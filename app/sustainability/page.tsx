import { PageHero } from "@/components/sections/PageHero";
import { SustainabilityStrip } from "@/components/sections/SustainabilityStrip";
import { ImpactCounters } from "@/components/sections/ImpactCounters";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { SustainabilityManifesto } from "@/components/sections/SustainabilityManifesto";
import { CTABanner } from "@/components/sections/CTABanner";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = buildMetadata({
  title: "Sustainability",
  description:
    "Recyclable polypropylene non-woven and compostable jute bags engineered for 200+ uses. Audited mills, food-safe fabric, transparent carbon math — manufactured in Kakinada, Andhra Pradesh.",
  path: "/sustainability",
  keywords: [
    "sustainable bag manufacturer",
    "recyclable non woven bag",
    "compostable jute bag",
    "eco friendly carry bags",
    "carbon footprint bag",
    "audited mills India",
    "Andhra Pradesh",
    "Kakinada",
    "Vizag bag manufacturer",
    "Hyderabad bag supplier",
    "South India non-woven manufacturer",
  ],
});

export default function SustainabilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Replace plastic. Save nature."
        title="The math beats single-use plastic in the first month."
        lede="Every bag we make is designed to be reused 200× and either recycled or composted. We don't just say sustainable — we measure it."
      />

      <SustainabilityManifesto />

      <section className="bg-cream py-20 md:py-28">
        <Container width="narrow">
          <p className="serif text-[clamp(22px,2.4vw,32px)] font-light leading-[1.4] tracking-tight text-forest-deep">
            One non-woven bag replaces an estimated <em className="italic text-moss">200 single-use plastic bags</em> over its lifetime. One jute tote replaces 600. Multiply that by 40 million bags shipped, and the math becomes obvious — and so does the reason we get up.
          </p>
        </Container>
      </section>

      <SustainabilityStrip />
      <ImpactCounters />
      <ProcessSteps />
      <CTABanner />

      <JsonLd
        id="ld-breadcrumb-sustainability"
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Sustainability", href: "/sustainability" },
        ])}
      />
    </>
  );
}
