import type { z } from 'zod';

/** Turns a Zod issue path such as ['pages', 0, 'sections', 2, 'price'] into pages[0].sections[2].price. Safe for the browser. */
export function formatPath(issuePath: ReadonlyArray<PropertyKey>): string {
  let out = '';
  for (const part of issuePath) {
    if (typeof part === 'number') out += `[${part}]`;
    else out += out === '' ? String(part) : `.${String(part)}`;
  }
  return out === '' ? '(root)' : out;
}

export function formatIssues(issues: ReadonlyArray<z.core.$ZodIssue>): string[] {
  return issues.map((issue) => `${formatPath(issue.path)}: ${issue.message}`);
}
