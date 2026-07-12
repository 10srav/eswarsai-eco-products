import type { MetadataRoute } from "next";
import { company } from "@/lib/company";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.name,
    short_name: "NextGen Eco",
    description: company.shortDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#faf7ef",
    theme_color: "#0e2a1e",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
