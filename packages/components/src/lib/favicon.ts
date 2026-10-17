/** A favicon drawn from the site's first letter in its theme colours, so every site has one from day one. */
export function letterFavicon(title: string, background: string, foreground: string): string {
  const initial = title.trim().charAt(0).toUpperCase().replace(/[<>&"']/g, '');
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
    `<rect width="64" height="64" rx="14" fill="${background}"/>` +
    `<text x="32" y="44" font-family="system-ui,sans-serif" font-size="36" font-weight="700" text-anchor="middle" fill="${foreground}">${initial}</text>` +
    '</svg>';
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
