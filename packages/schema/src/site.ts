import { z } from 'zod';
import { COLOR_ROLES, CORNERS, FONT_NAMES, SPACING, TEXT_SIZES, THEME_NAMES } from '@forge/themes';
import { Button, Image, Link, SOCIAL_NAMES, href, longText, text } from './fields.ts';
import { ONCE_PER_SITE, SectionSchema } from './sections.ts';

const Hex = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, 'must be a 6-digit colour like #1a2b3c')
  .meta({ widget: 'color' });

/** Plain names for the colour roles, shown in Studio and Decap. */
const ROLE_TITLES: Record<(typeof COLOR_ROLES)[number], string> = {
  background: 'Page background',
  tinted: 'Soft band',
  surface: 'Cards and fields',
  text: 'Text',
  muted: 'Secondary text',
  border: 'Lines',
  primary: 'Main colour',
  'on-primary': 'Text on the main colour',
  accent: 'Accent',
  bold: 'Bold band',
  'on-bold': 'Text on the bold band',
};

const colourOverrides = (title: string) =>
  z
    .object(Object.fromEntries(COLOR_ROLES.map((role) => [role, Hex.optional().meta({ title: ROLE_TITLES[role], widget: 'color' })])) as Record<
      (typeof COLOR_ROLES)[number],
      z.ZodOptional<typeof Hex>
    >)
    .optional()
    .meta({ title });

export const ThemeSchema = z
  .object({
    name: z.enum(THEME_NAMES).meta({ title: 'Theme' }),
    mode: z
      .enum(['light', 'dark', 'auto'])
      .optional()
      .meta({ title: 'Light or dark', description: 'Auto follows each visitor’s device setting. Empty uses the theme’s own choice.' }),
    toggle: z.boolean().optional().meta({ title: 'Show a light and dark switch' }),
    corners: z.enum(CORNERS).optional().meta({ title: 'Corners' }),
    spacing: z.enum(SPACING).optional().meta({ title: 'Spacing' }),
    textSize: z.enum(TEXT_SIZES).optional().meta({ title: 'Text size' }),
    fonts: z
      .object({
        heading: z.enum(FONT_NAMES).optional().meta({ title: 'Heading font' }),
        body: z.enum(FONT_NAMES).optional().meta({ title: 'Text font' }),
      })
      .optional()
      .meta({ title: 'Fonts' }),
    colors: colourOverrides('Colours (light)'),
    darkColors: colourOverrides('Colours (dark)'),
  })
  .meta({ title: 'Theme' });

const PATH = /^\/([a-z0-9-]+\/)*$/;

export const PageSchema = z
  .object({
    path: z
      .string()
      .regex(PATH, 'must look like / or /about/ (lowercase, ending in /)')
      .meta({ title: 'Page address', description: 'The home page is /. Other pages look like /about/.' }),
    title: text('Page title', { help: 'Shown in the browser tab and search results. Empty uses the site title.' }).optional(),
    description: longText('Page description', { help: 'One or two sentences for search results.' }).max(160).optional(),
    sections: z.array(SectionSchema).min(1).meta({ title: 'Sections' }),
  })
  .meta({ title: 'Page' });

const Social = z.object({
  network: z.enum(SOCIAL_NAMES).meta({ title: 'Network' }),
  href: href('Link'),
});

