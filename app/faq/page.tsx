import { PageHero } from "@/components/sections/PageHero";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { CTABanner } from "@/components/sections/CTABanner";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { generalFaqs } from "@/lib/faqs";

export const metadata = buildMetadata({
  title: "Eco Bag FAQs — MOQ, Sampling, Printing, Delivery",
  description:
    "Straight answers on bulk eco bag orders: minimum order quantity, sample timelines, GSM guidance, custom printing, food safety, and pan-India delivery from Kakinada.",
  path: "/faq",
  keywords: [
    "eco bag MOQ",
    "non woven bag GSM guide",
    "custom printed bags India",
    "jute bag wholesale FAQ",
    "bulk bag order process",
    "eco bag manufacturer Kakinada",
  ],
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Answers"
        title="Every question buyers ask, answered straight."
        lede="MOQ, sampling, GSM, printing, food safety, delivery — the details that decide a bulk order, without a sales call. If it isn't here, WhatsApp us."
        variant="forest"
      />
      <FAQAccordion
        items={generalFaqs}
        kicker="The full list"
        heading="From first sample to palletised despatch."
        lede="Sixteen answers covering ordering, materials and delivery. Still stuck? Real humans answer the phone, Mon–Sat."
      />
      <CTABanner />
      <JsonLd id="ld-faq-page" data={faqPageSchema(generalFaqs)} />
      <JsonLd
        id="ld-breadcrumb-faq"
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "FAQ", href: "/faq" },
        ])}
      />
    </>
  );
}
