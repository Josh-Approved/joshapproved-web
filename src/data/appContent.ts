// Per-app FAQ + related-essay links, kept out of apps.ts so the core app record
// stays lean. FAQ answers are app-page voice: plain, "you/your" for the reader,
// "I/my" for the studio (matching the app-page body copy). They also feed the
// FAQPage structured data on each app page, which can win question-shaped search
// results. RELATED_ESSAYS maps an app to the reaction essays in src/content/writing.

export type Faq = { q: string; a: string };

export const FAQ: Record<string, Faq[]> = {
  'grocery-list': [
    { q: 'Is Grocery List really free?', a: 'Yes. The whole app is the free app, with no paywall and no locked features. It is supported by optional donations, not ads or subscriptions.' },
    { q: 'Do I need an account to share a list?', a: 'No. You share a list with a link or a QR code, phone to phone. There is no sign-up and no email to hand over.' },
    { q: 'How does the list stay in sync without a server?', a: 'Changes pass between your phones encrypted end to end, through free public relays I do not run and cannot read. The list merges on each device, so nothing about what you buy reaches me.' },
    { q: 'Does it work on both iPhone and Android?', a: 'Yes, and a shared list stays in sync across both.' },
  ],
  'free-workout-timer': [
    { q: 'Is Free Workout Timer free?', a: 'Yes. Every feature is in the app for free, including custom intervals and Tabata. No paywall, no ads.' },
    { q: 'Does the timer keep running when the screen is off?', a: 'Yes. It keeps time in the background, so locking the phone or switching apps does not stop the count.' },
    { q: 'Do you track my workouts?', a: 'No. There is no account and no analytics. The timer runs on your phone and reports nothing back.' },
  ],
  'packing-list': [
    { q: 'Is Packing List free?', a: 'Yes. The whole app is free, with no paywall and no ads.' },
    { q: 'Do I need an account?', a: 'No account and no sign-up. Open it and start a list.' },
    { q: 'How does it decide what to pack?', a: 'You tell it the trip and it builds a suggested list with sensible quantities you can adjust. Nothing is sent to a server to do it.' },
    { q: 'Can I share a trip with the person I am travelling with?', a: 'Yes. You share a trip with a link or a QR code, phone to phone. There is no sign-up and no email to hand over.' },
    { q: 'How does a shared trip stay in sync without a server?', a: 'Changes pass between your phones encrypted end to end, through free public relays I do not run and cannot read. The list merges on each device, so nothing about your trip reaches me.' },
  ],
  'home-maintenance': [
    { q: 'Is Home Upkeep free?', a: 'Yes. The whole app is free, with no paywall, no ads, and no subscription. The appliance registry and the reminders are all in the free app.' },
    { q: 'Do I need an account?', a: 'No account and no sign-up. Open it and add your first task.' },
    { q: 'Will it nag me?', a: 'No. One reminder when a task is due, on a schedule you set yourself. There are no streaks, no badges, and no daily prompts.' },
    { q: 'What happens when I mark a task done?', a: 'The next due date sets itself from the day you did the work, so a job done early or late keeps its own rhythm instead of drifting.' },
    { q: 'Can I get my data out?', a: 'Yes. Export everything to a file whenever you want, and import it back on another phone.' },
  ],
  'split-expenses': [
    { q: 'Is Split Expenses free?', a: 'Yes. Tracking costs and settling up are free, with no paywall and no ads.' },
    { q: 'Do I need an account to split with a group?', a: 'No. You share a group with a link or a QR code, and balances are worked out on each phone.' },
    { q: 'Does the app handle the money?', a: 'No. It records who paid and shows the fewest payments to settle up. You settle in cash or hand off to Venmo, PayPal, or Cash App. The app never touches the money.' },
  ],
  'tend': [
    { q: 'Is Relationships free?', a: 'Yes. The whole app is free, with no paywall, no ads, and no subscription.' },
    { q: 'Where is my information about people stored?', a: 'On your device. There is no account, and nothing you write about the people in your life reaches me.' },
    { q: 'Does it use streaks or notifications to keep me in the app?', a: 'No. It has gentle reminders you set yourself, and none of the streaks, badges, or engagement nudges other apps use.' },
  ],
  'ask-ai': [
    { q: 'Is Ask AI free?', a: 'Yes. The extension is free, with no paywall and no ads.' },
    { q: 'Do I need an account?', a: 'No account and no sign-up.' },
    { q: 'What happens to the pages I ask about?', a: 'Your question goes to the AI to answer, and is not logged or tracked by me. The extension is open source, so you can check exactly what it sends.' },
  ],
  'private-ai-summary': [
    { q: 'Is Private AI Summary free?', a: 'Yes. Free, with no paywall and no ads.' },
    { q: 'Do I need an account?', a: 'No account needed.' },
    { q: 'Is my reading tracked?', a: 'No. There is no analytics. The extension is open source, so you can verify what it does.' },
  ],
};

// App slug -> writing-essay ids (src/content/writing/<id>.md) that explain the
// thinking behind that app. Rendered as "Further reading" on the app page.
export const RELATED_ESSAYS: Record<string, string[]> = {
  'grocery-list': ['accounts', 'tracking'],
  'free-workout-timer': ['paywalls', 'ads'],
  'packing-list': ['accounts', 'paywalls'],
  'home-maintenance': ['paywalls', 'tracking'],
  'split-expenses': ['accounts', 'paywalls'],
  'tend': ['tracking', 'accounts'],
  'ask-ai': ['tracking', 'ads'],
  'private-ai-summary': ['tracking', 'ads'],
};
