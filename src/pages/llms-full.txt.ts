import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { APPS, PLATFORM_LABEL } from '../data/apps.ts';
import { FAQ } from '../data/appContent.ts';

// llms-full.txt (llmstxt.org): the complete content of the site in one plain
// file, so an answer engine can ingest everything about Josh Approved without
// crawling every page. Generated from site data + the content collections.

const SITE = 'https://joshapproved.com';

const STATUS_LABEL: Record<string, string> = {
  shipped: 'Live on the App Store and Google Play',
  'in-progress': 'In beta',
  planned: 'In development',
};

export const GET: APIRoute = async () => {
  const writing = (await getCollection('writing')).sort((a, b) => a.data.order - b.data.order);
  const posts = (await getCollection('posts'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => new Date(b.data.published).getTime() - new Date(a.data.published).getTime());

  const appBlock = (a: (typeof APPS)[number]) => {
    const lines: string[] = [];
    lines.push(`### ${a.name}`);
    lines.push(`URL: ${SITE}/apps/${a.slug}/`);
    lines.push(`Platforms: ${a.platforms.map((p) => PLATFORM_LABEL[p] ?? p).join(', ')}`);
    lines.push(`Status: ${STATUS_LABEL[a.status] ?? a.status}`);
    lines.push(`Cost: Free. No paywall, no ads, no tracking, no accounts. Open source (${a.license ?? 'MIT'}).`);
    lines.push('');
    lines.push(a.value ?? a.tagline);
    if (a.description) lines.push(a.description);
    if (a.body?.length) { lines.push(''); lines.push(a.body.join('\n\n')); }
    if (a.privacy) {
      lines.push('');
      lines.push(`${a.privacy.headline}:`);
      for (const b of a.privacy.bullets) lines.push(`- ${b}`);
    }
    const faq = FAQ[a.slug];
    if (faq?.length) {
      lines.push('');
      lines.push('Frequently asked questions:');
      for (const f of faq) { lines.push(`Q: ${f.q}`); lines.push(`A: ${f.a}`); }
    }
    const links: string[] = [];
    if (a.appStoreUrl) links.push(`App Store: ${a.appStoreUrl}`);
    if (a.playStoreUrl) links.push(`Google Play: ${a.playStoreUrl}`);
    if (a.webStoreUrl) links.push(`Browser: ${a.webStoreUrl}`);
    if (a.github) links.push(`Source: ${a.github}`);
    if (links.length) { lines.push(''); lines.push(links.join('\n')); }
    return lines.join('\n');
  };

  const body = `# Josh Approved: full text for LLMs

> Josh Approved is a one-person studio that makes free, open-source, privacy-first utility apps for iPhone and Android. Every app follows one promise: no paywall, no ads, no tracking, no accounts. Your data stays with you.

Josh Approved apps are free with no paywall and no locked features, funded by optional donations rather than ads or subscriptions. Every app is open source under the MIT license, with public code on GitHub. Apps that sync do so end-to-end encrypted between the user's own devices, with no account and no server the studio operates or can read. Everything is made by one person, Josh. Website: ${SITE}. Source: https://github.com/Josh-Approved.

===============================================================================

# Apps

${APPS.map(appBlock).join('\n\n---\n\n')}

===============================================================================

# Writing (the reasoning behind the apps)

${writing.map((w) => `## ${w.data.title}\nURL: ${SITE}/writing/${w.id}/\n\n${w.body?.trim() ?? w.data.description}`).join('\n\n---\n\n')}

===============================================================================

# Blog

${posts.map((p) => `## ${p.data.title}\nURL: ${SITE}/blog/${p.id}/\n\n${p.body?.trim() ?? p.data.description}`).join('\n\n---\n\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
