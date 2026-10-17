import fs from 'node:fs';
import path from 'node:path';
import type { Loader } from 'astro/loaders';
import { describeErrors, markdownKey, markdownTexts, parseSiteText } from '@forge/schema';

const siteFile = (siteDir: string) => path.join(siteDir, 'site.yaml');
/** Forge Studio marks each draft site.yaml with its number in a first-line comment. */
const DRAFT_VERSION = /^# forge-draft-version: (\d+)/;

/** Reads, checks and returns site.yaml. A bad file stops the build with one `path: message` line per problem. */
function readSite(siteDir: string) {
  const file = siteFile(siteDir);
  if (!fs.existsSync(file)) throw new Error(`site.yaml: no file at ${file}`);
  const text = fs.readFileSync(file, 'utf8');
  const result = parseSiteText(text);
  if (!result.ok) throw new Error(describeErrors(siteDir, result.errors));
  return { text, data: result.data };
}

/**
 * The `site` collection, filled from site.yaml in one step, so its entries always agree:
 * - `site`: the whole site.yaml, checked against the schema;
 * - `md-...`: every markdown field, rendered once and keyed by its text (see the Markdown component);
 * - `draft-version`: in a Studio preview, the draft this content came from.
 * It reloads in dev whenever site.yaml changes.
 */
export function siteLoader(siteDir: string): Loader {
  return {
    name: 'forge-site',
    async load({ store, generateDigest, renderMarkdown, watcher, logger }) {
      const sync = async () => {
        // Text and data come from one read, so the draft number always matches the content.
        const { text, data } = readSite(siteDir);
        const rendered = await Promise.all(markdownTexts(data).map(async (md) => ({ id: markdownKey(md), body: md, rendered: await renderMarkdown(md) })));
        const version = Number(DRAFT_VERSION.exec(text)?.[1] ?? 0);
        store.clear();
        store.set({ id: 'site', data: data as unknown as Record<string, unknown>, digest: generateDigest(text) });
        for (const entry of rendered) store.set({ id: entry.id, data: {}, body: entry.body, rendered: entry.rendered });
        store.set({ id: 'draft-version', data: { value: version } });
      };
      await sync();
      watcher?.add(siteFile(siteDir));
      watcher?.on('change', async (changed) => {
        if (path.resolve(changed) !== path.resolve(siteFile(siteDir))) return;
        try {
          await sync();
          logger.info('site.yaml reloaded');
        } catch (err) {
          logger.error(err instanceof Error ? err.message : String(err));
        }
      });
    },
  };
}
