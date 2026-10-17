/**
 * The plain-English names people see in Studio and Decap: sections, their layouts, site types
 * and site settings. The schema holds the structure; this file holds the words.
 */
import { ONCE_PER_SITE, type SectionType, type VariantOf } from '@forge/schema';
import { THEMES, type ThemeName } from '@forge/themes';

export const CATEGORIES = ['Opening', 'About you', 'What you offer', 'Selling', 'Showing your work', 'Trust', 'Getting in touch', 'Writing'] as const;
export type Category = (typeof CATEGORIES)[number];

interface Choice {
  name: string;
  description: string;
}

export interface SectionInfo<T extends SectionType> {
  /** The name people see, such as Products. */
  name: string;
  category: Category;
  description: string;
  /** One entry per layout, in schema order. The first is the default. */
  variants: Record<VariantOf<T>, Choice>;
}

export const SECTION_INFO: { [T in SectionType]: SectionInfo<T> } = {
  hero: {
    name: 'Opening banner',
    category: 'Opening',
    description: 'The big headline at the top of a page, with buttons and an optional photo.',
    variants: {
      split: { name: 'Words and photo side by side', description: 'Headline on the left, a tall photo on the right.' },
      centred: { name: 'Centred', description: 'A calm centred headline, with the photo underneath.' },
      'image-background': { name: 'Photo background', description: 'A full-width photo with the headline over it.' },
    },
  },
  features: {
    name: 'Services or features',
    category: 'What you offer',
    description: 'What you offer, each with a short title and description.',
    variants: {
      columns: { name: 'Columns', description: 'Short points side by side.' },
      list: { name: 'Numbered list', description: 'One point per row, numbered, with room for more words.' },
      split: { name: 'Heading beside the list', description: 'The heading stays on the left while the points run down the right.' },
    },
  },
  steps: {
    name: 'How it works',
    category: 'What you offer',
    description: 'The steps someone goes through to work with you.',
    variants: {
      numbered: { name: 'Large numbers', description: 'Each step led by a big number.' },
      line: { name: 'Joined by a line', description: 'Numbered dots joined by a line across the page.' },
    },
  },
  gallery: {
    name: 'Photo gallery',
    category: 'Showing your work',
    description: 'A set of photos that open larger when clicked.',
    variants: {
      grid: { name: 'Grid', description: 'Photos in neat rows. With five or more, the first one is shown large.' },
      masonry: { name: 'Stone wall', description: 'Photos at their own height in columns.' },
      carousel: { name: 'Slideshow', description: 'One large photo at a time with arrows and a counter.' },
    },
  },
  pricing: {
    name: 'Prices',
    category: 'Selling',
    description: 'Your plans or packages with what each includes.',
    variants: {
      cards: { name: 'Side by side', description: 'Plans next to each other, with one made to stand out.' },
      list: { name: 'Price list', description: 'One plan per row, good for services with many options.' },
    },
  },
  testimonials: {
    name: 'Reviews',
    category: 'Trust',
    description: 'Kind words from customers, with optional stars and photos.',
    variants: {
      grid: { name: 'Wall of reviews', description: 'Several reviews in columns.' },
      spotlight: { name: 'One big review', description: 'One review set large, the others underneath.' },
    },
  },
  faq: {
    name: 'Questions and answers',
    category: 'Getting in touch',
    description: 'Common questions with short answers.',
    variants: {
      list: { name: 'All answers showing', description: 'Every answer visible, in two columns.' },
      accordion: { name: 'Open one at a time', description: 'Answers open when a question is clicked.' },
      'two-column': { name: 'Heading beside the questions', description: 'The heading on the left, questions opening on the right.' },
    },
  },
  cta: {
    name: 'Call to action',
    category: 'Getting in touch',
    description: 'One clear message with one or two buttons.',
    variants: {
      banner: { name: 'Bold band', description: 'A strong colour band with the buttons on the right.' },
      centred: { name: 'Centred', description: 'A calm centred message.' },
      split: { name: 'With a photo', description: 'The message beside a photo.' },
    },
  },
  'contact-form': {
    name: 'Contact form',
    category: 'Getting in touch',
    description: 'A form that sends messages to you through Netlify.',
    variants: {
      simple: { name: 'Form only', description: 'Just the form.' },
      split: { name: 'Form and details', description: 'Your email, phone and address beside the form.' },
    },
  },
  'product-grid': {
    name: 'Products',
    category: 'Selling',
    description: 'Things you sell, each with a photo, price and a buy button (Stripe Payment Links work well).',
    variants: {
      grid: { name: 'Shop grid', description: 'Tall product photos in rows.' },
      list: { name: 'List with details', description: 'A photo beside each product, with room for a description.' },
    },
  },
  menu: {
    name: 'Menu',
    category: 'Selling',
    description: 'Food and drink in groups, with prices and dietary tags.',
    variants: {
      list: { name: 'Single column', description: 'Like a printed one-page menu.' },
      columns: { name: 'Two columns', description: 'Groups side by side on wide screens.' },
    },
  },
  team: {
    name: 'Team',
    category: 'About you',
    description: 'The people behind the business.',
    variants: {
      grid: { name: 'Portraits', description: 'Tall photos with names underneath.' },
      list: { name: 'With bios', description: 'A small round photo beside each short bio.' },
    },
  },
  stats: {
    name: 'Key numbers',
    category: 'Trust',
    description: 'A few numbers that show what you have done.',
    variants: {
      row: { name: 'In a row', description: 'Numbers side by side.' },
      tiles: { name: 'Tiles', description: 'Numbers in blocks, the first in your main colour.' },
    },
  },
  marquee: {
    name: 'Moving words',
    category: 'Showing your work',
    description: 'A band of large words that slides sideways as people scroll, such as your skills or services.',
    variants: {
      single: { name: 'One row', description: 'One band of words.' },
      double: { name: 'Two rows', description: 'Two bands sliding in opposite directions.' },
    },
  },
  'logo-cloud': {
    name: 'Logos',
    category: 'Trust',
    description: 'Logos of clients, partners or press.',
    variants: {
      row: { name: 'In a row', description: 'Logos in a centred row.' },
      grid: { name: 'Grid', description: 'Logos in boxes.' },
    },
  },
  'blog-list': {
    name: 'Latest posts',
    category: 'Writing',
    description: 'Your newest blog posts.',
    variants: {
      list: { name: 'List', description: 'Titles and summaries in rows.' },
      cards: { name: 'Cards with photos', description: 'Cover photos in a grid.' },
    },
  },
  about: {
    name: 'About',
    category: 'About you',
    description: 'Your story in a few paragraphs, with an optional photo.',
    variants: {
      split: { name: 'Photo beside the words', description: 'A tall photo next to your story.' },
      centred: { name: 'Words only', description: 'A calm column of text.' },
    },
  },
  'opening-hours': {
    name: 'Opening hours',
    category: 'Getting in touch',
    description: 'When you are open and where to find you.',
    variants: {
      card: { name: 'Card', description: 'Hours and address in one panel.' },
      strip: { name: 'Strip', description: 'Heading, hours and address in one row.' },
    },
  },
  projects: {
    name: 'Projects',
    category: 'Showing your work',
    description: 'Work you are proud of, each with a photo and a short description.',
    variants: {
      grid: { name: 'Grid', description: 'Three across, with tall and wide photos mixed.' },
      list: { name: 'One per row', description: 'Each project gets a full row, alternating sides.' },
      featured: { name: 'One big, the rest small', description: 'The first project wide across the top.' },
    },
  },
  timeline: {
    name: 'Timeline',
    category: 'About you',
    description: 'Dates in order, such as your history or upcoming events.',
    variants: {
      line: { name: 'Line', description: 'A vertical line with a dot for each date.' },
      list: { name: 'Schedule', description: 'Dated rows, good for events.' },
    },
  },
  map: {
    name: 'Map link',
    category: 'Getting in touch',
    description: 'Your address with a link to a maps site. No embedded map, so no cookies.',
    variants: {
      card: { name: 'With a picture', description: 'A picture of the area beside the address.' },
      wide: { name: 'Wide', description: 'A wide picture above the address.' },
    },
  },
  video: {
    name: 'Video',
    category: 'Showing your work',
    description: 'A YouTube or Vimeo video, shown as a picture that opens the video.',
    variants: {
      card: { name: 'Standard', description: 'The video picture at the page width.' },
      wide: { name: 'Extra wide', description: 'The video picture wider than the text.' },
    },
  },
  text: {
    name: 'Text',
    category: 'Writing',
    description: 'Free text with headings, lists and links.',
    variants: {
      narrow: { name: 'Reading column', description: 'A comfortable column for longer text.' },
      wide: { name: 'Heading beside the text', description: 'Good for terms and policies.' },
    },
  },
  newsletter: {
    name: 'Newsletter sign-up',
    category: 'Getting in touch',
    description: 'An email sign-up form, sent through Netlify.',
    variants: {
      stacked: { name: 'Centred', description: 'Heading, then the form.' },
      inline: { name: 'Side by side', description: 'Heading on the left, form on the right.' },
    },
  },
};

