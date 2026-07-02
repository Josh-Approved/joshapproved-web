// Regenerate demo posters from the first frame of each animated demo.
//
// The site's demo scheme is a plain <picture>: the <img> loads the .gif (which
// animates on its own when motion is allowed), and a reduced-motion <source>
// swaps in the still poster. The poster MUST be the gif's own first frame so the
// reduced-motion still matches the animation's opening — and so a re-rendered gif
// can't drift away from a stale hand-made poster (the springboard-frame defect).
//
// Run after copying new demo gifs into src/assets/demos/:
//   node scripts/gen-demo-posters.mjs
//
// The demos live under src/assets/ (not public/) so Astro/Vite content-hashes
// them at build via the ?url imports in src/data/apps.ts — a deploy can never
// serve stale demo bytes behind an unchanged filename.
//
// For every <name>.gif it (re)writes <name>-poster.png from page 0. Static demos
// (a bare .png with no gif) are left alone — they have no poster.
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const DEMO_DIR = fileURLToPath(new URL('../src/assets/demos/', import.meta.url));

const files = await readdir(DEMO_DIR);
const gifs = files.filter((f) => f.endsWith('.gif'));

if (gifs.length === 0) {
  console.error(`No .gif demos found in ${DEMO_DIR}`);
  process.exit(1);
}

for (const gif of gifs) {
  const base = gif.slice(0, -'.gif'.length);
  const src = path.join(DEMO_DIR, gif);
  const out = path.join(DEMO_DIR, `${base}-poster.png`);
  // page: 0 pulls the first frame of the animated GIF.
  await sharp(src, { page: 0 }).png().toFile(out);
  const meta = await sharp(out).metadata();
  console.log(`poster: ${base}-poster.png  (${meta.width}x${meta.height}) from ${gif} frame 0`);
}
