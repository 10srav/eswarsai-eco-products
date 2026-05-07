import { PageHero } from "@/components/sections/PageHero";
import { IndustriesGrid } from "@/components/sections/IndustriesGrid";
import { IndustriesDetail } from "@/components/sections/IndustriesDetail";
import { CTABanner } from "@/components/sections/CTABanner";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = buildMetadata({
  title: "Industries we serve",
  description:
    "From kirana counters to listed FMCG, hospitals to wedding stages — Eswar Sai Eco Products manufactures eco-friendly bags for every industry that wants to replace plastic, with MOQ ranges and sample timelines per sector.",
  path: "/industries",
  keywords: [
    "non woven bag manufacturer for retail",
    "pharma bag supplier",
    "FMCG bag manufacturer",
    "boutique loop handle bag",
    "wedding promotional bag",
    "ecommerce drawstring pouch",
    "Andhra Pradesh",
    "Kakinada",
    "Vizag bag manufacturer",
    "Hyderabad bag supplier",
    "South India non-woven manufacturer",
  ],
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Trusted across sectors"
        title="From kirana to FMCG. Hospitality to e-commerce."
        lede="We design, manufacture, and despatch eco-friendly bags into industries that move at very different speeds — and need different bags for each."
      />
      <IndustriesGrid />
      <IndustriesDetail />
      <CTABanner />
      <JsonLd
        id="ld-breadcrumb-industries"
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Industries", href: "/industries" },
        ])}
      />
    </>
  );
}
