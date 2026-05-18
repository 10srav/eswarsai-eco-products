# Technical SEO Audit — Eswar Sai Eco Products

**Stack:** Next.js 16 + App Router + Tailwind 4 + GSAP.
**Domain (canonical):** `https://eswarsaiecoproducts.com`
**Audit date:** 2026-05-18
**Scope:** Metadata, structured data, sitemap/robots, OG image, headings, internal links, canonical, image SEO, security headers, mobile, performance signals.

---

## Severity legend
- **Critical** — blocks ranking / breaks crawl / serves wrong content
- **High** — material impact on rankings or rich results
- **Medium** — best-practice gap, missed opportunity
- **Low** — polish / hygiene

---

## 1. Critical findings

### C-1. Open Graph image `/og.png` does not exist on disk
- **Where:** `lib/seo.ts:9` (`url: ${SITE}/og.png`) and `lib/schema.ts:29` (LocalBusiness `image`) point to `https://eswarsaiecoproducts.com/og.png`.
- **Problem:** `public/` contains only `favicon.svg`, no `og.png`. The `og:image` and `twitter:image` URLs will 404 in production.
- **Caveat / mitigation:** The app DOES export `app/opengraph-image.tsx` (a Next.js convention file) which generates a 1200×630 image at `/opengraph-image` (or similar route). However, `buildMetadata` in `lib/seo.ts:67` *manually overrides* this with the static `/og.png` URL, so Next's auto-discovery is suppressed. Crawlers, Slack/WhatsApp/LinkedIn unfurls, and Twitter cards will reference a missing asset.
- **Fix direction:** Either drop the manual `OG_IMAGE` constant and let `app/opengraph-image.tsx` auto-wire, or generate a real `public/og.png` (1200×630, ≤300 KB).

### C-2. LocalBusiness schema uses incorrect `@type`
- **Where:** `lib/schema.ts:8` — `"@type": "LocalBusiness"`.
- **Problem:** The site is a *manufacturer* (non-woven and jute bags). For Google rich results and entity disambiguation, `LocalBusiness` is the wrong primary type. Should be `Manufacturer` or, more specifically, multi-type: `["LocalBusiness", "Organization", "Manufacturer"]`. Currently search engines may classify it as a generic retail business and weaken topical authority for "manufacturer" queries — exactly the long-tail intent the site targets (e.g. "non woven bag manufacturer in Andhra Pradesh", `lib/seo.ts:48`).
- **Severity rationale:** This is the *primary* business entity declaration; Google rich result eligibility for "Manufacturer" / B2B intent is at stake.

### C-3. No global error/fallback `<Image>` width or fallback for runtime resilience — pages may show broken thumbnails for non-existent paths
- **Where:** `lib/products.ts:134` references `/images/products/non-woven-bag-manufacturer-in-rajkot.jpg` and `lib/products.ts:73` references `/images/products/non-woven-bag.jpg` — both exist on disk, OK. But this is worth tracking because the build does not validate image presence; a single typo silently degrades a product detail page (which is the high-intent ranking page).
- Actual asset map confirmed present at `public/images/products/`. **Not a current bug**; flagged as a process risk only. (Down-graded from High.)

---

## 2. High-severity findings

### H-1. No `Product` schema rich-result completeness for individual product pages
- **Where:** `lib/schema.ts:62-82` (`productSchema`), wired in `app/products/[slug]/page.tsx:144`.
- **Problem:** The schema is *present* but minimal/risky for Google Merchant validation:
  - `lib/schema.ts:75` uses `"AggregateOffer"` with `lowPrice: "1"` and `offerCount: "1"`. A `lowPrice: 1` (INR) is misleading/spammy — Google may reject the markup or apply a manual action under "misleading structured data". For B2B/MOQ products with no public pricing, the correct pattern is **omit `offers` entirely** or use `priceSpecification` with a request-for-quote indicator.
  - No `aggregateRating` or `review` — without one of these, the product won't get review stars, but Google increasingly *requires* either `offers` OR `review`/`aggregateRating` for Product rich snippet eligibility. Current setup: has fake `offers`, no reviews → ineligible AND at risk of being flagged.
  - No `gtin`, `mpn`, or `productID` field — fine for custom-manufactured bags, but combined with the `offers` issue, the structured data signal quality is low.
