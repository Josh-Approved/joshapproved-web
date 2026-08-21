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
 * Images: a figure with no `src` renders as a marked empty slot at the right
 * shape, so a case can go up before its photos exist.
 */

/* --------------------------------------------------------------- building blocks */

/** What an image is evidence OF. Rendered as the small tag above a figure. */
export type FigureTag = 'Research' | 'Data' | 'Artifact' | 'Process' | 'Final';

export type Figure = {
  tag: FigureTag;
  /**
   * Leave unset while the real photo is still to come. The slot renders as a
   * marked placeholder at the right shape, so the page can go up before every
   * image exists and the layout is still honest about its weight.
   */
  src?: string;
  /** Required once `src` is set. */
  alt?: string;
  caption: string;
  /**
   * 'wide' breaks out of the reading column to the full page width. 'narrow'
   * is for portrait photos (a receipt, a phone), which would otherwise be
   * absurdly tall at the full column width.
   */
  width?: 'narrow' | 'column' | 'wide';
  /** Shape of the empty slot, e.g. '3 / 4' for a tall receipt. Ignored once
   *  `src` is set. */
  ratio?: string;
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
  /** Leave unset until the real cover image exists; the card shows a marked
   *  empty slot instead. */
  cover?: { src: string; alt: string };
  /** The spec table under the masthead. Keep every case to the same rows. */
  facts: { label: string; value: string }[];
  /** The outcome strip under the spec table. Three tiles reads best. */
  outcomes: Metric[];
  sections: CaseSection[];
};

/* ------------------------------------------------------- section prompt defaults */

const PROMPTS = {
  situation: 'What was going on before I touched it, and how I know.',
  task: 'What I was actually asked to do, and the box I had to do it in.',
  action: 'What I did, in order, and why each move followed from the last.',
  result: 'What changed, measured against the targets above, and what I got wrong.',
};

/* -------------------------------------------------------------- digital receipts */

