/**
 * Edge front for the static site. Its only job is URL canonicalisation so that
 * every page has one address Google will index:
 *
 *   - www.joshapproved.com        -> joshapproved.com   (drop the www)
 *   - http://…                    -> https://…          (force TLS)
 *   - a trailing-slash normalise  -> made permanent (301) instead of temporary
 *
 * Everything that is already canonical falls straight through to the static
 * assets (env.ASSETS), which still applies _redirects and trailing-slash
 * handling as before. Requires assets.run_worker_first so this runs on every
 * request, including ones that map directly to a built file.
 */

const CANONICAL_HOST = 'joshapproved.com';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const wrongHost = url.hostname === 'www.joshapproved.com';
    const wrongScheme = url.protocol === 'http:';

    if (wrongHost || wrongScheme) {
      url.hostname = CANONICAL_HOST;
      url.protocol = 'https:';
      url.port = '';
      return Response.redirect(url.toString(), 301);
    }

    // Already canonical host + scheme: serve the static asset.
    const res = await env.ASSETS.fetch(request);

    // Cloudflare emits a temporary 307 for its automatic trailing-slash
    // normalisation (e.g. /about -> /about/). Make it permanent so Google
    // consolidates ranking signals onto the slashed URL and stops re-checking.
    if (res.status === 307) {
      return new Response(res.body, { status: 308, headers: new Headers(res.headers) });
    }
    return res;
  },
};
