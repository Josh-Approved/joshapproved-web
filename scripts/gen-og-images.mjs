// Generate per-app Open Graph / share-card images (1200×630).
//
// Why this exists: the raw app-icon PNGs are rounded squircles on a transparent
// background. Handed straight to og:image, link unfurlers (iMessage, Slack, …)
// fill the transparent corners with black/white and crop the square to the card
// aspect — it looks broken. Instead we composite each icon onto a Paper card,
// add the studio's green approval check and a short descriptor, and commit the
// result as a static asset. No image work happens at deploy time (keeps the
// Cloudflare build trivial) — re-run `npm run gen-og` when icons or copy change.
//
// Output: public/assets/og/<slug>.png

import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Brand tokens (mirrors public/styles/tokens.css — light theme).
const PAPER = '#FAFAF7';
const INK = '#0E0E0F';
const MUTED = '#6B6B72';
const GREEN = '#1F8A4C';

const W = 1200;
const H = 630;
const ICON = 360; // icon square size
const ICON_X = 110;
const ICON_Y = (H - ICON) / 2;
const TEXT_X = ICON_X + ICON + 72;

// Embed the real IBM Plex fonts so the card renders in the studio typeface
// rather than whatever the rasteriser falls back to.
async function fontFace(family, weight, file) {
  const b64 = (await readFile(join(ROOT, 'public/fonts', file))).toString('base64');
  return `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
}

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Minimal manual wrap so a long descriptor breaks cleanly across two lines.
function wrap(text, max) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max && line) {
      lines.push(line.trim());
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

async function loadApps() {
  // catalog.ts, NOT apps.ts: this script runs under plain tsx, outside Vite, so
  // it can only load the data-only module. apps.ts attaches demo assets through
  // Vite-only features (`import.meta.glob`, `?url`), which throw here. Same
  // reason generate-install-links.ts reads catalog.ts.
  const mod = await import(join(ROOT, 'src/data/catalog.ts'));
  return mod.APPS;
}

async function main() {
  const fonts =
    (await fontFace('Plex', 600, 'IBMPlexSans-SemiBold.woff2')) +
    (await fontFace('Plex', 400, 'IBMPlexSans-Regular.woff2'));

  const apps = await loadApps();
  const outDir = join(ROOT, 'public/assets/og');
  await mkdir(outDir, { recursive: true });

  for (const app of apps) {
    if (!app.icon) continue;

    const subtitleLines = wrap(app.seoTitle ?? app.description ?? '', 40);
    const nameY = subtitleLines.length > 1 ? 280 : 300;
    const subStartY = nameY + 56;

    const subtitleTspans = subtitleLines
      .map((l, i) => `<tspan x="${TEXT_X}" y="${subStartY + i * 40}">${esc(l)}</tspan>`)
      .join('');

    // Green approval check, anchored to the icon's bottom-right — the studio's
    // signature mark, matching the on-site AppIcon corner.
    const badge = 84;
    const bx = ICON_X + ICON - badge + 14;
    const by = ICON_Y + ICON - badge + 14;
    const c = badge / 2;

    const svg = `
      <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
        <style>${fonts}</style>
        <rect width="${W}" height="${H}" fill="${PAPER}"/>
        <text font-family="Plex" font-weight="600" font-size="66" fill="${INK}"
              x="${TEXT_X}" y="${nameY}" letter-spacing="-1.5">${esc(app.name)}</text>
        <text font-family="Plex" font-weight="400" font-size="30" fill="${MUTED}">${subtitleTspans}</text>
        <text font-family="Plex" font-weight="400" font-size="24" fill="${MUTED}"
              x="${TEXT_X}" y="${H - 70}">joshapproved.com</text>
      </svg>`;

    const badgeSvg = `
      <svg width="${badge}" height="${badge}" viewBox="0 0 ${badge} ${badge}" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="${badge - 6}" height="${badge - 6}" rx="22"
              fill="${GREEN}" stroke="${PAPER}" stroke-width="6"/>
        <polyline points="${c - 16},${c} ${c - 5},${c + 11} ${c + 17},${c - 13}"
                  fill="none" stroke="${PAPER}" stroke-width="7"
                  stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

    const iconPng = await sharp(join(ROOT, 'public', app.icon))
      .resize(ICON, ICON, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    await sharp(Buffer.from(svg))
      .composite([
        { input: iconPng, left: ICON_X, top: Math.round(ICON_Y) },
        { input: Buffer.from(badgeSvg), left: bx, top: Math.round(by) },
      ])
      .png()
      .toFile(join(outDir, `${app.slug}.png`));

    console.log(`og: ${app.slug}.png`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
