// Labels for the blog's post kinds, kept in one place so the post page, the
// blog index, and an app page's "Further reading" list never disagree.
export type PostKind = 'launch' | 'alternative' | 'update';

/** Full label: the eyebrow on a post and on the blog index. */
export const POST_KIND_LABEL: Record<PostKind, string> = {
  launch: 'New app',
  alternative: 'Alternative to paid apps',
  update: "What's new",
};

/** Short label: the tag beside a link in an app page's "Further reading". */
export const POST_KIND_SHORT: Record<PostKind, string> = {
  launch: 'New app',
  alternative: 'Alternative',
  update: "What's new",
};
