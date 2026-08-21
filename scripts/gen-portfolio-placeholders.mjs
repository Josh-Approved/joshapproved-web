/**
 * Portfolio placeholder artwork.
 *
 * The portfolio case-study template needs real image files so the layout has
 * honest weight: covers, research artifacts, charts, flows, screens. Until real
 * work goes in, these stand in. They are deliberately abstract and each one
 * carries a small PLACEHOLDER label so nobody mistakes them for finished work.
 *
 * Run: node scripts/gen-portfolio-placeholders.mjs
 * Out: public/assets/portfolio/*.svg
 *
 * Palette is the studio marketing palette (terracotta lead, dusty blue accent)
 * plus ink. No ochre: the system says pick one lead, one accent, leave the
 * third alone.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/assets/portfolio');

const C = {
  paper: '#FAFAF7',
  ink50: '#F2F2EE',
  ink100: '#E5E5E2',
  ink200: '#C8C8CC',
  ink300: '#9A9AA0',
  ink500: '#6B6B72',
  ink900: '#1A1A1C',
  terra: '#B0654B',
  terraBg: '#F4E8E2',
  dusty: '#5E7691',
  dustyBg: '#E5EBF1',
};

/* ---------------------------------------------------------------- helpers */

const rect = (x, y, w, h, fill, r = 0, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${extra ? ' ' + extra : ''}/>`;

const line = (x1, y1, x2, y2, stroke, w = 2) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"/>`;

const circle = (cx, cy, r, fill) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;

/** A stack of fake text lines. */
const lines = (x, y, w, count, { gap = 22, h = 10, fill = C.ink200, last = 0.55 } = {}) =>
  Array.from({ length: count }, (_, i) =>
    rect(x, y + i * gap, i === count - 1 ? Math.round(w * last) : w, h, fill, h / 2),
  ).join('');

/** Faint grid so an empty area still reads as a working surface. */
const grid = (w, h, step = 40) => {
  const parts = [];
  for (let x = step; x < w; x += step) parts.push(line(x, 0, x, h, C.ink100, 1));
  for (let y = step; y < h; y += step) parts.push(line(0, y, w, y, C.ink100, 1));
  return `<g opacity="0.55">${parts.join('')}</g>`;
};

const label = (w, h, text) =>
  `<g><rect x="24" y="${h - 52}" width="${20 + text.length * 8.4}" height="28" rx="6" fill="${C.paper}" stroke="${C.ink200}" stroke-width="1"/>` +
  `<text x="34" y="${h - 33}" font-family="IBM Plex Mono, ui-monospace, Menlo, monospace" font-size="13" letter-spacing="1.4" fill="${C.ink300}">${text}</text></g>`;

const svg = (w, h, body, tag = 'PLACEHOLDER') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">` +
  rect(0, 0, w, h, C.ink50) +
  grid(w, h) +
  body +
  label(w, h, tag) +
  `</svg>\n`;

/* ----------------------------------------------------------------- scenes */

/** Covers: abstract compositions, one per case, so the grid has variety. */
const coverA = (w, h) => {
  const g = [];
  g.push(rect(w * 0.06, h * 0.16, w * 0.42, h * 0.62, C.paper, 18));
  g.push(rect(w * 0.06, h * 0.16, w * 0.42, h * 0.1, C.ink900, 18));
  g.push(rect(w * 0.06, h * 0.24, w * 0.42, h * 0.02, C.ink900));
  g.push(lines(w * 0.1, h * 0.34, w * 0.3, 5, { gap: h * 0.075, h: 12 }));
  g.push(rect(w * 0.1, h * 0.66, w * 0.14, h * 0.07, C.terra, 8));
  g.push(rect(w * 0.54, h * 0.16, w * 0.4, h * 0.28, C.terraBg, 18));
  g.push(circle(w * 0.62, h * 0.3, h * 0.06, C.terra));
  g.push(lines(w * 0.68, h * 0.25, w * 0.2, 3, { gap: h * 0.055, h: 10, fill: C.ink300 }));
  g.push(rect(w * 0.54, h * 0.5, w * 0.4, h * 0.28, C.dustyBg, 18));
  const bars = [0.16, 0.24, 0.19, 0.27, 0.22];
  bars.forEach((b, i) =>
    g.push(rect(w * (0.58 + i * 0.07), h * (0.72 - b), w * 0.045, h * b, C.dusty, 6)),
  );
  return svg(w, h, g.join(''), 'PLACEHOLDER COVER');
};

const coverB = (w, h) => {
  const g = [];
  g.push(rect(w * 0.06, h * 0.16, w * 0.88, h * 0.62, C.paper, 18));
  g.push(rect(w * 0.06, h * 0.16, w * 0.88, h * 0.09, C.ink100, 18));
  g.push(rect(w * 0.06, h * 0.22, w * 0.88, h * 0.03, C.ink100));
  g.push(line(w * 0.06, h * 0.25, w * 0.94, h * 0.25, C.ink200, 2));
  for (let i = 0; i < 4; i++) {
    const y = h * (0.3 + i * 0.115);
    g.push(rect(w * 0.1, y, w * 0.26, 12, C.ink200, 6));
    g.push(rect(w * 0.42, y, w * 0.16, 12, C.ink100, 6));
    g.push(rect(w * 0.64, y - 6, w * (0.06 + i * 0.05), 24, i === 1 ? C.terra : C.dusty, 6));
    if (i < 3) g.push(line(w * 0.1, y + 34, w * 0.9, y + 34, C.ink100, 1));
  }
  return svg(w, h, g.join(''), 'PLACEHOLDER COVER');
};

const coverC = (w, h) => {
  const g = [];
  const cols = [0.1, 0.32, 0.54, 0.76];
  cols.forEach((c, i) => {
    g.push(rect(w * c, h * 0.18, w * 0.18, h * 0.58, C.paper, 16));
    g.push(rect(w * c, h * 0.18, w * 0.18, h * 0.06, i === 2 ? C.terra : C.ink200, 16));
    g.push(rect(w * c, h * 0.22, w * 0.18, h * 0.02, i === 2 ? C.terra : C.ink200));
    for (let j = 0; j < 3; j++) {
      g.push(
        rect(w * (c + 0.02), h * (0.3 + j * 0.14), w * 0.14, h * 0.1, j === 0 ? C.dustyBg : C.ink50, 10),
      );
    }
  });
  return svg(w, h, g.join(''), 'PLACEHOLDER COVER');
};

/** Research: an affinity board of clustered notes. */
const affinity = (w, h) => {
  const g = [];
  const clusters = [
    { x: 0.06, tint: C.terraBg, edge: C.terra, n: 6 },
    { x: 0.38, tint: C.dustyBg, edge: C.dusty, n: 5 },
    { x: 0.7, tint: C.ink100, edge: C.ink300, n: 7 },
  ];
  clusters.forEach((c) => {
    g.push(rect(w * c.x, h * 0.1, w * 0.24, h * 0.78, C.paper, 14));
    g.push(rect(w * c.x, h * 0.1, w * 0.24, h * 0.05, c.edge, 14));
    g.push(rect(w * c.x, h * 0.13, w * 0.24, h * 0.02, c.edge));
    for (let i = 0; i < c.n; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      g.push(
        rect(
          w * (c.x + 0.015 + col * 0.11),
          h * (0.2 + row * 0.21),
          w * 0.098,
          h * 0.17,
          c.tint,
          8,
        ),
      );
      g.push(lines(w * (c.x + 0.03) + col * w * 0.11, h * (0.24 + row * 0.21), w * 0.07, 2, { gap: 16, h: 7, fill: C.ink300 }));
    }
  });
  return svg(w, h, g.join(''), 'PLACEHOLDER RESEARCH');
};

/** Research: interview transcript / quote cards. */
const interviews = (w, h) => {
  const g = [];
  for (let i = 0; i < 3; i++) {
    const y = h * (0.12 + i * 0.29);
    g.push(rect(w * 0.06, y, w * 0.88, h * 0.24, C.paper, 14));
    g.push(circle(w * 0.11, y + h * 0.12, h * 0.055, i === 1 ? C.terraBg : C.dustyBg));
    g.push(circle(w * 0.11, y + h * 0.12, h * 0.022, i === 1 ? C.terra : C.dusty));
    g.push(rect(w * 0.17, y + h * 0.05, w * 0.14, 11, C.ink200, 6));
    g.push(lines(w * 0.17, y + h * 0.1, w * 0.7, 3, { gap: 24, h: 9, fill: C.ink100 }));
  }
  return svg(w, h, g.join(''), 'PLACEHOLDER RESEARCH');
};

/** Data: grouped bar chart with an axis. */
const bars = (w, h) => {
  const g = [];
  g.push(rect(w * 0.04, h * 0.08, w * 0.92, h * 0.84, C.paper, 14));
  const base = h * 0.76;
  const left = w * 0.12;
  const right = w * 0.92;
  for (let i = 1; i <= 4; i++) {
    const y = base - (i * (base - h * 0.16)) / 4;
    g.push(line(left, y, right, y, C.ink100, 1));
    g.push(rect(w * 0.06, y - 5, w * 0.04, 10, C.ink100, 5));
  }
  g.push(line(left, base, right, base, C.ink200, 2));
  const data = [0.36, 0.52, 0.44, 0.68, 0.58, 0.82, 0.74];
  data.forEach((d, i) => {
    const bw = (right - left) / data.length;
    const x = left + i * bw + bw * 0.2;
    const hh = (base - h * 0.16) * d;
    g.push(rect(x, base - hh, bw * 0.28, hh, C.dusty, 5));
    g.push(rect(x + bw * 0.32, base - hh * 0.62, bw * 0.28, hh * 0.62, C.terra, 5));
    g.push(rect(x, base + 14, bw * 0.6, 8, C.ink100, 4));
  });
  return svg(w, h, g.join(''), 'PLACEHOLDER DATA');
};

/** Data: a four-step funnel. */
const funnel = (w, h) => {
  const g = [];
  g.push(rect(w * 0.04, h * 0.08, w * 0.92, h * 0.84, C.paper, 14));
  const steps = [0.86, 0.62, 0.41, 0.29];
  steps.forEach((s, i) => {
    const y = h * (0.18 + i * 0.19);
    g.push(rect(w * 0.08, y, w * 0.84 * s, h * 0.13, i === steps.length - 1 ? C.terra : C.dusty, 8, `opacity="${1 - i * 0.16}"`));
    g.push(rect(w * 0.08 + w * 0.84 * s + 16, y + h * 0.045, w * 0.06, 10, C.ink200, 5));
  });
  return svg(w, h, g.join(''), 'PLACEHOLDER DATA');
};

/** Artifact: a boxes-and-arrows flow. */
const flow = (w, h) => {
  const g = [];
  const boxes = [0.06, 0.29, 0.52, 0.75];
  boxes.forEach((b, i) => {
    const y = i % 2 === 0 ? h * 0.24 : h * 0.5;
    g.push(rect(w * b, y, w * 0.19, h * 0.26, C.paper, 12));
    g.push(rect(w * b, y, w * 0.19, h * 0.06, i === 2 ? C.terra : C.ink200, 12));
    g.push(rect(w * b, y + h * 0.04, w * 0.19, h * 0.02, i === 2 ? C.terra : C.ink200));
    g.push(lines(w * (b + 0.02), y + h * 0.12, w * 0.13, 2, { gap: 20, h: 8, fill: C.ink100 }));
    if (i < boxes.length - 1) {
      const y2 = (i + 1) % 2 === 0 ? h * 0.24 : h * 0.5;
      g.push(line(w * (b + 0.19), y + h * 0.13, w * boxes[i + 1], y2 + h * 0.13, C.ink300, 2));
      g.push(circle(w * boxes[i + 1] - 6, y2 + h * 0.13, 5, C.ink300));
    }
  });
  return svg(w, h, g.join(''), 'PLACEHOLDER ARTIFACT');
};

/** Artifact: low-fidelity wireframe screens. */
const wireframes = (w, h) => {
  const g = [];
  for (let i = 0; i < 3; i++) {
    const x = w * (0.07 + i * 0.3);
    g.push(rect(x, h * 0.1, w * 0.24, h * 0.8, C.paper, 14));
    g.push(rect(x, h * 0.1, w * 0.24, h * 0.09, C.ink100, 14));
    g.push(rect(x, h * 0.16, w * 0.24, h * 0.03, C.ink100));
    g.push(rect(x + w * 0.02, h * 0.23, w * 0.2, h * 0.16, C.ink50, 8));
    g.push(lines(x + w * 0.02, h * 0.44, w * 0.2, 3, { gap: 26, h: 9, fill: C.ink100 }));
    g.push(rect(x + w * 0.02, h * 0.62, w * 0.2, h * 0.09, C.ink50, 8));
    g.push(rect(x + w * 0.02, h * 0.75, w * 0.1, h * 0.07, i === 1 ? C.ink900 : C.ink200, 8));
  }
  return svg(w, h, g.join(''), 'PLACEHOLDER ARTIFACT');
};

/** Final: three finished phone screens. */
const screens = (w, h) => {
  const g = [];
  for (let i = 0; i < 3; i++) {
    const x = w * (0.09 + i * 0.29);
    const pw = w * 0.22;
    g.push(rect(x - 8, h * 0.08 - 8, pw + 16, h * 0.84 + 16, C.ink900, 30));
    g.push(rect(x, h * 0.08, pw, h * 0.84, C.paper, 24));
    g.push(rect(x + pw * 0.34, h * 0.1, pw * 0.32, 10, C.ink900, 5));
    g.push(rect(x + pw * 0.08, h * 0.18, pw * 0.5, 14, C.ink900, 7));
    g.push(rect(x + pw * 0.08, h * 0.24, pw * 0.72, 9, C.ink200, 5));
    for (let j = 0; j < 3; j++) {
      const cy = h * (0.32 + j * 0.15);
      g.push(rect(x + pw * 0.08, cy, pw * 0.84, h * 0.12, i === 1 && j === 0 ? C.terraBg : C.ink50, 10));
      g.push(circle(x + pw * 0.19, cy + h * 0.06, pw * 0.07, i === 1 && j === 0 ? C.terra : C.ink200));
      g.push(rect(x + pw * 0.31, cy + h * 0.035, pw * 0.4, 9, C.ink200, 5));
      g.push(rect(x + pw * 0.31, cy + h * 0.065, pw * 0.28, 7, C.ink100, 4));
    }
    g.push(rect(x + pw * 0.08, h * 0.79, pw * 0.84, h * 0.08, C.ink900, 10));
  }
  return svg(w, h, g.join(''), 'PLACEHOLDER FINAL');
};

/** Final: one screen with a detail callout. */
const detail = (w, h) => {
  const g = [];
  g.push(rect(w * 0.05, h * 0.1, w * 0.52, h * 0.8, C.paper, 16));
  g.push(rect(w * 0.05, h * 0.1, w * 0.52, h * 0.08, C.ink900, 16));
  g.push(rect(w * 0.05, h * 0.15, w * 0.52, h * 0.03, C.ink900));
  g.push(rect(w * 0.08, h * 0.23, w * 0.28, 14, C.ink200, 7));
  g.push(lines(w * 0.08, h * 0.3, w * 0.44, 4, { gap: 26, h: 9, fill: C.ink100 }));
  g.push(rect(w * 0.08, h * 0.55, w * 0.46, h * 0.14, C.terraBg, 12));
  g.push(rect(w * 0.08, h * 0.55, w * 0.46, h * 0.14, 'none', 12, `stroke="${C.terra}" stroke-width="3"`));
  g.push(rect(w * 0.08, h * 0.74, w * 0.16, h * 0.08, C.ink900, 10));
  g.push(line(w * 0.54, h * 0.62, w * 0.63, h * 0.62, C.terra, 3));
  g.push(rect(w * 0.63, h * 0.34, w * 0.32, h * 0.36, C.paper, 14));
  g.push(rect(w * 0.63, h * 0.34, w * 0.32, h * 0.36, 'none', 14, `stroke="${C.terra}" stroke-width="2"`));
  g.push(rect(w * 0.66, h * 0.4, w * 0.18, 12, C.terra, 6));
  g.push(lines(w * 0.66, h * 0.47, w * 0.26, 4, { gap: 24, h: 8, fill: C.ink100 }));
  return svg(w, h, g.join(''), 'PLACEHOLDER FINAL');
};

/** Process: a horizontal journey with phases. */
const journey = (w, h) => {
  const g = [];
  g.push(rect(w * 0.04, h * 0.1, w * 0.92, h * 0.8, C.paper, 14));
  const y = h * 0.62;
  g.push(line(w * 0.1, y, w * 0.9, y, C.ink200, 2));
  const pts = [0.14, 0.32, 0.5, 0.68, 0.86];
  const heights = [0.42, 0.3, 0.5, 0.24, 0.36];
  pts.forEach((p, i) => {
    g.push(line(w * p, y, w * p, h * heights[i], C.ink100, 2));
    g.push(circle(w * p, h * heights[i], 11, i === 2 ? C.terra : C.dusty));
    g.push(rect(w * p - w * 0.06, h * 0.7, w * 0.12, 10, C.ink200, 5));
    g.push(rect(w * p - w * 0.04, h * 0.75, w * 0.08, 8, C.ink100, 4));
  });
  return svg(w, h, g.join(''), 'PLACEHOLDER PROCESS');
};

/* ------------------------------------------------------------------- emit */

const files = {
  'cover-a.svg': coverA(1600, 1000),
  'cover-b.svg': coverB(1600, 1000),
  'cover-c.svg': coverC(1600, 1000),
  'research-affinity.svg': affinity(1600, 900),
  'research-interviews.svg': interviews(1600, 900),
  'data-bars.svg': bars(1600, 900),
  'data-funnel.svg': funnel(1600, 900),
  'artifact-flow.svg': flow(1600, 800),
  'artifact-wireframes.svg': wireframes(1600, 900),
  'final-screens.svg': screens(1600, 900),
  'final-detail.svg': detail(1600, 900),
  'process-journey.svg': journey(1600, 800),
};

mkdirSync(OUT, { recursive: true });
for (const [name, body] of Object.entries(files)) {
  writeFileSync(resolve(OUT, name), body, 'utf8');
}
console.log(`Wrote ${Object.keys(files).length} placeholders to public/assets/portfolio/`);
