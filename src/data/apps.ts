// Site-facing catalog: the data-only catalog (src/data/catalog.ts) plus the
// demo assets, which must be attached here because they are Vite `?url`
// imports. Plain-Node scripts import catalog.ts directly; everything in the
// Astro site keeps importing from this module.
import { APPS as CATALOG_APPS, type AppRecord } from './catalog';

export type { Platform, AppRecord } from './catalog';
export { platformUrl, TAGS, PLATFORM_LABEL } from './catalog';

// Demo assets live under src/assets/ and are imported with `?url` so Astro/Vite
// content-hashes them into the build. The hashed filename changes whenever the
// bytes change, so a deploy can never leave Cloudflare's edge serving stale demo
// bytes behind an unchanged name (Josh's 2026-07-02 cache concern).
//
// They are picked up BY FILENAME rather than by a hand-written import list: a
// demo named after the app's slug is wired automatically the moment it lands in
// src/assets/demos/. That is deliberate. The hand-written list meant adding an
// app to the site took a code edit in two files, and the second one was the one
// that got forgotten (Home Upkeep shipped to both stores in August 2026 with no
// demo on the site at all). The factory's site-parity check copies each app's
// own hero recording in here, so the only thing left for a human to write is
// the alt text, which lives with the rest of the app's copy in catalog.ts.
const DEMO_URLS = import.meta.glob('../assets/demos/*.{gif,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const demoAsset = (slug: string, ext: string): string | undefined =>
  DEMO_URLS[`../assets/demos/${slug}.${ext}`];

function demoFor(app: AppRecord): AppRecord['demo'] {
  if (!app.demoAlt) return undefined;
  // A `.gif` animates and takes its reduced-motion still from the matching
  // `-poster.png` (generated from the gif's own first frame by
  // scripts/gen-demo-posters.mjs). A bare `.png` is a static framed screenshot.
  const gif = demoAsset(app.slug, 'gif');
  if (gif) {
    return { src: gif, poster: demoAsset(`${app.slug}-poster`, 'png'), alt: app.demoAlt };
  }
  const still = demoAsset(app.slug, 'png');
  return still ? { src: still, alt: app.demoAlt } : undefined;
}

export const APPS: AppRecord[] = CATALOG_APPS.map((app) => {
  const demo = demoFor(app);
  return demo ? { ...app, demo } : app;
});
