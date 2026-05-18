import type { MetadataRoute } from "next";
import { company } from "@/lib/company";
import { products, industries } from "@/lib/products";

const SITE = company.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly" },
    { url: `${SITE}/about`, changeFrequency: "monthly" },
    { url: `${SITE}/products`, changeFrequency: "monthly" },
    { url: `${SITE}/industries`, changeFrequency: "monthly" },
    { url: `${SITE}/sustainability`, changeFrequency: "monthly" },
    { url: `${SITE}/gallery`, changeFrequency: "monthly" },
    { url: `${SITE}/contact`, changeFrequency: "monthly" },
  ];

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE}/products/${p.slug}`,
    changeFrequency: "monthly",
    images: [`${SITE}${p.image.src}`],
  }));

  const industryEntries: MetadataRoute.Sitemap = industries.map((i) => ({
    url: `${SITE}/industries/${i.slug}`,
    changeFrequency: "monthly",
    images: [`${SITE}${i.caseImage.src}`],
  }));

  return [...staticEntries, ...productEntries, ...industryEntries];
}
