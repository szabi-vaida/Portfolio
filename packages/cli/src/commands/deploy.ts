import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { resolveSiteDir, toPosix } from '../paths.ts';

const API = 'https://api.netlify.com/api/v1';

export interface DeployOptions {
  token: string;
  siteId: string;
  /** Publish to the live address. Without it Netlify makes a draft with its own preview link. */
  production: boolean;
  /** Replaces fetch in tests. */
  fetchImpl?: typeof fetch;
}

function walk(dir: string, base = dir): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full, base) : [full];
  });
}

/**
 * Uploads a built site with Netlify's file digest API: send the list of file hashes,
 * then upload only the files Netlify does not have yet.
 */
export async function deployDist(distDir: string, options: DeployOptions): Promise<{ url: string; id: string }> {
  const f = options.fetchImpl ?? fetch;
  const headers = { Authorization: `Bearer ${options.token}` };
  const files = new Map<string, string>();
  const byHash = new Map<string, string>();
  for (const file of walk(distDir)) {
    const rel = `/${toPosix(path.relative(distDir, file))}`;
    const sha = crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex');
    files.set(rel, sha);
    byHash.set(sha, file);
  }

  const created = await f(`${API}/sites/${options.siteId}/deploys`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ files: Object.fromEntries(files), draft: !options.production }),
  });
  if (!created.ok) throw new Error(`Netlify refused the deploy (${created.status}): ${await created.text()}`);
  const deploy = (await created.json()) as { id: string; required?: string[]; deploy_ssl_url?: string; ssl_url?: string };

  for (const sha of deploy.required ?? []) {
    const file = byHash.get(sha);
    if (!file) continue;
    const rel = toPosix(path.relative(distDir, file));
    const uploaded = await f(`${API}/deploys/${deploy.id}/files/${rel.split('/').map(encodeURIComponent).join('/')}`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/octet-stream' },
      body: fs.readFileSync(file),
    });
    if (!uploaded.ok) throw new Error(`Upload failed for ${rel} (${uploaded.status})`);
  }
  return { id: deploy.id, url: deploy.deploy_ssl_url ?? deploy.ssl_url ?? '' };
}

/** forge deploy <site> [--prod]: needs NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID (or --site-id). */
export async function deploySite(arg: string, production: boolean, siteIdArg?: string): Promise<number> {
  const siteDir = resolveSiteDir(arg);
  const dist = path.join(siteDir, 'dist');
  const token = process.env.NETLIFY_AUTH_TOKEN;
  const siteId = siteIdArg ?? process.env.NETLIFY_SITE_ID;
  if (!fs.existsSync(path.join(dist, 'index.html'))) {
    console.error(`Nothing to deploy yet. Run: npm run forge -- build ${arg}`);
    return 1;
  }
  if (!token || !siteId) {
    console.error('Deploying needs NETLIFY_AUTH_TOKEN and NETLIFY_SITE_ID to be set (or pass --site-id).');
    return 1;
  }
  try {
    const result = await deployDist(dist, { token, siteId, production });
    console.log(`${production ? 'Published' : 'Draft ready'}: ${result.url}`);
    return 0;
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err));
    return 1;
  }
}
