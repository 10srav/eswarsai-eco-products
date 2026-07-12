import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { BrandStrip } from "@/components/sections/BrandStrip";
import { EditorialBreak } from "@/components/sections/EditorialBreak";
import { PlasticStory } from "@/components/sections/PlasticStory";
import { BagStudio } from "@/components/sections/BagStudio";
import { ProductsPreview } from "@/components/sections/ProductsPreview";
import { JourneyLine } from "@/components/sections/JourneyLine";
import { ImpactCounters } from "@/components/sections/ImpactCounters";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { IndiaReach } from "@/components/sections/IndiaReach";
import { SustainabilityStrip } from "@/components/sections/SustainabilityStrip";
import { IndustriesPreview } from "@/components/sections/IndustriesPreview";
import { FoundersSection } from "@/components/sections/FoundersSection";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { CTABanner } from "@/components/sections/CTABanner";

export const metadata = buildMetadata({
  title: "Eco Bag Manufacturer in Kakinada, Andhra Pradesh",
  description:
    "Non-woven, jute and custom-printed eco bags made in Kakinada, delivered in bulk across India. 40M+ bags since 2013. Samples in 5 days, MOQ from 1,000.",
  path: "/",
  keywords: [
    "eco bag manufacturer Kakinada",
    "non woven bags Andhra Pradesh",
    "jute bags wholesale India",
    "custom printed carry bags",
    "biodegradable shopping bags bulk",
    "non woven bag manufacturer India",
    "eco friendly bags B2B",
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <BrandStrip />
      <PlasticStory />
      <BagStudio />
      <ProductsPreview />
      <EditorialBreak
        image="/images/factory/non-woven-shopping-bag.jpg"
        alt="Reusable non-woven shopping bag"
        kicker="Built with purpose"
        headline="Built for businesses replacing plastic with purpose."
        caption="Twelve years of bag manufacturing — built around one belief: India deserves manufacturers who care about the planet they operate on."
        side="left"
        tone="dark"
      />
      <JourneyLine />
      <SustainabilityStrip />
      <ImpactCounters />
      <BeforeAfter />
      <RoiCalculator />
      <IndiaReach />
      <IndustriesPreview />
      <FoundersSection variant="compact" />
      <GalleryPreview />
      <CTABanner />
    </>
  );
}
