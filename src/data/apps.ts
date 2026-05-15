export type AppRecord = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  tag: 'photo' | 'doc' | 'audio' | 'util' | 'browser';
  platforms: Array<'ios' | 'android' | 'mac' | 'chrome' | 'firefox'>;
  status: 'shipped' | 'in-progress' | 'planned';
  github: string;
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

export const APPS: AppRecord[] = [
  {
    slug: 'free-workout-timer',
    name: 'Free Workout Timer',
    tagline: 'A timer for intervals and Tabata. No account, no subscription, no ads.',
    description: 'Tabata and interval timing that runs entirely on your phone. No account, no subscription, no ads.',
    tag: 'util',
    platforms: ['ios', 'android'],
    status: 'shipped',
    github: 'https://github.com/Josh-Approved/Free-Workout-Timer',
    glyph: '◷',
    permissions: 'None',
    network: 'None',
    license: 'MIT',
    body: [
      "This one runs on your phone, plays a beep, and counts down. No sign-in, no email, no subscription — that's the whole app.",
      'Build your own intervals or pick a preset. Works in portrait or landscape on the floor next to you. No account. No tracking. No data leaves your device because there is no server to send it to.',
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
    tagline: 'Ask questions about the page or video you are looking at. On-device.',
    description: 'A Chrome extension that answers questions about the current page or YouTube video, using on-device Gemini Nano.',
    tag: 'browser',
    platforms: ['chrome'],
    status: 'shipped',
    github: 'https://github.com/Josh-Approved/Ask-AI',
    glyph: '?',
    permissions: 'Active tab',
    network: 'None',
    license: 'MIT',
    body: [
      'Open the popup on any article or YouTube video. Ask a question. The answer comes from Gemini Nano running locally in Chrome — nothing about the page leaves your machine.',
      'Works on YouTube videos that have captions. Suggests question chips per page type so you do not have to think of one. If the page is too sparse or the model is not yet downloaded, the popup says so plainly.',
    ],
    privacy: {
      headline: 'What this extension collects',
      bullets: [
        'No analytics, no telemetry, no remote logging.',
        'Page content is read into the on-device model only. It never reaches a server.',
        'Requires Chrome with Gemini Nano available — see the popup for one-time setup.',
      ],
    },
  },
  {
    slug: 'private-ai-summary',
    name: 'Private AI Summary',
    tagline: 'Summarize any page. Critique any news article. On your device, not ours.',
    description: 'A Chrome extension that summarizes pages and critiques news articles using on-device Gemini Nano.',
    tag: 'browser',
    platforms: ['chrome'],
    status: 'shipped',
    github: 'https://github.com/Josh-Approved/PrivateAISummary',
    glyph: '≡',
    permissions: 'Active tab',
    network: 'None',
    license: 'MIT',
    body: [
      'A summarizer and a news-critique tool, both running entirely in your browser. No accounts, no subscription, no upload of the page you are reading.',
      'Uses the Chrome Summarizer API and the Prompt API, both backed by Gemini Nano on-device. Some Chrome builds still gate the model behind a one-time flag — the popup walks you through it the first time.',
    ],
    privacy: {
      headline: 'What this extension collects',
      bullets: [
        'No analytics, no telemetry, no usage logs.',
        'The page text is processed on-device. Nothing is uploaded.',
        'Works offline once the on-device model is installed.',
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
