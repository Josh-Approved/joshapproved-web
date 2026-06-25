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

A **server-first, modal-fallback** design that maps 1:1 onto Josh's framing
("high confidence → store, otherwise the modal"):

```
Customer taps  joshapproved.com/get/<slug>
        │
        ▼
Cloudflare Pages Function  (edge, server-side, free tier 100k req/day)
   reads User-Agent (+ Client Hints when present)
        │
   ┌────┴───────────────────────────────────────────────┐
   │ high-confidence iPhone  → 302 → appStoreUrl          │
   │ high-confidence Android phone → 302 → playStoreUrl   │
   │ everything else (desktop, iPad, bot, in-app webview, │
   │   unknown, no UA)  → serve the MODAL page (static)   │
   └──────────────────────────────────────────────────────┘
                                   │
                                   ▼
                 Modal/landing page (static HTML, cacheable)
                 • QR code (encodes the SAME /get/<slug> link)
                 • App Store button   • Play Store button
                 • client-side JS second-pass (optional iPad refine)
```

Why this shape:

- **Cloudflare Pages Functions** give us a server-side hop on the host we already
  use, at no cost, with no new vendor. Put one file at
  `functions/get/[slug].ts`. It is the direct analogue of Branch's
  click-tracking server, minus the tracking.
- **Server decides only the two confident cases** (iPhone, Android phone) and
  defers *everything ambiguous to the modal*. We never have to be clever about
  iPad-vs-Mac or webviews — if we're not confident it's a phone, the modal is
  the answer, which is exactly what Josh wants.
- **The modal page is static HTML** → cacheable, crawler-safe, works with no JS.
  The two store buttons are real `<a>` tags; the QR is an `<img>`.
- **The QR encodes the smart link itself**, not a store URL. A desktop visitor
  scans it with their phone → the phone hits `/get/<slug>` → server detects the
  phone → correct store. One canonical link, end to end. (Generate the QR at
  build time per app — the link is static — so no runtime cost and no client lib.)

**Detection rules (server-side, conservative):**
- iPhone: UA contains `iPhone` (optionally `iPod`). → App Store.
- Android **phone**: UA contains `Android` **and** `Mobile`. (Android tablets
  omit `Mobile`; send those to the modal.) → Play Store.
- iPad, Mac, Windows, Linux, ChromeOS, unknown, empty UA → modal.
- Known bot/crawler/unfurler UAs → serve the modal HTML (never redirect a
  crawler; see §4).

**Why not pure client-side JS?** It works on static hosting (read
`navigator.userAgent` / `navigator.userAgentData`, then `location.replace`), but
it flashes a blank page first and does nothing without JS. **Why not pure
server-side?** It can't see touch capability (can't disambiguate iPad). The
hybrid above takes the best of both: fast confident server redirect for phones,
robust static modal for everything else, optional JS refinement on top.

**Fallback path if we ever want to avoid Pages Functions entirely:** a fully
static `/get/<slug>` page that does the detection in a `<script>` and falls back
to the visible modal. Slightly worse UX (flash), but zero runtime — keep it in
the back pocket.

---

## 4. Edge cases

| Case | What happens / risk | Handling |
|---|---|---|
| **In-app webview** (Instagram, TikTok, FB, Snap, etc.) | UA still contains `iPhone`/`Android Mobile`, often plus `wv`, `FBAN/FBAV`, `Instagram`, `Line`. Store links *do* open the native store from these webviews. | Detect OS normally and redirect to the store — it works. Don't over-engineer. The modal remains the fallback if UA is unrecognizable. |
| **iPad** | iPadOS Safari sends a **macOS desktop UA** by default, so server-side sees "desktop." ([Apple Dev Forums](https://developer.apple.com/forums/thread/119186), [51Degrees](https://51degrees.com/blog/missing-ipad-tablet-web-traffic)) | Falls to the **modal** — acceptable (QR + buttons present). Optional client-side refine: UA says Macintosh **but** `navigator.maxTouchPoints > 1` ⇒ iPad ⇒ can surface the App Store button prominently. |
| **Misdetection / low confidence** | We guess wrong about the device. | **Default to the modal** whenever not high-confidence. The modal always offers both stores + QR, so a misdetect costs one extra tap, never a dead end. |
| **No JavaScript** | Client-side refinement won't run. | Server-side redirect needs no JS; the modal's store buttons + QR are static HTML. Fully functional without JS. |
| **Bots / crawlers / link unfurlers** (Googlebot, `facebookexternalhit`, `Twitterbot`, `Slackbot`, etc.) | A 302 to the App Store would wreck link previews and SEO. | Match known bot UAs → **serve the modal HTML** (with proper OG/Twitter meta) instead of redirecting. Link unfurls show a real preview. |
| **Client Hints absent on first request** | High-entropy UA Client Hints aren't sent on the first hit. ([ScientiaMobile](https://www.scientiamobile.com/user-agent-client-hints/)) | Rely on the **UA platform token** (always present) for the decision; treat Client Hints as optional enrichment only. |
| **Android WebView UA reduction** (Android 16+) | Google is reducing WebView UA detail. ([Android Developers Blog](https://android-developers.googleblog.com/2024/12/user-agent-reduction-on-android-webview.html)) | The `Android` + `Mobile` tokens we rely on are retained; we don't depend on fine-grained model strings. |
| **Private Relay / VPN** | Hides IP. | We don't use IP for anything — irrelevant to store routing. |
| **Desktop, genuinely** | Correct case. | Modal with QR + both buttons. |

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
| `functions/get/[slug].ts` Pages Function — UA detection + redirect/serve decision | ~½ day incl. the detection rules + bot list |
| Modal/landing page template (reuses `apps.ts` + `platformUrl`) with QR + 2 store buttons | a few hours |
| Build-time QR generation per app (link is static) | ~1 hour |
| Cross-device verification (real iPhone, Android phone, iPad, desktop, an in-app webview, a crawler UA) | ~½ day, per cross-platform-parity policy |

**Total: ~1 day of focused work.** No recurring cost (Cloudflare free tier),
no SDK in the mobile apps, no new vendor in the stack.

---

## 7. Recommendation

Build the **server-first, modal-fallback** smart link at `joshapproved.com/get/<slug>`
as a Cloudflare Pages Function over the existing `apps.ts` / `storeAvailability`
data. It delivers exactly the requested behavior, costs nothing, removes the
Branch dependency, and degrades gracefully (every ambiguous or low-confidence
case lands on the modal with QR + both store buttons). Defer Universal/App Links,
deferred deep linking, and attribution — they're separate, heavier efforts that
the acquisition use case doesn't require.

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
