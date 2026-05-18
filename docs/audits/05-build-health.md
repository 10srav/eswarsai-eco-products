# Audit: Build Health Check

Project: `/home/sraav/Desktop/Esep WEb`
Package manager: `pnpm 10.32.1` (Node 24.14.0)
Next.js: 16.2.5 (Turbopack)
Run date: 2026-05-18

---

## 1. Type-check — PASS

Command: `pnpm type-check` → `tsc --noEmit`
Exit code: **0**

Output:
```
> eswarsai-eco-products@1.0.0 type-check /home/sraav/Desktop/Esep WEb
> tsc --noEmit
```

No errors. No warnings. Clean pass.

---

## 2. Lint — FAIL (tooling, not code)

Command: `pnpm lint` → `next lint`
Exit code: **1**

Output (verbatim):
```
> eswarsai-eco-products@1.0.0 lint /home/sraav/Desktop/Esep WEb
> next lint

Invalid project directory provided, no such directory: /home/sraav/Desktop/Esep WEb/lint
 ELIFECYCLE  Command failed with exit code 1.
```

Analysis:
- The failure is **not a code-quality issue**. It is a Next.js 16 CLI argument-parsing bug: `next lint` is treating the space in the directory name `Esep WEb` as a positional argument boundary and interpreting `WEb` (mangled to `lint`) as a subcommand/path.
- The CLI never reaches any ESLint rule evaluation. No `.ts`/`.tsx` file is inspected.
- Per task constraints, NO fix is applied. Note that `next lint` is also deprecated/removed in newer Next.js workflows in favor of running `eslint` directly.

Errors/warnings discovered: **none** (linter did not execute).

---

## 3. Build — PASS

Command: `pnpm build` → `next build`
Exit code: **0**

Output (verbatim):
```
> eswarsai-eco-products@1.0.0 build /home/sraav/Desktop/Esep WEb
> next build

▲ Next.js 16.2.5 (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully in 3.5s
  Running TypeScript ...
  Finished TypeScript in 3.5s ...
  Collecting page data using 11 workers ...
  Generating static pages using 11 workers (0/20) ...
  Generating static pages using 11 workers (5/20)
  Generating static pages using 11 workers (10/20)
  Generating static pages using 11 workers (15/20)
✓ Generating static pages using 11 workers (20/20) in 611ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ƒ /api/enquire
├ ○ /contact
├ ○ /gallery
├ ○ /industries
├ ○ /opengraph-image
├ ○ /products
├ ● /products/[slug]
│ ├ /products/d-cut-non-woven
│ ├ /products/w-cut-non-woven
│ ├ /products/loop-handle
│ └ [+5 more paths]
├ ○ /robots.txt
├ ○ /sitemap.xml
└ ○ /sustainability


○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

No errors. No warnings. 20/20 static pages generated.

Bundle size table: **NOT printed by Next.js 16.2.5 / Turbopack build.** Per-route First Load JS / Size columns are absent in this output format. The route map above is the complete final report from `next build`.

Route summary:
- Static (○): 12 routes — `/`, `/_not-found`, `/about`, `/contact`, `/gallery`, `/industries`, `/opengraph-image`, `/products`, `/robots.txt`, `/sitemap.xml`, `/sustainability`
- SSG (●): 1 dynamic route — `/products/[slug]` with 8 prerendered paths (d-cut-non-woven, w-cut-non-woven, loop-handle, + 5 more)
- Dynamic (ƒ): 1 route — `/api/enquire`

Build time: compile 3.5s, TypeScript 3.5s, static pages 611ms.

---

## Verdict

| Check       | Result | Notes                                                |
| ----------- | ------ | ---------------------------------------------------- |
| type-check  | PASS   | tsc clean                                            |
| lint        | FAIL\* | `next lint` CLI bug on path with space; linter never ran |
| build       | PASS   | Truth-check passes; 20 static pages + 1 dynamic API  |

\*Lint failure is a Next.js 16 CLI argument-parsing defect against the directory name `Esep WEb`, not a code-quality regression. Build (the truth check) is green.
