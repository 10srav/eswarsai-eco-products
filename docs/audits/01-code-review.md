# Eswar Sai Eco Products — Code Review Audit

Scope: `app/`, `components/`, `lib/`, `animations/`, `next.config.ts`, `vercel.ts`, `app/api/enquire/route.ts`.
Method: high-confidence (>80% sure) findings only. No code changed.
Files examined: ~50 TS/TSX files.

---

## CRITICAL (real bug / data loss / correctness regression)

### C1. `app/api/enquire/route.ts:1-43` — public unauthenticated endpoint with no abuse mitigation
The POST handler accepts arbitrary lead submissions from any origin, has no rate limiting, no Origin/Referer check, no CSRF token, and no CAPTCHA. The route logs whatever the client sends to stdout (`console.log("[enquiry]", JSON.stringify(lead))`). Combined with the form being entirely client-side, the endpoint is open to:
- Automated spam flooding `console.log` (and any future KV/email integration) at zero cost.
- Cross-origin POST since no Origin check exists.

Fix: Before merging real lead capture (KV/DB/email), add (a) IP-based rate limit (e.g. Vercel Edge KV `incr` with TTL), (b) Origin allowlist for `eswarsaiecoproducts.com`, (c) honeypot field or hCaptcha. At minimum the Origin check is a one-line guard.

### C2. `components/sections/EnquireForm.tsx:43-74` — form treats fetch failure as success and silently opens WhatsApp
`onSubmit` does `await fetch("/api/enquire", ...).catch(() => null)` and then unconditionally opens WhatsApp and resets the form. Two consequences:
1. If `/api/enquire` returns 422 (validation failed) or 500, the user never learns — the toast says "Opening WhatsApp…" and the form resets. The lead is lost server-side but the user assumes it was captured.
2. The `try` block can never enter `catch` because the only async call has its own `.catch`. The outer error toast is dead code.

Fix: Inspect `res.ok` from fetch (no `.catch`), surface a real error toast on non-2xx, and only reset the form on success.

---

## HIGH (correctness risk / leak / TS hole)

### H1. `components/ui/Counter.tsx:65-91` — GSAP tween leaks past unmount
The `gsap.to(obj, { ... })` started inside `startAnim` is not stored or killed in the cleanup function. The cleanup only kills the ScrollTrigger (`trigger.kill()`). If the user navigates away mid-animation, the tween continues running `onUpdate` and writes `numEl.textContent` on a detached DOM node until duration completes. Repeated mounts (e.g., filter toggles, route changes) accumulate orphan tweens.

Fix: Assign the tween to a ref (`tweenRef.current = gsap.to(...)`) and kill it in the cleanup alongside `trigger.kill()`.

### H2. `components/sections/HeroBag.tsx:412-422` — every carousel slide loads with `priority`
All five slides in the rotator are rendered as `<Image priority />`. `priority` instructs Next.js to skip lazy-loading and preload. Only the first slide is above the fold initially; preloading the other four delays LCP and wastes bandwidth on mobile (slides 2-5 will not be needed for ~4.5s each).

Fix: Set `priority` only when `i === 0`; let the other slides lazy-load (Next will still load them in time because they swap in JS).

### H3. `components/decor/SmoothScroll.tsx:41-52` — dead `fontsCleanup` variable conceals a never-disconnected font listener
`fontsCleanup` is declared as `let ... | undefined` and called in cleanup, but is never assigned. The `document.fonts.ready.then(...)` Promise has no cancellation hook — if the component unmounts before fonts resolve, `ScrollTrigger.refresh()` is invoked on a dead instance. Low practical impact (refresh is idempotent), but the declared variable advertises an intent that was not implemented.

Fix: Either remove the `fontsCleanup` declaration and the corresponding call, or implement it with an `aborted` flag wrapped around `.then((() => { if (!aborted) ScrollTrigger.refresh(); }))`.

### H4. `components/ui/SplitText.tsx:94` — `ref as never` defeats type safety
`<Tag ref={ref as never}>` uses `never` to silence TypeScript. The `as` is a TypeScript hole hiding the fact that `Tag: ElementType` can be any HTML element while `ref: RefObject<HTMLElement>` is hard-typed. If `Tag` is changed to a non-DOM element type (e.g. a custom component without forwardRef), the runtime would silently fail.

Fix: Constrain the prop type — e.g. `as?: keyof JSX.IntrinsicElements` — and remove the `as never`.

