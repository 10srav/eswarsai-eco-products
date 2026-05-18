import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Container } from "@/components/Container";
import { ProductCard } from "@/components/sections/ProductCard";
import { CTABanner } from "@/components/sections/CTABanner";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SplitText } from "@/components/ui/SplitText";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { industries, industriesBySlug, productsForIndustry } from "@/lib/products";
import { company } from "@/lib/company";

type Params = { slug: string };

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const industry = industriesBySlug[slug];
  if (!industry) return buildMetadata({ title: "Not found", noindex: true });
  return buildMetadata({
    title: `${industry.name} bag manufacturer`,
    description: industry.longDesc,
    path: `/industries/${industry.slug}`,
    keywords: industry.keywords,
  });
}

export default async function IndustryDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const industry = industriesBySlug[slug];
  if (!industry) notFound();

  const related = productsForIndustry(industry, 3);
  const quoteText = `Hi ${company.name}, I'd like a quote for ${industry.short.toLowerCase()} bags.`;

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-deep via-forest to-moss pb-20 pt-36 text-bone md:pb-28 md:pt-44">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 80% 20%, rgba(149,213,178,0.22), transparent 50%), radial-gradient(ellipse at 10% 90%, rgba(82,183,136,0.18), transparent 60%)",
          }}
        />
        <Container>
          <nav aria-label="Breadcrumb" className="eyebrow flex items-center gap-3 text-sage">
            <Link href="/industries" className="opacity-80 hover:opacity-100">Industries</Link>
            <span className="opacity-50">/</span>
            <span>{industry.short}</span>
          </nav>
          <div className="mt-8 grid gap-12 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-16">
            <div>
              <p className="mono text-xs tracking-[0.2em] text-sage">Sector · {industry.short.toUpperCase()}</p>
              <SplitText
                as="h1"
                className="serif mt-5 text-[clamp(44px,7vw,108px)] font-light leading-[0.95] tracking-[-0.04em]"
              >
                {industry.name} bags, made in India.
              </SplitText>
              <p className="mt-8 max-w-md text-base leading-relaxed opacity-80 md:text-lg">{industry.longDesc}</p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <MagneticButton href={`/contact?req=${encodeURIComponent(industry.short)}`} variant="primary">
                  Request samples <ArrowRight size={16} aria-hidden="true" />
                </MagneticButton>
                <a
                  href={`https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(quoteText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-bone/30 px-7 py-4 text-sm transition-colors hover:bg-bone/10"
                >
                  WhatsApp us <span className="sr-only">(opens in new tab)</span>
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-bone/[0.04] md:aspect-square">
              <Image
                src={industry.caseImage.src}
                alt={industry.caseImage.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-forest-deep/80 to-transparent"
              />
              <span className="mono pointer-events-none absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.22em] text-bone/85">
                Real client, real production line
              </span>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-bone py-16 md:py-24">
        <Container>
          <div className="grid gap-10 border-y border-forest-deep/10 py-12 md:grid-cols-3 md:gap-12 md:py-16">
            {industry.metrics.map((m) => (
              <div key={m.label}>
                <p className="serif text-[clamp(40px,5vw,72px)] font-light leading-none tracking-[-0.03em] text-forest-deep">
                  {m.value}
                </p>
                <p className="eyebrow mt-3 text-moss">{m.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-bone py-20 md:py-28">
        <Container>
          <p className="eyebrow text-moss">Why teams in {industry.short.toLowerCase()} choose us</p>
          <SplitText
            as="h2"
            className="serif mt-5 max-w-4xl text-[clamp(32px,4vw,56px)] font-light leading-[1.02] tracking-[-0.03em] text-forest-deep"
          >
            {industry.short === "Pharma"
              ? "Compliance documentation, batch traceability, predictable cadence."
              : industry.short === "FMCG & Food"
              ? "Reinforced builds, food-safe fabric, despatch you can plan around."
              : industry.short === "E-commerce"
              ? "Low MOQs, edition runs, fulfilment-friendly packaging."
              : industry.short === "Events & Weddings"
              ? "Tight calendars, per-event SKUs, direct-to-venue despatch."
              : industry.short === "Fashion & Boutique"
              ? "Lower MOQs, higher print resolution, finishes that match the garment."
              : "Bags that survive the high-traffic counter and the printed brand promise."}
          </SplitText>

          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
            {industry.whyUs.map((w, i) => (
              <article key={w.title}>
                <div className="mono text-[11px] tracking-[0.22em] text-moss">
                  0{i + 1}
                </div>
                <h3 className="serif mt-4 text-[24px] font-light leading-tight tracking-[-0.02em] text-forest-deep">{w.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-forest-deep/75">{w.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <Container>
          <p className="eyebrow text-moss">Best-fit applications</p>
          <SplitText
            as="h2"
            className="serif mt-5 max-w-4xl text-[clamp(28px,3.4vw,48px)] font-light leading-[1.06] tracking-[-0.03em] text-forest-deep"
          >
            Where {industry.short.toLowerCase()} teams put these bags to work.
          </SplitText>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            {industry.applications.map((a) => (
              <li key={a} className="flex items-start gap-3 border-t border-forest-deep/15 pt-4 text-sm text-forest-deep">
                <Check size={16} className="mt-0.5 shrink-0 text-leaf" aria-hidden="true" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-forest-deep py-20 text-bone md:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-sage">Recommended products for {industry.short.toLowerCase()}</p>
              <SplitText
                as="h2"
                className="serif mt-4 text-[clamp(28px,3.4vw,48px)] font-light leading-[1.04] tracking-[-0.03em]"
              >
                Built for this sector.
              </SplitText>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100">
              All products <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 [&>*]:!w-full">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} className="!w-full" />
            ))}
          </div>
        </Container>
      </section>

      <CTABanner />

      <JsonLd
        id={`ld-breadcrumb-industry-${industry.slug}`}
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Industries", href: "/industries" },
          { name: industry.short, href: `/industries/${industry.slug}` },
        ])}
      />
    </>
  );
}