- **Severity:** Product detail pages are the highest-converting templates for B2B intent; broken rich-result eligibility costs CTR.

### H-2. FAQ schema duplicated on home and contact pages
- **Where:** `app/page.tsx:49` and `app/contact/page.tsx:37` both inject the same `faqSchema` JSON-LD.
- **Problem:** Google's FAQ rich result guidelines state the FAQ schema must reflect FAQs *visible on that specific page*. On the home page, the FAQ content is **not rendered** (only the FAQAccordion on contact renders it via `components/sections/FAQAccordion.tsx`). This is a structured-data policy violation — schema present without visible content. Google may suppress FAQ rich results sitewide or issue a manual action.
- **Fix direction:** Remove the `<JsonLd id="ld-faq" data={faqSchema} />` from `app/page.tsx:49`, OR render `<FAQAccordion />` on the home page.

### H-3. Single `<h1>` per page is enforced — but title hierarchy on home page is weak
- **Where:** `app/page.tsx` + `components/sections/Hero.tsx:184`.
- **Confirmed:** Only one `<h1>` per page across all routes (verified via grep).
- **Sub-issue:** The home `<h1>` text "Replace plastic." + rotating word ("with non-woven.", "with jute.", etc., `components/sections/Hero.tsx:21-27`) is artistic but the **rotation is JS-driven and the DOM contains all five strings stacked**. For search engines (which run JS) the visible text alternates; for crawlers reading initial server HTML, all five `<span>`s are present. This means the `<h1>` effectively renders as:
  > Replace plastic. with non-woven.with jute.with care.with craft.with science.
  
  When concatenated by SSR (`components/sections/Hero.tsx:209-225`). Each rotating word is in a positioned absolute span with `clip-path` hiding inactive ones, but **all five are in the DOM at SSR time**. Google's bot will see this concatenated string — keyword stuffed and unnatural — and may discount the `<h1>` as low-quality.
- **Fix direction:** Server-render only one phrase by default (e.g. "with non-woven.") and rotate via JS on the client only, replacing the textNode.

### H-4. Internal linking — orphan `industry` detail pages
- **Where:** `lib/products.ts:283-290` defines six industries (retail, pharma, fashion, events, fmcg, ecommerce), but there are **no `app/industries/[slug]/` routes**. `components/sections/IndustriesGrid.tsx:71` and `IndustriesPreview.tsx:84` link every industry card to `/industries` (the index), not to a detail page.
- **Problem:** Heavy keyword potential for "pharma bag manufacturer", "FMCG bag supplier", "boutique bag supplier" etc. — all listed in `app/industries/page.tsx:14-26` as keywords — is squandered. No deep internal-link target = no ranking page.
- **Severity:** Six high-intent, low-competition long-tail pages missing.

### H-5. No `BreadcrumbList` for the home page (and inconsistent across pages)
- **Where:** Breadcrumb JSON-LD is wired on `/about` (`app/about/page.tsx:91-97`), `/contact` (`app/contact/page.tsx:38-44`), `/products` (`app/products/page.tsx:44-50`), `/products/[slug]` (`app/products/[slug]/page.tsx:145-152`), `/industries` (`app/industries/page.tsx:40-46`), `/gallery` (`app/gallery/page.tsx:38-44`), `/sustainability` (`app/sustainability/page.tsx:56-62`).
- **Confirmed:** Every page except the root has breadcrumbs. Good. **No breadcrumb is needed on the home page itself** (correct UX — root has no parent). Re-classified as **Low**; the existing setup is correct.
- **Status:** OK after re-review. Moved to "What's working".

