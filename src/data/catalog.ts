// Data-only app catalog. No Vite-specific imports (`?url` assets etc.) may be
// added here: this module is imported both by the Astro site (via apps.ts) and
// by plain-Node scripts (scripts/generate-install-links.ts), which cannot load
// image assets. Demo assets are attached in apps.ts, the site-facing module.
import { STORE_AVAILABILITY } from './storeAvailability.generated';

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
  /** Above-the-fold value line: what the user gets, in plain words, before any
   *  mention of how it's built. Wedge-free (the wedge renders as its own chips).
   *  Falls back to `description` when unset. */
  value?: string;
  /** Alt text for the hero demo. Setting this is what turns the demo on: apps.ts
   *  looks for src/assets/demos/<slug>.gif (or .png) and attaches it, so the
   *  asset needs no code change of its own, only this line of copy. */
  demoAlt?: string;
  /** Hero demo shown above the fold on the app page and on the catalog card.
   *  A `.gif` src autoplays and loops with `poster` as the reduced-motion / pre-load
   *  still; a `.png`/`.jpg` src is a static framed screenshot (no poster). All
   *  assets are ~600px-wide device-framed marketing images (aspect ≈ 600:1296).
   *  Attached in apps.ts from `demoAlt` + the asset on disk; never hand-set here. */
  demo?: {
    src: string;
    poster?: string;
    alt: string;
  };
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

