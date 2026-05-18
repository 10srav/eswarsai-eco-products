# Verification Audit — Eswar Sai Eco Products

**Scope**: Read-only verification of 60+ fixes applied across code review, security, a11y, SEO, perf, and build domains on the Next.js 16 + React 19 marketing site at `/home/sraav/Desktop/Esep WEb`.

**Build status**: `pnpm type-check` PASS · `pnpm build` PASS (20 pages, no warnings).

---

## Per-File Verdicts (in order requested)

### 1. `lib/enquire-schema.ts` — CLEAN

Single source of truth confirmed.

- Both `app/api/enquire/route.ts:2` and `components/sections/EnquireForm.tsx:12` import from `@/lib/enquire-schema`. No drift, no duplicate Zod definitions elsewhere (`grep -rn "enquireSchema"` returns only these 5 lines).
- Exports `enquireSchema` (Zod object) and inferred `EnquireInput` type.
- Validation rules are reasonable: name 2-120, phone regex `^[+0-9\s\-()]{7,}$`, requirement required, optional fields nullable with `max()`.

**Minor**: phone regex allows 7+ characters of mixed digits/separators. A user entering `+()()  ` (7 spaces/brackets) would pass length but produce 0 digits. Server-side `maskPhone()` handles this (returns `""`), so no crash, but it is a permissive boundary.

### 2. `app/api/enquire/route.ts` — MOSTLY CLEAN, two concerns

**Rate limit logic (lines 14-30) — correct**:
- 5 requests succeed (count progresses 1→2→3→4→5), 6th returns 429. No off-by-one.
- No race condition inside a single Node instance: the JS event loop is single-threaded and the check + increment is synchronous. Across serverless instances, no shared state — the comment correctly warns.

**Phone masking (lines 32-40) — handles all advertised edge cases**:
- Empty string → `""` (no crash)
- ≤3 digits → only stars (no leak)
- 4-10 digits (no country code) → `*******210` style (last 3 visible)
- >10 digits → `+XX *********YYY`
- Truth-tabled against the bracket comment.

**MEDIUM — `sanitizeText` regex on line 44 is broken/dead**:
```ts
return value.replace(/[\r\n]+/g, " ").replace(/ -/g, " ").trim();
```
The `/ -/g` (space-dash) replacement is too narrow to be useful as CSV-injection or formula guard, and the data is never written to a CSV anyway — only `console.log`'d. This looks like leftover code from a different intent. **Risk**: confusing logic that doesn't do what it appears to attempt. **Fix**: drop the second `.replace()` or replace with explicit Excel-formula sanitization (`/^[=+@\-\t]/` strip) if needed.

**LOW — Origin allowlist (lines 55-62)**: correctly enforces in production, bypasses in dev (documented). Modern browsers always send `Origin` on POST, so a real browser request without `Origin` is unlikely; cURL/server-to-server probes get rejected, which is desired.

**LOW — Rate-limit bucket map never pruned**: `rateLimitBuckets.set` overwrites or refreshes, but entries from past IPs that don't return live forever in long-lived processes. Acknowledged in the comment ("replace before scale"), but worth a `setInterval` cleanup if this ever moves beyond serverless.

### 3. `components/sections/EnquireForm.tsx` — CLEAN

**`useId()` uniqueness (lines 26-32) — verified**: 7 separate `useId()` calls each produce a distinct stable ID per instance. Template-literal pattern ``${nameId}-err`` for `aria-describedby` is correct. Multiple form instances on the same page would not collide.

**Aria wiring (lines 145-197)**: `aria-invalid`, `aria-required`, `aria-describedby` set correctly on the 4 required fields. The `aria-describedby` is conditional on `errors.<field>` truthy, which means screen readers won't get a dangling reference to an empty error region.

**Error flow (lines 50-60)**: clean — status-aware messages for 422/429/other.

**Success flow (lines 62-82)**: success toast plus an sr-only `role="status"` `aria-live="polite"` region (line 252-260). Focusing the sr-only div is defensive; the `aria-live` region would announce regardless, so the `focus()` call is "belt and suspenders" — informational only.

**LOW — double-submit window (line 86-87)**: `setSubmitting(false)` fires in `finally` *before* the 700ms setTimeout. Button is clickable while toast is visible. Adding a 700ms-await before flipping `setSubmitting(false)` would close this. Not introduced by the audit.

