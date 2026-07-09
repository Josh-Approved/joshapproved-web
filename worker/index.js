/**
 * Edge front for the static site. Two jobs, both about giving every page one
 * secure, canonical address:
 *
 *   1. Canonicalise the URL:
 *        - www.joshapproved.com      -> joshapproved.com   (drop the www)
 *        - http://…                  -> https://…          (force TLS)
 *        - a trailing-slash normalise -> made permanent (301/308) not temporary
 *   2. Set HSTS on every response so browsers refuse to downgrade to http
 *      (clears Cloudflare's "Domains without HSTS" insight for apex + www).
 *
 * Everything already canonical falls straight through to the static assets
 * (env.ASSETS), which still applies _redirects and trailing-slash handling.
 * Requires assets.run_worker_first so this runs on every request, including
 * ones that map directly to a built file.
 */

const CANONICAL_HOST = 'joshapproved.com';
// 1 year, cover subdomains. No `preload` on purpose: the preload list is a
// hard-to-reverse commitment we don't need for a marketing site.
const HSTS = 'max-age=31536000; includeSubDomains';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const wrongHost = url.hostname === 'www.joshapproved.com';
    const wrongScheme = url.protocol === 'http:';

    if (wrongHost || wrongScheme) {
      url.hostname = CANONICAL_HOST;
      url.protocol = 'https:';
      url.port = '';
      return new Response(null, {
        status: 301,
        headers: {
          Location: url.toString(),
          'Strict-Transport-Security': HSTS,
        },
      });
    }

    // Already canonical host + scheme: serve the static asset, then add HSTS.
    const assetRes = await env.ASSETS.fetch(request);

    // Cloudflare emits a temporary 307 for its automatic trailing-slash
    // normalisation (e.g. /about -> /about/). Make it permanent so Google
    // consolidates ranking signals and stops re-checking the other form.
    const status = assetRes.status === 307 ? 308 : assetRes.status;

    const res = new Response(assetRes.body, {
      status,
      statusText: assetRes.statusText,
      headers: new Headers(assetRes.headers),
    });
    res.headers.set('Strict-Transport-Security', HSTS);
    return res;
  },
};
