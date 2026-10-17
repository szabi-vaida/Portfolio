import fs from 'node:fs';
import path from 'node:path';
import { parse, YAMLParseError } from 'yaml';
import { formatIssues } from './paths.ts';
import { SiteSchema, type SiteSpec } from './site.ts';

export type LoadResult = { ok: true; data: SiteSpec } | { ok: false; errors: string[] };

export function parseSiteText(text: string): LoadResult {
  let raw: unknown;
  try {
    raw = parse(text);
  } catch (err) {
    if (err instanceof YAMLParseError) {
      const pos = err.linePos?.[0];
      const where = pos ? `line ${pos.line}, column ${pos.col}` : 'an unknown position';
      return { ok: false, errors: [`site.yaml: YAML syntax error at ${where}: ${err.message.split('\n')[0]}`] };
    }
    throw err;
  }
  const result = SiteSchema.safeParse(raw);
  if (!result.success) return { ok: false, errors: formatIssues(result.error.issues) };
  return { ok: true, data: result.data };
}

export function loadSite(siteDir: string): LoadResult {
  const file = path.join(siteDir, 'site.yaml');
  if (!fs.existsSync(file)) return { ok: false, errors: [`site.yaml: no file at ${file}`] };
  return parseSiteText(fs.readFileSync(file, 'utf8'));
}

/** The error text both the CLI and the Astro loader show for an invalid site.yaml. */
export function describeErrors(siteDir: string, errors: string[]): string {
  return [`site.yaml is not valid (${path.join(siteDir, 'site.yaml')}):`, ...errors.map((e) => `  ${e}`)].join('\n');
}
