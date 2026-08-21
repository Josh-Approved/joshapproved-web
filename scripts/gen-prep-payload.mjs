#!/usr/bin/env node
/**
 * Encrypt the /prep/ page's content.
 *
 * /prep/ is a temporary, unlisted, passphrase-locked page. Unlike the portfolio
 * gate (a curtain: the case copy is in the page source and the passphrase only
 * hides it), this one is actually encrypted, because the repo and the built site
 * are public and the content is private notes about named people.
 *
 * The plaintext lives OUTSIDE this repo. Only the ciphertext is committed.
 *
 *   PREP_PASSWORD='...' node scripts/gen-prep-payload.mjs \
 *     "$HOME/code/recruiting/Powered by Light/prep/onsite-run-sheet.html"
 *
 * AES-256-GCM, key derived with PBKDF2-SHA256. The browser side of this lives in
 * src/pages/prep/index.astro and must keep the same parameters.
 *
 * Delete this script, src/data/prep-payload.json and src/pages/prep/ together
 * when the page is no longer needed.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { webcrypto as crypto } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const ITERATIONS = 200_000;
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/prep-payload.json');

const source = process.argv[2];
const password = process.env.PREP_PASSWORD;

if (!source) {
  console.error('Usage: PREP_PASSWORD=... node scripts/gen-prep-payload.mjs <plaintext.html>');
  process.exit(1);
}
if (!password) {
  console.error('PREP_PASSWORD is not set. The passphrase is never stored in this repo.');
  process.exit(1);
}

const plaintext = readFileSync(source, 'utf8');

const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));

const base = await crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode(password),
  'PBKDF2',
  false,
  ['deriveKey'],
);
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
  base,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt'],
);
const ciphertext = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv },
  key,
  new TextEncoder().encode(plaintext),
);

const b64 = (bytes) => Buffer.from(bytes).toString('base64');

writeFileSync(
  OUT,
  `${JSON.stringify(
    {
      v: 1,
      alg: 'AES-GCM',
      kdf: 'PBKDF2-SHA256',
      iterations: ITERATIONS,
      salt: b64(salt),
      iv: b64(iv),
      ct: b64(new Uint8Array(ciphertext)),
    },
    null,
    2,
  )}\n`,
);

console.log(`Wrote ${OUT} (${plaintext.length} chars in, ${Math.round(ciphertext.byteLength / 1024)} KB out)`);