export const SiteSchema = z
  .object({
    meta: z
      .object({
        name: z
          .string()
          .regex(/^[a-z0-9-]+$/, 'must be lowercase letters, digits and hyphens')
          .meta({ title: 'Site folder name' }),
        title: text('Site name'),
        description: longText('Site description', { help: 'One or two sentences for search results.' }).max(160),
        locale: z.string().default('en-GB').meta({ title: 'Language', description: 'Such as en-GB.' }),
        url: z
          .string()
          .regex(/^https:\/\/[^/]+$/, 'must be an https address with no path, like https://example.com')
          .optional()
          .meta({ title: 'Web address', description: 'Needed for search engines and link previews.' }),
        image: Image.optional().meta({ title: 'Link preview image' }),
      })
      .meta({ title: 'Site' }),
    theme: ThemeSchema,
    announcement: z
      .object({
        text: text('Text'),
        link: Link.optional(),
        closeable: z.boolean().optional().meta({ title: 'Visitors can close it' }),
      })
      .optional()
      .meta({ title: 'Announcement bar' }),
    navbar: z
      .object({
        variant: z.enum(['simple', 'centred', 'split']).default('simple').meta({ title: 'Layout' }),
        logo: Image.optional().meta({ title: 'Logo' }),
        links: z.array(Link).optional().meta({ title: 'Menu links' }),
        button: Button.optional(),
        sticky: z.boolean().default(true).meta({ title: 'Stay at the top while scrolling' }),
      })
      .default({ variant: 'simple', sticky: true })
      .meta({ title: 'Navigation bar' }),
    footer: z
      .object({
        variant: z.enum(['simple', 'columns', 'split']).default('simple').meta({ title: 'Layout' }),
        text: longText('Footer text').optional(),
        columns: z
          .array(z.object({ title: text('Column title'), links: z.array(Link).min(1) }))
          .optional()
          .meta({ title: 'Link columns' }),
        social: z.array(Social).optional().meta({ title: 'Social links' }),
        smallPrint: text('Small print', { help: 'Such as your company number.' }).optional(),
      })
      .default({ variant: 'simple' })
      .meta({ title: 'Footer' }),
    blog: z
      .object({
        title: text('Blog title').default('Journal'),
        path: z.string().regex(PATH, 'must look like /blog/').default('/blog/').meta({ title: 'Blog address' }),
      })
      .optional()
      .meta({ title: 'Blog' }),
    pages: z.array(PageSchema).min(1).meta({ title: 'Pages' }),
  })
  .superRefine((site, ctx) => {
    const paths = new Map<string, number>();
    site.pages.forEach((page, i) => {
      if (paths.has(page.path)) {
        ctx.addIssue({ code: 'custom', path: ['pages', i, 'path'], message: `${page.path} is used by more than one page` });
      }
      paths.set(page.path, i);
    });
    if (!paths.has('/')) ctx.addIssue({ code: 'custom', path: ['pages'], message: 'one page needs the address / (the home page)' });
    if (site.blog && paths.has(site.blog.path)) {
      ctx.addIssue({ code: 'custom', path: ['blog', 'path'], message: `${site.blog.path} is also a page address` });
    }
    for (const type of ONCE_PER_SITE) {
      let seen = false;
      site.pages.forEach((page, p) =>
        page.sections.forEach((s, i) => {
          if (s.type !== type) return;
          if (seen) ctx.addIssue({ code: 'custom', path: ['pages', p, 'sections', i, 'type'], message: `only one ${type} per site` });
          seen = true;
        }),
      );
    }
    site.pages.forEach((page, p) => {
      const ids = new Set<string>();
      page.sections.forEach((s, i) => {
        if (!s.id) return;
        if (ids.has(s.id)) ctx.addIssue({ code: 'custom', path: ['pages', p, 'sections', i, 'id'], message: `anchor "${s.id}" is used twice on this page` });
        ids.add(s.id);
      });
    });
    const usesBlogList = site.pages.some((page) => page.sections.some((s) => s.type === 'blog-list'));
    if (usesBlogList && !site.blog) {
      ctx.addIssue({ code: 'custom', path: ['blog'], message: 'a blog-list section needs a blog setting' });
    }
  });

export type SiteSpec = z.infer<typeof SiteSchema>;
export type SiteInput = z.input<typeof SiteSchema>;
export type PageSpec = z.infer<typeof PageSchema>;
export type ThemeSpec = z.infer<typeof ThemeSchema>;
