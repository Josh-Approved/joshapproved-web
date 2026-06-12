// Dynamic sitemap — zero-dependency Astro endpoint. Enumerates every static
// route plus the per-app and per-writing pages from their data sources, so the
// sitemap can never drift from the pages that actually build. Referenced by
// public/robots.txt.

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { APPS } from '../data/apps.ts';

export const prerender = true;

const SITE = 'https://joshapproved.com';

export const GET: APIRoute = async () => {
  const writing = await getCollection('writing');

  const urls: Array<{ loc: string; lastmod?: string; priority?: string }> = [
    { loc: '/', priority: '1.0' },
    { loc: '/apps/', priority: '0.9' },
    { loc: '/about/', priority: '0.6' },
    { loc: '/writing/', priority: '0.6' },
    ...APPS.map((a) => ({ loc: `/apps/${a.slug}/`, priority: '0.8' })),
    ...writing.map((w) => ({
      loc: `/writing/${w.id}/`,
      lastmod: w.data.updated,
      priority: '0.5',
    })),
  ];

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map(
        (u) =>
          `  <url><loc>${SITE}${u.loc}</loc>` +
          (u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : '') +
          (u.priority ? `<priority>${u.priority}</priority>` : '') +
          '</url>'
      )
      .join('\n') +
    '\n</urlset>\n';

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
