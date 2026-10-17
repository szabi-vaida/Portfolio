import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import { buildDecapConfig } from '@forge/decap';
import type { SiteSpec } from '@forge/schema';

/** Decap's config, generated from the same schema that checks site.yaml, so the editor and the file never drift. */
export const GET: APIRoute = async () => {
  const site = (await getEntry('site', 'site'))!.data as SiteSpec;
  return new Response(buildDecapConfig(site), { headers: { 'Content-Type': 'text/yaml; charset=utf-8' } });
};
