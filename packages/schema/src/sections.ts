import { z } from 'zod';
import { Button, Icon, Image, href, imageSrc, longText, markdown, text, variant } from './fields.ts';

/**
 * Every section shares these fields. `variant` picks the layout, `tone` the background band.
 * Section names and fields use plain words, because people pick them in Studio by name.
 */
const common = {
  id: z
    .string()
    .regex(/^[a-z][a-z0-9-]*$/, 'must be lowercase letters, digits and hyphens, starting with a letter')
    .optional()
    .meta({ title: 'Anchor name', description: 'Lets menu links jump here, as in #menu. Leave empty to use the section name.' }),
  tone: z
    .enum(['plain', 'tinted', 'bold'])
    .default('plain')
    .meta({ title: 'Background', description: 'Plain uses the page colour, tinted a soft band, bold a strong contrasting band.' }),
};

const heading = text('Heading');
const intro = longText('Intro').optional();
const actions = z.array(Button).max(2).optional().meta({ title: 'Buttons' });

export const HeroSection = z.object({
  type: z.literal('hero'),
  variant: variant(['split', 'centred', 'image-background']),
  ...common,
  heading,
  intro,
  actions,
  image: Image.optional(),
  points: z.array(text('Point')).max(4).optional().meta({ title: 'Short selling points' }),
  backdrop: z
    .enum(['none', 'glow', 'grid'])
    .optional()
    .meta({ title: 'Background effect', description: 'A soft glow in your colours or a faint dot grid behind the words. Empty keeps the layout’s own look.' }),
});

export const FeaturesSection = z.object({
  type: z.literal('features'),
  variant: variant(['columns', 'list', 'split']),
  ...common,
  heading,
  intro,
  items: z
    .array(
      z.object({
        title: text('Title'),
        text: longText('Text'),
        icon: Icon.optional(),
      }),
    )
    .min(1)
    .meta({ title: 'Features' }),
});

export const StepsSection = z.object({
  type: z.literal('steps'),
  variant: variant(['numbered', 'line']),
  ...common,
  heading,
  intro,
  items: z
    .array(z.object({ title: text('Title'), text: longText('Text') }))
    .min(2)
    .meta({ title: 'Steps' }),
});

export const GallerySection = z.object({
  type: z.literal('gallery'),
  variant: variant(['grid', 'masonry', 'carousel']),
  ...common,
  heading,
  intro,
  items: z
    .array(Image.extend({ caption: text('Caption').optional() }))
    .min(1)
    .meta({ title: 'Photos' }),
});

export const PricingSection = z.object({
  type: z.literal('pricing'),
  variant: variant(['cards', 'list']),
  ...common,
  heading,
  intro,
  plans: z
    .array(
      z.object({
        name: text('Plan name'),
        price: text('Price', { help: 'Written as you want it shown, such as £49 or From £1,200.' }),
        period: text('Per', { help: 'Such as per month or one-off.' }).optional(),
        description: longText('Short description').optional(),
        features: z.array(text('Feature')).optional().meta({ title: 'What is included' }),
        button: Button.optional(),
        badge: text('Ribbon', { help: 'Such as Most popular.' }).optional(),
        highlight: z.boolean().optional().meta({ title: 'Make this plan stand out' }),
      }),
    )
    .min(1)
    .meta({ title: 'Plans' }),
  note: longText('Small print').optional(),
});

export const TestimonialsSection = z.object({
  type: z.literal('testimonials'),
  variant: variant(['grid', 'spotlight']),
  ...common,
  heading,
  intro,
  items: z
    .array(
      z.object({
        quote: longText('Quote'),
        name: text('Name'),
        role: text('Role or place').optional(),
        image: Image.optional(),
        rating: z.number().int().min(1).max(5).optional().meta({ title: 'Stars (1 to 5)' }),
      }),
    )
    .min(1)
    .meta({ title: 'Reviews' }),
});

export const FaqSection = z.object({
  type: z.literal('faq'),
  variant: variant(['list', 'accordion', 'two-column']),
  ...common,
  heading,
  intro,
  items: z
    .array(z.object({ question: text('Question'), answer: markdown('Answer') }))
    .min(1)
    .meta({ title: 'Questions' }),
});

export const CtaSection = z.object({
  type: z.literal('cta'),
  variant: variant(['banner', 'centred', 'split']),
  ...common,
  heading,
  intro,
  actions: z.array(Button).min(1).max(2).meta({ title: 'Buttons' }),
  image: Image.optional(),
});

const FormField = z.object({
  name: z
    .string()
    .regex(/^[a-z][a-z0-9-]*$/, 'must be lowercase letters, digits and hyphens, starting with a letter')
    .meta({ title: 'Field name', description: 'Shown in your form submissions, such as phone.' }),
  label: text('Label'),
  kind: z.enum(['text', 'email', 'tel', 'textarea', 'select']).meta({ title: 'Kind' }),
  options: z.array(text('Choice')).optional().meta({ title: 'Choices (for a select field)' }),
  required: z.boolean().optional().meta({ title: 'Required' }),
});

