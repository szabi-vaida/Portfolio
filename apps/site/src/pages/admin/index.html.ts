import type { APIRoute } from 'astro';
import { buildAdminHtml } from '@forge/decap';

/** The Decap CMS page at /admin/. Not in the sitemap and marked noindex. */
export const GET: APIRoute = () => new Response(buildAdminHtml(), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
