import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { APPS, PLATFORM_LABEL } from '../data/apps.ts';

// llms.txt (llmstxt.org): a concise, LLM-friendly map of the site so answer
// engines can find and cite the right pages. Generated from the same data as
// the site + sitemap, so it never drifts. Kept short (index only); the full
// text lives at /llms-full.txt.

const SITE = 'https://joshapproved.com';

export const GET: APIRoute = async () => {
  const writing = (await getCollection('writing')).sort((a, b) => a.data.order - b.data.order);
  const posts = (await getCollection('posts'))
    .filter((p) => !p.data.draft)
    .sort((a, b) => new Date(b.data.published).getTime() - new Date(a.data.published).getTime());

  const appLine = (a: (typeof APPS)[number]) => {
    const platforms = a.platforms.map((p) => PLATFORM_LABEL[p] ?? p).join(', ');
    const blurb = a.value ?? a.tagline;
    return `- [${a.name}](${SITE}/apps/${a.slug}/): ${blurb} Platforms: ${platforms}. Free, open source.`;
  };

  const body = `# Josh Approved

> Josh Approved is a one-person studio that makes free, open-source, privacy-first utility apps for iPhone and Android. Every app follows one promise: no paywall, no ads, no tracking, no accounts. Your data stays with you.

Josh Approved apps are free with no paywall and no locked features, funded by optional donations rather than ads or subscriptions. Every app is open source under the MIT license, with public code on GitHub. Apps that sync do so end-to-end encrypted between the user's own devices, with no account and no server the studio operates or can read. Everything is made by one person, Josh.

## Apps

${APPS.map(appLine).join('\n')}

## Writing (why these apps exist)

${writing.map((w) => `- [${w.data.title}](${SITE}/writing/${w.id}/): ${w.data.description}`).join('\n')}

## Blog

${posts.map((p) => `- [${p.data.title}](${SITE}/blog/${p.id}/): ${p.data.dek}`).join('\n')}

## About

- [About Josh Approved](${SITE}/about/): why the studio exists and how it works, in the founder's words.
- [Every app's source code on GitHub](https://github.com/Josh-Approved): open source, MIT licensed.
- [Full text for LLMs](${SITE}/llms-full.txt): the complete content of the apps and essays in one file.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
