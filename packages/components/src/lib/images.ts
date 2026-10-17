import type { ImageMetadata } from 'astro';
// Every image in the site's images folder, keyed by its path inside images/. Provided by the site app.
import files from 'virtual:forge-images';

const byPath = files as Record<string, ImageMetadata>;

/** The imported image for a site.yaml path such as images/team/ana.jpg, or undefined when there is no such file. */
export function localImage(src: string): ImageMetadata | undefined {
  if (!src.startsWith('images/')) return undefined;
  return byPath[src.slice('images/'.length)];
}

export function imageExists(src: string): boolean {
  return src.startsWith('https://') || localImage(src) !== undefined;
}
