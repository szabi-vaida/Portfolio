import fs from 'node:fs';
import path from 'node:path';
import { parseDocument } from 'yaml';
import { loadSite } from '@forge/schema';
import { SITES_DIR, TEMPLATES_DIR, assertSiteName, templateNames } from '../paths.ts';

export interface CreateOptions {
  sitesDir?: string;
  templatesDir?: string;
}

export type CreateResult = { ok: true; dir: string } | { ok: false; status: 400 | 409 | 422; message: string };

/**
 * Copies a template into sites/<site> and gives it the new name. Never overwrites.
 * Shared by the CLI and Forge Studio.
 */
export function createSite(site: string, template: string, options: CreateOptions = {}): CreateResult {
  const sitesDir = options.sitesDir ?? SITES_DIR;
  const templatesDir = options.templatesDir ?? TEMPLATES_DIR;
  try {
    assertSiteName(site);
  } catch (err) {
    return { ok: false, status: 400, message: (err as Error).message };
  }
  const from = path.join(templatesDir, template);
  if (!/^[a-z0-9-]+$/.test(template) || !fs.existsSync(path.join(from, 'site.yaml'))) {
    return { ok: false, status: 400, message: `There is no template called "${template}". Choose one of: ${templateNames().join(', ')}.` };
  }
  const to = path.join(sitesDir, site);
  if (fs.existsSync(to)) return { ok: false, status: 409, message: `sites/${site} already exists. Choose another name.` };

  fs.mkdirSync(sitesDir, { recursive: true });
  fs.cpSync(from, to, { recursive: true, filter: (src) => !/[\\/](dist|node_modules|\.astro)([\\/]|$)/.test(src) });

  // Keep the template's comments: edit the YAML document rather than re-writing it.
  const file = path.join(to, 'site.yaml');
  const doc = parseDocument(fs.readFileSync(file, 'utf8'));
  doc.setIn(['meta', 'name'], site);
  fs.writeFileSync(file, doc.toString({ lineWidth: 0 }), 'utf8');

  const check = loadSite(to);
  if (!check.ok) {
    fs.rmSync(to, { recursive: true, force: true });
    return { ok: false, status: 422, message: `The template "${template}" is not valid:\n${check.errors.join('\n')}` };
  }
  return { ok: true, dir: to };
}

export function newSite(site: string, template: string): number {
  const result = createSite(site, template);
  if (!result.ok) {
    console.error(result.message);
    return 1;
  }
  console.log(`Created ${result.dir} from the ${template} template.`);
  console.log(`Next: npm run forge -- dev ${site}`);
  return 0;
}
