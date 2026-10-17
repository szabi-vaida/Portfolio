import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { PostSchema } from '@forge/schema';
import { siteLoader } from './loaders';

// astro.config.ts always sets this, to the site being built or to the fixture site.
const siteDir = process.env.FORGE_SITE_DIR as string;
const postsDir = path.join(siteDir, 'posts');

export const collections = {
  site: defineCollection({ loader: siteLoader(siteDir) }),
  posts: defineCollection({
    // A site without a posts folder gets an empty collection.
    loader: fs.existsSync(postsDir) ? glob({ pattern: '**/*.md', base: pathToFileURL(postsDir + path.sep).href }) : { name: 'no-posts', load: async () => {} },
    schema: PostSchema,
  }),
};
