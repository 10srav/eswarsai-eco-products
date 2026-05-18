import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { BrandStrip } from "@/components/sections/BrandStrip";
import { EditorialBreak } from "@/components/sections/EditorialBreak";
import { StoryPanels } from "@/components/sections/StoryPanels";
import { ProductsPreview } from "@/components/sections/ProductsPreview";
import { ImpactCounters } from "@/components/sections/ImpactCounters";
import { SustainabilityStrip } from "@/components/sections/SustainabilityStrip";
import { IndustriesPreview } from "@/components/sections/IndustriesPreview";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { CTABanner } from "@/components/sections/CTABanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <BrandStrip />
      <EditorialBreak
        image="/images/factory/non-woven-shopping-bag.jpg"
        alt="Reusable non-woven shopping bag"
        kicker="Built with purpose"
        headline="Built for businesses replacing plastic with purpose."
        caption="Twelve years of bag manufacturing — built around one belief: India deserves manufacturers who care about the planet they operate on."
        side="left"
        tone="dark"
      />
      <StoryPanels />
      <ProductsPreview />
      <SustainabilityStrip />
      <ImpactCounters />
      <IndustriesPreview />
      <EditorialBreak
        image="/images/products/eswar-sai-kakinada-manufacturing-line.jpg"
        alt="Inside the manufacturing line"
        kicker="Inside the line"
        headline="Two production lines. In-house printing. Schedules we keep."
        caption="From fibre to fold, we own every step. No middlemen, no missed dates."
        side="right"
        tone="dark"
        height="short"
      />
      <ProcessSteps />
      <GalleryPreview />
      <CTABanner />
    </>
  );
}