### H5. `lib/seo.ts:38` & `app/products/[slug]/page.tsx:22-33` — exported async function lacks an explicit return type
`generateMetadata` returns `buildMetadata(...)` whose declared return is `Metadata`, but the wrapping `async` function has no explicit `Promise<Metadata>` return type. Combined with `buildMetadata`'s implicit return signature, the public API surface is not contract-locked. This is a maintainability hole rather than a runtime bug — but the audit brief flagged missing return types on exported APIs as in-scope.

Fix: Add `: Promise<Metadata>` to `generateMetadata` and `: Metadata` to `buildMetadata`.

---

## MEDIUM (maintainability / dead code / repeated pattern)

### M1. Dead exports / unused components — keep the tree honest
The following are exported but imported by zero files:
- `components/sections/PullQuote.tsx` (entire file)
- `components/sections/GalleryStrip.tsx` (entire file; superseded by `GalleryPreview` + `GalleryShowcase`)
- `components/sections/ProductsRail.tsx` (entire file; superseded by `ProductsPreview` + `ProductsFilterableGrid`)
- `animations/hooks/useGsapReveal.ts` (entire file)
- `animations/hooks/useParallax.ts` (entire file)

Verified by grep across `app/` and `components/`. These add bundle weight only if tree-shaking misses them, but they are pure maintenance debt.

Fix: Delete the files. If kept for "soon", add a comment with the planned re-introduction date.

### M2. `data-cursor` attributes are orphans after CustomCursor removal
Commit `c1e8646` removed the custom cursor, but 13 components still set `data-cursor="link"|"view"|"drag"` (Hero, ProductCard, IndustriesGrid, IndustriesPreview, GalleryPreview, GalleryStrip, ProductsFilterableGrid, ProductsPreview, ProductsRail, Navigation, MagneticButton via `...rest`). Nothing reads these attributes. They are noise in the DOM and noise in code review diffs going forward.

Fix: Sweep `data-cursor=` and delete attribute occurrences. About 13 lines.

### M3. `ensureRegistered()` pattern duplicated in 18 files
Every GSAP-using component repeats this exact 6-line block:
```ts
let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}
```
Files: Footer, Counter, SplitText, IndustriesGrid, IndustriesPreview, IndustriesDetail, ProductsFilterableGrid, ProductsPreview, ProductsRail, ProductCard, ProcessSteps, StoryPanels, GalleryPreview, GalleryShowcase, GalleryStrip, Timeline, SustainabilityManifesto, EditorialBreak, ProductsRail, SmoothScroll, Hero, HeroBag, useGsapReveal, useParallax.

Each file declares its own module-level `let registered` so the protection is per-module, not global. The function is correct but should live in one place.

Fix: Move to `lib/gsap.ts` exporting a single `ensureScrollTrigger()` and import it everywhere.

### M4. `components/sections/EnquireForm.tsx:122-187` — form inputs lack `id` + `htmlFor` and `aria-invalid`
The `Field` component wraps `<input>` in `<label>` with no `htmlFor`. Wrap-association does work in most screen readers, but error messages are rendered as visual-only `<span>` siblings — they are not linked to the input via `aria-describedby`, and inputs in error state don't have `aria-invalid="true"`. Screen reader users won't hear the error after submitting.

Fix: Use `useId()` to generate per-field IDs, pass to `<input id={fieldId}>` and `<label htmlFor={fieldId}>`. Add `aria-invalid={!!error}` and `aria-describedby={error ? errorId : undefined}` with a matching id on the error span.

### M5. `app/api/enquire/route.ts:9` & `components/sections/EnquireForm.tsx:17` — divergent validation schemas
The Zod schemas on the client (`EnquireForm.tsx`) and server (`route.ts`) are similar but not identical:
- Server caps `requirement` at 160 chars; client has no max.
- Server caps `quantity` at 80; client has no max.
- Server caps `notes` at 800; client has no max.
- Server caps `name` at 120; client has no max.

A client-bypass attacker (or a benign user pasting 1000 chars) gets a 422 from the server, but the client treats the request as success (see C2). Even after C2 is fixed, two sources of truth for the same data shape will drift.

Fix: Extract the schema to `lib/enquire-schema.ts` and import on both sides.

### M6. `components/Footer.tsx:39-48` — uses `el.parentElement!` non-null assertion
The footer parallax ScrollTrigger uses `trigger: el.parentElement!`. If the surrounding markup changes such that the parent is hidden or removed, the bang asserts away a real possibility. There is only one usage, but the pattern is risky.

Fix: Capture `const parent = el.parentElement; if (!parent) return;` and pass `parent`.