const RAW_APPS: AppRecord[] = [
  {
    slug: 'split-expenses',
    name: 'Split Expenses',
    tagline: 'Split shared costs with a group and see who owes whom. No paywall, no ads, no tracking, no accounts.',
    description: 'Track who paid for what on a trip, in a house, or as a couple, and settle up in the fewest payments. Your data stays with you.',
    value: 'Track who paid for what, then settle up in the fewest payments.',
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
      'Make a group for a trip, a household, or a couple, add what people pay for in any currency, and Split Expenses keeps a running who-owes-whom, then shows everyone the fewest payments that settle it. Tap any balance to see exactly how it was worked out.',
      "Share a group with a link or a QR code: no account, and nothing held on a server of mine. Everyone's phone stays in sync, and the balances are worked out on each phone so you all see the same numbers. Settle up by recording a cash payment or handing off to Venmo, PayPal, or Cash App, and the app never touches the money.",
    ],
    privacy: {
      headline: 'What this app collects',
      bullets: [
        'No analytics, no crash reports, no usage logs. No accounts, so there is nothing to sign up for.',
        'Your groups live on your device. A shared group is passed, encrypted end-to-end, through free public drop boxes I do not run and cannot read.',
        'Currency rates are fetched as a whole table and converted on your phone, so a rate lookup reveals nothing about your expenses.',
      ],
    },
  },
  {
    slug: 'grocery-list',
    name: 'Grocery List',
    tagline: 'A shared grocery list the whole household keeps in sync. No paywall, no ads, no tracking, no accounts.',
    description: 'Make a list, share it with a link, and everyone adds and checks off items together in real time. Your data stays with you.',
    value: 'One shared list your whole household keeps in sync. Add milk on your way home and it shows up on their phone.',
    tag: 'util',
    platforms: ['ios', 'android'],
    status: 'shipped',
    github: 'https://github.com/Josh-Approved/grocery-list',
    seoTitle: 'Shared grocery list, no account',
    keywords: 'grocery list, shopping list, shared list, household, groceries, no account, free',
    icon: '/assets/app-icons/grocery-list.png',
    demoAlt: 'Adding an item to a shared grocery list and checking it off',
    permissions: 'None required',
    network: 'Optional',
    license: 'MIT',
    body: [
      'Make a grocery list, add items as they come to mind, and check them off at the store. Share the list with anyone in your household by sending a link or showing a QR code: no account, nothing to sign up for.',
      "Once a list is shared, everyone's phone stays in sync: add milk on your way home and it shows up on your partner's list, check something off and it clears for everyone. The syncing runs through free public drop boxes I do not run and cannot read, and the merging happens on each phone, so you all see the same list without a server of mine in the middle.",
    ],
    privacy: {
      headline: 'What this app collects',
      bullets: [
        'No analytics, no crash reports, no usage logs. No accounts, so there is nothing to sign up for.',
        'Your lists live on your device. A shared list is passed, encrypted end-to-end, through free public drop boxes I do not run and cannot read.',
        'Nothing about what you buy ever reaches me. There is no server of mine in the path.',
      ],
    },
  },
  {
    slug: 'packing-list',
    name: 'Packing List',
    tagline: 'A packing checklist that builds itself from the kind of trip you are taking.',
    description: 'A packing checklist that builds itself from the kind of trip you are taking. No accounts, no tracking. Your data stays with you.',
    value: 'Tell it the trip and it builds the packing list for you, with sensible quantities to adjust.',
    tag: 'util',
    platforms: ['ios', 'android'],
    status: 'shipped',
    github: 'https://github.com/Josh-Approved/packing-list',
    seoTitle: 'A packing checklist that builds itself',
    keywords: 'packing list, travel checklist, packing checklist, trip planner, what to pack, free, no ads',
    icon: '/assets/app-icons/packing-list.png',
    demoAlt: 'A packing list building itself from the trip type, with sensible quantities',
    permissions: 'None required',
    network: 'Optional',
    license: 'MIT',
    body: [
      "Pick how long you're going and what kind of trip it is (beach, business, hiking, cold weather, kids along), and Packing List composes a checklist with sensible quantities. One pair of socks a day, one passport, two swimsuits.",
      'Adjust anything, add your own items, split the list across the people you are packing for, and check things off as you go. No account, no tracking, no analytics.',
      'You can also share a trip with whoever you are travelling with, by sending a link or showing a QR code. Once a trip is shared, everyone\'s phone stays in sync as items get added and checked off. The syncing runs through free public drop boxes I do not run and cannot read, and the merging happens on each phone, so you all see the same list without a server of mine in the middle.',
    ],
    privacy: {
      headline: 'What this app collects',
      bullets: [
        'No analytics, no crash reports, no usage logs. No accounts, so there is nothing to sign up for.',
        'Your trips live on your device. A shared trip is passed, encrypted end-to-end, through free public drop boxes I do not run and cannot read.',
        'Nothing about where you are going ever reaches me. There is no server of mine in the path.',
      ],
    },
  },
  {
    slug: 'home-maintenance',
    name: 'Home Upkeep',
    tagline: 'Reminders for the house stuff you always forget. No paywall, no ads, no tracking, no accounts.',
    description: "Maintenance reminders that reschedule themselves from the day you did the work, plus every appliance's details in one place. Your data stays with you.",
    value: "Know what the house needs this month, and keep every appliance's model and serial number where you can find it.",
    tag: 'util',
    platforms: ['ios', 'android'],
    status: 'shipped',
    github: 'https://github.com/Josh-Approved/home-maintenance',
    seoTitle: 'Home maintenance reminders and appliance log',
    keywords: 'home maintenance, maintenance reminders, appliance log, hvac filter, gutters, water heater, house chores, no account, free',
    icon: '/assets/app-icons/home-maintenance.png',
    demoAlt: 'The Due screen listing what is overdue and what is coming up around the house, and a task being marked done',
    permissions: 'Notifications (optional)',
    network: 'None',
    license: 'MIT',
    body: [
      'Start from a library of about 60 common maintenance tasks, from the HVAC filter to the gutters to the smoke detectors, each with a sensible schedule you can change. Mark one done with a tap and the next due date sets itself from the day you actually did the work. You get one reminder when something is due, with no streaks and no nagging.',
      "Keep each appliance's brand, model, serial number, and purchase year in the app, so you are not up a stepladder with a flashlight the next time you need them. Find manual opens a search for that exact model's documentation in one tap. Everything stays on your phone, there are no accounts, and you can export all of it to a file any time.",
    ],
    privacy: {
      headline: 'What this app collects',
      bullets: [
        'No analytics, no crash reports, no usage logs. No accounts, so there is nothing to sign up for.',
        'Your tasks and appliances live on your device. Reminders are local notifications the app schedules for itself, and they never reach a server.',
        'Nothing about your house ever reaches me. Export hands a file to the share sheet only when you tap it, and Find manual opens a browser search only when you ask for one.',
      ],
    },
  },
  {
    slug: 'free-workout-timer',
    name: 'Free Workout Timer',
    tagline: 'An interval and Tabata timer. No paywall, no ads, no tracking, no accounts.',
    description: 'Tabata and interval timing for the phone in your pocket. No paywall, no ads, no tracking, no accounts.',
    value: 'Set your intervals, press start, and put the phone down. It counts you through the workout.',
    tag: 'util',
    platforms: ['ios', 'android'],
    status: 'shipped',
    github: 'https://github.com/Josh-Approved/workout-timer',
    seoTitle: 'Free interval & Tabata timer',
    keywords: 'interval timer, tabata timer, hiit timer, workout timer, circuit timer, free, no ads, no accounts',
    icon: '/assets/app-icons/free-workout-timer.png',
    demoAlt: 'Picking a timer and counting down into the first exercise',
    appStoreUrl: 'https://apps.apple.com/us/app/workout-timer-josh-approved/id6767314178',
    permissions: 'None',
    network: 'None',
    license: 'MIT',
    body: [
      "Plays a beep, counts down, and gets out of your way. No sign-in, no email, no paywall. That's the whole app.",
      'Build your own intervals or pick a preset. Works in portrait or landscape on the floor next to you. Your data stays with you: no accounts, no tracking, no analytics.',
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
    value: 'Ask a question about the page or video you are on. The answer comes from the AI built into Chrome.',
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
      "Open the popup on any article or YouTube video. Ask a question. The answer comes from Chrome's built-in AI model, and what you're reading stays with you.",
      'Works on YouTube videos that have captions. Suggests question chips per page type so you do not have to think of one. If the page is too sparse or the model is not yet downloaded, the popup says so plainly.',
    ],
    privacy: {
      headline: 'What this extension collects',
      bullets: [
        'No analytics, no crash reports, no remote logging.',
        "Page content is read into Chrome's built-in AI model only. It never reaches a server.",
        'Requires Chrome with Gemini Nano available. See the popup for one-time setup.',
      ],
    },
  },
  {
    slug: 'private-ai-summary',
    name: 'Private AI Summary',
    tagline: 'Summarize any page. Critique any news article. Your data stays with you.',
    description: "A Chrome extension that summarizes pages and critiques news articles using the AI model built into Chrome.",
    value: 'Summarize any page or critique any news article, right there in your browser.',
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
      "Uses the Chrome Summarizer API and the Prompt API, both backed by Gemini Nano built into Chrome. Some Chrome builds still gate the model behind a one-time flag, and the popup walks you through it the first time.",
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
  {
    // The app repo is still named `tend`, the internal name it was born under,
    // but nothing public says that word: the stores, the site and this URL all
    // say Relationships (slug renamed from `tend` 2026-08-27, Josh's call, with
    // a 301 in public/_redirects). The factory maps repo slug -> website slug in
    // sync-web-store-status.mjs § WEB_SLUG, so the generated overlay below keys
    // off `relationships` too.
    // The hand-written status is the pre-launch one; the store-availability
    // overlay upgrades it and fills each store's link as that store goes live,
    // which is why no store URL is hand-set here. The overlay is refreshed by the
    // factory's daily site-parity job (josh-approved-factory/scripts/site-parity.mjs).
    slug: 'relationships',
    name: 'Relationships',
    tagline: 'A calm, private place to keep up with the people you love. No paywall, no ads, no tracking, no accounts.',
    description: 'Gentle reach-out reminders, the details worth remembering about each person, and a quiet space to prepare for the conversations that are hard to start. Your data stays with you.',
    value: 'A calm place to keep up with the people you love. A gentle nudge when it has been too long, and the details worth remembering about each person.',
    tag: 'util',
    platforms: ['ios', 'android'],
    status: 'shipped',
    github: 'https://github.com/Josh-Approved/tend',
    seoTitle: 'Keep up with the people you love, privately',
    keywords: 'relationships, friends, family, friendship, reminder, connection, birthday, stay in touch, no account, free',
    icon: '/assets/app-icons/relationships.png',
    demoAlt: 'The Today screen showing who to reach out to and what is coming up, then a catch-up logged against one person',
    permissions: 'Notifications (optional)',
    network: 'None',
    license: 'MIT',
    body: [
      'A calm "Today" shows only who to reach out to and what is coming up, never a guilt trip. Keep what matters about each person: how you met, important dates, what they love, what to ask about next time.',
      'When a conversation is hard to start, "Have the Conversation" gives you a quiet space to prepare for it one step at a time. Set a gentle rhythm for each person, or none at all. Everything you write stays on your phone. There are no accounts, and nothing about the people in your life leaves your device.',
    ],
    privacy: {
      headline: 'What this app collects',
      bullets: [
        'No analytics, no crash reports, no usage logs. No accounts, so there is nothing to sign up for.',
        'Everything you write about the people in your life stays on your device.',
        'You keep your own encrypted backup, and share your "Me" manual only when you choose to.',
      ],
    },
  },
];

// Overlay live App Store + Play availability (generated from the store APIs by
// josh-approved-factory/scripts/sync-web-store-status.mjs). It only fills facts:
// upgrades status to 'shipped' when an app is actually live, and adds a store link
// for a store it's live on, never overwriting hand-set copy or a hand-set URL.
export const APPS: AppRecord[] = RAW_APPS.map((app) => {
  const live = STORE_AVAILABILITY[app.slug];
  if (!live) return app;
  return {
    ...app,
    status: live.status ?? app.status,
    appStoreUrl: app.appStoreUrl ?? live.appStoreUrl,
    playStoreUrl: app.playStoreUrl ?? live.playStoreUrl,
  };
});

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