### H-6. Sitemap missing `images:image` entries
- **Where:** `app/sitemap.ts:20-25`.
- **Problem:** The sitemap returns only `url`, `lastModified`, `changeFrequency`, `priority`. For a manufacturer with strong visual SEO opportunity (Google Images is a meaningful source of B2B-bag traffic from "non woven bag image" searches), an **Image sitemap extension** (`<image:image><image:loc>` per page) would index product photos faster.
- **Severity:** High because Image SEO is one of the biggest underutilised channels for this vertical.

### H-7. `lastModified: now` on every URL — dishonest signal
- **Where:** `app/sitemap.ts:8` (`const now = new Date()`) — used as `lastModified` for every static and dynamic route.
- **Problem:** Every crawl, every URL appears just-updated. Google quickly learns to ignore `lastmod` when it's a literal "now" on every build. This is a *Trust* signal degradation — better to omit `lastModified` than to lie.
- **Fix direction:** Use real `fs.stat(...).mtime` per page file, or omit the field.

### H-8. No `Strict-Transport-Security` (HSTS) header
- **Where:** `next.config.ts:20-37`. Headers set: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-DNS-Prefetch-Control`. **Missing:** `Strict-Transport-Security`, `Content-Security-Policy`.
- **Problem:** HSTS is part of Google's "secure connection" composite signal and prevents protocol-downgrade. Vercel/Cloudflare may layer HSTS at the edge, but it should be explicit in app config so the contract is owned. CSP missing is a separate security gap (not strictly SEO but Lighthouse-visible).

---

## 3. Medium-severity findings

### M-1. Product image alt text is generic and short
- **Where:** `lib/products.ts:28, 43, 58, 73, 89, 104, 119, 134`.
- **Problem:** Alts read "D-cut non-woven bag", "W-cut non-woven bag", "Classic jute tote", etc. — minimally descriptive. Compare to the gallery alts (`lib/products.ts:145-167`) which are richly specific ("Custom jute tote with KCB logo for The Kakinada Co-operative Town Bank"). Product alts should match this style for image search ranking:
  > Better: "D-Cut non-woven bag — 90 GSM polypropylene with welded die-cut handle, custom-print ready · Eswar Sai Eco Products, Kakinada"
- **Severity:** Medium. Improves image search significantly with minor effort.

### M-2. Product image *filenames* are inconsistent and one is misleading
- **Where:** `lib/products.ts:134` references `non-woven-bag-manufacturer-in-rajkot.jpg` — used as the **Custom-bespoke** product image AND also as the About page hero (`app/about/page.tsx:76`) AND on `app/page.tsx:37`.
- **Problem:** The filename literally says "in Rajkot" — a competitor's city — and the company is in Kakinada. Google reads filenames as ranking signals. This image appears 3+ times site-wide. Rename to e.g. `eswar-sai-non-woven-bag-manufacturer-kakinada.jpg`.
- Other filenames are SKU-ish (`d-cut-non-woven-bags-1-.avif`, `product-jpeg-500x500-1.webp`, `printed-non-woven-carry-bag-f-20240416214534297.jpg`) — opaque and not search-friendly.

### M-3. `metadataBase` is computed but `canonical` is built manually
- **Where:** `lib/seo.ts:37` sets `metadataBase: new URL(SITE)`, then `lib/seo.ts:52` sets `alternates: { canonical: url }` where `url = ${SITE}${path}` (`lib/seo.ts:34`). Functionally correct; minor duplication. The `metadataBase` is otherwise unused since OG URLs are also absolute. Not a bug; flag for future maintenance.

### M-4. Same `keywords` array appears repeatedly with city names
- **Where:** `lib/seo.ts:40-50`, `app/about/page.tsx:17-27`, `app/contact/page.tsx:13-23`, `app/industries/page.tsx:14-26`, etc.
- **Problem:** The `keywords` meta tag is **not used by Google** since 2009 (Yahoo dropped it 2014, Bing devalued it). Bing still reads it but treats keyword stuffing negatively. Repetitive "Vizag bag manufacturer", "Hyderabad bag supplier" across every page is wasted bytes — and *might* trigger Bing's keyword-stuffing classifier. Recommend removing the `keywords` field from `buildMetadata` entirely.

### M-5. `app/not-found.tsx:4` metadata title is too short
- **Where:** `app/not-found.tsx:4` — `export const metadata = { title: "Page not found" }`.
- **Problem:** Won't get the brand suffix via `buildMetadata`. Title in browser tab: "Page not found" (no brand). Better: `metadata = buildMetadata({ title: "Page not found", noindex: true })` to suppress indexing AND keep brand consistency.
- The 404 page is currently *not* `noindex`'d — meaning Google can index 404 fragments as soft-404s.

### M-6. Missing `application/manifest+json` (PWA-style manifest) — no Apple touch icon, no theme-color in `<head>` HTML manifest
- **Where:** `app/layout.tsx:38-47` sets `themeColor` via Viewport, which is correct for Next 16. **Missing:** `apple-touch-icon`, `manifest.webmanifest`. Mobile share-to-home-screen icons fall back to a screenshot.
- **Severity:** Medium for mobile UX, indirect SEO via mobile usability score.

### M-7. `geo.position` and `ICBM` use comma-different formats
- **Where:** `lib/seo.ts:82-83`. `geo.position` uses `;` (semicolon, correct for ISO 6709): `"16.9891;82.2475"`. `ICBM` uses `,` (correct): `"16.9891, 82.2475"`. **Verified correct**, but flagged because it's an unusual pattern.

### M-8. Hero h1 lacks the primary local-intent keyword
- **Where:** `components/sections/Hero.tsx:194` — `<h1>` says "Replace plastic. with [rotating word]."
- **Problem:** The strongest commercial intent keyword is "non-woven bag manufacturer in Andhra Pradesh / India". The home `<h1>` is brand/voice-driven (good for UX) but has zero keyword density for the primary money phrase. There's no `<h2>` immediately following that picks up the SEO slack either — the next prominent heading is `EditorialBreak.tsx:173` with "Built for businesses replacing plastic with purpose" (also not keyword-rich).
- **Trade-off:** This is an editorial choice. If the brand voice is the priority, keep it but compensate via a clear `<h2>` or strong body copy. Currently there is no above-the-fold textual mention of "non-woven bag manufacturer" — only "non-woven and jute bags" (`Hero.tsx:238`).
- **Severity:** Medium because the home page is the primary entity for the brand's local-intent rankings.

### M-9. `app/layout.tsx:51` `<html lang="en">` should be `en-IN`
- **Where:** `app/layout.tsx:51`.
- **Problem:** Schema declares `inLanguage: "en-IN"` (`lib/schema.ts:60`) and OG locale is `en_IN` (`lib/seo.ts:66`), but the HTML `lang` attribute is generic `en`. Inconsistent locale signal. Should be `lang="en-IN"`.

### M-10. Hero rotating words are wrapped in a single line — risk of CLS / mobile overflow
- **Where:** `components/sections/Hero.tsx:201-228`.
- **Problem:** The "invisible" longest-word span (`LONGEST_WORD`, line 207) pre-sizes the container, which prevents layout shift. **Good** — but check line 183: `max-w-[60%]` may clip on small viewports. (Performance agent will measure.) No SEO impact unless CLS > 0.1.

---

## 4. Low-severity / polish

### L-1. Skip-link missing for keyboard accessibility
- **Where:** `app/layout.tsx:57` — `<main id="main">` exists but no `<a href="#main" class="sr-only">Skip to content</a>` link in `Navigation.tsx` or before the nav.
- Impact: A11y / Lighthouse accessibility score, indirect SEO. Add a visually-hidden skip-link to surface for tab users.

### L-2. `robots.ts` does not declare `Disallow: /_next/` or static-asset hygiene
- **Where:** `app/robots.ts:6` — only disallows `/api/`.
- Generally fine; Next handles `/_next/` exclusion. Could add `Disallow: /*?` to prevent query-param URL duplication if filters become URL-driven later. Not urgent.

### L-3. Sitemap `priority` values are arbitrary
- **Where:** `app/sitemap.ts:24`.
- Google has openly stated it ignores `<priority>` since ~2017. Cosmetic only.

### L-4. `app/products/[slug]/page.tsx:18` `generateStaticParams` is good — but no `dynamicParams = false`
- Missing default-false means an unknown slug → soft-404 via `notFound()` (line 38) which is correct. Could add `export const dynamicParams = false;` for clarity, but functionally equivalent.

### L-5. No structured data for `WebPage` per-page
- Site uses `WebSite` once in layout (`lib/schema.ts:52`). Adding `WebPage` schema per page (with `breadcrumb` reference, `mainEntity`, `inLanguage`, `dateModified`) is a minor extra signal but rarely moves rankings. Skip unless going for completionism.

### L-6. Twitter `site:` / `creator:` handle not set
- **Where:** `lib/seo.ts:69-73`. The `twitter` block has `card`, `title`, `description`, `images` but no `site` or `creator` handle (e.g. `@eswarsai`). Useful when Twitter cards are shared. Low impact for B2B.

### L-7. `<video>` lacks `<track>` captions
- **Where:** `components/sections/GalleryShowcase.tsx:111-122` — the `factory-floor.mp4` is muted/autoplay/loop with no captions. Aria-label is present (`aria-label={hero.alt}`, line 121), which helps but doesn't substitute for captions. Accessibility-medium; SEO-low.

### L-8. `lib/products.ts:1` types `Product["category"]` is a union including "Shopping", "Specialty", "Custom" — but Schema.org `category` field expects a free string. Currently passed through (`lib/schema.ts:71`). Consider mapping to `https://schema.org/[Whatever]` URIs. Low impact.

### L-9. No `dateModified` / `datePublished` on Product schema
- **Where:** `lib/schema.ts:62-82`. Adding these helps freshness signals. Minor.

### L-10. Footer "Products" links include exactly 5 product slugs but mix existing and non-existing intents
- **Where:** `components/Footer.tsx:16-22`. All five slugs exist in `lib/products.ts` (`d-cut-non-woven`, `w-cut-non-woven`, `loop-handle`, `classic-jute-tote`, `branded-promotional`). No broken links — verified. Three product slugs (`heavy-duty-shopper`, `drawstring-pouch`, `custom-bespoke`) are NOT linked from the footer — minor internal-linking opportunity loss.

---

## 5. What's working well

- **Per-page metadata:** All 8 routes export unique `metadata` or `generateMetadata`. Confirmed: layout root (`app/layout.tsx:36`), home (uses root), `/about` (`app/about/page.tsx:12`), `/contact` (`app/contact/page.tsx:8`), `/products` (`app/products/page.tsx:8`), `/products/[slug]` (`app/products/[slug]/page.tsx:22`), `/industries` (`app/industries/page.tsx:9`), `/gallery` (`app/gallery/page.tsx:8`), `/sustainability` (`app/sustainability/page.tsx:12`).
- **Single h1 enforced:** One `<h1>` per page. Sectioning uses `<h2>` and `<h3>` correctly.
- **Canonical:** Every page sets `alternates: { canonical: url }` via `buildMetadata` (`lib/seo.ts:52`). No duplicate canonicals.
- **Sitemap covers all routes** including dynamic product detail pages (`app/sitemap.ts:18`).
- **Robots.txt** correctly disallows `/api/`, references sitemap, sets `host` (`app/robots.ts:4-9`).
- **OpenGraph image generator** exists (`app/opengraph-image.tsx`) — though currently bypassed (see C-1).
- **Viewport** is properly set in `app/layout.tsx:38-47` (Next 16 Viewport export pattern).
- **`metadataBase`** correctly set so relative URLs resolve.
- **JSON-LD injection** is XSS-safe — `JsonLd.tsx:7` escapes `<` to `<`.
- **`generateStaticParams`** correctly pre-renders all 8 product detail pages (`app/products/[slug]/page.tsx:18`).
- **`generateMetadata`** for product detail returns `noindex: true` for not-found (`app/products/[slug]/page.tsx:25`) — correct.
- **Image format** preference set to AVIF then WebP (`next.config.ts:12`).
- **Security headers** partial-but-good (`next.config.ts:24-30`): nosniff, frame-deny, referrer-policy, permissions-policy, dns-prefetch.
- **Image cache** is aggressive and correct (`next.config.ts:33-35`) — `max-age=31536000, immutable` for image/font assets.
- **`poweredByHeader: false`** (`next.config.ts:6`) — small fingerprinting reduction.
- **Mobile responsive** — all components use Tailwind responsive utilities; viewport meta is correct.
- **Gallery alt text** is excellent (`lib/products.ts:145-167`) — descriptive, specific, location-aware. Use as the template for product alts (M-1).
- **External links** correctly use `rel="noopener noreferrer"` (e.g. `components/Footer.tsx:107`, `StickyWhatsApp.tsx:13`, `app/products/[slug]/page.tsx:70`).
- **No client-side rendering of body content** that would block SEO — all pages have full server-rendered HTML.

---

## 6. Per-route metadata audit (quick table)

| Route | Title | Description | Canonical | OG | Breadcrumbs | h1 count | Notes |
|---|---|---|---|---|---|---|---|
| `/` | Default brand title (`lib/seo.ts:5`) | shortDescription | OK | OK (broken — see C-1) | N/A (root) | 1 | Bad FAQ schema (H-2), keyword-stuffed h1 (H-3) |
| `/about` | "About" | unique | OK | OK | yes | 1 | Image filename misleading (M-2) |
| `/contact` | "Contact" | unique | OK | OK | yes | 1 | FAQ schema OK (visible) |
| `/products` | "Products" | unique | OK | OK | yes | 1 | productListSchema present |
| `/products/[slug]` | product name | shortDesc | OK | per-product image | yes | 1 | Bad `offers` (H-1) |
| `/industries` | "Industries we serve" | unique | OK | OK | yes | 1 | No detail pages (H-4) |
| `/gallery` | "Gallery" | unique | OK | OK | yes | 1 | OK |
| `/sustainability` | "Sustainability" | unique | OK | OK | yes | 1 | OK |
| `/404` (not-found) | "Page not found" | none | n/a | n/a | n/a | 1 | NOT noindex'd (M-5) |

---

## 7. Recommended remediation order

1. **C-1** — Generate or auto-route a real `og.png` (or rely on `app/opengraph-image.tsx`).
2. **C-2** — Expand LocalBusiness `@type` to `["LocalBusiness", "Manufacturer"]`.
3. **H-1** — Remove fake `offers.lowPrice: "1"`; use proper "quote request" pattern or drop `offers`.
4. **H-2** — Remove duplicate FAQ schema from `app/page.tsx`.
5. **H-3** — Server-render only one variant of the rotating word.
6. **H-4** — Add `app/industries/[slug]/page.tsx` for 6 industry detail pages.
7. **H-6 + H-7** — Add image entries to sitemap; replace fake `lastModified`.
8. **H-8** — Add HSTS header.
9. **M-1, M-2** — Rewrite product alts, rename `non-woven-bag-manufacturer-in-rajkot.jpg`.
10. **M-5, M-9** — Add `noindex` to not-found page; switch `lang` to `en-IN`.
11. Rest of M and all L items as polish.

---

## 8. Notes for the perf agent (out of this audit's scope)

- Hero `<HeroBag>` (`components/sections/HeroBag.tsx`) sets `priority` on all 5 slide images (`line 416`) — this is **incorrect** and will hurt LCP. Only the first slide should be `priority`. Pass to perf audit.
- GSAP, Lenis, multiple ScrollTriggers, and a smooth-scroll wrapper — JS bundle and INP are likely the perf bottleneck, not SEO directly.
- AVIF/WebP formats are configured, good for Lighthouse Performance.

---

End of audit.
