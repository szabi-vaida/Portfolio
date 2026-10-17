import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { describeErrors, loadSite } from '@forge/schema';
import { fontRequests, resolveTheme } from '@forge/themes';
import { forgeImages } from './images-plugin';

/**
 * One Astro project builds any Forge site. The forge CLI sets FORGE_SITE_DIR to the site folder.
 * Without it (astro check, astro sync) the small fixture site in this folder is used.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(process.env.FORGE_SITE_DIR ?? path.join(here, 'fixture'));
process.env.FORGE_SITE_DIR = siteDir;

const loaded = loadSite(siteDir);
if (!loaded.ok) throw new Error(describeErrors(siteDir, loaded.errors));
const site = loaded.data;

const webcoreComponents = path.join(path.dirname(createRequire(import.meta.url).resolve('webcoreui')), 'components');
// Western European languages fit the latin subset. Others, such as Hungarian or Polish, also need latin-ext.
const subsets: [string, ...string[]] = /^(en|fr|de|es|it|nl|pt|da|sv|nb|no|fi|ga|is)(-|$)/i.test(site.meta.locale) ? ['latin'] : ['latin', 'latin-ext'];
const webcoreSettings = path.join(here, '..', '..', 'packages', 'components', 'src', 'vendor');

export default defineConfig({
  site: site.meta.url,
  srcDir: './src',
  outDir: path.join(siteDir, 'dist'),
  // Studio's live preview builds from a draft copy but serves the real site's public folder.
  publicDir: process.env.FORGE_PUBLIC_DIR ?? path.join(siteDir, 'public'),
  cacheDir: path.join(here, 'node_modules', '.astro', path.basename(siteDir)),
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  integrations: site.meta.url
    ? [sitemap({ filter: (page) => !/\/(admin|thanks)\//.test(page) })]
    : [],
  fonts: fontRequests(resolveTheme(site.theme)).map((font) => ({
    provider: fontProviders.fontsource(),
    name: font.name,
    cssVariable: font.cssVariable,
    weights: font.weights as [string, ...string[]],
    styles: ['normal'],
    subsets,
    fallbacks: [font.fallback],
  })),
  image: {
    // Images in site.yaml may be full https links. They are downloaded and optimised at build time.
    remotePatterns: [{ protocol: 'https' }],
  },
  vite: {
    plugins: [forgeImages(path.join(siteDir, 'images'))],
    resolve: {
      alias: { '@webcore': webcoreComponents },
      noExternal: ['webcoreui'],
    },
    // Webcore UI ships Astro components with Sass styles, compiled into the site.
    css: { preprocessorOptions: { scss: { loadPaths: [webcoreSettings] } } },
  },
});
