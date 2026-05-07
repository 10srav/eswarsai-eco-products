import type { MetadataRoute } from "next";
import { company } from "@/lib/company";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${company.url}/sitemap.xml`,
    host: company.url,
  };
}
