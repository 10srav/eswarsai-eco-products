# WCAG 2.2 AA Accessibility Audit — Eswar Sai Eco Products

Site: Next.js 16 marketing site for an eco-bag manufacturer.
Date: 2026-05-18
Severity scale: **Critical** (blocks WCAG AA), **Serious**, **Moderate**, **Minor**.

---

## 0. Confirmed in place

- **Lang attribute** present on root `<html lang="en">` — `app/layout.tsx:51`.
- **Single `<main id="main">`** wrapper — `app/layout.tsx:57`.
- **`:focus-visible` outline** defined globally: `2px solid var(--color-leaf)` with `outline-offset: 3px` — `app/globals.css:94`.
- **`prefers-reduced-motion`** global declaration shrinks all CSS animations/transitions to 0.01ms — `app/globals.css:165-171`.
- **Most GSAP hooks** guard their effects behind a `prefers-reduced-motion` media query check (see §7).
- **Toast** uses `role="status"` + `aria-live="polite"` — `components/ui/Toast.tsx:11-12`.
- **WhatsApp sticky button** has an `aria-label="Chat on WhatsApp"` — `components/StickyWhatsApp.tsx:14`.
- **Nav hamburger** has `aria-label="Toggle menu"` and `aria-expanded` — `components/Navigation.tsx:94-95`.
- **Breadcrumb `nav aria-label`** on product detail page — `app/products/[slug]/page.tsx:47`.

---

## 1. Critical — blocks WCAG AA

### C-1. No "skip to content" link
**WCAG 2.4.1 Bypass Blocks (A).**
The layout has `<main id="main">` (`app/layout.tsx:57`) but there is **no skip-link** rendered first in the `<body>`. Keyboard and screen-reader users must tab through every nav item on every page load.
**File:** `app/layout.tsx:50-66`.
**Expected:** an `<a href="#main">` styled `sr-only focus:not-sr-only` immediately after `<body>` (and before `<Grain />`).

### C-2. Hero rotating-words live region announces 5 times in a loop
**WCAG 4.1.3 Status Messages (AA) — misuse.**
`components/sections/Hero.tsx:199` wraps the italic phrase span with `aria-live="polite"`. Every 3.5 seconds (`Hero.tsx:65-69`) the active word changes and the polite region re-announces — five different decorative variants on rotation. This is decorative animation, not status. AT users will hear the same H1 read repeatedly with no user-initiated action.
**Fix:** drop `aria-live` from the rotating word span; the h1 itself should carry the single canonical phrase or use `aria-hidden` on the rotator.

### C-3. Color-contrast failures (text on background)

Computed using stated palette in `app/globals.css:3-16`:

| Combination | File / line | Ratio | WCAG AA requirement |
|---|---|---|---|
| `text-bone/35` placeholder (#faf7ef @ 35%) on `bg-forest-deep` (#0e2a1e) — form inputs | `EnquireForm.tsx:232` | **~2.7 : 1** | Fails 4.5:1 for body text (1.4.3) |
| `text-bone/55` mono refs/copy on `bg-forest-deep` | `HeroBag.tsx:443,448` etc. | **~3.9 : 1** | Fails 4.5:1 (small text) |
| `text-bone/60` "Drag/Scroll" hint | `ProductsRail.tsx:161` | **~4.3 : 1** | Borderline fail at 10–11px |
| `text-cream/50` legal/copyright | `Footer.tsx:113` | **~4.5 : 1** | At 12px regular — likely fails |
| `text-forest-deep/40` mono "01 / 05" | `Timeline.tsx:111` | **~3.8 : 1** | Fails 4.5:1 |
| `text-moss/50` "01" overlay | `ImpactCounters.tsx:40` | **~3.6 : 1** | Fails 3:1 only because text-moss `#2d6a4f` is on `bg-cream` `#f5f0e3` — borderline |
| `text-bone/65` body opacity-marked copy | many sections | **~5.5 : 1** | Passes |
| `nav mix-blend-mode: difference` | `Navigation.tsx:35` | **unpredictable** | Cannot guarantee 4.5:1 against arbitrary backgrounds the user scrolls past — see §6 |

**Recommendation:** raise placeholder/secondary text opacity to ≥ 70% on dark, ≥ 60% on light, or replace `text-x/35` with a solid token whose contrast is explicitly checked.

### C-4. Form errors not associated with inputs (no `aria-describedby` / `aria-invalid`)
**WCAG 3.3.1 Error Identification (A), 1.3.1 Info & Relationships (A), 4.1.3 Status Messages (AA).**
`components/sections/EnquireForm.tsx:210-228`. The `Field` wrapper renders the error as a sibling `<span>` of the input but the input has no `aria-describedby` pointing to it, no `aria-invalid`, no `id`, no `role="alert"`. The label is wrapped via `<label>` but the input has no `id`. Screen-reader users will hit the input, hear no error, then submit and re-hit the input still hearing no error.
**Fix scope:** generate stable IDs, set `aria-invalid={!!error}`, render the error with `id={`${id}-err`}` and link via `aria-describedby`. Add `role="alert"` (or `aria-live="polite"`) on first-render of error text.

### C-5. Required fields not marked programmatically
**WCAG 3.3.2 Labels or Instructions (A).**
`EnquireForm.tsx:123,131,152` use a visible "*" in the label text but the inputs have **no `required` attribute and no `aria-required="true"`**. Screen-reader users don't hear "required". Submit is gated by Zod only.

### C-6. Submit success/error relies on toast that then steals focus to a new tab
**WCAG 3.2.2 On Input, 3.3.4 Error Prevention.**
`EnquireForm.tsx:62-67`: after a 700ms timeout the form `reset()`s and `window.open(...)`. There's no focus management — focus stays on the (now disabled, then re-enabled) submit button while a new tab opens. Keyboard/AT users get no programmatic confirmation that the network call succeeded before the context switch.

### C-7. Decorative `<a>` and `<button>` with low effective hit areas
**WCAG 2.5.8 Target Size (Minimum) (AA, new in WCAG 2.2) — 24×24 CSS pixels.**

- `Navigation.tsx:54-77` desktop nav links have `py-1` only — height ≈ **22–24px**. Borderline; the underline indicator helps but the click target itself is short.
- `Navigation.tsx:81-88` "Get a quote" hidden < sm and `py-2 text-xs` — height ≈ 30px (ok).
- `Navigation.tsx:89-98` mobile hamburger `p-2.5` + `size={16}` ≈ 36×36 (ok).
- `ProductCard.tsx:52-94` cards are large (ok).
- `Footer.tsx:79-109` link rows `text-sm` with no min-height — multiple links sit in a tight `gap-2.5` flex column at ~16–18px line height each. **Touch targets ≈ 18–20px** — fails the 24px AA minimum.
- `EnquireForm.tsx:105-114` row links: `<a>` inside an `<li>` with `py-3.5` — ok (~50px).
- `IndustriesPreview.tsx:82-97` cells `p-10` — ok.

### C-8. Heading hierarchy: PageHero uses `<h1>` but home Hero also uses `<h1>` — multiple pages also include `<h1>` from PageHero
**WCAG 1.3.1 Info & Relationships (A).**
- `app/page.tsx` renders `<Hero />` whose `h1` is at `Hero.tsx:184-229`. The `EditorialBreak`s on the home page each call themselves `<section aria-label={kicker}>` and render an `<h2>` (`EditorialBreak.tsx:173`) — fine.
- However on `/products/[slug]`, the page also contains a custom hero section with `<SplitText as="h1">` — `app/products/[slug]/page.tsx:55-60`. Plus the global Navigation has no `<h>` so only one `<h1>` per page. **OK on subpages.**
- `app/loading.tsx:8` and `app/not-found.tsx:12-14` are fine (single h1 in NotFound).
- **Real issue:** `<h2>` jumps to `<h3>` then to `<h4>` in `Footer.tsx:77,90,103` — but no preceding `<h1>`/`<h2>` inside `<footer>`. Many SR users tolerate this, but strictly footer headings should start at `<h2>` to match document outline. **Moderate, not Critical** — see M-1.

---

## 2. Serious

### S-1. The decorative full-bleed marquee is `<section aria-hidden="true">` but contains visible scrolling text
**WCAG 1.3.1, 4.1.2.**
`components/sections/Marquee.tsx:24-37`. A section is set to `aria-hidden="true"` but holds eight product-category nouns ("Non-woven bags", "Jute totes", etc.) that are visually present and arguably content. The `<section>` element itself with `aria-hidden` removes the entire region from the a11y tree — acceptable IF this is purely visual flavour, but the same words appear nowhere else above the fold for non-sighted users. Better: keep `aria-hidden` and **add the labels in a visible list elsewhere** (already covered by nav, so this is acceptable). Flag for review only.

### S-2. SmoothScroll (Lenis) hijacks native scrolling
**WCAG 2.1.1 Keyboard, 2.3.3 Animation from Interactions (AAA), 2.2.2 Pause/Stop/Hide.**
`components/decor/SmoothScroll.tsx:22-26` instantiates Lenis with `duration: 1.2, smoothWheel: true`. While the module respects `prefers-reduced-motion` (`SmoothScroll.tsx:18`), keyboard users using PageDown/PageUp/Space/Arrow on Lenis-controlled scrolls often experience trapped or delayed scroll — verify with manual testing. The current `syncTouch: false` is correct.

### S-3. Mobile menu has no focus trap, no `Escape` key handler, no role
**WCAG 2.1.2 No Keyboard Trap (A) — inverse: missing trap means focus escapes behind the overlay.**
`Navigation.tsx:102-124`. When `open` is true, a fixed-overlay menu shows over the page. The menu:
- has **no `role="dialog"` / `role="menu"`** — it's a `<div>` with an internal `<ul>`.
- **does not move focus** into the menu on open.
- **does not trap focus** — tabbing past the last link escapes to body content behind the visually-covered overlay.
- has **no `Escape` keypress handler** to close.
- has **no `aria-modal`** and does not set `aria-hidden` on background content.
- The toggle button is *outside* the overlay region but is what is `aria-expanded`-bound.

### S-4. FAQ accordion uses native `<details>`/`<summary>` — mostly OK, but no `aria-expanded` mirror
**WCAG 4.1.2 Name, Role, Value (A).**
`components/sections/FAQAccordion.tsx:38-56`. Native `<details>` is fine and provides built-in disclosure semantics, but the visible "plus" icon at line 46-51 does not rotate via an explicit `aria-expanded` change announcement (the browser does this implicitly for `details/summary`). The decorative `+` icon has `aria-hidden="true"` — good. **Acceptable, monitor.**

### S-5. Filter buttons use `aria-pressed` but no `role="group"` and no group label
**WCAG 1.3.1.**
`components/sections/ProductsFilterableGrid.tsx:42-76`. The filter bar is a `<div>` with seven `<button aria-pressed>` toggles. Should be wrapped in `<div role="group" aria-label="Filter by category">` or use a `<fieldset>`/`<legend>` pattern. Otherwise SR users hear seven random toggle states with no shared context.

### S-6. Form `<label>` wraps both label text and input — accessible name OK, but no programmatic association by `id`/`htmlFor`
**WCAG 1.3.1, 3.3.2.**
`EnquireForm.tsx:222-227`. `<label>` wraps the input, which IS valid HTML and creates an implicit association. However:
- The visible label is inside a child `<span>` (line 223). Screen readers will read the span text as label, **plus the placeholder**, **plus the error**, **plus any helper** — risk of redundant announcements.
- Better pattern: explicit `htmlFor={id}` + `<input id={id}>`. Combined with C-4 fix.

### S-7. `<select>` styled with custom chevron has accessibility risk on focus
**WCAG 1.4.11 Non-text Contrast (AA), 2.4.7 Focus Visible (AA).**
`EnquireForm.tsx:153-158, 171-177`. The `<select>` styles override default appearance with a custom svg chevron. The chevron color `%2395d5b2` (sage) on a translucent input has insufficient contrast against the form's translucent `bg-bone/[0.04]` over `bg-forest-deep`. The select itself is focusable (good) — but on focus the border becomes `border-leaf` which is fine, but no visible focus ring beyond the border at the bottom edge of the underline-style input. Could be missed.

### S-8. The hero "scroll cue" rotating element animates infinitely without a pause control
**WCAG 2.2.2 Pause, Stop, Hide (A).**
`Hero.tsx:286-294`. An infinite CSS animation (`animate-drop`, 2.4s loop, defined in `globals.css:28`) — although the `prefers-reduced-motion` rule shortens it to 0.01ms (`globals.css:165-171`). Functionally compliant. Same applies to:
- `pulse-soft` (Navigation indicator, GalleryShowcase live badge)
- `wa-ring` (StickyWhatsApp ripple)
- `scroll-x` (Marquee)
- `bag-float`, `bag-corner`, `fall`, `leaffall` (decorative bag/leaf falls)
All decorative elements are `aria-hidden`. **Pass via reduced-motion.**

### S-9. Mobile menu links inherit `transitionDelay` from inline style on `<li>` but never animate
**WCAG 1.3.1 (minor).**
`Navigation.tsx:111`. `style={{ transitionDelay: `${i * 60}ms` }}` is applied to the `<li>` but there's no corresponding `transition` property on a transformable attribute. Dead code — no a11y impact.

### S-10. `/products/[slug]` page H1 lives inside the hero, but the breadcrumb `<nav>` precedes it without a `<h1>` — fine, but heading order in product page jumps h1→h2→h3
**WCAG 1.3.1.**
`app/products/[slug]/page.tsx:55-60` (h1), `:97` (h2 absent — uses `<p class=serif>` for "30–120 GSM"). **The "Specs / Features / Best for" headings are rendered as `<p>` not `<h2>` or `<h3>`** — see lines 95, 101, 112. Screen reader users browsing by heading skip the spec section entirely.

---

## 3. Moderate

### M-1. Footer headings lack a parent `<h2>`
**WCAG 1.3.1.** `Footer.tsx:77,90,103` use `<h4>` directly under a region with no `<h2>`. Convert to `<h3>` (footer has no parent heading) or scope the document outline. Pass landmark navigation but fails heading-jump navigation.

### M-2. Hero "Tagline / live status bar" — punctuation dots are `<span aria-hidden="true">` (good) but the surrounding `<span>` containing `LIVE`, time, day, city has no role and is read flat
`Hero.tsx:166-181`. Probably acceptable; no fix needed.

### M-3. `Status` text uses `suppressHydrationWarning` for time/day
`Hero.tsx:172,176`. Time and day change between SSR and client — the suppression is to silence React but means screen readers may read "LIVE LIVE Kakinada Kakinada 29°C" momentarily after hydration. Cosmetic only.

### M-4. `<details>` accordion has decorative `+` rotated on `group-open` but `aria-hidden="true"`
`FAQAccordion.tsx:46-51`. Good. (Confirms.)

### M-5. Decorative SVGs in Footer (logo) and Navigation (logo) lack `aria-hidden`
`Footer.tsx:65, Navigation.tsx:44`. The leaf icon inside a brand `<Link>` is decorative and the link has visible text "Eswar Sai Eco Products". The SVG is unlabelled and is read by some SR as "image". Add `aria-hidden="true"` to those `<svg>` elements.

### M-6. `lucide-react` icons rendered as SVGs inline have no `aria-hidden` by default
**WCAG 1.1.1 Non-text Content (A).** Many call sites — `ArrowRight`, `ArrowUpRight`, `Plus`, `Check`, `Menu`, `X`, `Loader2`, `ClipboardList`, `Recycle`, `Scissors`, `Truck`, `CheckCircle2`, `AlertTriangle`. They render as `<svg>` with default `aria-hidden` is **NOT** set by lucide-react when there's no `aria-label` prop. Verify by inspecting DOM. If they ship without `aria-hidden`, SR users hear nothing useful but may announce "graphic". For each icon adjacent to text already present, the icon should explicitly be `aria-hidden`. Same for the `<Plus />` in FAQ (already aria-hidden via wrapping `<span aria-hidden="true">` — good).
**Specific fail risk:** `EnquireForm.tsx:194` — submit button has `<Loader2 />` then "Sending…" text. If lucide-react doesn't ship aria-hidden, the spinner has the default `role="img"` from many lucide builds.

### M-7. The cinematic `<HeroBag />` is `aria-hidden="true"` (`HeroBag.tsx:345`) — the actual product images inside have `alt=""` (line 414)
Good — entire decorative tree hidden. The image cycling is also functionally invisible to AT. The "01 / 05" counter (line 438-441) is similarly inside the hidden region. **Pass.**

### M-8. `<Hero/>` is a `<header>` element but is not the page banner landmark
`Hero.tsx:144-148` uses `<header>` for the home hero. The `<nav>` at the top of `<body>` is **NOT** wrapped in a `<header>` banner landmark. ARIA: there are now two `<header>` regions — root and inside Hero. NVDA may report `banner` landmark twice. Wrap the global `<nav>` in `<header>` and change Hero's `<header>` to `<section>` or `<div>`.

### M-9. Live region status bar contains decimal punctuation as `aria-hidden` `<span>` mid-flow — good
`Hero.tsx:171, 175, 177, 179`. No issue.

### M-10. The grain overlay is `position:fixed` with `pointer-events:none` and `aria-hidden`
`Grain.tsx:1-3`. **Pass.**

### M-11. Multiple `<a target="_blank">` open external links — most include `rel="noopener noreferrer"` correctly
Spot-check: `Footer.tsx:107-108`, `EnquireForm.tsx:108`, `CTABanner.tsx:36-40`, `StickyWhatsApp.tsx:12-13`. The new-tab indicator is missing from links — WCAG 3.2.5 advises informing users about new windows. Add visually-hidden "opens in new tab" via `<span class="sr-only">`.

### M-12. `text-balance` and `drop-cap` apply via `@utility` — drop-cap doesn't affect a11y but ::first-letter styling could confuse text-to-speech engines that interpret it as a separate fragment. Minor cosmetic.

### M-13. Hero CTA "Request samples" uses MagneticButton which renders `<Link>` with mouse-driven transform
`MagneticButton.tsx:34, useMagneticButton.ts:14-15`. Already guards against `(hover: hover)` for touch devices and `prefers-reduced-motion`. **Pass.**

### M-14. Navigation `style={{ mixBlendMode: "difference" }}` on the entire nav bar
`Navigation.tsx:35`. While it produces good visual contrast against varied backgrounds in most cases, `mix-blend-mode: difference` interacts unpredictably with browser-zoom and high-contrast forced-colors modes. **WCAG 1.4.6 (AAA), 1.4.11 (AA)** — borderline. The text color is `text-cream`. On `bg-bone` (#faf7ef) the difference produces near-black `#050807` — contrast ~21:1, fine. On `bg-forest-deep` it produces a green-yellow with ratio ~7:1, fine. On the cream marquee scrolling underneath it produces another color — could fail. **Manual test required.**

### M-15. `loading.tsx` has no live region and an indefinite shimmer
`app/loading.tsx:5-7`. The progress indicator is a CSS pulse — purely visual. Add `role="status"` `aria-live="polite"` with an `sr-only` "Loading…" text (the visible "Loading…" is `eyebrow` opacity-70 — may need contrast bump too).

### M-16. Counter component changes text content rapidly (~2.4s tween)
`Counter.tsx:71-78`. Updates `textContent` on every animation frame. The element is not in a live region (good) and most SR ignore textContent mutations unless live. But VoiceOver in browse mode might announce. Generally acceptable.

### M-17. `<button>` inside `EnquireForm.tsx:189-196` has `disabled={submitting}` but no `aria-busy`
Minor — add `aria-busy={submitting}` for SR feedback.

---

## 4. Minor

### N-1. Many sections begin with an `eyebrow` `<div>` (or `<p>`) — these are stylistic and unrelated to semantic eyebrow. Adopting a consistent `<p class="eyebrow">` (not `<div>`) would help. Examples: `Hero.tsx:166`, `BrandStrip.tsx:22`, `StoryPanels.tsx:92`, `ImpactCounters.tsx:16`. Mixed `<p>` and `<div>` usage — acceptable.

### N-2. `EditorialBreak` uses `aria-label={kicker}` on `<section>`
`EditorialBreak.tsx:158`. Good practice. The label is short, matches the visible eyebrow. **Pass.**

### N-3. `Hero.tsx:209-225` rotating words map renders all five spans simultaneously, four with `aria-hidden={!isActive}`
Each non-active span has `aria-hidden="true"`. **Pass.**

### N-4. Missing alt on `<HeroBag>` cycled images is intentional (decoration); the section is itself `aria-hidden`. **Pass.**

### N-5. Video on Gallery page (`GalleryShowcase.tsx:111-122`) uses `aria-label={hero.alt}` on the `<video>` (`Inside the Eswar Sai factory floor…`). Good. Auto-play with `muted loop` is allowed. **Pass.**

### N-6. Manifold use of `text-pretty` / `text-balance` — purely visual.

### N-7. `Marquee.tsx` `aria-hidden="true"` on the whole section — confirms it's decorative.

### N-8. `decorative ✕` and `✓` glyphs in StoryPanels are inside `<span>` not `aria-hidden`
`StoryPanels.tsx:108, 130`. `<span class="text-lg text-flame">✕</span> Plastic bags`. SR will read "X Plastic bags" or "Check mark Plastic bags" depending on locale. Better to wrap glyph in `<span aria-hidden="true">` and add `<span class="sr-only">cross</span>` if essential — or drop the glyph from the AT tree entirely since the heading text conveys the same meaning.

### N-9. `Hero.tsx` time/day/temp displays a static `29°C` — out of date if weather data isn't live. Not a11y, content-quality.

### N-10. `BrandStrip.tsx:36-37` uses `outline-stroke` (`text-stroke 1px transparent`) for every 3rd brand name. **WCAG 1.4.11 Non-text Contrast.** The stroked text color is `currentColor` which resolves to `forest-deep` (#0e2a1e) on bone (#faf7ef) — contrast OK as outline color. But the *outlined text fill* is transparent, so the only legibility is the 1px stroke. For thin font weights this fails 4.5:1 because what's being measured is the visible glyph edge, not the full glyph mass. Borderline serious — flag as **Moderate** for the brand names that need readability.

### N-11. The radial-gradient hero overlays at `Hero.tsx:151-156`, `PageHero.tsx:22-26`, `CTABanner.tsx:13-16`, `EnquireForm.tsx:78-82`, `SustainabilityStrip.tsx:11-14` are all `aria-hidden="true"`. **Pass.**

### N-12. `<Counter>` value `100%` next to `text-[0.55em] italic text-moss` unit — visual only, contrast acceptable. **Pass.**

### N-13. `Toast` `role="status"` is correct for non-blocking notifications. Note: success message reads "Opening WhatsApp…" then disappears at 700ms before WhatsApp window opens — short window but visible. Some AT may miss it. Consider `role="alert"` (assertive) for the error tone branch.

---

## 5. Heading hierarchy summary by page

| Page | h1 | h2s | h3s | Notes |
|---|---|---|---|---|
| `/` (home) | `Hero` "Replace plastic." | StoryPanels, ProductsPreview, SustainabilityStrip, ImpactCounters, IndustriesPreview, ProcessSteps, GalleryPreview, CTABanner | StoryPanels articles, ProductCards, ProcessSteps, IndustriesPreview cells | OK |
| `/products` | PageHero | ProductsFilterableGrid has none | ProductCards (h3) | **Missing h2 between h1 and h3 cards** (filter section needs a heading or sr-only "Products"). Serious. |
| `/products/[slug]` | "{product.name}" | none in the body — the spec/features/best-for sections use `<p class="eyebrow">` instead of `<h2>` | Related products h3 | **Serious** — see S-10 |
| `/sustainability` | PageHero | SustainabilityManifesto, SustainabilityStrip, ImpactCounters, ProcessSteps, CTABanner | None | OK |
| `/industries` | PageHero | IndustriesGrid, IndustriesDetail | Industries link cards (h3), industry rows (h3) | OK |
| `/gallery` | PageHero | GalleryShowcase, CTABanner | None | OK |
| `/contact` | PageHero | EnquireForm, FAQAccordion | None (FAQ is `<details><summary>`) | OK |
| `/404` | "This page composted." | none | none | OK |

---

## 6. Color & contrast notes (raw)

Palette tokens — `app/globals.css:3-16`:
- `--color-forest-deep: #0e2a1e` (very dark green)
- `--color-forest: #1a4d36`
- `--color-moss: #2d6a4f`
- `--color-leaf: #52b788`
- `--color-sage: #95d5b2`
- `--color-cream: #f5f0e3`
- `--color-bone: #faf7ef`
- `--color-ink: #0a1a12`

Common pairings & contrast ratios (using WCAG 2.x formula):

| Foreground | Background | Ratio | Use | Pass AA? |
|---|---|---|---|---|
| `ink` #0a1a12 | `bone` #faf7ef | **17.0 : 1** | Body text default | Yes |
| `forest-deep` #0e2a1e | `bone` #faf7ef | **14.9 : 1** | Section text | Yes |
| `moss` #2d6a4f | `bone` #faf7ef | **6.6 : 1** | Eyebrow | Yes |
| `moss` #2d6a4f | `cream` #f5f0e3 | **6.4 : 1** | Eyebrow on cream | Yes |
| `leaf` #52b788 | `forest-deep` #0e2a1e | **4.9 : 1** | Button text | Borderline (24px+) |
| `leaf` #52b788 | `bone` #faf7ef | **2.3 : 1** | Decorative accent | **Fails text** but ok decorative |
| `sage` #95d5b2 | `forest-deep` #0e2a1e | **7.4 : 1** | Hero italic text | Yes |
| `bone/35` #faf7ef@35% | `forest-deep` #0e2a1e composite | **~2.7 : 1** | Placeholder | **Fails** |
| `bone/55` #faf7ef@55% | `forest-deep` | **~3.9 : 1** | Secondary copy | **Fails** body, ok large |
| `bone/60` #faf7ef@60% | `forest-deep` | **~4.3 : 1** | Hint text | **Borderline fail** |
| `bone/70` #faf7ef@70% | `forest-deep` | **~5.0 : 1** | Body opacity | Yes |
| `bone/85` #faf7ef@85% | `forest-deep` | **~6.0 : 1** | Body | Yes |
| `cream/50` #f5f0e3@50% | `ink` #0a1a12 | **~7.0 : 1** | Footer copyright (small) | Yes — was correct |
| `cream/65` | `ink` | ~9.0 : 1 | Yes |
| `forest-deep/40` | `bone` | **~3.8 : 1** | Timeline number | **Fails small** |
| `forest-deep/55` | `bone` | ~5.4 : 1 | Outline-stroke | Yes |
| `forest-deep/65` | `bone` | ~6.7 : 1 | Body | Yes |
| `forest-deep/70` | `bone` | ~7.1 : 1 | Body | Yes |
| `forest-deep/75` | `bone` | ~7.6 : 1 | Body | Yes |
| `forest-deep/80` | `bone` | ~8.1 : 1 | Body | Yes |
| `flame` #ff6b4a | `bone` | **2.8 : 1** | Error text | **Fails** for error text — see C-4 too. Use a darker flame for errors. |
| `flame` | `forest-deep` | **~7.5 : 1** | Error on dark form | Yes |
| `rust` #c2410c | `bone` | **3.9 : 1** | Likely fails for body, ok for large |

**Actionable contrast issues:**
- Replace `bone/35` placeholders with `bone/55` minimum (still fails — use `bone/65` for safety).
- Replace `bone/55` and `bone/60` body/hint text with `bone/70` or higher.
- Error text on the *light* breadcrumb area uses `flame` (#ff6b4a) which is **2.8 : 1 on bone** — fails. The form error is on a dark background so OK there, but be cautious if errors ever render on cream/bone.
- `forest-deep/40` mono numerals fail; use `forest-deep/55` minimum.

---

## 7. Motion / `prefers-reduced-motion` coverage

| Component | File | Respects? |
|---|---|---|
| Global CSS animations | `globals.css:165-171` | **Yes** — capped to 0.01ms |
| `useGsapReveal` | `animations/hooks/useGsapReveal.ts` | **NO direct check** — but `globals.css` rule overrides any CSS animation. Inside GSAP this is JS-driven so the rule doesn't apply. **The hook itself never reads `matchMedia` — runs always.** | **Critical** for §C-X (see below). |
| `useParallax` | `useParallax.ts:33` | **Yes** — guards behind matchMedia |
| `useMagneticButton` | `useMagneticButton.ts:15` | **Yes** |
| `SmoothScroll` (Lenis) | `SmoothScroll.tsx:18` | **Yes** — exits early |
| `Hero.tsx` GSAP | `Hero.tsx:54-69,71-73` | **Yes** — reads `mq.matches` and `reduced` flag throughout |
| `HeroBag.tsx` GSAP | `HeroBag.tsx:68-75` + checks at `:77,103,127,176` | **Yes** |
| `EditorialBreak.tsx` GSAP | `EditorialBreak.tsx:57` | **Yes** |
| `StoryPanels.tsx` | `StoryPanels.tsx:47` | **Yes** |
| `ProductsPreview.tsx` | `ProductsPreview.tsx:30` | **Yes** |
| `IndustriesPreview.tsx` | `IndustriesPreview.tsx:27` | **Yes** |
| `ProcessSteps.tsx` | `ProcessSteps.tsx:27` | **Yes** |
| `GalleryPreview.tsx` | `GalleryPreview.tsx:28` | **Yes** |
| `ProductCard.tsx` GSAP entrance | `ProductCard.tsx:26` | **Yes** |
| `Timeline.tsx` | `Timeline.tsx:51` | **Yes** |
| `Counter.tsx` | `Counter.tsx:60` | **Yes** |
| `SplitText.tsx` | `SplitText.tsx:40` | **Yes** |
| `Footer.tsx` parallax | `Footer.tsx:38` | **Yes** |
| `GalleryShowcase.tsx` (video) | `GalleryShowcase.tsx:50-55` | **Yes** — pauses video |
| `IndustriesGrid.tsx` | `IndustriesGrid.tsx:26` | **Yes** |
| `IndustriesDetail.tsx` | `IndustriesDetail.tsx:68` | **Yes** |
| `ProductsFilterableGrid.tsx` | `ProductsFilterableGrid.tsx:30` | **Yes** |
| `FAQAccordion.tsx` | `FAQAccordion.tsx` | No JS animations — CSS rotate-45 on group-open. Reduced-motion CSS catches it. **Yes** |
| `SustainabilityManifesto.tsx` | `:22` | **Yes** |
| `ProductsRail.tsx` (pinned horizontal scroll) | `ProductsRail.tsx:32` | **Yes** — skips desktop scrub on reduce |
| `GalleryStrip.tsx` | `:27` | **Yes** |
| `ScrollProgress.tsx` (top progress bar) | `ScrollProgress.tsx` | **No check** — but it's a passive bar at 0–1 scale. CSS keyframe path isn't used. The width adjusts on actual scroll. Pure scroll feedback — acceptable. |

**M-18 (Moderate): `useGsapReveal` hook ignores `prefers-reduced-motion`.**
`animations/hooks/useGsapReveal.ts:33-55`. The hook calls `gsap.set()` and `gsap.to()` with scroll triggers but never checks `matchMedia`. If components use this hook (the audit found no actual use sites in `app/` or `components/sections/`, but it's exported), they will animate even with reduce. Bug-prone — fix the hook or document it.

**Mobile-touch animation caveat:** `useMagneticButton` correctly returns early if `(hover: hover)` is false — good.

---

## 8. Keyboard navigation

| Concern | Status |
|---|---|
| Tab order natural (no `tabindex` overrides) | ✓ |
| Focus visible on all interactive | ✓ via global `:focus-visible` |
| Focus indicator contrast against all backgrounds | **Mostly yes** — `leaf` #52b788 outline at 2px, 3:1 against bone (#faf7ef) is **2.3 : 1 — fails 1.4.11 Non-text Contrast**. On `forest-deep` it's **4.9 : 1** — ok. **Critical for light pages.** See **C-9**. |
| Skip to main content link | **MISSING** — see **C-1** |
| Modal/menu focus trap | **MISSING** — see **S-3** |
| Escape key closes mobile menu | **MISSING** — see **S-3** |
| `<details>` keyboard support | Native — ✓ |
| Toast `role="status"` | ✓ |
| `aria-expanded` on disclosure widgets | ✓ on nav hamburger; absent in FAQ (native details handles) |
| `aria-current` on active nav link | **MISSING** — `Navigation.tsx:54-77` computes `active` boolean but only uses it for opacity styling. Add `aria-current={active ? "page" : undefined}`. **Moderate.** **M-19.** |

### C-9 (added Critical): Focus ring color insufficient contrast against light backgrounds
**WCAG 1.4.11 Non-text Contrast (AA).** The global `:focus-visible` outline is `solid var(--color-leaf)` which is `#52b788`. Against `bone` (`#faf7ef`) the contrast ratio is **2.3:1** — fails the 3:1 requirement for UI components. On `bg-cream` (`#f5f0e3`) it's similar. Either use `forest-deep` for the outline on light pages or thicken the outline to 3–4px with offset.

---

## 9. Images & alt text

| Location | File:Line | Alt | Verdict |
|---|---|---|---|
| Hero rotating slides | `HeroBag.tsx:414` | `alt=""` | ✓ (decorative, parent `aria-hidden`) |
| EditorialBreak background | `EditorialBreak.tsx:161` | uses `alt` prop | ✓ (passed in `app/page.tsx:27,38`) |
| Gallery preview tiles | `GalleryPreview.tsx:91` | `img.alt` from `galleryImages` | ✓ — all 14 have descriptive alt in `products.ts:144-168` |
| Gallery showcase tiles | `GalleryShowcase.tsx:158` | `tile.alt` | ✓ (descriptive) |
| Gallery showcase video | `GalleryShowcase.tsx:121` | `aria-label={hero.alt}` | ✓ |
| Product card image | `ProductCard.tsx:68` | `product.image.alt` | ✓ |
| Product detail hero image | `app/products/[slug]/page.tsx:80` | `product.image.alt` | ✓ |
| About: manufacturing line | `app/about/page.tsx:77` | `"Non-woven bag manufacturing line"` | ✓ |
| Brand logos | `BrandStrip.tsx` | text only — no images | n/a |

**No filename-as-alt or empty alt errors detected for content images.**

---

## 10. Top blockers — summary table

| # | Severity | Item | File:Line |
|---|---|---|---|
| 1 | **Critical** | No skip-to-content link | `app/layout.tsx:50-66` |
| 2 | **Critical** | Form inputs lack `id`/`htmlFor`/`aria-describedby`/`aria-invalid`/`role="alert"` on error | `EnquireForm.tsx:210-235` |
| 3 | **Critical** | Form required fields not marked with `required` or `aria-required` | `EnquireForm.tsx:123-159` |
| 4 | **Critical** | Mobile menu has no focus trap, no `Escape`, no `role="dialog"`, no `aria-modal` | `Navigation.tsx:102-124` |
| 5 | **Critical** | Hero rotating words `aria-live="polite"` re-announces decorative text every 3.5s | `Hero.tsx:199-228` |
| 6 | **Critical** | Color contrast: `text-bone/35` placeholders, `text-bone/55`/`/60`, `text-forest-deep/40` numerals fail 4.5:1 | various |
| 7 | **Critical** | `:focus-visible` ring uses `--color-leaf` (#52b788) — 2.3:1 on bone — fails 1.4.11 | `globals.css:94` |
| 8 | **Critical** | Touch targets in footer link columns ≤ 20px — fails 2.5.8 (24px AA) | `Footer.tsx:79-109` |
| 9 | **Serious** | Heading hierarchy on `/products/[slug]` — "Specs/Features/Best for" are `<p>`, not `<h2>`/`<h3>` | `app/products/[slug]/page.tsx:95,101,112` |
| 10 | **Serious** | Filter button group missing `role="group"` + label | `ProductsFilterableGrid.tsx:42-76` |
| 11 | **Serious** | No focus management after form submit / before opening WhatsApp tab | `EnquireForm.tsx:62-67` |
| 12 | **Serious** | `nav` uses `mix-blend-mode: difference` — unpredictable contrast | `Navigation.tsx:35` |
| 13 | **Moderate** | Missing `aria-current` on active nav link | `Navigation.tsx:54-77` |
| 14 | **Moderate** | Lucide icons without explicit `aria-hidden` may be announced | many files |
| 15 | **Moderate** | Footer headings start at `<h4>` (no `<h2>`/`<h3>` parent) | `Footer.tsx:77,90,103` |
| 16 | **Moderate** | Two `<header>` landmarks (Navigation should be wrapped; Hero should be `<section>`) | `Hero.tsx:144` |
| 17 | **Moderate** | `useGsapReveal` hook doesn't check `prefers-reduced-motion` | `useGsapReveal.ts:33-55` |
| 18 | **Moderate** | Decorative ✕/✓ glyphs read aloud | `StoryPanels.tsx:108,130` |
| 19 | **Moderate** | New-tab links don't announce "opens in new tab" | multiple |
| 20 | **Moderate** | Loading page lacks `role="status"`/sr-only text | `app/loading.tsx` |

---

## 11. Recommendations (prioritized)

1. Add skip-to-content link.
2. Wire up form labels (`id`/`htmlFor`), `aria-invalid`, `aria-describedby`, `required`, `role="alert"` on error.
3. Increase placeholder/secondary text opacity to ≥ 70% on dark, ≥ 65% on light.
4. Replace focus-ring color with `forest-deep` (or dual-tone: leaf on dark, forest-deep on light via `prefers-color-scheme` or a JS-set CSS var).
5. Remove `aria-live` from the rotating-word span in Hero.
6. Implement focus trap + ESC + `role="dialog"` `aria-modal="true"` on mobile menu.
7. Add `aria-current="page"` to active nav links.
8. Convert product-detail "Specs / Features / Best for" `<p>` eyebrows into `<h2>`s.
9. Wrap filter buttons in `role="group" aria-label="Filter products"`.
10. Add `aria-hidden="true"` to decorative lucide icons paired with text labels; investigate lucide-react version behavior.
11. Add visually-hidden "opens in new tab" indicator to external `<a target="_blank">` links.
12. Bump footer link line-heights to a min 24px touch target (use `py-1.5` on each link or `min-h-[24px]`).
13. Add `aria-busy={submitting}` to the form submit button.
14. Manage focus after WhatsApp redirect — return focus to the form or to a confirmation summary.
15. Reconsider `mix-blend-mode: difference` on nav — replace with a scroll-driven color swap or backdrop blur to guarantee predictable contrast.
16. Fix `useGsapReveal` to read `matchMedia("(prefers-reduced-motion: reduce)")` before tweening.

---

End of audit.