/** Labels for the other choices in site.yaml, keyed by their dotted path. */
export const OPTION_LABELS: Record<string, Record<string, string>> = {
  tone: { plain: 'Plain', tinted: 'Soft colour', bold: 'Bold colour' },
  'theme.name': Object.fromEntries(Object.entries(THEMES).map(([k, t]) => [k, t.label])),
  'theme.mode': { light: 'Light', dark: 'Dark', auto: 'Follow the visitor’s device' },
  'theme.corners': { square: 'Square', soft: 'Slightly rounded', round: 'Round' },
  'theme.spacing': { compact: 'Compact', comfortable: 'Comfortable', airy: 'Airy' },
  'theme.textSize': { small: 'Small', medium: 'Medium', large: 'Large' },
  'navbar.variant': { simple: 'Name left, menu right', centred: 'Name centred above the menu', split: 'Menu left, name centred' },
  'footer.variant': { simple: 'Simple and centred', columns: 'With link columns', split: 'Large name with links' },
  'footer.social.network': { instagram: 'Instagram', facebook: 'Facebook', linkedin: 'LinkedIn', x: 'X', youtube: 'YouTube', tiktok: 'TikTok', github: 'GitHub', mastodon: 'Mastodon', email: 'Email' },
  'hero.backdrop': { none: 'None', glow: 'Soft glow', grid: 'Dot grid' },
  'contact-form.fields.kind': { text: 'Short text', email: 'Email', tel: 'Phone', textarea: 'Long text', select: 'Choose from a list' },
};

