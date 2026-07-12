import type { Metadata } from "next";
import { company } from "./company";

const SITE = company.url;
const TITLE_BASE = `${company.name} — Replace Plastic. Save Nature.`;
const DESC_BASE = company.shortDescription;

const DEFAULT_KEYWORDS = [
  "eco bag manufacturer Kakinada",
  "non woven bags Andhra Pradesh",
  "jute bags wholesale India",
  "custom printed carry bags",
  "biodegradable shopping bags bulk",
  "reusable bags manufacturer India",
];

const OG_IMAGE = {
  url: `${SITE}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: TITLE_BASE,
};

export type SeoInput = {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noindex?: boolean;
  keywords?: string[];
};

export function buildMetadata({
  title,
  description,
  path = "/",
  ogImage,
  noindex,
  keywords,
}: SeoInput = {}): Metadata {
  const fullTitle = title ? `${title} · ${company.name}` : TITLE_BASE;
  const desc = description ?? DESC_BASE;
  const url = `${SITE}${path}`;

  return {
    metadataBase: new URL(SITE),
    title: fullTitle,
    description: desc,
    keywords: keywords ?? DEFAULT_KEYWORDS,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
        },
    openGraph: {
      title: fullTitle,
      description: desc,
      type: "website",
      url,
      siteName: company.name,
      locale: "en_IN",
      images: [ogImage ? { url: ogImage, width: 1200, height: 630, alt: fullTitle } : OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage ?? OG_IMAGE.url],
    },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
    formatDetection: { telephone: true, address: true, email: true },
    other: {
      "geo.region": "IN-AP",
      "geo.placename": "Kakinada",
      "geo.position": "17.0455277;82.1207793",
      ICBM: "17.0455277, 82.1207793",
    },
  };
}
