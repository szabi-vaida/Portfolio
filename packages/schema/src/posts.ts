import { z } from 'zod';
import { imageSrc, longText, text } from './fields.ts';

/** Front matter of a blog post in sites/<name>/posts/*.md. Decap's posts collection is generated from this. */
export const PostSchema = z
  .object({
    title: text('Title'),
    date: z.coerce.date().meta({ title: 'Date', widget: 'datetime' }),
    description: longText('Summary', { help: 'Shown in post lists and search results.' }).max(200),
    image: imageSrc('Cover image').optional(),
    alt: text('Cover image description').optional(),
    draft: z.boolean().optional().meta({ title: 'Draft (not published)' }),
  })
  .refine((p) => !p.image || !!p.alt, { path: ['alt'], message: 'describe the cover image when one is set' });

export type PostSpec = z.infer<typeof PostSchema>;
