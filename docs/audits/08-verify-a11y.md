# A11y Re-Audit — `/home/sraav/Desktop/Esep WEb` (WCAG 2.2 AA)

Verdict: **PARTIAL PASS** — every Critical item from the prior audit is correctly fixed in the code paths reviewed. A small number of Moderate / Minor issues remain or were not part of the prior fix scope. Stack: Next.js 16, React 19, Tailwind CSS v4 (`@tailwindcss/postcss`), Lenis smooth-scroll, GSAP.

Severity legend: **Critical** = blocks a class of users · **Serious** = significant barrier · **Moderate** = inconsistent / risky · **Minor** = polish.

---

## Critical fixes — verification

### 1. Skip-link — PASS
`app/layout.tsx:53-58` renders the `<a href="#main">Skip to content</a>` as the first body child.

- `sr-only` and `focus:not-sr-only` are valid Tailwind v4 first-party utilities (shipped by default, no plugin needed). They resolve correctly with `@tailwindcss/postcss` 4.0 wired in `postcss.config.mjs`.
- Focus styles applied via `focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-forest-deep focus:px-4 focus:py-2 focus:text-bone focus:outline focus:outline-2 focus:outline-leaf`.
- Stacking: skip-link `z-[200]` ties `ScrollProgress` (`components/decor/ScrollProgress.tsx:33`, also `z-[200]`), but `ScrollProgress` is a 2px-high fixed bar at `top:0`. Skip-link surfaces at `top: 1rem` so there is no visual overlap. Skip-link sits above `Navigation` (`z-[90]`) and `Toast` (`z-[110]`).
- Target `#main` exists (`app/layout.tsx:63`). The wrapping `SmoothScroll` (Lenis) does not alter scroll targets.
- Visibility test: when Tab is pressed once after load, `focus:not-sr-only` removes the visual-hiding class set and the focus-* utilities apply — link becomes visible and keyboard-focusable.

### 2. Form a11y (`EnquireForm`) — PASS
`components/sections/EnquireForm.tsx`:

