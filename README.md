# joshapproved.com

The studio site for Josh Approved — a two-person studio shipping privacy-first, open-source replacements for paywalled utility apps.

Lives at https://joshapproved.com.

## What's here

- `/` — studio site with the apps catalogue
- `/apps/<slug>/` — per-app landing pages (driven by `src/data/apps.ts`)
- `/manifesto/` — what we make and what we don't

In-browser tools (HEIC → JPG, image compression, etc.) live on their own subdomains and ship as separate Pages projects. They will be linked from the catalogue when shipped.

## Stack

- [Astro](https://astro.build), static output. Zero JavaScript at runtime by default.
- Hosted on [Cloudflare Pages](https://pages.cloudflare.com). Free tier, unlimited bandwidth.
- IBM Plex Sans / Plex Mono, OFL.
- Design tokens vendored from the studio design system.

## Develop

```bash
npm install
npm run dev          # local dev server at http://localhost:4321
npm run build        # static build into ./dist
npm run preview      # serve ./dist locally
```

## Add a new app

Add an entry to `src/data/apps.ts`. The catalogue card and `/apps/<slug>/` page render from that record — no new files needed for a standard listing.

## Design system

Tokens, fonts, and assets are vendored under `public/`. The upstream source is the studio design system; do not edit `public/styles/tokens.css` or `public/fonts/*` directly. Re-vendor instead.

## License

MIT. See [`LICENSE`](LICENSE).
