# szabivaida

This folder holds one website and the Forge code that builds it.

## Ownership and licence
The site is yours to keep, change, host anywhere and use commercially. No fee or credit is needed.
The Forge code may be used and changed to run this site, but not passed on by itself. Keep `LICENSE` in the repository. It never shows on the site.

## Edit, build and preview
```
npm install
npm run dev        # live preview at http://127.0.0.1:4321
npm run build      # the finished site in sites/szabivaida/dist
npm run preview    # the build, as it will look online
```
Content lives in `sites/szabivaida/site.yaml`, photos in `sites/szabivaida/images`.

## Publish on Netlify
1. Put this folder in a Git repository with `main` as its default branch, and push it.
2. Create a Netlify site from the repository. Netlify reads `netlify.toml`.
3. In Netlify, turn on Identity (invite only) and Git Gateway, then invite the site owner.
4. The owner edits the site at `/admin/`.

Or deploy from this computer with `npm run deploy` once `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` are set.
