import type { MetadataRoute } from "next";
import { company } from "@/lib/company";
import { products } from "@/lib/products";

const SITE = company.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/about",
    "/products",
    "/industries",
    "/sustainability",
    "/gallery",
    "/contact",
  ];
  const productRoutes = products.map((p) => `/products/${p.slug}`);

  return [...staticRoutes, ...productRoutes].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/products/") ? 0.8 : 0.7,
  }));
}
