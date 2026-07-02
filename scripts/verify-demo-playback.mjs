// Deterministic gate: the demos must actually PLAY.
//
// Josh's 2026-07-02 defect: the homepage/app-page demos rendered as static
// stills — the old poster-swap-when-motion-allowed scheme never swapped, so a
// silent regression to a still image shipped. This gate makes that class of
// regression impossible to ship again. It drives the BUILT site in real headless
// Chrome (via the DevTools Protocol — no browser-automation dependency) and, for
// every demo surface, asserts:
//
//   1. motion allowed        → the animated .gif is what actually renders
//   2. prefers-reduced-motion → the still .png poster is what actually renders
//   3. every demo asset URL (gif + poster) returns HTTP 200 and is non-empty
//
// Static demos (a bare <img> with no reduced-motion <source>) are exempt from
// (1)/(2) — they only have to load. Run against dist/ after `astro build`:
//   node scripts/verify-demo-playback.mjs
//
// Exit 0 = all surfaces play. Exit 1 = a demo is static / an asset 404s.
import { createServer } from 'node:http';
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.gif': 'image/gif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.xml': 'application/xml', '.txt': 'text/plain',
};

const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  process.env.CHROME_PATH,
].find(Boolean);

function log(ok, msg) { console.log(`${ok ? '  ok ' : 'FAIL '} ${msg}`); }
const failures = [];
function fail(msg) { failures.push(msg); log(false, msg); }

// --- tiny static server over dist/ -----------------------------------------
async function resolveFile(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  let abs = path.join(DIST, p);
  try {
    const s = await stat(abs);
    if (s.isDirectory()) abs = path.join(abs, 'index.html');
  } catch {
    // Astro emits /route/index.html for /route/ — also try /route.html
    if (!path.extname(abs)) abs = abs.replace(/\/?$/, '.html');
  }
  return abs;
}

function startServer() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      try {
        const abs = await resolveFile(req.url);
        const body = await readFile(abs);
        res.writeHead(200, { 'content-type': MIME[path.extname(abs)] ?? 'application/octet-stream' });
        res.end(body);
      } catch {
        res.writeHead(404, { 'content-type': 'text/plain' });
        res.end('not found');
      }
    });
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

// --- discover demo surfaces from the built HTML ----------------------------
async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const abs = path.join(dir, name);
    const s = await stat(abs);
    if (s.isDirectory()) out.push(...(await walk(abs)));
    else if (name.endsWith('.html')) out.push(abs);
  }
  return out;
}

async function demoRoutes() {
  const routes = [];
  for (const abs of await walk(DIST)) {
    const html = await readFile(abs, 'utf8');
    if (!html.includes('demo-media')) continue;
    let route = '/' + path.relative(DIST, abs).replaceAll(path.sep, '/');
    route = route.replace(/index\.html$/, '').replace(/\.html$/, '/');
    routes.push(route);
  }
  return routes.sort();
}

// --- minimal CDP client (browser ws + flattened target session) ------------
async function launchChrome() {
  if (!CHROME) throw new Error('No Chrome/Chromium binary found (set CHROME_PATH).');
  const userDataDir = await mkdtemp(path.join(tmpdir(), 'demo-verify-'));
  const proc = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--mute-audio', '--remote-debugging-port=0',
    `--user-data-dir=${userDataDir}`, 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  // Chrome prints "DevTools listening on ws://..." to stderr; parse the port.
  const wsUrl = await new Promise((resolve, reject) => {
    let buf = '';
    const to = setTimeout(() => reject(new Error('Chrome did not report a DevTools endpoint in time')), 15000);
    proc.stderr.on('data', (d) => {
      buf += d.toString();
      const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
      if (m) { clearTimeout(to); resolve(m[1]); }
    });
    proc.on('exit', (c) => reject(new Error(`Chrome exited early (${c})`)));
  });
  return { proc, userDataDir, wsUrl };
}

class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.waiters = []; }
  static async connect(wsUrl) {
    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => { ws.addEventListener('open', res, { once: true }); ws.addEventListener('error', rej, { once: true }); });
    const cdp = new CDP(ws);
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && cdp.pending.has(msg.id)) {
        const { resolve, reject } = cdp.pending.get(msg.id);
        cdp.pending.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      } else if (msg.method) {
        cdp.waiters = cdp.waiters.filter((w) => !w(msg));
      }
    });
    return cdp;
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }
  once(method, sessionId) {
    return new Promise((resolve) => {
      this.waiters.push((msg) => {
        if (msg.method === method && (!sessionId || msg.sessionId === sessionId)) { resolve(msg.params); return true; }
        return false;
      });
    });
  }
}

