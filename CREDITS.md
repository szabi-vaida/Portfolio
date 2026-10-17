# Credits

Everything Forge ships or loads that it did not make itself, with its source and licence. Full licence texts are in `licenses/`, which every export carries. This file replaces `THIRD_PARTY_NOTICES.md`.

Forge's own code, components, themes, icons and template text are covered by `LICENSE`.

## Code that ends up in a built site

| What | Where Forge uses it | Source | Licence |
|---|---|---|---|
| Webcore UI 1.5.0 | Photo carousel, masonry gallery, pricing ribbon, closeable announcement bar (`packages/components/src/vendor/`) | https://github.com/Frontendland/webcoreui | MIT, Copyright (c) 2024 Frontendland (`licenses/webcoreui.txt`) |
| Astro 7.3.8 | Builds every site. A small runtime ships only with the islands that need it | https://github.com/withastro/astro | MIT |
| @astrojs/sitemap 3.7.4 | Writes `sitemap-index.xml` for sites with a web address | https://github.com/withastro/astro | MIT |

## Loaded from elsewhere

| What | When | Source | Licence |
|---|---|---|---|
| Decap CMS 3.16.3 | On `/admin/` only, pinned with a Subresource Integrity hash | https://github.com/decaporg/decap-cms | MIT |
| Netlify Identity widget | On `/admin/`, and on a public page only when its address holds an invitation or password reset token | https://github.com/netlify/netlify-identity-widget | MIT |

No other third-party request is made by a built site. Fonts and photos are downloaded at build time and served from the site itself.

## Fonts

Downloaded at build time through Astro's Fonts API from Fontsource, then served from the site. All are under the SIL Open Font License 1.1 (https://openfontlicense.org), which allows use on any website, including commercial ones.

| Font | Used by theme | Designer |
|---|---|---|
| Fraunces, Public Sans | Harbour | Undercase Type; USWDS |
| Bricolage Grotesque, Figtree | Market | Mathieu Triay; Erik Kennedy |
| Instrument Serif, Instrument Sans | Atelier | Instrument |
| DM Serif Display, Karla | Bistro | Colophon Foundry; Jonathan Pinhorn |
| Space Grotesk, Manrope | Signal | Florian Karsten; Mikhail Sharanda |
| Newsreader, Source Serif 4 | Journal | Production Type; Frank Grießhammer (Adobe) |

## Photos in the templates

All template photos come from Unsplash under the Unsplash License (https://unsplash.com/license): free to use, including commercially, with no permission or credit needed. They may not be sold unaltered or used to build a competing photo service. Sites made from a template are expected to replace them with their own photos. Each photo is linked in its template's `site.yaml` as `https://images.unsplash.com/<id>`.

| Template | Unsplash photo ids |
|---|---|
| business | photo-1584622650111-993a426fbf0a, photo-1676210134050-6f12c6898395, photo-1733426107854-ee00a25d72a7, photo-1763485956354-f8c29a91b31f, photo-1765046300927-6c1827612c42, photo-1778731660083-60d60e6817ca, photo-1781705117331-10010c599e78, photo-1787539386512-e7d727dc5c1a |
| shop | photo-1536936812504-0e77dc3f0b40, photo-1577576223085-3eb295cd414f, photo-1595351298020-038700609878, photo-1598815272841-4e85a77e0a67, photo-1607448885122-b3d4cf451587, photo-1610128361323-6e941c97f023, photo-1610701596007-11502861dcfa, photo-1612870199268-d33b7e0bd9b0, photo-1673339065013-f8411fb93848, photo-1676125105332-608345abe20e, photo-1725169412537-acd1cd15e10f, photo-1740329362227-45c2f46a1f66, photo-1740478949628-ff562c3c3923, photo-1766875127697-8e5d2004cde8, photo-1784652587169-6b3933829d22 |
| portfolio | photo-1446038202205-1c96430dbdab, photo-1446038236174-69712e24d137, photo-1514691184245-358dd4016ca0, photo-1520529890308-f503006340b4, photo-1548248823-ce16a73b6d49, photo-1549981832-2ba2ee913334, photo-1772465970992-f559109178b9, photo-1774762720340-8067294bb494, photo-1782666052410-8d1bb1d23bab, photo-1789407927660-2365089dd9fa, photo-1790623943801-7ba0b34a9b79 |
| restaurant | photo-1511081692775-05d0f180a065, photo-1532713107108-dfb5d8d2fc42, photo-1534432182912-63863115e106, photo-1599125816289-736f5025fc05, photo-1609246258268-fd17f2b9a2c7, photo-1687877465634-a7599027966c, photo-1718791985055-e1b06ef5961d, photo-1719520670204-dbe1903a789f |
| agency | photo-1572021335469-31706a17aaef, photo-1574856049959-d3134a3e592f, photo-1603201667230-bd139210db18, photo-1676282831194-f7dcd46eafef, photo-1765046300927-6c1827612c42, photo-1772989665252-7cb41ae759cc, photo-1777923311853-d14b7beb9fec, photo-1779497056294-ff180f55e3e1, photo-1781705117331-10010c599e78, photo-1790270577185-4b7680364174 |
| blog | photo-1687878269800-c92f8d327aae, photo-1687878269804-63e8b50e3ddc, photo-1770982699024-31edd9a6d4d3, photo-1775568109786-18598bf7b294, photo-1781521215146-5aa55e800b0d, photo-1791318219716-2ce5458c8257 |

The client logos in the agency template are made up for the demo and drawn for Forge.

## Icons

The icon set in `packages/components/src/lib/icons.ts` is drawn for Forge. The social network marks are simplified outlines of trademarks that belong to their owners, used only to label a link to that network.

## Design references (no code copied)

These free Astro themes were studied for patterns. No code was copied from any of them, so nothing below is bundled.

| Theme | Licence | What Forge took as an idea |
|---|---|---|
| AstroWind, https://github.com/onwidget/astrowind | MIT | Pages built from typed section widgets, a site setting for light, dark or system colours, SEO defaults from one config |
| Accessible Astro Starter, https://github.com/incluud/accessible-astro-starter | MIT | Skip link, focus rings that work on light and dark, landmarks, the current menu item marked for screen readers, reduced motion respected everywhere |
| ScrewFast, https://github.com/mearashadowfax/ScrewFast | MIT | Pages as thin shells over shared sections, one place for metadata and navigation, structured data built from page props |
| Astroship, https://github.com/surjithctly/astroship | GPL-3.0 | Looked at only. Its licence is not permissive, so nothing from it is used |

Other references, also with no code copied:
- The Forge marketing page, the visual quality bar for the templates.
- Impeccable (https://github.com/pbakaus/impeccable, Apache-2.0), used as written design guidance.
- Mantine's spacing, radius and shadow scales, used as a reference for Forge Studio's own scales (`apps/studio/public/studio.css`). Mantine is MIT.
