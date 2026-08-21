/**
 * Portfolio case studies.
 *
 * The case-study page is a TEMPLATE, not a set of one-off layouts. Every case
 * is the same four sections (Situation, Task, Action, Result) built from the
 * same small set of blocks, so a new project is a data entry, not a design
 * exercise. Add a case by adding an object to CASES below.
 *
 * The blocks are the vocabulary. If a project needs something the vocabulary
 * cannot say, add a block type here and render it in
 * `src/components/case/Blocks.astro` once, so every future case can use it too.
 *
 * Everything currently in here is placeholder copy and placeholder artwork.
 */

/* --------------------------------------------------------------- building blocks */

/** What an image is evidence OF. Rendered as the small tag above a figure. */
export type FigureTag = 'Research' | 'Data' | 'Artifact' | 'Process' | 'Final';

export type Figure = {
  tag: FigureTag;
  src: string;
  alt: string;
  caption: string;
  /** 'wide' breaks out of the reading column to the full page width. */
  width?: 'column' | 'wide';
};

export type Metric = {
  value: string;
  label: string;
  note?: string;
};

export type CaseBlock =
  /** Body copy. One string per paragraph. */
  | { kind: 'prose'; paragraphs: string[] }
  /** A sub-heading inside a section. Mostly used inside Action. */
  | { kind: 'heading'; text: string }
  /** One image with a tag and a caption. */
  | ({ kind: 'figure' } & Figure)
  /** Two or three images side by side. Always full page width. */
  | { kind: 'figures'; columns: 2 | 3; items: Figure[] }
  /** Big numbers. The "show data" block. */
  | { kind: 'metrics'; items: Metric[] }
  /** A verbatim quote from research, with who said it. */
  | { kind: 'quote'; text: string; source: string }
  /** A boxed aside: a constraint, an insight, a decision. */
  | { kind: 'callout'; label: string; body: string }
  /** A plain bulleted list, optionally with a label above it. */
  | { kind: 'list'; label?: string; items: string[] }
  /** Numbered steps with a title and a line of detail each. */
  | { kind: 'steps'; items: { title: string; body: string }[] }
  /** A plain hairline table. The other "show data" block. */
  | { kind: 'table'; caption?: string; columns: string[]; rows: string[][] };

