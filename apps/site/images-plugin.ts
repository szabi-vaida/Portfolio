import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';

const ID = 'virtual:forge-images';
const RESOLVED = `\0${ID}`;
const IMAGE = /\.(jpe?g|png|webp|avif|gif|svg)$/i;

function list(dir: string, prefix = ''): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) return list(path.join(dir, entry.name), rel);
    return IMAGE.test(entry.name) ? [rel] : [];
  });
}

/**
 * Exposes every file in the site's images folder as `virtual:forge-images`, a map from the path
 * after images/ to the imported image. astro:assets can then resize and convert each one.
 */
export function forgeImages(imagesDir: string): Plugin {
  return {
    name: 'forge-images',
    // In dev, a new or removed image rebuilds the map and reloads the page, so an upload shows at once.
    configureServer(server) {
      server.watcher.add(imagesDir);
      const refresh = (file: string) => {
        if (!path.resolve(file).startsWith(path.resolve(imagesDir)) || !IMAGE.test(file)) return;
        for (const env of Object.values(server.environments)) {
          const mod = env.moduleGraph.getModuleById(RESOLVED);
          if (mod) env.moduleGraph.invalidateModule(mod);
        }
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh);
      server.watcher.on('unlink', refresh);
    },
    resolveId(id) {
      return id === ID ? RESOLVED : undefined;
    },
    load(id) {
      if (id !== RESOLVED) return undefined;
      const files = list(imagesDir);
      for (const f of files) this.addWatchFile(path.join(imagesDir, f));
      const imports = files.map((f, i) => `import i${i} from ${JSON.stringify(path.join(imagesDir, f).split(path.sep).join('/'))};`);
      const entries = files.map((f, i) => `${JSON.stringify(f)}: i${i}`);
      return `${imports.join('\n')}\nexport default {${entries.join(',')}};`;
    },
  };
}
