import { PageHero } from "@/components/sections/PageHero";
import { CTABanner } from "@/components/sections/CTABanner";
import { GalleryMasonry } from "@/components/sections/GalleryMasonry";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = buildMetadata({
  title: "Gallery",
  description:
    "Manufacturing line, finished products, and people doing the work — a visual tour of what eco-friendly non-woven and jute bag manufacturing looks like in Kakinada, Andhra Pradesh.",
  path: "/gallery",
  keywords: [
    "non woven bag manufacturing",
    "factory tour bag manufacturer",
    "eco bag manufacturer Andhra Pradesh",
    "Kakinada",
    "Vizag bag manufacturer",
    "Hyderabad bag supplier",
    "South India non-woven manufacturer",
    "behind the line bag factory",
  ],
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="The work, the line, the people"
        title="A visual tour of Eswar Sai."
        lede="Manufacturing isn't pretty. We made it look pretty anyway. Browse by bags, manufacturing line, or detail."
      />

      <GalleryMasonry />

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
