# Security Re-Audit: Eswarsai Eco Products
**Date:** 2026-05-18  
**Scope:** `app/api/enquire/route.ts`, `next.config.ts`, `lib/enquire-schema.ts`  
**Verdict:** PASS (original 5 MEDIUM issues resolved). One new MEDIUM introduced.

---

## Original 5 MEDIUM Issues — Verification

### 1. PII Logs (phone) — FIXED
`maskPhone()` correctly strips non-digits, detects country code by `digits.length > 10`, masks all but last 3 and country prefix.

Edge case results:
| Input | Output |
|---|---|
| `""` | `""` (0 digits, `"*".repeat(0)`) |
| `"123"` | `"***"` |
| `"9123456789"` (10 digits) | `"*******789"` |
| `"+91 9876543210"` | `"+91 *******210"` |
| `"+91 (912) 105-3678"` | `"+91 *******678"` |
| `"((((((("` (7 non-digit chars, 0 digits) | `""` |

All correct. The empty-string output for zero-digit inputs is cosmetically odd but not a security issue.

### 2. Log Injection — PARTIALLY FIXED (new gap found — see MEDIUM-1 below)
`sanitizeText()` correctly strips `\r\n` by replacing with a space. The ` -` stripping (`/ -/g`) removes ` -` patterns used in common log formatting. User-supplied fields (`name`, `business`, `requirement`, `quantity`, `time`, `notes`) are all sanitized before entering `lead`.

Gap: `userAgent` (line 104) is logged raw without `sanitizeText()`. A crafted `User-Agent: Mozilla\r\nINJECTED: {...}` header splits into a second log line in any aggregator that newline-parses JSON-L. See MEDIUM-1.

### 3. Rate Limiter — FIXED (with documented caveats)
- Logic is correct: 5 req / 60s window, reset on expiry. Verified by replay.
- TOCTOU: not applicable — `rateLimit()` is fully synchronous; Node.js single-threaded event loop makes Map operations atomic.
- IP spoofing via `X-Forwarded-For`: Vercel sets `x-real-ip` from the real connection IP before the request reaches the function. Client-supplied `X-Forwarded-For` is ignored when `x-real-ip` is present. Safe on Vercel.
- `"unknown"` bucket: if both `x-real-ip` and `x-forwarded-for` are absent, all anonymous requests share one bucket (5 total req/60s across all such clients). On Vercel this only happens if Vercel's edge is bypassed. Documented concern, not exploitable in practice.
- Map never pruned: expired entries accumulate. On serverless cold starts this resets; on a long-lived instance it grows. Not exploitable, low severity.

### 4. CSP — FIXED (with flagged follow-up)
`Content-Security-Policy` header confirmed present at `next.config.ts:45`.

CSP value:
```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; media-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

`'unsafe-inline'` in `script-src` is present as documented for JSON-LD. This nullifies script injection protection entirely — any DOM XSS that can write a `<script>` tag runs freely. Flagged as a known follow-up item, not a regression. Tighter form: move JSON-LD to a `/public/*.js` static file (or a server component that serialises via `<script src>`) and remove `'unsafe-inline'`.

### 5. HSTS — FIXED
`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` confirmed at `next.config.ts:44`.

Preload eligibility:
- `max-age=63072000` (2 years) — meets minimum 1-year requirement. PASS.
- `includeSubDomains` present. PASS.
- `preload` present. PASS.

**Ops caveat:** `preload` submits the domain to browser preload lists, which is permanent for months even after removal. All subdomains of `eswarsaiecoproducts.com` must be HTTPS-only from the moment this header is live. If any subdomain (e.g. `mail.`, `staging.`) is HTTP-only, browsers will block it outright. This is an infrastructure concern, not a code defect.

`X-XSS-Protection: 0` confirmed present — correct modern practice (old browsers' XSS auditor was itself an attack vector).

---

## New Findings

### MEDIUM-1: Log injection via unsanitized `User-Agent` header
**File:** `app/api/enquire/route.ts:104`

```ts
userAgent: req.headers.get("user-agent") ?? "unknown",
```

`userAgent` is placed into the `lead` object and logged via `JSON.stringify(lead)` at line 107. Unlike all other user-supplied fields, it is not passed through `sanitizeText()`.

**Attack:** A request with `User-Agent: Mozilla/5.0\r\n{"level":"error","ip":"admin","msg":"payment_bypass"}` causes the JSON serialisation to embed a newline. Log aggregators (Datadog, Loki, CloudWatch) that split on `\n` or parse per-line JSON will ingest the injected object as a real log event. With a structured-log aggregator this can suppress or forge audit entries.

**Fix:** Replace line 104 with:
```ts
userAgent: sanitizeText(req.headers.get("user-agent")) ?? "unknown",
```

---

## INFO Items

### INFO-1: Phone schema allows `\r`/`\n` through Zod validation
**File:** `lib/enquire-schema.ts:6`

The regex `/^[+0-9\s\-()]{7,}$/` uses `\s` which matches `\r` and `\n`. A phone string like `+91 9876\r\n543210` passes Zod. `sanitizeText()` and `maskPhone()` both handle this correctly downstream (newlines stripped/ignored), so there is no current exploit path. The schema should reject control characters at the boundary:
```ts
.regex(/^[+0-9 \-()]{7,}$/, ...)   // explicit space, not \s
```

### INFO-2: `img-src 'https:'` is broad
`next.config.ts:9` — allows images from any HTTPS origin. Acceptable for a media-heavy marketing site; would enable content injection if an attacker controls any image URL rendered in an `<img>` tag, but there is no such user-controlled URL currently.

### INFO-3: HSTS `preload` — irreversible commitment
See HSTS section above. Not a code bug; flagging for ops awareness before DNS goes live.

### INFO-4: `rateLimitBuckets` Map unbounded growth
`route.ts:16` — entries are never evicted. On a long-running Node.js process with high unique-IP traffic this is a memory leak. On Vercel serverless it is bounded by instance lifetime. No fix needed for current deployment target; add a note or use Upstash/KV when scaling.

---

## Summary Table

| Original Finding | Status |
|---|---|
| PII logs (phone) | FIXED |
| Log injection (user fields) | FIXED |
| No rate limit | FIXED |
| No CSP | FIXED |
| No HSTS | FIXED |

| New Finding | Severity |
|---|---|
| Unsanitized `userAgent` in log | MEDIUM |
| Phone regex allows `\r\n` (mitigated downstream) | INFO |
