import type { PageSpec, Section, SiteSpec } from '@forge/schema';

export type { PageSpec, Section, SiteSpec };

/** A section with the anchor it renders, unique on its page. */
export interface PlacedSection {
  section: Section;
  anchor: string;
  /** True for the first section on the page. It loads its image first and is never held back. */
  first: boolean;
}

/** The props every section component receives from the page renderer. */
export interface SectionProps<S extends Section = Section> {
  section: S;
  anchor: string;
  first: boolean;
  site: SiteSpec;
}

/** Gives every section an anchor: its own `id`, or its type, numbered from the second of a kind. */
export function placeSections(sections: Section[]): PlacedSection[] {
  const taken = new Set(sections.flatMap((s) => (s.id ? [s.id] : [])));
  const counts = new Map<string, number>();
  return sections.map((section, i) => {
    let anchor = section.id;
    if (!anchor) {
      let n = counts.get(section.type) ?? 0;
      do {
        n += 1;
        anchor = n === 1 ? section.type : `${section.type}-${n}`;
      } while (taken.has(anchor));
      counts.set(section.type, n);
      taken.add(anchor);
    }
    return { section, anchor, first: i === 0 };
  });
}

/** The browser tab title for a page: its own title with the site name, or the site title alone on the home page. */
export function pageTitle(site: SiteSpec, title?: string): string {
  return title && title !== site.meta.title ? `${title} | ${site.meta.title}` : site.meta.title;
}

/** True when the link points at the current page, so the menu can mark it. */
export function isCurrent(href: string, path: string): boolean {
  // A link to a section, such as /#work, jumps within a page rather than naming one.
  if (!href.startsWith('/') || href.includes('#')) return false;
  return href === path || (href !== '/' && path.startsWith(href));
}

/** Formats a post date the same way everywhere, in the site's language. */
export function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}
