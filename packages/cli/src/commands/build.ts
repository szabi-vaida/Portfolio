import path from 'node:path';
import { SITE_APP, resolveSiteDir } from '../paths.ts';
import { astroApi, checkSite, useSite } from '../astro.ts';

/** Builds one site into sites/<name>/dist, including /admin/ for Decap. Returns a process exit code. */
export async function buildSite(arg: string): Promise<number> {
  const siteDir = resolveSiteDir(arg);
  if (!checkSite(siteDir)) return 1;
  useSite(siteDir);
  const { build } = await astroApi();
  try {
    await build({ root: SITE_APP, logLevel: process.env.FORGE_QUIET ? 'warn' : 'info' });
  } catch (err) {
    console.error(`The build failed for ${siteDir}:`);
    console.error(err instanceof Error ? err.message : String(err));
    return 1;
  }
  console.log(`Built ${path.join(siteDir, 'dist')}`);
  return 0;
}