/** A starting point in the new-site questions: "I want a shop" leads to the shop template. */
export interface SiteType {
  id: string;
  /** The answer people pick, in their words. */
  label: string;
  hint: string;
  /** The folder under templates/ the new site is copied from. */
  template: string;
  theme: ThemeName;
}

export const SITE_TYPES: readonly SiteType[] = [
  { id: 'business', label: 'A business or service', hint: 'Trades, clinics, consultants and studios. Services, prices, reviews and a contact form.', template: 'business', theme: 'harbour' },
  { id: 'shop', label: 'A shop', hint: 'A small catalogue with photos, prices and buy buttons through Stripe Payment Links.', template: 'shop', theme: 'market' },
  { id: 'portfolio', label: 'A portfolio', hint: 'Your work up front, with a short story and a way to get in touch.', template: 'portfolio', theme: 'atelier' },
  { id: 'restaurant', label: 'A café or restaurant', hint: 'Menu, opening hours, photos and where to find you.', template: 'restaurant', theme: 'bistro' },
  { id: 'agency', label: 'An agency or launch page', hint: 'A bold pitch, your process, results and a strong call to action.', template: 'agency', theme: 'signal' },
  { id: 'blog', label: 'A blog', hint: 'Your writing first, with a newsletter sign-up.', template: 'blog', theme: 'journal' },
];

/** A JSON copy for the Studio browser code. */
export function catalogueJson() {
  return JSON.parse(
    JSON.stringify({
      categories: CATEGORIES,
      sections: SECTION_INFO,
      optionLabels: OPTION_LABELS,
      siteTypes: SITE_TYPES,
      oncePerSite: ONCE_PER_SITE,
      themes: Object.fromEntries(Object.entries(THEMES).map(([k, t]) => [k, { label: t.label, description: t.description }])),
    }),
  ) as {
    categories: string[];
    sections: Record<string, { name: string; category: string; description: string; variants: Record<string, Choice> }>;
    optionLabels: Record<string, Record<string, string>>;
    siteTypes: SiteType[];
    oncePerSite: string[];
    themes: Record<string, { label: string; description: string }>;
  };
}
