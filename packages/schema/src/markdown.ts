import { z } from 'zod';
import { SiteSchema } from './site.ts';

interface Node {
  widget?: string;
  type?: string | string[];
  properties?: Record<string, Node>;
  items?: Node;
  oneOf?: Node[];
  anyOf?: Node[];
  const?: unknown;
}

let cached: Node | undefined;
const schemaNode = () => (cached ??= z.toJSONSchema(SiteSchema, { io: 'output', unrepresentable: 'any' }) as Node);

/** Picks the union member that matches a value, by its `type` constant. */
function branch(node: Node, value: unknown): Node | undefined {
  const options = node.oneOf ?? node.anyOf;
  if (!options) return node;
  const tag = (value as { type?: unknown } | null)?.type;
  return options.find((o) => o.properties?.type?.const === tag) ?? options.find((o) => o.type !== 'null');
}

function walk(node: Node | undefined, value: unknown, out: Set<string>): void {
  if (!node || value === undefined || value === null) return;
  const n = branch(node, value);
  if (!n) return;
  if (n.widget === 'markdown' && typeof value === 'string') {
    out.add(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) walk(n.items, item, out);
    return;
  }
  if (typeof value === 'object' && n.properties) {
    for (const [key, child] of Object.entries(n.properties)) walk(child, (value as Record<string, unknown>)[key], out);
  }
}

/** Every markdown text in a site, found through the schema's markdown widget hint. */
export function markdownTexts(site: unknown): string[] {
  const out = new Set<string>();
  walk(schemaNode(), site, out);
  return [...out];
}

/** A short stable key for a markdown text. The loader and the Markdown component must agree on it. */
export function markdownKey(text: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193);
    h2 = Math.imul(h2 ^ c, 0x5bd1e995);
  }
  return `md-${(h1 >>> 0).toString(36)}${(h2 >>> 0).toString(36)}-${text.length}`;
}