const PROBE = `(async () => {
  const imgs = [...document.querySelectorAll('img.demo-media')];
  await Promise.all(imgs.map((i) => i.complete ? null : (i.decode().catch(() => {}))));
  return imgs.map((img) => {
    const pic = img.closest('picture');
    const animated = !!(pic && [...pic.querySelectorAll('source')].some((s) => (s.media || '').includes('reduced-motion')));
    return { currentSrc: img.currentSrc, naturalWidth: img.naturalWidth, complete: img.complete, animated };
  });
})()`;

async function probe(cdp, sessionId, base, route, motion) {
  await cdp.send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: motion }],
  }, sessionId);
  const loaded = cdp.once('Page.loadEventFired', sessionId);
  await cdp.send('Page.navigate', { url: base + route }, sessionId);
  await loaded;
  const { result } = await cdp.send('Runtime.evaluate', {
    expression: PROBE, awaitPromise: true, returnByValue: true,
  }, sessionId);
  return result.value;
}

// --- run --------------------------------------------------------------------
const { server, port } = await startServer();
const base = `http://127.0.0.1:${port}`;
const routes = await demoRoutes();
console.log(`Demo surfaces found: ${routes.length}`);
routes.forEach((r) => console.log(`  · ${r}`));
if (routes.length === 0) fail('no demo surfaces found in dist/ — did the build emit demos?');

const assetUrls = new Set();
let chrome;
try {
  chrome = await launchChrome();
  const cdp = await CDP.connect(chrome.wsUrl);
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  await cdp.send('Page.enable', {}, sessionId);
  await cdp.send('Runtime.enable', {}, sessionId);

  for (const route of routes) {
    const motionOn = await probe(cdp, sessionId, base, route, 'no-preference');
    const reduced = await probe(cdp, sessionId, base, route, 'reduce');

    if (motionOn.length === 0) fail(`${route}: no img.demo-media rendered`);

    motionOn.forEach((img, i) => {
      const tag = `${route} [demo ${i + 1}]`;
      if (!img.complete || img.naturalWidth === 0) fail(`${tag}: image failed to load (${img.currentSrc})`);
      if (img.animated) {
        if (/\.gif(\?|$)/.test(img.currentSrc)) log(true, `${tag}: motion-allowed renders the .gif`);
        else fail(`${tag}: motion allowed but rendered a still, not the .gif (${img.currentSrc})`);
      } else {
        log(true, `${tag}: static demo loads (${img.currentSrc.split('/').pop()})`);
      }
      if (img.currentSrc.startsWith(base)) assetUrls.add(img.currentSrc);
    });

    reduced.forEach((img, i) => {
      const tag = `${route} [demo ${i + 1}]`;
      if (img.animated) {
        if (/\.png(\?|$)/.test(img.currentSrc)) log(true, `${tag}: reduced-motion renders the poster`);
        else fail(`${tag}: reduced-motion did not fall back to the .png poster (${img.currentSrc})`);
      }
      if (img.currentSrc.startsWith(base)) assetUrls.add(img.currentSrc);
    });
  }
} catch (e) {
  fail(`browser probe error: ${e.message}`);
} finally {
  if (chrome) { chrome.proc.kill('SIGKILL'); await rm(chrome.userDataDir, { recursive: true, force: true }).catch(() => {}); }
}

// Every demo asset URL must 200 and be non-empty.
for (const url of [...assetUrls].sort()) {
  try {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    if (res.status === 200 && buf.byteLength > 0) log(true, `asset 200: ${url.replace(base, '')} (${buf.byteLength} bytes)`);
    else fail(`asset not served: ${url.replace(base, '')} → ${res.status}, ${buf.byteLength} bytes`);
  } catch (e) {
    fail(`asset fetch error: ${url.replace(base, '')} → ${e.message}`);
  }
}

server.close();

if (failures.length) {
  console.error(`\n${failures.length} demo-playback check(s) FAILED — demos would ship static.`);
  process.exit(1);
}
console.log('\nAll demo surfaces play (gif when motion allowed, poster under reduced-motion). Assets 200.');
process.exit(0);