**LOW — line 123 missing `noopener`**: `target={... ? "_blank" : undefined} rel="noreferrer"` — modern browsers default to `noopener` implicitly on `_blank`, so not a security issue, but inconsistent with the rest of the codebase (`Footer.tsx`, `MagneticButton.tsx`, `StickyWhatsApp.tsx` all use `noopener noreferrer`).

**No dead code observed** in the error/success flow.

### 4. `components/Navigation.tsx` — CLEAN

**Focus trap correctness (lines 31-74)**:

- Listener (`onKeyDown`) is added/removed on every `open` change via the dependency array. **No leak**: when `open` flips to false, cleanup removes the keydown listener before the next effect (which short-circuits at line 32).
- **Re-render survives**: the focusables list is re-queried *inside* `onKeyDown` (lines 49-51), so adding/removing dialog children between tab presses works correctly.
- **Escape handling**: calls `setOpen(false)`, which triggers cleanup → removes listener → restores focus. No leak path.
- **Initial focus**: `focusables[0]?.focus()` is the first call; if no focusables exist (e.g., menu items still hydrating), nothing happens — graceful.
- **Focus restoration**: cleanup either re-focuses `previouslyFocused` (if not body) or `toggleRef` — works regardless of dialog content state.

**Minor**: the inner `<Link tabIndex={open ? 0 : -1}>` (line 173) makes items unreachable when closed, complementing `aria-hidden`. Good defense-in-depth.

### 5. `components/sections/Hero.tsx` — CORRECT SSR STRATEGY

**Single-phrase SSR (lines 213-222)**:

```tsx
key={mounted ? activeWord : "ssr"}
{ROTATING_WORDS[mounted ? activeWord : 0]}
```

- Server: `mounted=false` → renders only `ROTATING_WORDS[0]` (`"with non-woven."`) with `key="ssr"`.
- Crawler sees one phrase, not five concatenated.
- After hydration `mounted` flips true (line 56-57), `activeWord` still 0, no visual jump.
- The invisible `LONGEST_WORD` placeholder (line 210) reserves layout width — `LONGEST_WORD` equals `"with non-woven."` (15 chars), which is also the longest entry. No layout shift after rotation.

**Hydration safe**: `suppressHydrationWarning` on the IST clock (line 178, 182) handles the timezone-dependent string.

### 6. `components/sections/HeroBag.tsx` — CORRECT

**Priority loading (lines 412-417)**:

```tsx
priority={i === 0}
loading={i === 0 ? "eager" : "lazy"}
```

Only the first slide (`esep-001`, 120 gsm loop-handle) eager-loads. The other 4 lazy-load. LCP image is the hero bag → correct.

**Minor**: 5 simultaneously positioned `Image` components stacked. Even with `loading="lazy"`, the lazy ones may still be fetched on hydration if they're inside the viewport. Next.js handles this with intersection observers — fine.

### 7. `components/ui/Counter.tsx` — TWEEN CLEANUP IS SOUND

**Cleanup pattern (lines 92-96)**:

```ts
return () => {
  tweenRef.current?.kill();
  tweenRef.current = null;
  trigger.kill();
};
```

- `tweenRef.current?.kill()` safely kills in-progress GSAP tween (idempotent if already complete).
- `trigger.kill()` removes the ScrollTrigger instance and listeners.
- Setting `tweenRef.current = null` prevents stale reference.

`started` flag is a local variable scoped to each effect run — no cross-instance contamination.

**LOW — redundant deps**: `finalLabel` is in the dep array even though it's derived from `prefix + formatNum(value, decimals, format)`, all of which are *also* in the dep array. Removing `finalLabel` from deps would be cleaner but harmless.

### 8. `components/ui/SplitText.tsx` — CAST IS A KNOWN SMELL

**Line 96**: `<Tag ref={ref as unknown as React.Ref<HTMLHeadingElement>} className={cn(className)}>`

The `as unknown as` double-cast indicates TypeScript can't resolve the generic ref type because `Tag` is a `string` union. Cleaner patterns exist:

