import { atelier } from './themes/atelier.ts';
import { bistro } from './themes/bistro.ts';
import { harbour } from './themes/harbour.ts';
import { journal } from './themes/journal.ts';
import { market } from './themes/market.ts';
import { signal } from './themes/signal.ts';
import { COLOR_ROLES, FONTS, type ColorRole, type Corners, type FontName, type Palette, type Spacing, type TextSize, type Theme } from './types.ts';

export * from './types.ts';

/** Every theme. A theme is one token file in ./themes. Components never fork per theme. */
export const THEMES = { harbour, market, atelier, bistro, signal, journal } as const satisfies Record<string, Theme>;
export type ThemeName = keyof typeof THEMES;
export const THEME_NAMES = Object.keys(THEMES) as [ThemeName, ...ThemeName[]];

/** What a site.yaml may set under `theme`. Everything except `name` is optional. */
export interface ThemeSettings {
  name: ThemeName;
  mode?: 'light' | 'dark' | 'auto';
  toggle?: boolean;
  colors?: Partial<Record<ColorRole, string>>;
  darkColors?: Partial<Record<ColorRole, string>>;
  fonts?: { heading?: FontName; body?: FontName };
  corners?: Corners;
  spacing?: Spacing;
  textSize?: TextSize;
}

export interface ResolvedTheme {
  theme: Theme;
  mode: 'light' | 'dark' | 'auto';
  light: Palette;
  dark: Palette;
  fonts: { heading: FontName; body: FontName };
  corners: Corners;
  spacing: Spacing;
  textSize: TextSize;
}

export function resolveTheme(settings: ThemeSettings): ResolvedTheme {
  const theme = THEMES[settings.name];
  return {
    theme,
    mode: settings.mode ?? theme.defaultMode,
    light: { ...theme.light, ...clean(settings.colors) },
    dark: { ...theme.dark, ...clean(settings.darkColors) },
    fonts: { heading: settings.fonts?.heading ?? theme.fonts.heading, body: settings.fonts?.body ?? theme.fonts.body },
    corners: settings.corners ?? theme.corners,
    spacing: settings.spacing ?? theme.spacing,
    textSize: settings.textSize ?? theme.textSize,
  };
}

function clean<T extends object>(o: T | undefined): Partial<T> {
  return Object.fromEntries(Object.entries(o ?? {}).filter(([, v]) => v !== undefined)) as Partial<T>;
}

/** One Fonts API entry per distinct font. Heading and body share an entry when they are the same font. */
export interface FontRequest {
  name: FontName;
  cssVariable: '--ff-heading' | '--ff-body';
  weights: string[];
  fallback: 'serif' | 'sans-serif';
}

/** The weights a font offers that are closest to the ones asked for. A variable font offers every weight in its range. */
function pickWeights(name: FontName, wanted: number[]): string[] {
  const offered = FONTS[name].weights as readonly string[];
  const range = offered.length === 1 && offered[0].includes(' ') ? offered[0].split(' ').map(Number) : undefined;
  const fixed = range ? [] : offered.map(Number);
  const pick = (w: number) => (range ? Math.min(Math.max(w, range[0]), range[1]) : fixed.reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a)));
  return [...new Set(wanted.map(pick))].sort((a, b) => a - b).map(String);
}

/**
 * The fonts to load. Only the weights the components use are fetched as static files:
 * the heading weight for headings, 400 and 600 for text. That is far smaller than a whole variable font.
 */
export function fontRequests(resolved: Pick<ResolvedTheme, 'fonts' | 'theme'>): FontRequest[] {
  const { heading, body } = resolved.fonts;
  const headingWeight = resolved.theme.headingWeight;
  const req = (name: FontName, cssVariable: FontRequest['cssVariable'], wanted: number[]): FontRequest => ({
    name,
    cssVariable,
    weights: pickWeights(name, wanted),
    fallback: FONTS[name].fallback,
  });
  return heading === body
    ? [req(body, '--ff-body', [400, 600, headingWeight])]
    : [req(heading, '--ff-heading', [headingWeight]), req(body, '--ff-body', [400, 600])];
}

const RADII: Record<Corners, [string, string, string, string]> = {
  // small, medium, large, button
  square: ['0', '0', '0', '0'],
  soft: ['0.375rem', '0.75rem', '1.25rem', '0.625rem'],
  round: ['0.75rem', '1.25rem', '2rem', '999px'],
};

const DENSITY: Record<Spacing, number> = { compact: 0.8, comfortable: 1, airy: 1.25 };