### M7. `components/sections/StoryPanels.tsx:81-82` — `bad.parentElement!` and `good.parentElement!` non-null assertion
Same pattern as M6 — `gsap.from(bad.parentElement!, ...)`. Within `useEffect` the elements exist, but the bang is unnecessary and disguises the assumption.

Fix: Read the parent once into a local, guard, then animate.

---

## LOW (polish / nice-to-have)

### L1. `components/sections/EnquireForm.tsx:9-17` — phone regex `i` flag is meaningless
`/^[+0-9\s\-()]{7,}$/i` — there are no letters in the character class, so case-insensitivity is a no-op. Cosmetic.

### L2. `components/sections/HeroBag.tsx:33-39` — pseudo-random particle layout uses deterministic modular math but the comment doesn't explain why
`(i * 13 + 9) % 96` etc. are intentionally deterministic so SSR and client render the same DOM. A one-line comment ("deterministic on purpose; avoids SSR/CSR hydration drift") would help future maintainers not "improve" it to `Math.random()`.

### L3. `components/Footer.tsx:114` — `new Date().getFullYear()` rendered in a client component
At year rollover the server-rendered year could differ from the client value. Probability is microscopic (a few seconds on Dec 31 / Jan 1), but trivially fixable.

Fix: Hardcode the year (`2026`) or render the entire copyright row inside an effect after mount.

### L4. `components/sections/GalleryShowcase.tsx:50` — no `prefers-reduced-motion` change listener
Reduced-motion state is read once. If the user toggles OS-level motion preference after page load, the autoplaying factory video keeps playing. Minor.

### L5. `app/api/enquire/route.ts:40` — structured log writes PII to stdout
Logging the lead body (name, phone, business) to `console.log` is fine for a placeholder but should not survive into production. The TODO is already in the comment ("replace with KV/DB/email integration"); flagging here so it doesn't slip through.

### L6. `components/sections/Hero.tsx:172-176` — `suppressHydrationWarning` used correctly but the dual-text strategy is verbose
The two fallback strings (`"LIVE"` and `"KAKINADA"`) are placeholders shown for one frame on the server render. This is fine, but the same pattern could be expressed via `useSyncExternalStore` for a more idiomatic SSR-safe live value.

### L7. `components/Navigation.tsx:35` — `mix-blend-mode: difference` on a fixed nav with text-cream may produce unreadable contrast over white sections
At runtime over light backgrounds (e.g. `bg-bone`, `bg-cream`) the difference blend produces dark text — usually fine. Over busy gradient hero sections it can produce mid-grey on mid-green and fail WCAG. Code-level concern only; the dedicated a11y agent owns visual checks.

---

## NOT FOUND (good news)

- No hardcoded secrets in `app/`, `components/`, `lib/`, `animations/`.
- No `any` or `as any` casts in scope (only the one `as never` in SplitText, see H4).
- No SQL/command injection surfaces — there is no database or shell call.
- All GSAP `useEffect` hooks return cleanup that kills the relevant tweens/triggers, with the single exception of H1 (`Counter`).
- All client-only state initialised inside `useEffect` to avoid hydration mismatch; the `Hero` status block uses `suppressHydrationWarning` correctly.
- No bare `except:` (Python) or unhandled `.unwrap()` (Rust) — not applicable, but the equivalent (`!`, `as any`) is rare.

---

## Files examined

`app/layout.tsx`, `app/page.tsx`, `app/loading.tsx`, `app/not-found.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `app/api/enquire/route.ts`, `app/about/page.tsx`, `app/sustainability/page.tsx`, `app/industries/page.tsx`, `app/gallery/page.tsx`, `app/contact/page.tsx`, `app/products/page.tsx`, `app/products/[slug]/page.tsx`, `app/globals.css`, `next.config.ts`, `vercel.ts`, `tsconfig.json`, `package.json`,
`components/Navigation.tsx`, `components/Footer.tsx`, `components/Container.tsx`, `components/JsonLd.tsx`, `components/StickyWhatsApp.tsx`,
`components/decor/Grain.tsx`, `components/decor/ScrollProgress.tsx`, `components/decor/SmoothScroll.tsx`,
`components/ui/Counter.tsx`, `components/ui/MagneticButton.tsx`, `components/ui/SplitText.tsx`, `components/ui/Toast.tsx`,
`components/sections/*` (all 24 files),
`lib/company.ts`, `lib/products.ts`, `lib/schema.ts`, `lib/seo.ts`, `lib/utils.ts`,
`animations/hooks/useGsapReveal.ts`, `animations/hooks/useMagneticButton.ts`, `animations/hooks/useParallax.ts`.
