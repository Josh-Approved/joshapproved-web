export type Platform = 'ios' | 'android' | 'mac' | 'chrome' | 'firefox';

export type AppRecord = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tag: 'photo' | 'doc' | 'audio' | 'util' | 'browser';
  platforms: Platform[];
  status: 'shipped' | 'in-progress' | 'planned';
  github: string;
  /** Longer-tail descriptor woven into the page <title> for search (honest,
   *  no doorway pages). e.g. "Free interval & Tabata timer". */
  seoTitle?: string;
  /** Honest category keywords for the SoftwareApplication JSON-LD. */
  keywords?: string;
  icon?: string;
  glyph?: string;
  from?: string;
  to?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  webStoreUrl?: string;
  repoSize?: string;
  permissions?: string;
  network?: 'None' | 'Required' | 'Optional';
  license?: string;
  body?: string[];
  privacy?: {
    headline: string;
    bullets: string[];
  };
};

export function platformUrl(p: Platform, app: AppRecord): string | undefined {
  switch (p) {
    case 'ios':
      return app.appStoreUrl;
    case 'android':
      return app.playStoreUrl;
    case 'chrome':
    case 'firefox':
      return app.webStoreUrl;
    default:
      return undefined;
  }
}

export const APPS: AppRecord[] = [
  {
    slug: 'split-expenses',
    name: 'Split Expenses',
    tagline: 'Split shared costs with a group and see who owes whom. No paywall, no ads, no tracking, no accounts.',
    description: 'Track who paid for what on a trip, in a house, or as a couple, and settle up in the fewest payments. Your data stays with you.',
    tag: 'util',
    platforms: ['ios', 'android'],
    status: 'planned',
    github: 'https://github.com/Josh-Approved/split-expenses',
    seoTitle: 'Split shared costs, no account',
    keywords: 'split expenses, bill splitting, who owes whom, group expenses, settle up, no account, free',
    icon: '/assets/app-icons/split-expenses.png',
    permissions: 'Camera, notifications (optional)',
    network: 'Optional',
    license: 'MIT',
    body: [
      'Make a group for a trip, a household, or a couple, add what people pay for in any currency, and Split Expenses keeps a running who-owes-whom — then shows everyone the fewest payments that settle it. Tap any balance to see exactly how it was worked out.',
      "Share a group with a link or a QR code — no account, and nothing held on a server of mine. Everyone's phone stays in sync, and the balances are worked out on each phone so you all see the same numbers. Settle up by recording a cash payment or handing off to Venmo, PayPal, or Cash App — the app never touches the money.",
    ],
    privacy: {
      headline: 'What this app collects',
      bullets: [
        'No analytics, no crash reports, no usage logs. No accounts — there is nothing to sign up for.',
        'Your groups live on your device. A shared group is passed, encrypted end-to-end, through free public drop boxes I do not run and cannot read.',
        'Currency rates are fetched as a whole table and converted on your phone — a rate lookup reveals nothing about your expenses.',
      ],
    },
  },
  {
    slug: 'grocery-list',
    name: 'Grocery List',
    tagline: 'A shared grocery list the whole household keeps in sync. No paywall, no ads, no tracking, no accounts.',
    description: 'Make a list, share it with a link, and everyone adds and checks off items together in real time. Your data stays with you.',
    tag: 'util',
    platforms: ['ios', 'android'],
    status: 'planned',
    github: 'https://github.com/Josh-Approved/grocery-list',
    seoTitle: 'Shared grocery list, no account',
    keywords: 'grocery list, shopping list, shared list, household, groceries, no account, free',
    icon: '/assets/app-icons/grocery-list.png',
    permissions: 'None required',
    network: 'Optional',
    license: 'MIT',
    body: [
      'Make a grocery list, add items as they come to mind, and check them off at the store. Share the list with anyone in your household by sending a link or showing a QR code — no account, nothing to sign up for.',
      "Once a list is shared, everyone's phone stays in sync: add milk on your way home and it shows up on your partner's list, check something off and it clears for everyone. The syncing runs through free public drop boxes I do not run and cannot read, and the merging happens on each phone — so you all see the same list without a server of mine in the middle.",
    ],
    privacy: {
      headline: 'What this app collects',
      bullets: [
        'No analytics, no crash reports, no usage logs. No accounts — there is nothing to sign up for.',
        'Your lists live on your device. A shared list is passed, encrypted end-to-end, through free public drop boxes I do not run and cannot read.',
        'Nothing about what you buy ever reaches me — there is no server of mine in the path.',
      ],
    },
  },
  {
    slug: 'packing-list',
    name: 'Packing List',
    tagline: 'A packing checklist that builds itself from the kind of trip you are taking.',
    description: 'A packing checklist that builds itself from the kind of trip you are taking. No accounts, no tracking — your data stays with you.',
    tag: 'util',
    platforms: ['ios'],
    status: 'in-progress',
    github: 'https://github.com/Josh-Approved/packing-list',
    seoTitle: 'A packing checklist that builds itself',
    keywords: 'packing list, travel checklist, packing checklist, trip planner, what to pack, free, no ads',
    icon: '/assets/app-icons/packing-list.png',
    permissions: 'None',
    network: 'None',
    license: 'MIT',
    body: [
      "Pick how long you're going and what kind of trip it is — beach, business, hiking, cold weather, kids along — and Packing List composes a checklist with sensible quantities. One pair of socks a day, one passport, two swimsuits.",
      'Adjust anything, add your own items, split the list across the people you are packing for, and check things off as you go. No account, no tracking, no analytics — your data stays on your device.',
    ],
    privacy: {
      headline: 'What this app collects',
      bullets: [
        'No analytics, no crash reports, no usage logs.',
        'No accounts. There is nothing to sign up for.',
        'Your packing lists stay on your device.',
      ],
    },
  },
  {
    slug: 'free-workout-timer',
    name: 'Free Workout Timer',
    tagline: 'An interval and Tabata timer. No paywall, no ads, no tracking, no accounts.',
    description: 'Tabata and interval timing for the phone in your pocket. No paywall, no ads, no tracking, no accounts.',
    tag: 'util',
    platforms: ['ios', 'android'],
    status: 'shipped',
    github: 'https://github.com/Josh-Approved/workout-timer',
    seoTitle: 'Free interval & Tabata timer',
    keywords: 'interval timer, tabata timer, hiit timer, workout timer, circuit timer, free, no ads, no accounts',
    icon: '/assets/app-icons/free-workout-timer.png',
    appStoreUrl: 'https://apps.apple.com/us/app/workout-timer-josh-approved/id6767314178',
    permissions: 'None',
    network: 'None',
    license: 'MIT',
    body: [
      "Plays a beep, counts down, and gets out of your way. No sign-in, no email, no paywall — that's the whole app.",
      'Build your own intervals or pick a preset. Works in portrait or landscape on the floor next to you. Your data stays with you — no accounts, no tracking, no analytics.',
    ],
    privacy: {
      headline: 'What this app collects',
      bullets: [
        'No analytics, no crash reports, no install pings.',
        'No accounts. There is nothing to sign up for.',
        'No network access. The app cannot send your data anywhere.',
      ],
    },
  },
  {
    slug: 'ask-ai',
    name: 'Ask AI',
    tagline: 'Ask questions about the page or video you are looking at. Your data stays with you.',
    description: 'A Chrome extension that answers questions about the current page or YouTube video, using the AI model built into Chrome.',
    tag: 'browser',
    platforms: ['chrome'],
    status: 'shipped',
    github: 'https://github.com/Josh-Approved/ask-ai',
    seoTitle: 'Ask questions about any page or video, privately',
    keywords: 'private AI, on-device AI, page summary, youtube summary, chrome extension, no tracking, free',
    icon: '/assets/app-icons/ask-ai.png',
    webStoreUrl: 'https://chromewebstore.google.com/detail/ask-ai/ijppmdedkjcpicffbinafhegdmkfdeff',
    permissions: 'Active tab',
    network: 'None',
    license: 'MIT',
    body: [
      "Open the popup on any article or YouTube video. Ask a question. The answer comes from Chrome's built-in AI model — what you're reading stays with you.",
      'Works on YouTube videos that have captions. Suggests question chips per page type so you do not have to think of one. If the page is too sparse or the model is not yet downloaded, the popup says so plainly.',
    ],
    privacy: {
      headline: 'What this extension collects',
      bullets: [
        'No analytics, no crash reports, no remote logging.',
        "Page content is read into Chrome's built-in AI model only. It never reaches a server.",
        'Requires Chrome with Gemini Nano available — see the popup for one-time setup.',
      ],
    },
  },
  {
    slug: 'private-ai-summary',
    name: 'Private AI Summary',
    tagline: 'Summarize any page. Critique any news article. Your data stays with you.',
    description: "A Chrome extension that summarizes pages and critiques news articles using the AI model built into Chrome.",
    tag: 'browser',
    platforms: ['chrome'],
    status: 'shipped',
    github: 'https://github.com/Josh-Approved/private-ai-summary',
    seoTitle: 'Private page summarizer & news critique',
    keywords: 'private summarizer, on-device AI, news critique, page summary, chrome extension, no tracking, free',
    icon: '/assets/app-icons/private-ai-summary.png',
    webStoreUrl: 'https://chromewebstore.google.com/detail/private-ai-summary/jbfgdnfdmolgdpohlcclaolkcanddjnm',
    permissions: 'Active tab',
    network: 'None',
    license: 'MIT',
    body: [
      'A summarizer and a news-critique tool, both running entirely in your browser. No accounts, no paywall, and the page you are reading stays with you.',
      "Uses the Chrome Summarizer API and the Prompt API, both backed by Gemini Nano built into Chrome. Some Chrome builds still gate the model behind a one-time flag — the popup walks you through it the first time.",
    ],
    privacy: {
      headline: 'What this extension collects',
      bullets: [
        'No analytics, no crash reports, no usage logs.',
        'The page text is processed inside Chrome. Nothing is uploaded.',
        'Works offline once the AI model is installed.',
      ],
    },
  },
];

export const TAGS = [
  { id: 'all', label: 'All' },
  { id: 'browser', label: 'Browser' },
  { id: 'util', label: 'Utilities' },
  { id: 'photo', label: 'Photo' },
  { id: 'doc', label: 'Documents' },
  { id: 'audio', label: 'Audio' },
] as const;

export const PLATFORM_LABEL: Record<string, string> = {
  ios: 'iOS',
  android: 'Android',
  mac: 'macOS',
  chrome: 'Chrome',
  firefox: 'Firefox',
};
