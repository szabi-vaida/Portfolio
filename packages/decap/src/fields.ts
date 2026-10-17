import { z } from 'zod';
import { OPTION_LABELS, SECTION_INFO } from '@forge/catalogue';
import { PostSchema, SiteSchema, type SectionType } from '@forge/schema';

/** One Decap CMS field, as written to config.yml. */
export interface DecapField {
  label: string;
  name: string;
  widget: string;
  required?: boolean;
  hint?: string;
  default?: unknown;
  value_type?: 'int' | 'float';
  min?: number;
  max?: number;
  options?: Array<string | { label: string; value: string }>;
  fields?: DecapField[];
  field?: DecapField;
  types?: DecapField[];
  typeKey?: string;
  summary?: string;
  collapsed?: boolean;
}

interface JsonNode {
  type?: string;
  title?: string;
  description?: string;
  widget?: string;
  default?: unknown;
  enum?: unknown[];
  const?: unknown;
  minimum?: number;
  maximum?: number;
  minItems?: number;
  maxItems?: number;
  properties?: Record<string, JsonNode>;
  required?: string[];
  items?: JsonNode;
  oneOf?: JsonNode[];
  anyOf?: JsonNode[];
}

const STRING_WIDGETS = new Set(['string', 'text', 'markdown', 'image', 'color', 'datetime']);

const labelOf = (name: string, node: JsonNode) => node.title ?? name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');

function unsupported(pointer: string, why: string): never {
  throw new Error(`Cannot map the schema at ${pointer} to a Decap field: ${why}`);
}

/**
 * Maps a JSON Schema node, made from the Zod schema, to a Decap field.
 * `path` is the dotted name of the field without list positions, used to find plain-English option labels.
 */
function mapNode(name: string, node: JsonNode, pointer: string, isRequired: boolean, path: string): DecapField {
  const base: DecapField = { label: labelOf(name, node), name, widget: 'string' };
  if (!isRequired) base.required = false;
  if (node.description) base.hint = node.description;
  if (node.default !== undefined && typeof node.default !== 'object') base.default = node.default;

  if (node.enum) {
    const values = node.enum.map(String);
    const labels = OPTION_LABELS[path] ?? OPTION_LABELS[path.split('.').slice(-1)[0]];
    return { ...base, widget: 'select', options: labels ? values.map((v) => ({ label: labels[v] ?? v, value: v })) : values };
  }
  if (!node.type && node.widget) {
    if (!STRING_WIDGETS.has(node.widget)) unsupported(pointer, `unknown widget "${node.widget}"`);
    return { ...base, widget: node.widget };
  }
  switch (node.type) {
    case 'string': {
      const widget = node.widget ?? 'string';
      if (!STRING_WIDGETS.has(widget)) unsupported(pointer, `unknown widget "${widget}"`);
      return { ...base, widget };
    }
    case 'number':
    case 'integer': {
      const field: DecapField = { ...base, widget: 'number', value_type: node.type === 'integer' ? 'int' : 'float' };
      if (typeof node.minimum === 'number') field.min = node.minimum;
      if (typeof node.maximum === 'number') field.max = node.maximum;
      return field;
    }
    case 'boolean':
      return { ...base, widget: 'boolean' };
    case 'object':
      return { ...base, widget: 'object', collapsed: true, fields: objectFields(node, pointer, path) };
    case 'array': {
      const items = node.items;
      if (!items) unsupported(pointer, 'a list without items');
      const alternatives = items.oneOf ?? items.anyOf;
      if (alternatives) return { ...base, ...sectionTypes(alternatives, `${pointer}/items`) };
      if (items.type === 'object') {
        const fields = objectFields(items, `${pointer}/items`, path);
        return { ...base, ...listLimits(node), widget: 'list', collapsed: true, summary: summaryFor(fields), fields };
      }
      if (items.type === 'string') {
        return { ...base, ...listLimits(node), widget: 'list', field: { label: labelOf('item', items), name: 'item', widget: items.widget ?? 'string' } };
      }
      return unsupported(`${pointer}/items`, `a list of ${items.type ?? 'unknown'}`);
    }
    default:
      return unsupported(pointer, `type ${node.type ?? 'unknown'}`);
  }
}

/** Decap enforces the same number of items as the schema. */
function listLimits(node: JsonNode): Pick<DecapField, 'min' | 'max'> {
  return {
    ...(typeof node.minItems === 'number' && node.minItems > 0 ? { min: node.minItems } : {}),
    ...(typeof node.maxItems === 'number' ? { max: node.maxItems } : {}),
  };
}

/** A list item's collapsed title: its first text field, such as the question or the name. */
function summaryFor(fields: DecapField[]): string | undefined {
  const first = fields.find((f) => f.widget === 'string');
  return first ? `{{fields.${first.name}}}` : undefined;
}

function objectFields(node: JsonNode, pointer: string, parentPath: string): DecapField[] {
  const required = new Set(node.required ?? []);
  return Object.entries(node.properties ?? {}).map(([name, child]) =>
    mapNode(name, child, `${pointer}/properties/${name}`, required.has(name), parentPath ? `${parentPath}.${name}` : name),
  );
}

/** The sections list: one Decap type per section, named and labelled from the catalogue. */
function sectionTypes(alternatives: JsonNode[], pointer: string) {
  const types: DecapField[] = alternatives.map((alt, i) => {
    const at = `${pointer}/oneOf/${i}`;
    const tag = alt.properties?.type?.const;
    if (typeof tag !== 'string') unsupported(at, 'a section without a "type"');
    const info = SECTION_INFO[tag as SectionType];
    const withoutType = { ...alt, properties: Object.fromEntries(Object.entries(alt.properties ?? {}).filter(([k]) => k !== 'type')) };
    const fields = objectFields(withoutType, at, tag);
    for (const field of fields) {
      if (field.name !== 'variant' || field.widget !== 'select') continue;
      const variants = info.variants as Record<string, { name: string }>;
      field.label = 'Layout';
      field.options = (field.options ?? []).map((o) => {
        const value = typeof o === 'string' ? o : o.value;
        return { label: variants[value]?.name ?? value, value };
      });
    }
    return { label: info.name, name: tag, widget: 'object', summary: '{{fields.heading}}', fields };
  });
  return { widget: 'list', typeKey: 'type', types };
}

/** The Decap fields for a whole site.yaml, generated from the same Zod schema that checks it. */
export function buildSiteFields(): DecapField[] {
  const schema = z.toJSONSchema(SiteSchema, { io: 'input', unrepresentable: 'any' }) as JsonNode;
  return objectFields(schema, '#', '');
}

/** The Decap fields for a blog post's front matter, plus the post body. */
export function buildPostFields(): DecapField[] {
  const schema = z.toJSONSchema(PostSchema, { io: 'input', unrepresentable: 'any' }) as JsonNode;
  return [...objectFields(schema, '#', 'post'), { label: 'Post', name: 'body', widget: 'markdown' }];
}