const RESERVED = ['bot-field', 'form-name'];

export const ContactFormSection = z
  .object({
    type: z.literal('contact-form'),
    variant: variant(['simple', 'split']),
    ...common,
    heading,
    intro,
    fields: z
      .array(FormField)
      .min(1)
      .default([
        { name: 'name', label: 'Your name', kind: 'text', required: true },
        { name: 'email', label: 'Email address', kind: 'email', required: true },
        { name: 'message', label: 'Message', kind: 'textarea', required: true },
      ])
      .meta({ title: 'Form fields' }),
    submitLabel: text('Send button text').default('Send message'),
    successPath: z.string().regex(/^\//, 'must start with /').default('/thanks/').meta({ title: 'Page shown after sending' }),
    email: text('Email').optional(),
    phone: text('Phone').optional(),
    address: longText('Address').optional(),
  })
  .superRefine((s, ctx) => {
    const seen = new Set<string>();
    s.fields.forEach((f, i) => {
      if (RESERVED.includes(f.name)) ctx.addIssue({ code: 'custom', path: ['fields', i, 'name'], message: `"${f.name}" is reserved` });
      else if (seen.has(f.name)) ctx.addIssue({ code: 'custom', path: ['fields', i, 'name'], message: `duplicate field name "${f.name}"` });
      if (f.kind === 'select' && !(f.options && f.options.length > 0)) {
        ctx.addIssue({ code: 'custom', path: ['fields', i, 'options'], message: 'a select field needs at least one choice' });
      }
      seen.add(f.name);
    });
  });

export const ProductGridSection = z.object({
  type: z.literal('product-grid'),
  variant: variant(['grid', 'list']),
  ...common,
  heading,
  intro,
  filter: z.boolean().optional().meta({ title: 'Let visitors filter by category' }),
  products: z
    .array(
      z.object({
        name: text('Product name'),
        price: text('Price', { help: 'Written as you want it shown, such as £24.' }),
        description: longText('Description').optional(),
        image: Image,
        category: text('Category').optional(),
        buyUrl: z
          .string()
          .regex(/^https:\/\//, 'must be an https link, such as a Stripe Payment Link')
          .optional()
          .meta({ title: 'Buy link', description: 'A Stripe Payment Link or any checkout page.' }),
        buyLabel: text('Buy button text').optional(),
        badge: text('Badge', { help: 'Such as New or Bestseller.' }).optional(),
        soldOut: z.boolean().optional().meta({ title: 'Sold out' }),
      }),
    )
    .min(1)
    .meta({ title: 'Products' }),
});

export const MenuSection = z.object({
  type: z.literal('menu'),
  variant: variant(['list', 'columns']),
  ...common,
  heading,
  intro,
  groups: z
    .array(
      z.object({
        name: text('Group name', { help: 'Such as Breakfast or Drinks.' }),
        note: text('Note').optional(),
        items: z
          .array(
            z.object({
              name: text('Dish or drink'),
              description: longText('Description').optional(),
              price: text('Price'),
              tags: z.array(text('Tag')).optional().meta({ title: 'Tags, such as V or GF' }),
            }),
          )
          .min(1)
          .meta({ title: 'Items' }),
      }),
    )
    .min(1)
    .meta({ title: 'Menu groups' }),
  note: longText('Small print', { help: 'Such as allergy information.' }).optional(),
});

export const TeamSection = z.object({
  type: z.literal('team'),
  variant: variant(['grid', 'list']),
  ...common,
  heading,
  intro,
  members: z
    .array(
      z.object({
        name: text('Name'),
        role: text('Role'),
        bio: longText('Short bio').optional(),
        image: Image.optional(),
      }),
    )
    .min(1)
    .meta({ title: 'People' }),
});

export const StatsSection = z.object({
  type: z.literal('stats'),
  variant: variant(['row', 'tiles']),
  ...common,
  heading: heading.optional(),
  intro,
  items: z
    .array(z.object({ value: text('Number', { help: 'Such as 12 or 98%.' }), label: text('Label') }))
    .min(1)
    .max(6)
    .meta({ title: 'Numbers' }),
});

export const LogoCloudSection = z.object({
  type: z.literal('logo-cloud'),
  variant: variant(['row', 'grid']),
  ...common,
  heading: heading.optional(),
  items: z
    .array(
      z.object({
        name: text('Name'),
        logo: imageSrc('Logo'),
        url: href('Link').optional(),
      }),
    )
    .min(1)
    .meta({ title: 'Logos' }),
});

export const BlogListSection = z.object({
  type: z.literal('blog-list'),
  variant: variant(['list', 'cards']),
  ...common,
  heading,
  intro,
  limit: z.number().int().min(1).max(50).default(6).meta({ title: 'Number of posts' }),
});

export const AboutSection = z.object({
  type: z.literal('about'),
  variant: variant(['split', 'centred']),
  ...common,
  heading,
  body: markdown('Text'),
  image: Image.optional(),
  actions,
});

export const OpeningHoursSection = z.object({
  type: z.literal('opening-hours'),
  variant: variant(['card', 'strip']),
  ...common,
  heading,
  intro,
  hours: z
    .array(z.object({ days: text('Days'), time: text('Time') }))
    .min(1)
    .meta({ title: 'Opening hours' }),
  address: longText('Address').optional(),
  phone: text('Phone').optional(),
  email: text('Email').optional(),
  mapUrl: z.string().regex(/^https:\/\//, 'must be an https link').optional().meta({ title: 'Map link' }),
});

export const ProjectsSection = z.object({
  type: z.literal('projects'),
  variant: variant(['grid', 'list', 'featured']),
  ...common,
  heading,
  intro,
  items: z
    .array(
      z.object({
        title: text('Title'),
        category: text('Category', { help: 'Such as Branding or Kitchen refit.' }).optional(),
        text: longText('Short description').optional(),
        image: Image,
        url: href('Link').optional(),
      }),
    )
    .min(1)
    .meta({ title: 'Projects' }),
});

export const TimelineSection = z.object({
  type: z.literal('timeline'),
  variant: variant(['line', 'list']),
  ...common,
  heading,
  intro,
  items: z
    .array(
      z.object({
        date: text('Date'),
        title: text('Title'),
        place: text('Place').optional(),
        text: longText('Text').optional(),
      }),
    )
    .min(1)
    .meta({ title: 'Entries' }),
});

export const MapSection = z.object({
  type: z.literal('map'),
  variant: variant(['card', 'wide']),
  ...common,
  heading,
  intro,
  address: longText('Address'),
  url: z.string().regex(/^https:\/\//, 'must be an https link').meta({ title: 'Map link' }),
  linkLabel: text('Link text').default('Open in maps'),
  image: Image.optional(),
});

export const VideoSection = z.object({
  type: z.literal('video'),
  variant: variant(['card', 'wide']),
  ...common,
  heading,
  intro,
  title: text('Video title'),
  url: z
    .string()
    .regex(/^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//, 'must be a YouTube or Vimeo https link')
    .meta({ title: 'Video link' }),
  poster: Image,
});

export const TextSection = z.object({
  type: z.literal('text'),
  variant: variant(['narrow', 'wide']),
  ...common,
  heading: heading.optional(),
  body: markdown('Text'),
});

export const MarqueeSection = z.object({
  type: z.literal('marquee'),
  variant: variant(['single', 'double']),
  ...common,
  heading: heading.optional(),
  items: z
    .array(z.object({ text: text('Word or phrase'), url: href('Link').optional() }))
    .min(1)
    .max(24)
    .meta({ title: 'Words' }),
});

export const NewsletterSection = z.object({
  type: z.literal('newsletter'),
  variant: variant(['stacked', 'inline']),
  ...common,
  heading,
  intro,
  emailLabel: text('Email label').default('Email address'),
  submitLabel: text('Button text').default('Subscribe'),
  successPath: z.string().regex(/^\//, 'must start with /').default('/thanks/').meta({ title: 'Page shown after signing up' }),
});

export const SectionSchema = z.discriminatedUnion('type', [
  HeroSection,
  FeaturesSection,
  StepsSection,
  GallerySection,
  PricingSection,
  TestimonialsSection,
  FaqSection,
  CtaSection,
  ContactFormSection,
  ProductGridSection,
  MenuSection,
  TeamSection,
  StatsSection,
  LogoCloudSection,
  BlogListSection,
  AboutSection,
  OpeningHoursSection,
  ProjectsSection,
  TimelineSection,
  MapSection,
  VideoSection,
  TextSection,
  NewsletterSection,
  MarqueeSection,
]);

export type Section = z.infer<typeof SectionSchema>;
export type SectionType = Section['type'];
export type SectionOf<T extends SectionType> = Extract<Section, { type: T }>;
export type VariantOf<T extends SectionType> = SectionOf<T>['variant'];

/** Every section type, in schema order. */
export const SECTION_TYPES = SectionSchema.options.map((o) => o.shape.type.value) as SectionType[];

/** The variants each section offers, read from the schema, default first. */
export const SECTION_VARIANTS = Object.fromEntries(
  SectionSchema.options.map((o) => [o.shape.type.value, o.shape.variant.unwrap().options]),
) as unknown as { [T in SectionType]: readonly VariantOf<T>[] };

/** Section types a site may hold only once, because each one is a named Netlify form. */
export const ONCE_PER_SITE: SectionType[] = ['contact-form', 'newsletter'];
