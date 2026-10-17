/** Colour roles. Every theme sets each role for light and dark. */
export const COLOR_ROLES = [
  'background',
  'tinted',
  'surface',
  'text',
  'muted',
  'border',
  'primary',
  'on-primary',
  'accent',
  'bold',
  'on-bold',
] as const;
export type ColorRole = (typeof COLOR_ROLES)[number];
export type Palette = Record<ColorRole, string>;

/**
 * Fonts Forge can load through Astro's Fonts API (Fontsource provider).
 * `weights` is a range for variable fonts. `fallback` is the generic family used while it loads.
 */
export const FONTS = {
  'Fraunces': { weights: ['300 800'], fallback: 'serif' },
  'Public Sans': { weights: ['300 800'], fallback: 'sans-serif' },
  'Bricolage Grotesque': { weights: ['300 800'], fallback: 'sans-serif' },
  'Figtree': { weights: ['300 800'], fallback: 'sans-serif' },
  'Instrument Serif': { weights: ['400'], fallback: 'serif' },
  'Instrument Sans': { weights: ['400 700'], fallback: 'sans-serif' },
  'DM Serif Display': { weights: ['400'], fallback: 'serif' },
  'Karla': { weights: ['300 800'], fallback: 'sans-serif' },
  'Space Grotesk': { weights: ['300 700'], fallback: 'sans-serif' },
  'Manrope': { weights: ['300 800'], fallback: 'sans-serif' },
  'Newsreader': { weights: ['300 800'], fallback: 'serif' },
  'Source Serif 4': { weights: ['300 800'], fallback: 'serif' },
} as const satisfies Record<string, { weights: readonly string[]; fallback: 'serif' | 'sans-serif' }>;
export type FontName = keyof typeof FONTS;
export const FONT_NAMES = Object.keys(FONTS) as FontName[];

export interface Theme {
  /** The name people see in Studio. */
  label: string;
  /** One line on the feel of the theme. */
  description: string;
  fonts: { heading: FontName; body: FontName };
  /** Weight used for headings, so a light display serif and a heavy grotesk both look right. */
  headingWeight: number;
  /** Letter spacing for large headings, in em. */
  headingTracking: number;
  light: Palette;
  dark: Palette;
  /** The mode a site gets when it does not choose one. */
  defaultMode: 'light' | 'dark';
  corners: Corners;
  spacing: Spacing;
  textSize: TextSize;
  /** Shadow strength for raised cards. */
  shadow: 'none' | 'soft' | 'crisp';
}

export const CORNERS = ['square', 'soft', 'round'] as const;
export type Corners = (typeof CORNERS)[number];
export const SPACING = ['compact', 'comfortable', 'airy'] as const;
export type Spacing = (typeof SPACING)[number];
export const TEXT_SIZES = ['small', 'medium', 'large'] as const;
export type TextSize = (typeof TEXT_SIZES)[number];
