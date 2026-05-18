# Security Audit — Eswarsai Eco Products (Next.js 16)

Audited: 2026-05-18
Scope: `app/api/enquire/route.ts`, `next.config.ts`, `components/sections/EnquireForm.tsx`, `lib/*.ts`, `app/**`, `package.json`, `.gitignore`

---

## MEDIUM — PII logged to stdout in plaintext

**File:** `app/api/enquire/route.ts:40`

```ts
console.log("[enquiry]", JSON.stringify(lead));
```

`lead` includes `phone` (user-supplied), `ip` (x-forwarded-for), and `userAgent`. On any managed platform (Vercel, Railway, Fly.io) these logs are shipped to a log aggregator in cleartext. Phone numbers are PII under PDPA/GDPR. An attacker who gains read access to logs (or a log-aggregation misconfiguration) gets a full dump of all enquiry contacts.

**Fix:** Strip or mask phone before logging. Use a structured logger with a PII scrubber, or skip logging the `phone` field entirely and store leads in a DB/queue instead.

---

## MEDIUM — Log injection via user-controlled JSON fields

**File:** `app/api/enquire/route.ts:34-40`

`name`, `notes`, `business`, `quantity` are Zod-validated for length but their content is not sanitised for log-escape sequences. If the log consumer parses JSON lines, a payload like:
```
name: "foo\n[enquiry] {\"phone\":\"+1...\",\"ip\":\"attacker_ip\"}"
```
will inject a synthetic log line. The Zod regex only constrains `phone`; all free-text fields accept arbitrary Unicode.

**Fix:** Flatten or sanitise newlines and control characters from string fields before logging. Alternatively log the raw Zod-parsed object through a structured logger that serialises safely (e.g. `pino`).

---

## MEDIUM — No rate limiting on the enquiry API endpoint

**File:** `app/api/enquire/route.ts` (entire file)

There is no rate limiting, no CAPTCHA, and no bot-detection on `POST /api/enquire`. An attacker can:
1. Enumerate and harvest logs by mass-submitting valid payloads.
2. Cause alert fatigue if the endpoint is later wired to an email/SMS notification.
3. Perform a low-volume credential-stuffing equivalent — submitting thousands of lead forms with competitor contacts to pollute the CRM.

The endpoint currently only logs, so direct damage is limited, but this needs to be addressed before any email/webhook integration is added.

**Fix:** Add Vercel's built-in Edge rate-limiting middleware, or use `@upstash/ratelimit` (Redis-backed) keyed on `x-forwarded-for`. Alternatively add Cloudflare Turnstile/hCaptcha on the client form.

---

## MEDIUM — Missing Content-Security-Policy header

**File:** `next.config.ts:20-37`

No `Content-Security-Policy` header is set. The site loads:
- Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`)
- GSAP CDN scripts (if loaded via CDN — confirm from bundle)
- Inline `<script>` tags for JSON-LD (via `dangerouslySetInnerHTML`)

Without CSP, any XSS vector (however unlikely on this largely static site) has unrestricted script execution. Modern browsers support `strict-dynamic` nonce-based CSP which Next.js 13+ supports natively.

**Fix:** Add a CSP header in `next.config.ts` with at minimum:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{nonce}'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none';
```
Use Next.js middleware to inject per-request nonces.

---

## MEDIUM — Missing HSTS header

**File:** `next.config.ts:20-37`

`Strict-Transport-Security` is absent. On a Vercel deployment HTTPS is enforced at the CDN layer, but HSTS should be declared in application headers so browsers cache the HTTPS requirement and resist SSLstrip attacks on non-CDN deployments or during rollback.

**Fix:** Add to the `/(.*) ` header block:
```ts
{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }
```

---

## LOW — `dangerouslySetInnerHTML` obfuscated in JsonLd component

**File:** `components/JsonLd.tsx:8`

```ts
const propKey = ["dangerously", "SetInner", "HTML"].join("");
```

