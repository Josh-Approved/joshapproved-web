# Smart Links — Feasibility Investigation

**One link per app → device detection → correct store, without Branch.io.**

Status: **investigation only** (no feature built). Date: 2026-06-25.

---

## TL;DR / Verdict

**The core use case — a single link per app that routes iPhone users to the App
Store, Android users to the Play Store, and everyone else to a modal with a QR
code + both store buttons — is achievable, cheaply, with zero new vendors and no
SDK.** It is standard web + OS plumbing on top of the static Astro site we
already host on Cloudflare. Rough effort: **~½–1 day.**

> **Design note (per Josh's two corrections):** there is exactly **one** app
> page per app — the existing `/apps/<slug>` listing page. The smart link is just
> that same URL with a query param (`?install=1`). Natural visits behave exactly
> as today; arriving with the param runs detection *on that page* and (for
> confident phones) opens the store via its app scheme so the real app page stays
> in the browser tab underneath. No clone page, no Cloudflare Pages Function — the
> existing static app page plus a `<script>`. See §3.

What we *cannot* replicate without a Branch-style SDK + backend is the part of
Branch that Josh **does not need for acquisition**: detecting whether the app is
already installed, opening the app instead of the store, and *deferred deep
linking* (dropping a post-install user onto a specific in-app screen). Those
require an in-app SDK and a matching backend. Our scope is "get the customer to
the right store," and that needs none of it.

---

## 1. How Branch.io actually works under the hood

Branch is two products fused together: a **link router** (the part we care about)
and an **attribution/deferred-deep-link backend** (the part that needs their SDK).

### 1a. The link + the click-tracking domain
A Branch link is just an HTTPS URL on a domain Branch controls/manages (e.g.
`yourapp.app.link`). Every tap hits **Branch's server first**. That server reads
the request's `User-Agent` (and increasingly User-Agent Client Hints), decides
what kind of device it is, and responds with the appropriate redirect or an
interstitial page. This server-side hop is the whole trick behind "one link,
many destinations" — there is no magic, it's an HTTP redirect chosen by
inspecting request headers. ([Branch — Deep Linking](https://www.branch.io/deep-linking/))

### 1b. The OS-native deep-link standards Branch sits on top of
- **iOS Universal Links** — an HTTPS link the OS can intercept and open directly
  in the app, *if installed*, with no browser bounce. Backed by an
  **Apple-App-Site-Association (AASA)** file hosted at the link domain. Branch
  hosts/manages this file for you.
- **Android App Links** — the same idea, verified by a **Digital Asset Links**
  (`assetlinks.json`) file at the domain.
- **URI schemes** (`myapp://…`) — the legacy mechanism; only works if the app is
  installed and tends to throw an ugly "Open in app?" prompt or an error if not.
  Universal/App Links exist precisely to replace these.

The key advantage of Universal/App Links over URI schemes: they are HTTPS,
OS-verified, and open the app directly (no interstitial, no browser flash).
([Branch — Universal Links vs URI schemes vs App Links](https://www.branch.io/resources/blog/universal-links-uri-schemes-app-links-and-deep-links-whats-the-difference/),
[Branch — iOS deep linking tutorial](https://www.branch.io/resources/blog/ios-deep-linking-a-complete-tutorial-for-universal-links-and-routing/))

> **Important for us:** Universal/App Links + AASA/assetlinks are only needed to
> *open an installed app*. For routing an un-installed user **to a store**, none
> of this is required — a plain HTTPS redirect to `apps.apple.com` /
> `play.google.com` is enough. The store links themselves launch the native
> App Store / Play Store app.

### 1c. Deferred deep linking — the hard part, and why it got harder
A normal Universal Link forgets all context across an install (you tap a link,
you don't have the app, you go to the store, install, open — and the app has no
idea which link sent you). **Deferred deep linking** preserves that context
through the install so the freshly-installed app can route you to the exact
content you tapped. ([Branch — Deferred deep linking](https://www.branch.io/glossary/deferred-deep-linking/))

To bridge that "install gap," Branch historically used **probabilistic
fingerprint matching**: collect device signals (IP address, User-Agent, screen
size) at link-click, collect them again at first app-open, and match within a
short time window. Quoted accuracy ~80–90%.
([Branch — Probabilistic modeling](https://www.branch.io/glossary/probabilistic-modeling/))

Apple's privacy changes broke this:
- **App Tracking Transparency (ATT)** restricts IDFA-based matching.
- **iCloud Private Relay** hides the IP address for iCloud+ users in Safari,
  removing a primary fingerprint signal.

So Branch built **NativeLink™**: when the user taps the CTA, a small encrypted,
single-use, fast-expiring token is written to the **iOS clipboard/pasteboard**;
after install, the **Branch SDK** reads that token on first launch and matches
it on-device — no IDFA, no IP fingerprint, ATT-compliant, ~100% match.
([Branch — Deferred deep linking on iOS](https://www.branch.io/resources/blog/how-to-set-up-deferred-deep-linking-on-ios/))

### 1d. What specifically requires Branch's SDK/backend vs. plain web+OS plumbing

| Capability | Needs Branch SDK + backend? | Why |
|---|---|---|
| One link → device-detected redirect to the right **store** | **No** | HTTP redirect chosen from `User-Agent`. Pure web plumbing. |
| Open the **installed app** instead of the store | No SDK, but needs AASA + `assetlinks.json` + app config | OS-native Universal/App Links. Free static files. |
| Know **whether the app is already installed** (from the web) | **Impossible from the web** | The browser cannot query installed apps. Branch infers it OS-side via Universal Links; it never truly "knows" from the web page. |
| **Deferred deep link** to a specific screen post-install | **Yes** | Requires the clipboard/fingerprint token written at click **and** an in-app SDK reading it at first launch + a matching backend. |
| **Attribution** (which link/campaign drove which install) | **Yes** | Needs the click log + first-open match in their backend. |

**Everything Josh asked for lives in row 1.** Rows 4–5 are Branch's real moat and
are out of scope for an acquisition link.

---

## 2. The Josh Approved web codebase (what we'd build on)

- **Repo:** `joshapproved-web` (`github.com/Josh-Approved/joshapproved-web`).
- **Stack:** **Astro 5**, `output: 'static'`, `site: 'https://joshapproved.com'`.
  Deployed on **Cloudflare** (git-integrated auto-deploy from `main`).
- **App pages:** `src/pages/apps/[slug].astro` generates one static page per app
  at build time via `getStaticPaths()`. Catalog at `src/pages/apps/index.astro`.
- **Store-link data already exists** — this is the key reuse:
  - `src/data/apps.ts` — hand-curated `AppRecord[]` with `appStoreUrl`,
    `playStoreUrl`, `webStoreUrl`, `platforms`, `status`, `slug`, `name`.
  - `src/data/storeAvailability.generated.ts` — **auto-generated** live overlay
    from the store APIs (the release/store-truth model: factory
    `scripts/sync-web-store-status.mjs` → App Store Connect + Play APIs). `APPS`
    merges the two so URLs/status stay live.
  - Helper already present: `platformUrl(platform, app)` maps
    `ios → appStoreUrl`, `android → playStoreUrl`, `chrome/firefox → webStoreUrl`.
  - The App Store **numeric ID** is embedded in `appStoreUrl`
    (`…/id6779417031`); the Android **package name** is embedded in `playStoreUrl`
    (`…?id=com.joshapproved.grocerylist`). No new data needed.
- **Routing today:** static only. No middleware. A `public/_redirects`
  (Cloudflare) file exists but only handles a couple of legacy 301s. There is
  **no device-detection layer yet** — store links are rendered statically.

**Conclusion:** the data layer we need is *already done*. A smart link is a thin
routing layer on top of `apps.ts` / `platformUrl()`.

---

## 3. Recommended architecture

> **Revised twice (2026-06-25) after Josh's corrections.** (1) The original draft
> was a bare `/get/<slug>` Cloudflare Pages Function that 302s confident phones
> straight to the store — it leaves the wrong page in the tab (§3a). (2) The first
> revision fixed the tab but used a *separate* `/get/<slug>` page that clones the
> app listing — Josh wants **no clone page**. Final design: **one canonical app
> page**, and the smart link is **that same URL plus a query param** (§3b).

### 3a. Two approaches considered and rejected

- **Bare server-side redirect** (`/get/<slug>` Pages Function → `302` to store):
  the customer never sees a JA page; the residual tab ends up on the store's own
  web page (`apps.apple.com/...` / `play.google.com/...`), not the app page. Fails
  the residual-tab requirement. The redirect's millisecond head-start is worthless
  if it leaves the wrong page behind.
- **Separate `/get/<slug>` page that clones the listing:** fixes the tab, but it's
  a second page per app — a duplicate to keep in sync and an SEO liability. Josh's
  rule: **exactly one app landing page per app.** Rejected.

### 3b. Recommended design — one page, a query-param trigger

There is **one** app page per app: the existing `/apps/<slug>` listing
(`src/pages/apps/[slug].astro`). The smart link is just that URL with a param:

```
Natural visit (nav, Google, internal link, direct):
   joshapproved.com/apps/free-workout-timer
        → page behaves EXACTLY as today. No detection, no handoff.

Smart link (the same page + the param):
   joshapproved.com/apps/free-workout-timer?install=1
        ▼
   The existing full app page renders (hero, description, privacy,
   screenshots, App Store + Play Store buttons) — this is the page
   that stays in the tab.
        ▼
   Inline script sees ?install=1 → arms detection on first paint
        │
   ┌────┴──────────────────────────────────────────────────────────┐
   │ confident iPhone        → open App Store via itms-apps:// link  │
   │ confident Android phone → open Play Store via market:// link    │
   │ desktop / iPad / unknown → QR + store-button modal over the page│
   │ no-JS / bot              → just the full app page (no handoff)  │
   └────────────────────────────────────────────────────────────────┘
        │
   In every case the tab is left on the REAL app page.
```

Key properties:

- **One canonical page.** No clone, no second route. We add a small inline script
  to the existing `/apps/<slug>` template; the param decides whether it does
  anything.
- **The script keys off the param.** It runs only when
  `new URLSearchParams(location.search).has('install')` is true. Natural visits
  (no param) → the script no-ops and the page is byte-for-byte today's behavior.
  This is what guarantees "natural navigation = unchanged."
- **Detection is client-side, on the real page.** When armed, a `<head>` script
  reads `navigator.userAgent` (+ `navigator.userAgentData` when present) and
  fires before paint. No Cloudflare Pages Function, no runtime — the existing
  static Astro page plus a `<script>`.

### 3c. Param name + SEO (no indexable duplicate)

- **Param:** `?install=1`. Semantic ("this link is for installing"), boolean,
  unmistakable. (`?from=link` was the alternative; `install` reads better and
  states intent.) The script only checks **presence**, so any truthy value works.
- **No duplicate page is created.** `?install=1` is the *same document* as
  `/apps/<slug>` — Astro serves one static file regardless of query string; the
  param is not a new route. So there is no second page to maintain.
- **Keep it out of the index, belt-and-suspenders:**
  1. The param is **never linked anywhere crawlable** — it appears only on the
     marketing links Josh hands out (QR, posters, social bios), never in site
     nav, the `/apps` catalog, sitemap, or internal links. Crawlers won't find it.
  2. The per-app page already emits a **`<link rel="canonical">`** to its clean
     `/apps/<slug>` URL (part of the P7 SEO pass). Keep it **param-less** so even
     if a `?install=1` URL is discovered, search engines fold it into the
     canonical — no duplicate listing.
  3. The sitemap lists only the clean URL (already the case).
  No `robots`/`noindex` gymnastics needed; canonical + not-linked is sufficient
  and standard for tracking-style params.

### 3d. Keeping the residual tab on the app page while still opening the store

The load-bearing detail. A top-level navigation to the **https** store URL
(`https://apps.apple.com/...`) would replace the tab's document with the store's
web page — the §3a problem again. To open the store **app** while leaving our
page intact in the tab, hand off via the store's **app URL scheme**, which the OS
routes straight to the App Store / Play Store app without rendering a new web
document in the tab:

- iPhone → `itms-apps://itunes.apple.com/app/id<APPSTORE_ID>` (https
  `apps.apple.com` link as fallback if the scheme doesn't fire).
- Android phone → `market://details?id=<PACKAGE>` (https `play.google.com`
  fallback).

Both the App Store ID and the package name are already embedded in our existing
`appStoreUrl` / `playStoreUrl` data, so we derive the scheme URLs at build time.
The store app foregrounds over the browser; Safari/Chrome stays on the app page
underneath. (On-device verification required — see §6 — exact tab-retention
behavior varies by OS version and inside in-app webviews.)

### 3e. The modal (desktop / low-confidence) sits over the real page

For desktop, iPad, unknown, or any non-confident case, **no handoff fires** and
the full app page is shown. For the desktop "hand them a QR" experience, a modal
pops over that same page with:

- a **QR code** encoding the smart link itself (`/apps/<slug>?install=1`) —
  scanning it with a phone runs the same detection on the phone → correct store —
  and
- explicit **App Store** and **Play Store** buttons (real `<a>` tags).

Generate the QR at build time per app (the link is static) → no runtime, no
client QR library. The page's own install buttons cover the no-JS / no-modal
cases.

**Detection rules (client-side, conservative; only run when `?install` present):**
- iPhone: UA contains `iPhone`/`iPod` → App Store scheme.
- Android **phone**: UA contains `Android` **and** `Mobile` (tablets omit
  `Mobile`) → Play Store scheme.
- iPad, Mac, Windows, Linux, ChromeOS, unknown, empty UA, bots → no handoff;
  full page (+ desktop modal).

### 3f. Tradeoff vs. the two-page approach

There is no real downside. The single-page + param design is strictly simpler
than a separate `/get/<slug>` page — one canonical page instead of two, nothing
to keep in sync, and the existing SEO/JSON-LD/OG work is inherited untouched.
The param is a no-op on natural visits, so today's behavior is preserved exactly.
The only nuance is making sure the inline script is correctly gated on the param
(so organic visits never trigger a handoff) and that the canonical tag stays
param-less (§3c) — both trivial. Recommended.

---

## 4. Edge cases

| Case | What happens / risk | Handling |
|---|---|---|
| **In-app webview** (Instagram, TikTok, FB, Snap, etc.) | UA still contains `iPhone`/`Android Mobile`, often plus `wv`, `FBAN/FBAV`, `Instagram`, `Line`. Store schemes/links *do* open the native store from these webviews. | The page renders fully (the residual webview tab is the real app page); detect OS normally and fire the store scheme. If UA is unrecognizable, no redirect → full page + buttons. |
| **iPad** | iPadOS Safari sends a **macOS desktop UA** by default, so UA sniffing sees "desktop." ([Apple Dev Forums](https://developer.apple.com/forums/thread/119186), [51Degrees](https://51degrees.com/blog/missing-ipad-tablet-web-traffic)) | No redirect → full app page shown (+ desktop modal). Acceptable. Optional client refine: UA says Macintosh **but** `navigator.maxTouchPoints > 1` ⇒ iPad ⇒ can fire the App Store scheme. |
| **Misdetection / low confidence** | We guess wrong about the device. | **No redirect unless high-confidence.** The full app page (with both install buttons, + desktop modal/QR) is always underneath, so a misdetect costs one extra tap, never a dead end. |
| **No JavaScript** | The detection script won't run, so no auto-redirect. | The page is fully static — the customer sees the **complete app page with both install buttons** (and the QR is a static `<img>`). Graceful: no-JS = the plain app page, which is fine. |
| **Bots / crawlers / link unfurlers** (Googlebot, `facebookexternalhit`, `Twitterbot`, `Slackbot`, etc.) | Don't want bots bounced to a store. | They don't run our JS, so they simply get the **full static app page + OG/Twitter meta** — correct previews and SEO for free, no special-casing needed. |
| **Client Hints absent on first request** | High-entropy UA Client Hints aren't sent on the first hit. ([ScientiaMobile](https://www.scientiamobile.com/user-agent-client-hints/)) | Detection runs client-side where `navigator.userAgentData` is available; we still key the decision on the **UA platform token** (always present) and treat Client Hints as enrichment only. |
| **Android WebView UA reduction** (Android 16+) | Google is reducing WebView UA detail. ([Android Developers Blog](https://android-developers.googleblog.com/2024/12/user-agent-reduction-on-android-webview.html)) | The `Android` + `Mobile` tokens we rely on are retained; we don't depend on fine-grained model strings. |
| **Private Relay / VPN** | Hides IP. | We don't use IP for anything — irrelevant to store routing. |
| **Desktop, genuinely** | Correct case. | Full app page + modal with QR + both buttons. |

---

## 5. What is genuinely hard or impossible without a Branch-style SDK

Be honest about the ceiling:

1. **"Open the app if it's already installed, else store."** Partially doable
   *without* an SDK by hosting our own AASA + `assetlinks.json` on
   `joshapproved.com` and adding associated-domains/intent-filters in the RN
   apps — but **the web can never *query* whether the app is installed**; only
   the OS decides at tap time. Out of scope for an acquisition link; a clean
   future add if Josh wants "re-engagement" links.
2. **Deferred deep linking** (post-install routing to a specific screen).
   Requires a click-time token (clipboard/fingerprint) **and** an in-app SDK to
   read it + a matching backend. Not replicable cheaply; not needed for "get to
   the store."
3. **Attribution** (which link/campaign caused which install). Same backend
   dependency. If Josh ever wants channel-level install attribution he can lean
   on the stores' own free tools (Apple App Analytics campaign links / SKAN,
   Play install referrer) rather than Branch.

None of these block the requested feature.

---

## 6. Effort estimate

| Piece | Effort |
|---|---|
| Inline detection script added to the existing `src/pages/apps/[slug].astro` — gated on `?install`, UA rules + `itms-apps://`/`market://` derivation | ~½ day |
| Desktop modal over the page (QR + 2 store buttons) — reuses `apps.ts` / `platformUrl` | a few hours |
| Build-time QR generation per app (link is static) | ~1 hour |
| Canonical-tag check (param-less) + confirm the param is linked nowhere crawlable | ~½ hour |
| Cross-device verification — **especially the residual-tab behavior** on a real iPhone + Android phone (does the JA page stay in the tab after the store scheme fires?), plus iPad, desktop, an in-app webview, a crawler UA | ~½ day, per cross-platform-parity policy |

**Total: ~1 day of focused work.** No recurring cost (Cloudflare free tier),
no SDK in the mobile apps, no new vendor, **no runtime** (pure static site + a
`<script>`).

---

## 7. Recommendation

One canonical app page, with a query-param trigger. The smart link is the
existing app URL plus a param: `joshapproved.com/apps/<slug>?install=1`. Natural
visits (no param) behave exactly as today. With the param, a tiny inline script
on the existing `/apps/<slug>` page runs detection: confident phones get the
store opened via its app scheme (`itms-apps://` / `market://`) so the **real app
page stays in the tab**; desktop/unknown gets a QR + store-button modal over the
page. No clone page, **no runtime** (no Cloudflare Pages Function) — the existing
static page plus a `<script>`. Keep the page's `<link rel="canonical">`
param-less and don't link the param anywhere crawlable, so no indexable duplicate
is created. Costs nothing, removes the Branch dependency, degrades gracefully
(no-JS and bots get the plain full app page). Defer Universal/App Links, deferred
deep linking, and attribution — separate, heavier efforts the acquisition use
case doesn't require.

The one thing to confirm on real hardware before calling it done: that firing the
`itms-apps://` / `market://` scheme reliably opens the store app **and leaves our
page in the browser tab** (§3c) across current iOS/Android and the common in-app
webviews. If a given environment instead navigates away, the fallback is the same
full page reachable via Back — still the real app page, never a blank shell.

---

### Sources
- [Branch — Deep Linking](https://www.branch.io/deep-linking/)
- [Branch — Deferred Deep Linking (glossary)](https://www.branch.io/glossary/deferred-deep-linking/)
- [Branch — Deferred Deep Linking on iOS (NativeLink, privacy)](https://www.branch.io/resources/blog/how-to-set-up-deferred-deep-linking-on-ios/)
- [Branch — Universal Links vs URI schemes vs App Links](https://www.branch.io/resources/blog/universal-links-uri-schemes-app-links-and-deep-links-whats-the-difference/)
- [Branch — iOS deep linking tutorial](https://www.branch.io/resources/blog/ios-deep-linking-a-complete-tutorial-for-universal-links-and-routing/)
- [Branch — Probabilistic modeling](https://www.branch.io/glossary/probabilistic-modeling/)
- [Branch — Preparing for iOS 14 privacy & IDFA changes](https://www.branch.io/resources/blog/how-to-prepare-your-mobile-app-and-attribution-stack-for-apples-ios-14-privacy-and-idfa-changes/)
- [ScientiaMobile — User-Agent, Client Hints and the future of device detection](https://www.scientiamobile.com/user-agent-client-hints/)
- [51Degrees — Importance of detecting WebView](https://51degrees.com/blog/importance-webview-detection)
- [Android Developers Blog — User-Agent Reduction on Android WebView](https://android-developers.googleblog.com/2024/12/user-agent-reduction-on-android-webview.html)
- [Apple Developer Forums — User Agent in Safari on iPadOS](https://developer.apple.com/forums/thread/119186)
- [51Degrees — Missing iPad tablet web traffic](https://51degrees.com/blog/missing-ipad-tablet-web-traffic)