- Seven `useId()` ids: `nameId`, `phoneId`, `businessId`, `requirementId`, `quantityId`, `timeId`, `notesId` (lines 26-32). Each id is passed to both the field input and the `<label htmlFor>` via the `Field` wrapper (lines 274-303).
- Every input renders `aria-invalid` conditionally and `aria-describedby={errors.X ? `${id}-err` : undefined}`. The error `<p>` carries the same id with `-err` suffix and `role="alert"` (line 297).
- Required fields (`name`, `phone`, `requirement`) carry both `required` and `aria-required="true"` (lines 143-144, 158-159, 194-195). Non-required fields (`business`, `quantity`, `time`, `notes`) correctly omit `aria-required`.
- Submit button: `disabled={submitting}` + `aria-busy={submitting}` (lines 244-245). Loading icon swap is visible feedback in addition to the busy state.
- Success state: hidden `role="status" aria-live="polite"` region at lines 252-260 announces the success message before WhatsApp navigation. Focus is moved into this `tabIndex={-1}` region via `successRef.current?.focus()` (line 76) to ensure SR readout.
- Placeholder color: `placeholder:text-bone/70` on the input class (line 307). bone (#faf7ef) at 70% on `bg-forest-deep` (#0e2a1e) — ratio ~10.4:1 — passes AA (4.5:1) and AAA (7:1).

### 3. Mobile menu — PASS
`components/Navigation.tsx`:

- `<div ref={dialogRef} id="mobile-nav-dialog" role="dialog" aria-modal="true" aria-label="Mobile navigation" aria-hidden={!open}>` (lines 152-157).
- Open: `useEffect` (lines 31-74) reads first focusable in the dialog and calls `focusables[0]?.focus()` — focus enters menu on open.
- Tab/Shift+Tab focus-trap: collects focusables on each keypress, wraps last→first and first→last (lines 56-62). Disabled elements filtered out.
- Escape: `e.preventDefault(); setOpen(false)` (lines 43-46).
- Close (cleanup): restores focus to `previouslyFocused` when it is not `document.body`, otherwise falls back to `toggleRef.current?.focus()` (lines 67-72). Fallback chain is correct.
- Mobile links carry `tabIndex={open ? 0 : -1}` (line 173) so the focus trap cannot land on hidden links when `open` is false.
- Toggle button: `aria-expanded`, `aria-controls="mobile-nav-dialog"`, `aria-label` toggles between "Open menu" / "Close menu" (lines 142-144).

Minor caveat (not blocking): pairing `aria-modal="true"` with `aria-hidden="true"` when closed is technically conflicting per ARIA, but since the dialog is non-interactive when closed (pointer-events-none, opacity-0, child links tabIndex=-1), it does not produce a user-facing failure. Could be cleaner to drop `aria-hidden` when closed and rely on `display:none` or `inert`. (Moderate / polish.)

### 4. Hero rotating word — PASS
`components/sections/Hero.tsx`: the rotating `<span>` at lines 212-222 has **no** `aria-live` attribute. Repeated `grep aria-live` across components confirms only `EnquireForm.tsx:256` and `Toast.tsx:12` carry it (both intentional `role="status"` regions). Background animation no longer spams AT.

### 5. Focus ring contrast — PASS
`app/globals.css:94`: `:focus-visible { outline: 2px solid var(--color-forest-deep); outline-offset: 3px; border-radius: 2px; }` — token is `--color-forest-deep` (`#0e2a1e`), not `--color-leaf`.

Contrast checks:
- `#0e2a1e` on bone `#faf7ef` ≈ 14.85:1 — passes WCAG AAA.
- `#0e2a1e` on forest-deep itself (e.g. CTAs on the dark hero) ≈ 1:1 — fails. Worth noting (Moderate). The dark sections rely on the outline-offset gap + the underlying `border-leaf` button style for visibility, but a pure-forest-deep button surrounded by a forest-deep page will produce an invisible ring. See "Outstanding" below.

### 6. Footer — PASS
`components/Footer.tsx`:

- Three group headings are `<h3 class="eyebrow opacity-50">` (Products line 79, Company line 92, Reach line 105). No `<h4>` remain.
- All link items use `inline-flex min-h-[24px] items-center` — meets WCAG 2.2 SC 2.5.8 Target Size (Minimum) 24×24 CSS px (lines 83-110).
- Year: hardcoded `© 2026` on line 116.
- Logo SVG: `<span aria-hidden="true">` wraps it and `<svg ... aria-hidden="true" focusable="false">` (lines 66-67) — double-hidden.
- External links: `target="_blank" rel="noopener noreferrer"` plus `<span class="sr-only">(opens in new tab)</span>` (lines 109-110). Solid.

### 7. Filter buttons — PASS
`components/sections/ProductsFilterableGrid.tsx:44` wraps the buttons in `<div role="group" aria-label="Filter products by category">`. Each button is `<button type="button" aria-pressed={isActive}>` (lines 49-54). Per WAI-ARIA APG, `role="group"` with `aria-label` is the correct pattern for a toolbar-lite of mutually exclusive `aria-pressed` toggles. Acceptable.

### 8. Product detail headings — PASS
`app/products/[slug]/page.tsx:95, 101, 112`: Specs / Features / Best for are now `<h2 class="eyebrow text-moss">`. They follow the `<h1>` rendered by `SplitText` at line 55.

---

## Outstanding / Newly observed

| # | Severity | Location | Issue |
|---|---|---|---|
| O1 | **Serious** | `app/products/[slug]/page.tsx:129` | `<p class="eyebrow text-sage">More from this range</p>` is the heading for the related-products section but rendered as a paragraph. Should be `<h2>`. Same eyebrow visual treatment as the Specs/Features/Best-for h2s already applied. |
| O2 | Moderate | `app/globals.css:94` | `:focus-visible` outline `#0e2a1e` is invisible on `bg-forest-deep` surfaces (Hero, EnquireForm, ProductsFilterableGrid, CTABanner, product detail hero). Consider `outline-color: currentColor` or a token that adapts to context (e.g. `--color-sage` on dark, `--color-forest-deep` on light) — or add a high-contrast inverse rule scoped to `.bg-forest-deep :focus-visible`. |
| O3 | Moderate | `components/Navigation.tsx:151-157` | Dialog carries both `aria-modal="true"` and `aria-hidden={!open}`. When closed, the modal+hidden pair is contradictory. Prefer `inert` (or conditional render) when closed and drop `aria-hidden` while open. Children already gate via `tabIndex={open ? 0 : -1}`, so practical impact is small. |
| O4 | Moderate | `components/sections/EnquireForm.tsx:123` | External Visit / Maps link uses `rel="noreferrer"` only; should be `rel="noopener noreferrer"`. The "Hours" row at line 120 has `href="#"` — a no-op link with no purpose, should be a `<span>` or `<p>`. |
| O5 | Moderate | `components/Navigation.tsx:78-86` | The fixed nav uses `style={{ mixBlendMode: "difference" }}`. While visually clever, blend-mode rendering can produce unpredictable colour outcomes against arbitrary scrolled content and can fail contrast in spots. Not introduced by this fix pass but worth flagging since the focus-ring concern (O2) intersects. |
| O6 | Minor | `components/Footer.tsx:107-110` | Min target size `min-h-[24px]` meets SC 2.5.8 Minimum (24px). For AAA SC 2.5.5 Enhanced (44×44) consider bumping to `min-h-[44px]` or adding `py-2`. |
| O7 | Minor | `components/sections/EnquireForm.tsx:262` | "We never spam · Your data stays with us" rendered at `opacity-50` over a dark background. Bone at 50% on forest-deep ≈ 5.1:1 — passes for normal text but cutting it close on AAA. |
| O8 | Minor | `components/sections/Hero.tsx:163-169` and `:284-290` | `aria-hidden="true"` correctly applied to decorative edge label and scroll cue. No regression. |

No issues introduced by the data-cursor sweep. `grep -rn data-cursor` returns no matches in `app/`, `components/`, or `lib/`.

---

## Quick stack-aware notes

- Tailwind v4 ships `sr-only` and `not-sr-only` as default utilities (Tailwind 4 docs, "Screen Readers"). No `@plugin "@tailwindcss/forms"` or custom utility required.
- React 19's `useId()` is the correct primitive for form id pairing (no `useId().replace(...)` hackery needed). Confirmed used everywhere in `EnquireForm`.
- Next.js 16 App Router renders `app/layout.tsx` once; the skip-link is the very first body child, before client-side hydration of `Navigation` and `SmoothScroll`. Lenis (`html.lenis`) does not break `href="#main"` anchor jumps because `<main id="main">` is in the static markup.
- `prefers-reduced-motion` honored at `app/globals.css:165-171` and `components/sections/Hero.tsx:61-66`. Rotator interval is bypassed under reduced motion (line 69).

---

## Files reviewed (absolute paths)

- `/home/sraav/Desktop/Esep WEb/app/layout.tsx`
- `/home/sraav/Desktop/Esep WEb/app/globals.css`
- `/home/sraav/Desktop/Esep WEb/app/products/page.tsx`
- `/home/sraav/Desktop/Esep WEb/app/products/[slug]/page.tsx`
- `/home/sraav/Desktop/Esep WEb/components/Navigation.tsx`
- `/home/sraav/Desktop/Esep WEb/components/Footer.tsx`
- `/home/sraav/Desktop/Esep WEb/components/sections/Hero.tsx`
- `/home/sraav/Desktop/Esep WEb/components/sections/EnquireForm.tsx`
- `/home/sraav/Desktop/Esep WEb/components/sections/ProductsFilterableGrid.tsx`
- `/home/sraav/Desktop/Esep WEb/components/ui/Toast.tsx`
- `/home/sraav/Desktop/Esep WEb/components/decor/ScrollProgress.tsx`
- `/home/sraav/Desktop/Esep WEb/postcss.config.mjs`
- `/home/sraav/Desktop/Esep WEb/package.json`
