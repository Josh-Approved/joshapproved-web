import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { APPS } from '../data/apps.ts';

// Blog posts + writing essays both come from content collections, so any new
// article auto-appears here on the next build. Drafts are excluded.

// Generated sitemap — derived from the app data + the writing collection so it
// can NEVER drift the way the old hand-maintained public/sitemap.xml did (it was
// silently missing grocery-list and tend). Astro prerenders this endpoint at
// build time, so the Cloudflare deploy still serves a plain static file.

const SITE = 'https://joshapproved.com';

type Entry = { loc: string; priority: string; lastmod?: string };

export const GET: APIRoute = async () => {
  const writing = await getCollection('writing');
  const posts = (await getCollection('posts')).filter((p) => !p.data.draft);

  const entries: Entry[] = [
    { loc: `${SITE}/`, priority: '1.0' },
    { loc: `${SITE}/apps/`, priority: '0.9' },
    { loc: `${SITE}/blog/`, priority: '0.7' },
    { loc: `${SITE}/about/`, priority: '0.6' },
    { loc: `${SITE}/writing/`, priority: '0.6' },
    ...APPS.map((app) => ({
      loc: `${SITE}/apps/${app.slug}/`,
      priority: '0.8',
    })),
    ...posts.map((post) => ({
      loc: `${SITE}/blog/${post.id}/`,
      priority: '0.7',
      lastmod: post.data.updated ?? post.data.published,
    })),
    ...writing.map((post) => ({
      loc: `${SITE}/writing/${post.id}/`,
      priority: '0.5',
      lastmod: post.data.updated,
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url><loc>${e.loc}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}<priority>${e.priority}</priority></url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
