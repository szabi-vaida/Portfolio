import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** The Forge repository root, three folders up from this file. */
export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
/** The one Astro project that builds every site. */
export const SITE_APP = path.join(REPO_ROOT, 'apps', 'site');
export const SITES_DIR = path.join(REPO_ROOT, 'sites');
/** Starter sites. `forge new` and Studio copy one of these. */
export const TEMPLATES_DIR = path.join(REPO_ROOT, 'templates');

const SITE_NAME = /^[a-z0-9-]+$/;

export function assertSiteName(name: string): void {
  if (!SITE_NAME.test(name)) throw new Error(`"${name}" is not a valid site name. Use lowercase letters, digits and hyphens only.`);
}

/**
 * A plain name means sites/<name>. Anything with a slash, or a folder that holds a site.yaml, is a path.
 */
export function resolveSiteDir(arg: string): string {
  if (arg.includes('/') || arg.includes('\\')) return path.resolve(arg);
  if (fs.existsSync(path.join(path.resolve(arg), 'site.yaml'))) return path.resolve(arg);
  assertSiteName(arg);
  return path.join(SITES_DIR, arg);
}

/** Every template folder with a site.yaml, by name. */
export function templateNames(): string[] {
  if (!fs.existsSync(TEMPLATES_DIR)) return [];
  return fs
    .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(TEMPLATES_DIR, e.name, 'site.yaml')))
    .map((e) => e.name)
    .sort();
}

export function toPosix(p: string): string {
  return p.split(path.sep).join('/');
}
