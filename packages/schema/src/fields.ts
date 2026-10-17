import { z } from 'zod';

/**
 * Field builders shared by every schema. `title` is the label people see in Studio and Decap.
 * `help` becomes the Decap hint. `widget` tells the Decap generator which editor to use.
 */
interface Meta {
  help?: string;
}

const meta = (title: string, extra: Record<string, unknown>, m: Meta = {}) => ({
  title,
  ...extra,
  ...(m.help ? { description: m.help } : {}),
});

export const text = (title: string, m?: Meta) => z.string().trim().min(1).meta(meta(title, {}, m));
export const longText = (title: string, m?: Meta) => z.string().trim().min(1).meta(meta(title, { widget: 'text' }, m));
export const markdown = (title: string, m?: Meta) => z.string().trim().min(1).meta(meta(title, { widget: 'markdown' }, m));

/** A link target: a page path such as /about/, an anchor such as #menu, or a full https, mailto or tel link. */
export const href = (title: string, m?: Meta) =>
  z
    .string()
    .trim()
    .regex(/^(\/|#|https?:\/\/|mailto:|tel:)/, 'must start with /, #, https://, mailto: or tel:')
    .meta(meta(title, {}, m));

/** An image file in the site's images folder, such as images/hero.jpg, or a full https link. */
export const imageSrc = (title: string, m?: Meta) =>
  z
    .string()
    .trim()
    .regex(/^(images\/|https:\/\/)/, 'must be a file in images/ or an https link')
    .meta(meta(title, { widget: 'image' }, m));

export const Image = z
  .object({
    src: imageSrc('Image'),
    alt: z
      .string()
      .trim()
      .min(1, 'describe the image for people who cannot see it')
      .meta({ title: 'Image description', description: 'What the image shows, for people using screen readers.' }),
  })
  .meta({ title: 'Image' });

export const Button = z
  .object({
    label: text('Button text'),
    href: href('Button link'),
  })
  .meta({ title: 'Button' });

export const Link = z.object({
  label: text('Link text'),
  href: href('Link'),
});

/** Built-in icons, drawn for Forge. Names describe what they show. */
export const ICON_NAMES = [
  'star', 'heart', 'bolt', 'leaf', 'shield', 'chat', 'clock', 'pin', 'camera', 'code', 'mail', 'phone',
  'globe', 'users', 'chart', 'cup', 'check', 'spark', 'tools', 'home', 'calendar', 'bag', 'palette', 'compass',
] as const;
export type IconName = (typeof ICON_NAMES)[number];
export const Icon = z.enum(ICON_NAMES).meta({ title: 'Icon' });

export const SOCIAL_NAMES = ['instagram', 'facebook', 'linkedin', 'x', 'youtube', 'tiktok', 'github', 'mastodon', 'email'] as const;
export type SocialName = (typeof SOCIAL_NAMES)[number];

/** A section variant. The first value is the default, so a section without `variant` still renders. */
export const variant = <const T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values).default(values[0]).meta({ title: 'Layout' });