export type CaseSection = {
  /** S, T, A, R. Rendered in the marker square. */
  letter: 'S' | 'T' | 'A' | 'R';
  /** Situation, Task, Action, Result. */
  title: string;
  /** Anchor id, used by the section index under the masthead. */
  id: string;
  /** One plain line saying what this section answers. */
  prompt: string;
  blocks: CaseBlock[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  /** One sentence under the title on the case page. */
  dek: string;
  /** One line on the index card. */
  summary: string;
  year: string;
  /**
   * The surfaces and kinds of work the project actually touched. NOT a job
   * title and not "product management": say what was worked on. Two or three
   * short terms, first capitalised, the rest lower case, e.g.
   * ['Digital', 'physical ops'] or ['Digital', 'usability', 'physical ops'].
   * Rendered next to the year on the card and above the case study title.
   */
  surfaces: string[];
  cover: { src: string; alt: string };
  /** The spec table under the masthead. Keep every case to the same rows. */
  facts: { label: string; value: string }[];
  /** The outcome strip under the spec table. Three tiles reads best. */
  outcomes: Metric[];
  sections: CaseSection[];
};

/* ------------------------------------------------------------------ placeholder */

const LOREM = {
  a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  b: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  c: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  d: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est qui dolorem ipsum quia dolor sit amet.',
  e: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
};

/* ------------------------------------------------------------------------ cases */

const curabiturCheckout: CaseStudy = {
  slug: 'curabitur-checkout',
  title: 'Curabitur checkout rebuild',
  dek: 'Placeholder case study. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
  summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.',
  year: '2026',
  surfaces: ['Digital', 'payments', 'support ops'],
  cover: {
    src: '/assets/portfolio/cover-a.svg',
    alt: 'Placeholder cover artwork for the Curabitur checkout rebuild case study.',
  },
  facts: [
    { label: 'Role', value: 'Lead product manager' },
    { label: 'Team', value: 'Three engineers, one designer, one researcher' },
    { label: 'Timeline', value: 'Ten weeks' },
    { label: 'Platform', value: 'iOS, Android, web' },
    { label: 'My part', value: 'Discovery, scope, spec, rollout, measurement' },
  ],
  outcomes: [
    { value: '00%', label: 'Placeholder metric', note: 'Lorem ipsum dolor sit' },
    { value: '0.0x', label: 'Placeholder metric', note: 'Consectetur adipiscing' },
    { value: '00 pts', label: 'Placeholder metric', note: 'Sed do eiusmod tempor' },
  ],
  sections: [
    {
      letter: 'S',
      title: 'Situation',
      id: 'situation',
      prompt: 'What was going on before I touched it, and how I know.',
      blocks: [
        { kind: 'prose', paragraphs: [LOREM.a, LOREM.b] },
        {
          kind: 'figure',
          tag: 'Data',
          src: '/assets/portfolio/data-funnel.svg',
          alt: 'Placeholder funnel chart showing drop-off across four steps.',
          caption: 'The problem in one chart. This slot holds the baseline data that made the case worth taking on.',
          width: 'wide',
        },
        { kind: 'prose', paragraphs: [LOREM.c] },
        {
          kind: 'figures',
          columns: 2,
          items: [
            {
              tag: 'Research',
              src: '/assets/portfolio/research-interviews.svg',
              alt: 'Placeholder layout of three interview summary cards.',
              caption: 'Who I talked to and what I asked them.',
            },
            {
              tag: 'Research',
              src: '/assets/portfolio/research-affinity.svg',
              alt: 'Placeholder affinity board with three clusters of notes.',
              caption: 'The raw notes, sorted into the themes that kept repeating.',
            },
          ],
        },
        {
          kind: 'quote',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. I never knew whether it had actually gone through.',
          source: 'Participant 4, placeholder quote',
        },
        {
          kind: 'list',
          label: 'What the research turned up',
          items: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            'Sed do eiusmod tempor incididunt ut labore et dolore magna.',
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
            'Duis aute irure dolor in reprehenderit in voluptate velit.',
          ],
        },
      ],
    },
    {
      letter: 'T',
      title: 'Task',
      id: 'task',
      prompt: 'What I was actually asked to do, and the box I had to do it in.',
      blocks: [
        { kind: 'prose', paragraphs: [LOREM.d] },
        {
          kind: 'callout',
          label: 'The brief, in one sentence',
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        },
        {
          kind: 'list',
          label: 'Constraints I could not move',
          items: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing.',
            'Sed do eiusmod tempor incididunt ut labore.',
            'Ut enim ad minim veniam, quis nostrud exercitation.',
          ],
        },
        {
          kind: 'table',
          caption: 'How success was defined before any design work started.',
          columns: ['Measure', 'Before', 'Target'],
          rows: [
            ['Lorem ipsum dolor', '00%', '00%'],
            ['Consectetur adipiscing', '0.0x', '0.0x'],
            ['Sed do eiusmod', '00 pts', '00 pts'],
          ],
        },
      ],
    },
    {
      letter: 'A',
      title: 'Action',
      id: 'action',
      prompt: 'What I did, in order, and why each move followed from the last.',
      blocks: [
        { kind: 'prose', paragraphs: [LOREM.e] },
        {
          kind: 'steps',
          items: [
            { title: 'Mapped the existing flow', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor.' },
            { title: 'Ran a round of concept tests', body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.' },
            { title: 'Cut the flow from seven steps to three', body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.' },
            { title: 'Prototyped and tested again', body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.' },
          ],
        },
        { kind: 'heading', text: 'Understanding the current flow' },
        { kind: 'prose', paragraphs: [LOREM.a] },
        {
          kind: 'figure',
          tag: 'Artifact',
          src: '/assets/portfolio/artifact-flow.svg',
          alt: 'Placeholder boxes and arrows diagram of a four step flow.',
          caption: 'The flow as it stood, with every branch drawn out. This is the slot for maps, IA, and service blueprints.',
          width: 'wide',
        },
        { kind: 'heading', text: 'Exploring the alternatives' },
        { kind: 'prose', paragraphs: [LOREM.b] },
        {
          kind: 'figure',
          tag: 'Artifact',
          src: '/assets/portfolio/artifact-wireframes.svg',
          alt: 'Placeholder low fidelity wireframes of three screens.',
          caption: 'Three directions, tested side by side before any of them got visual design.',
          width: 'wide',
        },
        {
          kind: 'callout',
          label: 'The decision that mattered',
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, and here is the tradeoff I accepted to get it.',
        },
        { kind: 'heading', text: 'What shipped' },
        { kind: 'prose', paragraphs: [LOREM.c] },
        {
          kind: 'figure',
          tag: 'Final',
          src: '/assets/portfolio/final-screens.svg',
          alt: 'Placeholder rendering of three finished phone screens.',
          caption: 'The shipped flow. This is the slot for finished screens, in context.',
          width: 'wide',
        },
        {
          kind: 'figure',
          tag: 'Final',
          src: '/assets/portfolio/final-detail.svg',
          alt: 'Placeholder rendering of one screen with a detail callout.',
          caption: 'One detail worth pulling out, with the reasoning next to it.',
          width: 'wide',
        },
      ],
    },
    {
      letter: 'R',
      title: 'Result',
      id: 'result',
      prompt: 'What changed, measured against the targets above, and what I got wrong.',
      blocks: [
        {
          kind: 'metrics',
          items: [
            { value: '00%', label: 'Placeholder metric', note: 'Against a 00% target' },
            { value: '0.0x', label: 'Placeholder metric', note: 'Measured over 00 weeks' },
            { value: '00 pts', label: 'Placeholder metric', note: 'Post launch survey' },
          ],
        },
        { kind: 'prose', paragraphs: [LOREM.d] },
        {
          kind: 'figure',
          tag: 'Data',
          src: '/assets/portfolio/data-bars.svg',
          alt: 'Placeholder bar chart comparing two series across seven periods.',
          caption: 'Before and after, same measure, same window. The honest version, including the flat weeks.',
          width: 'wide',
        },
        {
          kind: 'callout',
          label: 'What I would do differently',
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore. This block is here on purpose: a case study without one of these is a sales page.',
        },
      ],
    },
  ],
};

const vestibulumReporting: CaseStudy = {
  slug: 'vestibulum-reporting',
  title: 'Vestibulum reporting dashboard',
  dek: 'Placeholder case study. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
  summary: 'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
  year: '2025',
  surfaces: ['Digital', 'data', 'internal tools'],
  cover: {
    src: '/assets/portfolio/cover-b.svg',
    alt: 'Placeholder cover artwork for the Vestibulum reporting dashboard case study.',
  },
  facts: [
    { label: 'Role', value: 'Product manager' },
    { label: 'Team', value: 'Four engineers, one designer' },
    { label: 'Timeline', value: 'Sixteen weeks' },
    { label: 'Platform', value: 'Web' },
    { label: 'My part', value: 'Research, requirements, data model, launch' },
  ],
  outcomes: [
    { value: '00%', label: 'Placeholder metric', note: 'Lorem ipsum dolor sit' },
    { value: '00 min', label: 'Placeholder metric', note: 'Down from 00 min' },
    { value: '0.0x', label: 'Placeholder metric', note: 'Sed do eiusmod tempor' },
  ],
  sections: [
    {
      letter: 'S',
      title: 'Situation',
      id: 'situation',
      prompt: 'What was going on before I touched it, and how I know.',
      blocks: [
        { kind: 'prose', paragraphs: [LOREM.b, LOREM.c] },
        {
          kind: 'figure',
          tag: 'Research',
          src: '/assets/portfolio/process-journey.svg',
          alt: 'Placeholder journey diagram with five phases.',
          caption: 'The job as users actually did it, including the two steps that happened outside the product.',
          width: 'wide',
        },
      ],
    },
    {
      letter: 'T',
      title: 'Task',
      id: 'task',
      prompt: 'What I was actually asked to do, and the box I had to do it in.',
      blocks: [
        { kind: 'prose', paragraphs: [LOREM.d] },
        {
          kind: 'list',
          label: 'Constraints I could not move',
          items: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing.',
            'Sed do eiusmod tempor incididunt ut labore et dolore.',
          ],
        },
      ],
    },
    {
      letter: 'A',
      title: 'Action',
      id: 'action',
      prompt: 'What I did, in order, and why each move followed from the last.',
      blocks: [
        { kind: 'prose', paragraphs: [LOREM.e] },
        {
          kind: 'figures',
          columns: 2,
          items: [
            {
              tag: 'Artifact',
              src: '/assets/portfolio/artifact-wireframes.svg',
              alt: 'Placeholder low fidelity wireframes of three screens.',
              caption: 'Early structure, before visual design.',
            },
            {
              tag: 'Final',
              src: '/assets/portfolio/final-detail.svg',
              alt: 'Placeholder rendering of one screen with a detail callout.',
              caption: 'The same screen once it shipped.',
            },
          ],
        },
      ],
    },
    {
      letter: 'R',
      title: 'Result',
      id: 'result',
      prompt: 'What changed, measured against the targets above, and what I got wrong.',
      blocks: [
        {
          kind: 'metrics',
          items: [
            { value: '00%', label: 'Placeholder metric', note: 'Against a 00% target' },
            { value: '00 min', label: 'Placeholder metric', note: 'Median, 00 accounts' },
          ],
        },
        { kind: 'prose', paragraphs: [LOREM.a] },
        {
          kind: 'callout',
          label: 'What I would do differently',
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
        },
      ],
    },
  ],
};

const aliquamOnboarding: CaseStudy = {
  slug: 'aliquam-onboarding',
  title: 'Aliquam member onboarding',
  dek: 'Placeholder case study. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.',
  summary: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.',
  year: '2024',
  surfaces: ['Digital', 'usability', 'physical ops'],
  cover: {
    src: '/assets/portfolio/cover-c.svg',
    alt: 'Placeholder cover artwork for the Aliquam member onboarding case study.',
  },
  facts: [
    { label: 'Role', value: 'Product manager' },
    { label: 'Team', value: 'Two engineers, one designer' },
    { label: 'Timeline', value: 'Eight weeks' },
    { label: 'Platform', value: 'iOS, Android' },
    { label: 'My part', value: 'Discovery, spec, testing, launch' },
  ],
  outcomes: [
    { value: '00%', label: 'Placeholder metric', note: 'Lorem ipsum dolor sit' },
    { value: '0.0x', label: 'Placeholder metric', note: 'Consectetur adipiscing' },
    { value: '00 pts', label: 'Placeholder metric', note: 'Sed do eiusmod tempor' },
  ],
  sections: [
    {
      letter: 'S',
      title: 'Situation',
      id: 'situation',
      prompt: 'What was going on before I touched it, and how I know.',
      blocks: [
        { kind: 'prose', paragraphs: [LOREM.c] },
        {
          kind: 'figure',
          tag: 'Data',
          src: '/assets/portfolio/data-funnel.svg',
          alt: 'Placeholder funnel chart showing drop-off across four steps.',
          caption: 'Where people stopped, and how many of them there were.',
          width: 'wide',
        },
      ],
    },
    {
      letter: 'T',
      title: 'Task',
      id: 'task',
      prompt: 'What I was actually asked to do, and the box I had to do it in.',
      blocks: [
        { kind: 'prose', paragraphs: [LOREM.a] },
        {
          kind: 'callout',
          label: 'The brief, in one sentence',
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
        },
      ],
    },
    {
      letter: 'A',
      title: 'Action',
      id: 'action',
      prompt: 'What I did, in order, and why each move followed from the last.',
      blocks: [
        { kind: 'prose', paragraphs: [LOREM.b] },
        {
          kind: 'figure',
          tag: 'Final',
          src: '/assets/portfolio/final-screens.svg',
          alt: 'Placeholder rendering of three finished phone screens.',
          caption: 'The shipped flow, three screens end to end.',
          width: 'wide',
        },
      ],
    },
    {
      letter: 'R',
      title: 'Result',
      id: 'result',
      prompt: 'What changed, measured against the targets above, and what I got wrong.',
      blocks: [
        {
          kind: 'metrics',
          items: [
            { value: '00%', label: 'Placeholder metric', note: 'Against a 00% target' },
            { value: '0.0x', label: 'Placeholder metric', note: 'Measured over 00 weeks' },
            { value: '00 pts', label: 'Placeholder metric', note: 'Post launch survey' },
          ],
        },
        { kind: 'prose', paragraphs: [LOREM.d] },
      ],
    },
  ],
};

export const CASES: CaseStudy[] = [curabiturCheckout, vestibulumReporting, aliquamOnboarding];

/**
 * SHA-256 of the portfolio passphrase. The passphrase itself is not in the
 * repo. Input is trimmed, lowercased, and curly apostrophes are straightened
 * before hashing, so a phone that autocorrects the quote still matches.
 *
 * This is a curtain, not a vault: the pages are statically built, so the case
 * copy is in the page source for anyone who looks. It keeps the work off search
 * engines and off casual view, which is what a portfolio gate is for. If real
 * client work goes in and needs to be genuinely unreadable without the
 * passphrase, move the check into `worker/index.js` with a Cloudflare secret.
 */
export const PASSPHRASE_SHA256 =
  'af60a1511d052c44b96a44444b8f0dc8eb79b6170e4ed63f1ac6d059636447cc';
