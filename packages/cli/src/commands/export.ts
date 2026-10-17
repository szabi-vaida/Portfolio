import fs from 'node:fs';
import path from 'node:path';
import { loadSite } from '@forge/schema';
import { REPO_ROOT, resolveSiteDir } from '../paths.ts';
import { checkSite } from '../astro.ts';

const SKIP = new Set(['dist', '.astro', 'node_modules', 'fixture']);
/** The parts of Forge an exported site needs to build itself. */
const PACKAGES = ['schema', 'themes', 'components', 'catalogue', 'decap', 'cli'];
const ROOT_FILES = ['LICENSE', 'CREDITS.md'];

const keep = (src: string) => !src.split(path.sep).some((part) => SKIP.has(part));

function readme(name: string): string {
  return `# ${name}

This folder holds one website and the Forge code that builds it.

## Ownership and licence
The site is yours to keep, change, host anywhere and use commercially. No fee or credit is needed.
The Forge code may be used and changed to run this site, but not passed on by itself. Keep \`LICENSE\` in the repository. It never shows on the site.

## Edit, build and preview
\`\`\`
npm install
npm run dev        # live preview at http://127.0.0.1:4321
npm run build      # the finished site in sites/${name}/dist
npm run preview    # the build, as it will look online
\`\`\`
Content lives in \`sites/${name}/site.yaml\`, photos in \`sites/${name}/images\`.

## Publish on Netlify
1. Put this folder in a Git repository with \`main\` as its default branch, and push it.
2. Create a Netlify site from the repository. Netlify reads \`netlify.toml\`.
3. In Netlify, turn on Identity (invite only) and Git Gateway, then invite the site owner.
4. The owner edits the site at \`/admin/\`.

Or deploy from this computer with \`npm run deploy\` once \`NETLIFY_AUTH_TOKEN\` and \`NETLIFY_SITE_ID\` are set.
`;
}

export function exportSite(arg: string, outArg?: string): number {
  const siteDir = resolveSiteDir(arg);
  if (!checkSite(siteDir)) return 1;
  const loaded = loadSite(siteDir);
  if (!loaded.ok) return 1;
  const name = loaded.data.meta.name;

  const out = outArg ? path.resolve(outArg) : path.join(REPO_ROOT, 'exports', name);
  if (fs.existsSync(out) && fs.readdirSync(out).length > 0) {
    console.error(`Not exporting: ${out} already exists and is not empty. Choose another folder with --out.`);
    return 1;
  }
  fs.mkdirSync(out, { recursive: true });

  for (const pkg of PACKAGES) {
    fs.cpSync(path.join(REPO_ROOT, 'packages', pkg), path.join(out, 'packages', pkg), { recursive: true, filter: keep });
  }
  fs.cpSync(path.join(REPO_ROOT, 'apps', 'site'), path.join(out, 'apps', 'site'), { recursive: true, filter: keep });
  fs.cpSync(siteDir, path.join(out, 'sites', name), { recursive: true, filter: keep });
  for (const file of ROOT_FILES) {
    const from = path.join(REPO_ROOT, file);
    if (fs.existsSync(from)) fs.copyFileSync(from, path.join(out, file));
  }
  const licences = path.join(REPO_ROOT, 'licenses');
  if (fs.existsSync(licences)) fs.cpSync(licences, path.join(out, 'licenses'), { recursive: true });

  const forge = 'tsx packages/cli/src/forge.ts';
  const pkg = {
    name,
    private: true,
    type: 'module',
    workspaces: ['packages/*', 'apps/*'],
    engines: { node: '>=22.12' },
    scripts: {
      dev: `${forge} dev ${name}`,
      build: `${forge} build ${name}`,
      preview: `${forge} preview ${name}`,
      deploy: `${forge} deploy ${name}`,
    },
    dependencies: { tsx: '^4' },
  };
  fs.writeFileSync(path.join(out, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
  fs.writeFileSync(
    path.join(out, 'netlify.toml'),
    `[build]\n  command = "npm run build"\n  publish = "sites/${name}/dist"\n\n[build.environment]\n  NODE_VERSION = "22"\n`,
    'utf8',
  );
  fs.writeFileSync(path.join(out, '.gitignore'), 'node_modules/\ndist/\n.astro/\n*.local\n', 'utf8');
  fs.writeFileSync(path.join(out, 'README.md'), readme(name), 'utf8');

  console.log(`Exported ${name} to ${out}`);
  return 0;
}