1. **Best**: type `ref` as `React.Ref<HTMLElement>` directly via `useRef<HTMLElement>(null)` (already done) and cast only once: `ref={ref as React.Ref<HTMLElement>}`. The `as unknown` is unnecessary because `React.Ref<HTMLElement>` is assignable to all `Ref<HTMLHeadingElement | ...>` variants in practice.
2. **Cleaner generic**: introduce a generic type param `<T extends SplitTag = "h2">` and infer the element type from `JSX.IntrinsicElements[T]`. More complex but type-safe.
3. **Simplest**: drop the cast and let TS widen via `<Tag {...{ref}}>` (works in many configs).

**This is not breaking anything** — runtime behavior is correct. Severity: LOW (style).

**MEDIUM — pre-existing concern unrelated to the audit**: line 59 `root.replaceChildren(fragment)` destroys any nested JSX inside `children`. If a heading contains `<em>save nature.</em>`, the rewrite uses only `textContent` and loses the `<em>`. Visible in production where heading contains italics. Not introduced by recent fixes; flagging for awareness.

### 9. `components/Footer.tsx` — CLEAN

- **Parent-null check** (line 39-40): `const parent = el.parentElement; if (!parent) return;` correctly defends the ScrollTrigger setup.
- **Year hardcoded** (line 116): `© 2026` — matches `currentDate` in the system reminder. Will go stale Jan 2027; not a code defect, just a maintenance note.
- **Min-heights 24px+**: `inline-flex min-h-[24px]` on every link (lines 83, 96, 107, 108, 109, 110). All hit ≥24px tap target. Below WCAG 2.5.5 (44×44px) but acceptable for footer links — the typical bar is "approachable", not "primary action". Aligns with audit goal.

**Cleanup (lines 46-49)**: kills both `tween.scrollTrigger` and the tween itself. Correct.

### 10. `lib/schema.ts` — CONFORMS TO REQUIREMENTS

- **No `offers` field** on `productSchema` (lines 62-74). Confirmed by `grep -n offers lib/schema.ts` (empty result).
- **LocalBusiness `@type` is array form** (line 8): `["LocalBusiness", "Organization", "Manufacturer"]`.
- **Stable `@id` URIs** throughout (lines 9, 37, 55, 66). Helps Google merge graph nodes.

`faqSchema` still exists (line 76) and is used legitimately on `app/contact/page.tsx:6,37` and inside `components/sections/FAQAccordion.tsx`. It is *only* removed from `app/page.tsx`.

### 11. `app/sitemap.ts` — CLEAN

- **`lastModified` omitted** from all entries (verified via `grep -rn lastModified` — empty result).
- **`images` array on product entries** (line 21).
- Static + product entries return as `MetadataRoute.Sitemap`. Build generated `/sitemap.xml` as static — confirmed in build output.

### 12. `next.config.ts` — CSP IS CONSISTENT WITH STATED INTENT

**CSP (lines 4-15)** does not break the build. JSON-LD scripts inject inline through the React HTML-injection prop — `script-src 'self' 'unsafe-inline'` permits this.

**MEDIUM — inline-script allowance weakens XSS defense**:
- Acknowledged in the audit scope ("future improvement is nonces").
- Realistic upgrade path: set a per-request nonce in middleware and pass it to a custom `<JsonLd>` component that emits `nonce={...}`. Requires `dynamic = "force-dynamic"` on the root layout.
- Until then, the inline allowance is the practical compromise.

**LOW — `X-XSS-Protection: 0`**: explicitly disables legacy auditor (correct per OWASP modern recommendation, since `0` is the safer setting than `1; mode=block` which had its own bypass bugs).

**LOW — no `Cross-Origin-Opener-Policy` / `Cross-Origin-Embedder-Policy`**: WhatsApp `window.open` and Google Maps links would interact with COOP. Current configuration doesn't set them, which is permissive but matches "marketing site" risk profile.

### 13. `app/page.tsx` — CLEAN

`grep -n "faqSchema\|JsonLd" app/page.tsx` returns empty — no leftover reference.

The page just composes section components. `faqSchema` lives only on `/contact` (`app/contact/page.tsx:37`) where it semantically belongs.

---

## Cross-File Findings (introduced or surfaced by the audit)

### Critical
None.

### High
None.

### Medium

**[MEDIUM] `app/api/enquire/route.ts:44` — `sanitizeText` has a broken regex**

Risk: The `.replace(/ -/g, " ")` is too narrow to serve any obvious sanitization purpose (does not protect against CSV-injection, formula-injection, or shell-injection — and data is never written to a CSV anyway). It is confusing code that suggests an unfinished intent. A reader might assume it is doing something meaningful.

