import { stringify } from 'yaml';
import type { SiteSpec } from '@forge/schema';
import { buildPostFields, buildSiteFields } from './fields.ts';

export * from './fields.ts';

// Decap CMS is loaded from a CDN with an exact version and a Subresource Integrity hash.
// To bump it, change both together and check the hash with tools/decap-sri.ts.
export const DECAP_VERSION = '3.16.3';
export const DECAP_SRI = 'sha384-A/Gdn928CNLufmnGWGs9RM4Q9o8bSNLeJERqBFrBjwzL7FRpoLT3MPF8Tl0+Wd2p';

/**
 * The Decap config.yml for one site. Paths are relative to the root of the site's own repository,
 * where the site lives in sites/<name>/ (the layout `forge export` writes).
 */
export function buildDecapConfig(site: SiteSpec): string {
  const base = `sites/${site.meta.name}`;
  const collections: unknown[] = [
    {
      name: 'site',
      label: 'Website',
      files: [
        {
          name: 'site',
          label: 'Pages and settings',
          file: `${base}/site.yaml`,
          fields: buildSiteFields(),
        },
      ],
    },
  ];
  if (site.blog) {
    collections.push({
      name: 'posts',
      label: 'Blog posts',
      label_singular: 'Post',
      folder: `${base}/posts`,
      create: true,
      slug: '{{slug}}',
      extension: 'md',
      format: 'frontmatter',
      sortable_fields: ['date', 'title'],
      summary: '{{title}} ({{date}})',
      fields: buildPostFields(),
    });
  }
  const config = {
    backend: { name: 'git-gateway', branch: 'main' },
    site_url: site.meta.url,
    // Uploads land in the site's images folder and are written as images/<file>, which the site resolves.
    media_folder: `${base}/images`,
    public_folder: 'images',
    collections,
  };
  return stringify(config, { lineWidth: 0 });
}

/** The /admin/ page: Decap from a pinned, integrity-checked script, and Netlify Identity for logging in. */
export function buildAdminHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Content manager</title>
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@${DECAP_VERSION}/dist/decap-cms.js" integrity="${DECAP_SRI}" crossorigin="anonymous"></script>
  </body>
</html>
`;
}
