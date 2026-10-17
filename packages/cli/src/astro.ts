import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { describeErrors, loadSite } from '@forge/schema';
import { SITE_APP } from './paths.ts';

type AstroApi = typeof import('astro');

let cached: AstroApi | undefined;

/** Astro as installed for the site app, so the CLI always drives the same version the app uses. */
export async function astroApi(): Promise<AstroApi> {
  if (cached) return cached;
  const resolved = createRequire(path.join(SITE_APP, 'package.json')).resolve('astro');
  cached = (await import(pathToFileURL(resolved).href)) as AstroApi;
  return cached;
}

/** Checks site.yaml before Astro starts, so a mistake shows as plain `path: message` lines. Returns false when it is invalid. */
export function checkSite(siteDir: string): boolean {
  const result = loadSite(siteDir);
  if (result.ok) return true;
  console.error(describeErrors(siteDir, result.errors));
  return false;
}

/** Points the site app at one site. astro.config.ts reads this variable. */
export function useSite(siteDir: string): void {
  process.env.FORGE_SITE_DIR = siteDir;
}
