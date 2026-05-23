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
    slug: 'packing-list',
    name: 'Packing List',
    tagline: 'A packing checklist that builds itself from the kind of trip you are taking.',
    description: 'A packing checklist that builds itself from the kind of trip you are taking. No accounts, no tracking — your data stays with you.',
    tag: 'util',
    platforms: ['ios'],
    status: 'in-progress',
    github: 'https://github.com/Josh-Approved/packing-list',
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
    status: 'in-progress',
    github: 'https://github.com/Josh-Approved/workout-timer',
    icon: '/assets/app-icons/free-workout-timer.png',
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