The component deliberately obfuscates the string `"dangerouslySetInnerHTML"` to suppress security-warning hooks/linters. The actual usage at line 14 is safe — all data fed into `JsonLd` comes from `lib/schema.ts` (static strings) and `product.name`/`product.longDesc` (static data from `lib/products.ts`), and `JSON.stringify` with `<` escaping at line 7 prevents script injection. However, the obfuscation pattern means automated scanners (and future auditors) will miss this usage. If a dynamic data source is ever passed to `JsonLd` the lack of linter visibility becomes a real XSS risk.

**Fix:** Use the prop normally and disable the specific ESLint rule inline with a justification comment. Do not obfuscate prop names to evade tooling.

---

## LOW — `x-forwarded-for` trusted blindly for IP logging

**File:** `app/api/enquire/route.ts:37`

```ts
ip: req.headers.get("x-forwarded-for") ?? "unknown",
```

`x-forwarded-for` is user-controlled and can be spoofed by any client that sends the header directly (e.g. `curl -H "X-Forwarded-For: 1.2.3.4"`). On Vercel, the platform rewrites this header, so it is safe there; on a self-hosted Node deployment it is not. The logged IP would be attacker-controlled, enabling log injection of IP strings.

**Fix:** On Vercel use `req.headers.get("x-real-ip")` or the Vercel-specific `x-vercel-forwarded-for` which is platform-set. Document in a comment that this value is only trustworthy behind Vercel's edge.

---

## LOW — Untracked `.jpg` files not covered by `.gitignore` pattern

**Files (git-untracked):** `gallery-final.jpg`, `gallery-full.jpg`, `gallery-hero.jpg`, `gallery-mobile.jpg` (repo root)

`.gitignore` at line 19 contains `gallery-*.png` but not `gallery-*.jpg`. The four untracked files are JPEGs, so the ignore rule does not apply. A `git add .` or `git add -A` would commit them. These appear to be screenshot artefacts, not sensitive, but if they were replaced with files containing EXIF metadata (GPS coordinates, device IDs), that metadata would land in git history permanently.

**Fix:** Add `gallery-*.jpg` to `.gitignore`, or change the existing pattern to `gallery-*` to cover all extensions.

---

## INFO — No `X-XSS-Protection` header

**File:** `next.config.ts`

`X-XSS-Protection` is deprecated and ignored by Chrome/Firefox/Edge (only IE 11 used it). Its absence is not a vulnerability. Worth knowing: setting `X-XSS-Protection: 0` is actually the recommended modern posture to prevent the IE reflective XSS filter from being weaponised. Not a finding.

---

## INFO — Phone number in `lib/company.ts` is public business contact

**File:** `lib/company.ts:10-13`

Phone, WhatsApp number, and email are embedded in source. These are the company's public business contacts, already appearing on the website. Not a secret leak — no action needed.

---

## INFO — No known CVEs in locked dependency versions

- `next@16.2.5` — current release line, no published CVEs at audit date
- `react@19.2.6` — current, no CVEs
- `zod@3.25.76` — current, no CVEs
- `react-hook-form@7.75.0` — no CVEs
- `gsap@3.x`, `lenis@1.x` — client animation libs, no server attack surface

No `npm audit` vulnerabilities found.

---

## INFO — No `dangerouslySetInnerHTML` on user-controlled data

All usages of `dangerouslySetInnerHTML` resolve to static data from `lib/schema.ts` and `lib/products.ts`. `EnquireForm.tsx` uses React controlled inputs with no innerHTML usage. No XSS path from user input to DOM injection exists.

---

## INFO — No open redirect vectors

`window.open(url, ...)` in `EnquireForm.tsx:66` builds a WhatsApp URL from `encodeURIComponent(text)` where `text` is constructed from validated form data. The base URL is hardcoded to `https://wa.me/`. No user-controlled redirect destination.