Fix: Either remove the redundant `.replace()` entirely, or, if formula-injection guard was the intent, replace with `.replace(/^[=+@\-\t]+/, "")` (strips Excel-dangerous leading characters).

**[MEDIUM] `components/ui/SplitText.tsx:59` — `replaceChildren(fragment)` destroys nested JSX (pre-existing)**

Risk: Any heading wrapped in `<SplitText>` containing inline elements (e.g., `<em>`, `<strong>`) loses them — only flat text is preserved. The `EnquireForm.tsx:105-110` heading "Send us your brief on WhatsApp." is text-only, so unaffected. But `SplitText` is invoked across at least 8 components — verify none of them pass JSX with inline formatting that would silently disappear.

Fix: Walk DOM nodes instead of using `textContent`, or accept a `text` string prop instead of `children`.

**[MEDIUM] `next.config.ts:6` — inline-script allowance in script-src**

Risk: Disables CSP's strongest XSS mitigation. Any attacker-controlled HTML injection would execute. Mitigated in part by React's auto-escaping and the `<` replacement in `JsonLd.tsx:7`.

Fix: Future migration to nonces (already acknowledged in the audit scope).

### Low

**[LOW] `components/sections/EnquireForm.tsx:123` — `rel="noreferrer"` missing `noopener`**

Risk: Modern browsers implicitly default `noopener` on `target="_blank"`, so reverse-tabnabbing is not exploitable in current evergreens. Older browsers (pre-2021 Safari, etc.) could be vulnerable.

Fix: Use `rel="noopener noreferrer"` for consistency with the rest of the codebase.

**[LOW] `components/sections/EnquireForm.tsx:86-87` — double-submit window**

Risk: `setSubmitting(false)` fires before the 700ms timer that opens WhatsApp. User could click "Send via WhatsApp" twice during that window, sending two WA tabs.

Fix: Move `setSubmitting(false)` inside the setTimeout, or guard with the `submitting` state in the click handler.

**[LOW] `app/api/enquire/route.ts:16` — unbounded in-memory rate-limit map**

Risk: Acknowledged in the inline comment. Long-running processes accumulate stale IPs.

Fix: Either move to KV-backed limiter or add a periodic cleanup (`setInterval` to evict entries whose `resetAt < now`).

**[LOW] `components/ui/Counter.tsx:97` — redundant `finalLabel` in dep array**

Risk: None functional. Just causes effect to re-run if any of its inputs change, which is what the other deps already accomplish.

Fix: Drop `finalLabel` from the dep array.

**[LOW] `components/ui/SplitText.tsx:96` — `as unknown as React.Ref<...>` cast**

Risk: Style smell; no runtime impact. Indicates TypeScript inference issue with polymorphic `Tag`.

Fix: Cast directly to `React.Ref<HTMLElement>` (single `as`), or introduce a generic parameter for `Tag`.

**[LOW] `components/Footer.tsx:116` — year hardcoded as 2026**

Risk: Goes stale in January 2027.

Fix: `new Date().getFullYear()` server-render — but be careful with `dynamic` semantics; alternatively, `{2025 + ...}` static range. For a marketing site, annual manual update is acceptable.

---

## Build and Type-Check Confirmation

- `pnpm type-check` — **PASS** (no output, exit code 0).
- `pnpm build` — **PASS**. 20 static pages generated (8 product detail pages from `generateStaticParams`). API route `/api/enquire` correctly marked dynamic. Sitemap and robots prerendered. No CSP errors. Compile time 3.2s, total build under 8s.

---

## Verdict

**PASS WITH CAVEATS**

All 13 surveyed files behave as intended. The audit's headline goals are met:
- Single source of truth for the enquire schema.
- Rate limiter is correct, masking handles edge cases.
- Focus trap is leak-free and re-render-safe.
- SSR renders one rotating word, not five.
- Counter tween cleanup is sound.
- Footer/sitemap/schema are conformant.

The remaining issues are LOW–MEDIUM severity, mostly inherited (SplitText DOM rewrite) or stylistic (`as unknown` cast, `noopener` omission). None block production. None were *introduced* by the audit — they are surfaces revealed by it.

Most actionable items:
1. Remove or fix the dead `/ -/g` regex in `sanitizeText`.
2. Plan a CSP-nonce migration.
3. Audit `SplitText` callers for JSX-in-children risk.
