import { SITE_APP, resolveSiteDir } from '../paths.ts';
import { astroApi, checkSite, useSite } from '../astro.ts';

/** Runs the dev server with live reload, including when site.yaml changes. Returns -1 so the process stays up. */
export async function devSite(arg: string, port = 4321): Promise<number> {
  const siteDir = resolveSiteDir(arg);
  if (!checkSite(siteDir)) return 1;
  useSite(siteDir);
  const { dev } = await astroApi();
  await dev({ root: SITE_APP, server: { port, host: '127.0.0.1' } });
  return -1;
}

/** Serves the last build, as it will look when hosted. Run forge build first. */
export async function previewSite(arg: string, port = 4400): Promise<number> {
  const siteDir = resolveSiteDir(arg);
  if (!checkSite(siteDir)) return 1;
  useSite(siteDir);
  const { preview } = await astroApi();
  await preview({ root: SITE_APP, server: { port, host: '127.0.0.1' } });
  return -1;
}
