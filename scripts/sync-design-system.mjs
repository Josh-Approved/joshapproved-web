#!/usr/bin/env node
/**
 * Re-vendor design-system assets into public/.
 *
 * Sources (in order of preference):
 *   1. ../josh-approved-factory/templates/design-system/   (web fonts + LICENSE)
 *   2. ~/.claude/skills/josh-approved-design-system/       (assets, source CSS)
 *
 * Targets:
 *   public/fonts/*.woff2, public/fonts/LICENSE-IBM-Plex.md
 *   public/assets/wordmark.svg, approval-stamp.svg, app-icon-template.svg
 *
 * Does NOT regenerate public/styles/tokens.css automatically — that file
 * has had its @font-face URLs swapped from .otf to .woff2. If colors or
 * type scale change in the upstream design system, edit tokens.css by hand.
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const factoryFontsDir = resolve(repoRoot, '..', 'josh-approved-factory', 'templates', 'design-system', 'fonts-web');
const skillDir = join(homedir(), '.claude', 'skills', 'josh-approved-design-system');

const fontsDst = join(repoRoot, 'public', 'fonts');
const assetsDst = join(repoRoot, 'public', 'assets');
mkdirSync(fontsDst, { recursive: true });
mkdirSync(assetsDst, { recursive: true });

if (!existsSync(factoryFontsDir)) {
  console.error(`Factory fonts dir not found: ${factoryFontsDir}`);
  console.error('Make sure josh-approved-factory is cloned next to this repo.');
  process.exit(1);
}

let fontCount = 0;
for (const entry of readdirSync(factoryFontsDir)) {
  if (entry.endsWith('.woff2') || entry.startsWith('LICENSE')) {
    copyFileSync(join(factoryFontsDir, entry), join(fontsDst, entry));
    if (entry.endsWith('.woff2')) fontCount++;
  }
}
console.log(`Synced ${fontCount} fonts -> public/fonts/`);

const skillAssets = join(skillDir, 'assets');
if (existsSync(skillAssets)) {
  let assetCount = 0;
  for (const entry of readdirSync(skillAssets)) {
    if (entry.endsWith('.svg')) {
      copyFileSync(join(skillAssets, entry), join(assetsDst, entry));
      assetCount++;
    }
  }
  console.log(`Synced ${assetCount} SVGs -> public/assets/`);
} else {
  console.warn(`Skill assets dir not found: ${skillAssets} (skipping SVGs)`);
}

console.log('');
console.log('If colors or type tokens drifted upstream, also re-check public/styles/tokens.css by hand.');
