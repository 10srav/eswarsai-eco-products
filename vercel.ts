// Optional Vercel project config. The Next.js framework auto-detection plus
// next.config.ts already covers most settings — this file documents intent
// and adds long-cache headers for image assets.
const config = {
  buildCommand: "pnpm build",
  installCommand: "pnpm install --frozen-lockfile",
  framework: "nextjs",
  outputDirectory: ".next",
  devCommand: "pnpm dev",
  cleanUrls: true,
  trailingSlash: false,
  headers: [
    {
      source: "/images/(.*)",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    },
    {
      source: "/_next/static/(.*)",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    },
  ],
};

export default config;
