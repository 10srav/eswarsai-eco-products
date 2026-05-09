import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";
import { GalleryShowcase } from "@/components/sections/GalleryShowcase";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = buildMetadata({
  title: "Gallery",
  description:
    "Real client work — jute and non-woven bags we've manufactured for cooperative banks, weddings, hospitals, boutiques, and retailers across Andhra Pradesh and South India.",
  path: "/gallery",
  keywords: [
    "non woven bag manufacturing",
    "jute bag manufacturer Andhra Pradesh",
    "custom printed jute bag Kakinada",
    "wedding favour jute totes",
    "non-woven D-cut bag supplier",
    "bag printing Rajahmundry",
    "Vizag bag manufacturer",
    "bag factory Andhra Pradesh",
    "client work portfolio bag manufacturer",
  ],
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Made for them. Photographed on the floor."
        title="A gallery of bags we've shipped."
        lede="Cooperative banks, weddings, hospitals, boutiques. Every photo below is a real order from our line — captured before it left the building."
      />

      <GalleryShowcase />

      <CTABanner />
      <JsonLd
        id="ld-breadcrumb-gallery"
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Gallery", href: "/gallery" },
        ])}
      />
    </>
  );
}
