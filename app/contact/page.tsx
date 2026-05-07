import { PageHero } from "@/components/sections/PageHero";
import { EnquireForm } from "@/components/sections/EnquireForm";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Send us a brief on WhatsApp. We'll prefill a message with your specs and respond within 30 minutes during business hours. Based in Kakinada, Andhra Pradesh — pan-India despatch.",
  path: "/contact",
  keywords: [
    "non woven bag manufacturer contact",
    "WhatsApp bag enquiry",
    "request bag samples",
    "MOQ non woven bag",
    "Kakinada",
    "Andhra Pradesh",
    "Vizag bag manufacturer",
    "Hyderabad bag supplier",
    "South India non-woven manufacturer",
  ],
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Let's talk"
        title="Send us your brief. Sample in five days."
        lede="Pick a product, share your size and quantity, and we'll prefill a WhatsApp message you can review and send. Or call us — we still answer the phone."
        variant="forest"
      />
      <EnquireForm />
      <FAQAccordion />
      <JsonLd id="ld-faq-contact" data={faqSchema} />
      <JsonLd
        id="ld-breadcrumb-contact"
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ])}
      />
    </>
  );
}
