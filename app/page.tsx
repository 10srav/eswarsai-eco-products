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