/** Base text size in rem at a narrow and a wide screen, and the scale ratio at each. */
const TYPE: Record<TextSize, { min: number; max: number; minRatio: number; maxRatio: number }> = {
  small: { min: 0.9375, max: 1, minRatio: 1.18, maxRatio: 1.25 },
  medium: { min: 1, max: 1.0625, minRatio: 1.2, maxRatio: 1.28 },
  large: { min: 1.0625, max: 1.1875, minRatio: 1.2, maxRatio: 1.3 },
};

const SHADOWS: Record<Theme['shadow'], [string, string]> = {
  none: ['none', 'none'],
  soft: ['0 1px 2px rgb(0 0 0 / 0.05), 0 4px 12px -6px rgb(0 0 0 / 0.12)', '0 2px 4px rgb(0 0 0 / 0.04), 0 24px 48px -24px rgb(0 0 0 / 0.28)'],
  crisp: ['0 0 0 1px var(--color-border)', '0 0 0 1px var(--color-border), 0 30px 60px -30px rgb(0 0 0 / 0.5)'],
};

const STEPS = ['xs', 's', 'base', 'm', 'l', 'xl', '2xl', '3xl', '4xl'] as const;

const round = (n: number) => Number(n.toFixed(4));

/** A fluid size that grows from `min` rem at 22.5rem wide to `max` rem at 80rem wide. */
export function fluid(min: number, max: number): string {
  const slope = (max - min) / (80 - 22.5);
  const intercept = min - slope * 22.5;
  return `clamp(${round(min)}rem, ${round(intercept)}rem + ${round(slope * 100)}vw, ${round(max)}rem)`;
}

function typeScale(size: TextSize): string[] {
  const t = TYPE[size];
  return STEPS.map((name, i) => {
    const n = i - 2;
    return `--text-${name}:${fluid(t.min * t.minRatio ** n, t.max * t.maxRatio ** n)}`;
  });
}

function spaceScale(spacing: Spacing): string[] {
  const d = DENSITY[spacing];
  const steps: Array<[string, number]> = [
    ['3xs', 0.25], ['2xs', 0.5], ['xs', 0.75], ['s', 1], ['m', 1.5], ['l', 2], ['xl', 3], ['2xl', 4], ['3xl', 6],
  ];
  const out = steps.map(([name, rem]) => `--space-${name}:${round(rem * (name === '3xs' || name === '2xs' ? 1 : d))}rem`);
  out.push(`--section-space:${fluid(3.5 * d, 7 * d)}`);
  out.push(`--gutter:${fluid(1, 2)}`);
  return out;
}

function palette(p: Palette): string {
  return COLOR_ROLES.map((role) => `--color-${role}:${p[role]}`).join(';');
}

/**
 * The token stylesheet for one site. Light and dark both exist for every theme.
 * `auto` follows the visitor's system setting. With a toggle, `data-theme` on <html> wins.
 */
export function themeCss(settings: ThemeSettings): string {
  const r = resolveTheme(settings);
  const [sm, md, lg, button] = RADII[r.corners];
  const [shadowSm, shadowLg] = SHADOWS[r.theme.shadow];
  const sameFont = r.fonts.heading === r.fonts.body;
  const fallback = (name: FontName) => (FONTS[name].fallback === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif');
  const tokens = [
    `--font-heading:var(${sameFont ? '--ff-body' : '--ff-heading'}, ${fallback(r.fonts.heading)})`,
    `--font-body:var(--ff-body, ${fallback(r.fonts.body)})`,
    `--heading-weight:${r.theme.headingWeight}`,
    `--heading-tracking:${r.theme.headingTracking}em`,
    `--radius-s:${sm}`,
    `--radius-m:${md}`,
    `--radius-l:${lg}`,
    `--radius-button:${button}`,
    `--shadow-s:${shadowSm}`,
    `--shadow-l:${shadowLg}`,
    ...typeScale(r.textSize),
    ...spaceScale(r.spacing),
  ].join(';');

  const light = `${palette(r.light)};color-scheme:light`;
  const dark = `${palette(r.dark)};color-scheme:dark`;
  const rules = [`:root{${tokens}}`];
  if (r.mode === 'dark') {
    rules.push(`:root{${dark}}`, `:root[data-theme=light]{${light}}`);
  } else if (r.mode === 'light') {
    rules.push(`:root{${light}}`, `:root[data-theme=dark]{${dark}}`);
  } else {
    rules.push(`:root{${light}}`, `@media (prefers-color-scheme:dark){:root:not([data-theme=light]){${dark}}}`, `:root[data-theme=dark]{${dark}}`);
  }
  return rules.join('\n');
}
