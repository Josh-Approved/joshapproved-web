/**
 * Shared-list invite pages (`/join/<slug>/`).
 *
 * An app's "Send link" invite is https://joshapproved.com/join/<slug>/#?s=<secret>.
 * With the app installed, the phone opens the app straight from the link
 * (iOS universal link / Android verified app link, declared in
 * public/.well-known/). Without it, the phone lands on this page, which offers
 * the store buttons and an "Open in <app>" button that hands the code from the
 * link to the app's own scheme.
 *
 * The secret lives in the `#` fragment. Browsers never send the fragment to a
 * server, so this site never receives it: the page reads it in the browser.
 *
 * Adding an app here is one of four pieces (see the factory shared-sync README
 * § Web share links); the association files in public/.well-known/ must list
 * the same app and path.
 */

export interface JoinApp {
  /** Catalog slug, also the URL path segment. */
  slug: string;
  /** The app's custom URL scheme (expo.scheme). */
  scheme: string;
  /** Android application id, for the intent:// hand-off. */
  androidPackage: string;
  /** What is being shared, in a sentence ("a grocery list"). */
  thing: string;
}

export const JOIN_APPS: JoinApp[] = [
  {
    slug: 'grocery-list',
    scheme: 'grocerylist',
    androidPackage: 'com.joshapproved.grocerylist',
    thing: 'a grocery list',
  },
];
