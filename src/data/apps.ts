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
import groceryDemo from '../assets/demos/grocery-list.gif?url';
import groceryPoster from '../assets/demos/grocery-list-poster.png?url';
import packingDemo from '../assets/demos/packing-list.gif?url';
import packingPoster from '../assets/demos/packing-list-poster.png?url';
import fwtDemo from '../assets/demos/free-workout-timer.gif?url';
import fwtPoster from '../assets/demos/free-workout-timer-poster.png?url';
import tendDemo from '../assets/demos/tend.png?url';

const DEMOS: Record<string, NonNullable<AppRecord['demo']>> = {
  'grocery-list': {
    src: groceryDemo,
    poster: groceryPoster,
    alt: 'Adding an item to a shared grocery list and checking it off',
  },
  'packing-list': {
    src: packingDemo,
    poster: packingPoster,
    alt: 'A packing list building itself from the trip type, with sensible quantities',
  },
  'free-workout-timer': {
    src: fwtDemo,
    poster: fwtPoster,
    alt: 'Picking a timer and counting down into the first exercise',
  },
  tend: {
    src: tendDemo,
    alt: 'The Today screen showing who to reach out to and what is coming up',
  },
};

export const APPS: AppRecord[] = CATALOG_APPS.map((app) =>
  DEMOS[app.slug] ? { ...app, demo: DEMOS[app.slug] } : app,
);
