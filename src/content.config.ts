import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The reaction essays: the "why the apps exist" long-form pieces.
const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    dek: z.string(),
    order: z.number(),
    updated: z.string(),
    // Slugs of apps this essay is the reasoning behind, rendered as
    // "the apps this is about" cross-links at the foot of the piece.
    apps: z.array(z.string()).optional(),
    // Studio-wide pieces (the thesis essays, not tied to a few apps) opt in to
    // the full "More from Josh Approved" apps rail at the foot instead of a
    // hand-picked related-apps list.
    allApps: z.boolean().optional(),
  }),
});

// The blog: launch announcements ("Introducing X") and honest
// alternative-to-a-paywalled-app pieces. Separate from the essays: these are
// tied to a specific app and are the volume/SEO surface. Draft = not built.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    dek: z.string(),
    /** Slug of the app this post is about (drives the CTA + related links). */
    app: z.string(),
    /** 'launch' = introducing an app; 'alternative' = free-alternative-to-X. */
    kind: z.enum(['launch', 'alternative']),
    /** Named paid competitors positioned against (longer-form surface only). */
    competitors: z.array(z.string()).optional(),
    published: z.string(),
    updated: z.string().optional(),
    /** Draft posts are excluded from the build (index, routes, sitemap). */
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing, posts };
