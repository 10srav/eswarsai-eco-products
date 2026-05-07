import type { Metadata } from "next";
import { company } from "./company";

const SITE = company.url;
const TITLE_BASE = `${company.name} — Replace Plastic. Save Nature.`;
const DESC_BASE = company.shortDescription;

const OG_IMAGE = {
  url: `${SITE}/og.png`,
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
    keywords: keywords ?? [
      "non woven bag manufacturer",
      "jute bag supplier",
      "eco bag manufacturer",
      "reusable bags",
      "sustainable packaging",
      "Andhra Pradesh",
      "Kakinada",
      "non woven bag manufacturer in Andhra Pradesh",
      "best non woven bag manufacturer",
      "eco friendly carry bags",
    ],
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
      icon: "/favicon.svg",
    },
    formatDetection: { telephone: true, address: true, email: true },
    other: {
      "geo.region": "IN-AP",
      "geo.placename": "Kakinada",
      "geo.position": "16.9891;82.2475",
      ICBM: "16.9891, 82.2475",
    },
  };
}