const digitalReceipts: CaseStudy = {
  slug: 'digital-receipts',
  title: 'Digital receipts',
  dek: 'Whole Foods had been planning digital receipts since 2018 and had shipped none. I took it from a stalled idea to every US store, in two deliberate phases.',
  summary:
    'Six years of planning, twelve teams, and receipt law that changes by city. Here is how it finally went live.',
  year: '2024',
  surfaces: ['Digital', 'usability', 'physical ops'],
  facts: [
    { label: 'Company', value: 'Whole Foods Market' },
    { label: 'Role', value: 'Product manager, point of sale and receipts' },
    {
      label: 'Team',
      value:
        'Around twelve teams: legal, tax, accounting, procurement, core transactions, POS, self checkout, both apps, email, marketing',
    },
    { label: 'Timeline', value: 'Two phases, the first live at the end of 2024' },
    { label: 'Platform', value: 'Register, self checkout, email, app, web' },
    { label: 'My part', value: 'Requirements, phasing, cross team alignment, launch' },
  ],
  outcomes: [
    { value: '$1MM', label: 'Saved a year', note: 'Paper reduction alone' },
    { value: '3,000', label: 'Trees a year', note: 'No longer printed' },
    { value: '39%', label: 'Chose no print', note: 'Customer preference after phase 2' },
  ],
  sections: [
    {
      letter: 'S',
      title: 'Situation',
      id: 'situation',
      prompt: PROMPTS.situation,
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            'Whole Foods had been discussing digital receipts since 2018. Six years later nothing was live, and every customer still left the store holding a printed receipt whether they wanted one or not.',
            'It looks like a trivial feature. It is not. What a receipt has to contain is set federally and municipally, so the rules change city to city. Chicago requires a phone number on the receipt. Parts of California have their own tare requirements for weighed items. One template does not satisfy all of it, and getting it wrong is a compliance problem rather than a design one.',
            'The work also ran through around twelve teams: legal, tax, accounting, procurement, core transactions on the Amazon side, POS, self checkout, the Whole Foods app, the Amazon app, email and marketing. No single team could ship it, which is a large part of why it had sat for six years.',
          ],
        },
        {
          kind: 'figure',
          tag: 'Artifact',
          caption:
            'The receipt as it was. Printed for every transaction in every store, whether or not the customer wanted it.',
          width: 'narrow',
          ratio: '3 / 4',
        },
        {
          kind: 'callout',
          label: 'Why it kept stalling',
          body: 'Every team could describe its own piece, and no two teams agreed on what done meant. There was nothing written down to disagree with.',
        },
      ],
    },
    {
      letter: 'T',
      title: 'Task',
      id: 'task',
      prompt: PROMPTS.task,
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            'Launch digital receipts, and receipt preferences, for Amazon identified customers, at the register and at self checkout, in every US store, by October 2024.',
          ],
        },
        {
          kind: 'list',
          label: 'Constraints I could not move',
          items: [
            'Receipt content is set by federal and municipal law, so a compliant receipt in one city is not automatically compliant in the next.',
            'Customers had to keep being able to return things, so the returns barcode had to survive the change.',
            'Paper had to keep working the entire time. There was no version of this where receipts stopped.',
            'Around twelve teams had to ship in sequence and none of them reported to me.',
          ],
        },
      ],
    },
    {
      letter: 'A',
      title: 'Action',
      id: 'action',
      prompt: PROMPTS.action,
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            'The first problem was not technical. With that many teams there was no shared definition of done, so I wrote one.',
          ],
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'Wrote the requirements down',
              body: 'One business requirements document covering every team, so there was a single artifact to argue with instead of twelve verbal versions of the plan.',
            },
            {
              title: 'Fought for resourcing at kickoff',
              body: 'Several engineering teams had deliberately under scoped their piece. Correcting that before the work started was far cheaper than finding it in month four.',
            },
            {
              title: 'Hired specialist outside counsel and ran user research',
              body: 'Even with both, I expected legal and customer experience gaps that would not show up on paper.',
            },
            {
              title: 'Split the launch in two, planned from day one',
              body: 'A silent phase to learn in, then a full go live. The split was in the plan before any date was at risk.',
            },
          ],
        },
        { kind: 'heading', text: 'Phase 1: generate receipts silently' },
        {
          kind: 'prose',
          paragraphs: [
            "As soon as a digital receipt could be generated, we generated it, before it was fully compliant. That was safe precisely because we were still printing paper. The compliant receipt was already in the customer's hand, and the digital one was a shadow copy nobody depended on.",
            'That bought a real testing environment at zero customer risk and zero legal risk. We pressure tested returns barcodes, watched what customer care actually got called about, and dogfooded it internally. A number of problems surfaced there that no amount of reviewing the spec would have found.',
          ],
        },
        {
          kind: 'figures',
          columns: 2,
          items: [
            {
              tag: 'Final',
              caption: 'The emailed receipt.',
              ratio: '4 / 3',
            },
            {
              tag: 'Final',
              caption: 'The receipt in the app.',
              ratio: '4 / 3',
            },
          ],
        },
        { kind: 'heading', text: 'Phase 2: let customers turn paper off' },
        {
          kind: 'prose',
          paragraphs: [
            'Phase 2 moved the full compliance burden onto us. Once a customer sets a digital only preference there is no paper backstop, so the digital receipt has to be right for the city it was issued in, every time.',
          ],
        },
        {
          kind: 'figure',
          tag: 'Final',
          caption: 'The receipt on the web, and the preference that turns printing off.',
          width: 'wide',
        },
        {
          kind: 'callout',
          label: 'The decision that mattered',
          body: 'Launching before we were compliant sounds like the reckless option. It was the opposite. Paper was still covering the legal requirement, so everything we got wrong in phase 1 cost nothing to get wrong.',
        },
      ],
    },
    {
      letter: 'R',
      title: 'Result',
      id: 'result',
      prompt: PROMPTS.result,
      blocks: [
        {
          kind: 'metrics',
          items: [
            { value: '$1MM', label: 'Saved a year', note: 'Paper reduction alone' },
            { value: '3,000', label: 'Trees a year', note: 'No longer printed' },
            { value: '39%', label: 'Chose no print', note: 'Customer preference after phase 2' },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'Phase 1 was live before the end of 2024. After phase 2, 39% of customers set a no print preference, a far higher share than anyone had planned around. Paper reduction alone saves roughly $1MM and about 3,000 trees a year. Customer satisfaction engagement doubled.',
          ],
        },
        {
          kind: 'callout',
          label: 'What I would do differently',
          body: 'We missed October 2024 for preferences. I could see the long tail slipping across app, web, email and preference management, and I did not escalate hard enough or early enough. What changed after: long range timelines became a standing reported item rather than something I checked when I was nervous.',
        },
      ],
    },
  ],
};

