import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/Container";
import { CTABanner } from "@/components/sections/CTABanner";
import { ImpactCounters } from "@/components/sections/ImpactCounters";
import { Timeline } from "@/components/sections/Timeline";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { company } from "@/lib/company";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Pioneers in eco-friendly non-woven and jute bag manufacturing — based in Kakinada, Andhra Pradesh, building bags that replace single-use plastic at industrial scale since 2013.",
  path: "/about",
  keywords: [
    "eco friendly bag manufacturer story",
    "non woven bag manufacturer Kakinada",
    "jute bag manufacturer Andhra Pradesh",
    "Eswar Sai Eco Products",
    "Kakinada",
    "Vizag bag manufacturer",
    "Hyderabad bag supplier",
    "South India non-woven manufacturer",
    "since 2013",
  ],
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={`Since ${company.founded} · ${company.address.locality}, ${company.address.region}`}
        title="A manufacturer with a manufacturer's reputation."
        lede={company.longDescription}
      />

      <section className="bg-bone py-24 md:py-32">
        <Container>
          <div className="grid gap-16 md:grid-cols-2 md:gap-24">
            <div>
              <p className="eyebrow text-moss">The story</p>
              <p className="serif mt-6 text-[clamp(22px,2.4vw,32px)] font-light leading-[1.25] tracking-tight text-forest-deep">
                We started with one stitching line and a stubborn belief: India deserves bag manufacturers who care about both <em>quality</em> and the <em>planet</em>. Twelve years later, two production lines, in-house printing, and 500+ brand partners later — we still do.
              </p>
              <ul className="mt-10 grid gap-5 text-sm">
                <li className="flex justify-between border-b border-forest-deep/10 pb-4">
                  <span className="text-moss">Founded</span>
                  <span>{company.founded}</span>
                </li>
                <li className="flex justify-between border-b border-forest-deep/10 pb-4">
                  <span className="text-moss">Headquarters</span>
                  <span>{company.address.locality}, {company.address.region}</span>
                </li>
                <li className="flex justify-between border-b border-forest-deep/10 pb-4">
                  <span className="text-moss">Production lines</span>
                  <span>2 fully automated</span>
                </li>
                <li className="flex justify-between border-b border-forest-deep/10 pb-4">
                  <span className="text-moss">Print methods</span>
                  <span>Flexo, screen, digital</span>
                </li>
                <li className="flex justify-between border-b border-forest-deep/10 pb-4">
                  <span className="text-moss">Sample turnaround</span>
                  <span>5 working days</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-moss">Pan-India despatch</span>
                  <span>28 states + exports</span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-md md:aspect-[3/4]">
              <Image
                src="/images/products/eswar-sai-kakinada-manufacturing-line.jpg"
                alt="Eswar Sai non-woven bag manufacturing line in Kakinada, Andhra Pradesh"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      <Timeline />
      <ImpactCounters />
      <CTABanner />

      <JsonLd
        id="ld-breadcrumb-about"
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ])}
      />
    </>
  );
}