/* --------------------------------------------------------------- bottle deposits */

const bottleDeposits: CaseStudy = {
  slug: 'bottle-deposits',
  title: 'Bottle deposit recovery',
  dek: 'Whole Foods had paid bottle deposits to its suppliers for its entire existence and never charged a single one back. Around $8MM a year, straight out the door.',
  summary:
    'Roughly $8MM a year left the business in bottle deposits nobody was recovering. Here is how we started getting it back.',
  year: '2025',
  surfaces: ['Digital', 'physical ops'],
  facts: [
    { label: 'Company', value: 'Whole Foods Market' },
    { label: 'Role', value: 'Product manager, point of sale and returns' },
    {
      label: 'Team',
      value: 'POS engineering, accounting systems, retail ops, supplier management',
    },
    { label: 'Timeline', value: 'Ongoing, suppliers still being onboarded' },
    { label: 'Platform', value: 'Register, product catalog, accounting systems' },
    {
      label: 'My part',
      value: 'Problem definition, system design, register workflow, supplier terms',
    },
  ],
  outcomes: [
    { value: '$8MM', label: 'Annual exposure', note: 'Paid out yearly with no way to recover it' },
    { value: '$6MM', label: 'Recovered a year', note: 'So far, and still onboarding suppliers' },
    { value: '80%', label: 'Supplier recovery', note: 'Negotiated with our largest supplier, now the standard' },
  ],
  sections: [
    {
      letter: 'S',
      title: 'Situation',
      id: 'situation',
      prompt: PROMPTS.situation,
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            'A few states require retailers that sell bottles and cans to charge customers a deposit, then refund it when the customer brings the empties back. Whole Foods has always charged and refunded correctly, for its entire existence.',
            'What we never did was close the other side of the loop. The full cycle is: we pay the supplier a deposit fee on every unit we buy, we charge the customer, we refund the customer when they return the empties, and then we are entitled to return those empties to the supplier and charge the fee back. That last step never happened.',
            'Most suppliers do not actually want the empties. Nine times out of ten they end up at a recycling facility. So the money simply left the business. Around $8MM a year in hard cash, with no recovery mechanism at all.',
          ],
        },
        {
          kind: 'figure',
          tag: 'Artifact',
          caption:
            'The items themselves, and the PLUs behind them. Each one carries a deposit we pay the supplier, charge the customer, and refund on return.',
          width: 'wide',
        },
      ],
    },
    {
      letter: 'T',
      title: 'Task',
      id: 'task',
      prompt: PROMPTS.task,
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            'Find a way to recoup the deposit money from suppliers. That was the whole brief. There was no system to build on, no supplier agreement to point at, and no precedent for asking.',
          ],
        },
        {
          kind: 'list',
          label: 'What made it hard',
          items: [
            'Cashiers keyed return quantities and dollar values into the register by hand, so there was no record of which supplier any returned item came from.',
            'Without that record there is nothing to invoice. Item level traceability is the entire mechanism.',
            'Suppliers had never been billed for this and had no reason to want to start.',
            'The supplier relationship sat outside my scope.',
          ],
        },
      ],
    },
    {
      letter: 'A',
      title: 'Action',
      id: 'action',
      prompt: PROMPTS.action,
      blocks: [
        {
          kind: 'prose',
          paragraphs: [
            'Recovery only works with item level traceability. If I cannot tell a supplier which of their items came back and how many, there is nothing to bill them for. So the design question was how to get item level data out of a process that was, at the time, a cashier typing in a dollar amount.',
          ],
        },
        { kind: 'heading', text: 'Built it on the catalog we already had' },
        {
          kind: 'prose',
          paragraphs: [
            'The product catalog was already the mechanism that charged the customer a deposit at purchase, so it already knew which supplier an item came from and what the deposit was worth. I backboned the return workflow on that rather than standing up anything new.',
          ],
        },
        {
          kind: 'steps',
          items: [
            {
              title: 'Replaced keying with scanning',
              body: 'Cashiers scan each returned item instead of typing a quantity and a dollar value. From their side it is a workflow change, not a new job.',
            },
            {
              title: 'Captured supplier, count and deposit value per item',
              body: 'Scanning produces the item level record the whole recovery depends on, and it removes a real shrink and loss risk at the same time.',
            },
            {
              title: 'Wired the back end into accounting',
              body: 'Suppliers are invoiced monthly, for specifically the items they sold us and we paid returns on.',
            },
            {
              title: 'Joined the supplier calls',
              body: 'I did not own that relationship, but the conversations were not progressing and I had the context, so I joined them.',
            },
          ],
        },
        {
          kind: 'figure',
          tag: 'Final',
          caption:
            'The return workflow at the register. Cashiers scan the empties across instead of keying quantities and values.',
          width: 'wide',
        },
        { kind: 'heading', text: 'The bulk bag problem' },
        {
          kind: 'prose',
          paragraphs: [
            'People do not bring back six cans. They bring in trash bags full of them. From an operations, safety and cleanliness point of view, we do not want a bag of crushed cans opened out across the counter.',
            'So cashiers got predefined increments instead. A trash bag counts as roughly 100 units at whatever deposit value the state allows. That deliberately gives up the item level traceability the entire system exists for, on exactly the returns that carry the most volume. The bag might also hold a few Cokes or Pepsis, which we do not sell.',
            'The mitigation is a visual inspection: the cashier confirms the majority of what is in the bag was in fact sold by us. That is an approximation, and I treated it as one rather than pretending otherwise.',
          ],
        },
        {
          kind: 'callout',
          label: 'The tradeoff I had to price',
          body: 'I could not measure bulk returns precisely, so the honest move was to negotiate a defensible approximation instead of claiming a precision we did not have. That is what the 80% is: the number a supplier will accept against a known uncertainty.',
        },
        {
          kind: 'prose',
          paragraphs: [
            'Then came the commercial terms, which is where the real problem was. The first thing the calls turned up was that nobody knew what invoice format suppliers actually expected. That got settled on the calls, and only then could we get into what they would pay.',
          ],
        },
      ],
    },
    {
      letter: 'R',
      title: 'Result',
      id: 'result',
      prompt: PROMPTS.result,
      blocks: [
        {
          kind: 'metrics',
          items: [
            { value: '$6MM', label: 'Recovered a year', note: 'Against about $8MM of annual exposure' },
            { value: '80%', label: 'Supplier recovery', note: 'The precedent the rest are onboarded against' },
            { value: 'Item level', label: 'Traceability', note: 'Where before there was a keyed dollar amount' },
          ],
        },
        {
          kind: 'prose',
          paragraphs: [
            'Around $6MM a year recovered so far, against roughly $8MM of annual exposure. The larger outcome is the precedent: our biggest supplier agreed to pay 80% of the total bottle deposit return, and that is now the standard every other supplier is onboarded against. The work is still going.',
          ],
        },
        {
          kind: 'figure',
          tag: 'Data',
          caption:
            'The monthly supplier report: which items came back, how many, and what we are owed for them.',
          width: 'wide',
        },
        {
          kind: 'quote',
          text: "Turns out suppliers don't like it when you just send them a bill for something they haven't been paying for forever.",
          source: 'Something I said more than once',
        },
        {
          kind: 'callout',
          label: 'The part I am least happy with',
          body: 'The bulk bag increments are the weakest point in the system, and a visual check is a thin answer. Anything that gets even a rough item mix out of a bag without opening it across the counter would move that 80% up.',
        },
      ],
    },
  ],
};

export const CASES: CaseStudy[] = [digitalReceipts, bottleDeposits];

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
