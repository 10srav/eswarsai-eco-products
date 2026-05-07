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
import { breadcrumbSchema, productSchema } from "@/lib/schema";
import { products, productsBySlug, type Product } from "@/lib/products";
import { company } from "@/lib/company";

type Params = { slug: string };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = productsBySlug[slug];
  if (!product) return buildMetadata({ title: "Not found", noindex: true });
  return buildMetadata({
    title: product.name,
    description: product.shortDesc,
    path: `/products/${product.slug}`,
    ogImage: `${company.url}${product.image.src}`,
    keywords: [product.name, `${product.category} bag`, "non woven bag manufacturer", "jute bag supplier", "Andhra Pradesh"],
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = productsBySlug[slug];
  if (!product) notFound();

  const related = products.filter((p) => p.slug !== product.slug && p.category === product.category).slice(0, 3);
  const fallbackRelated = related.length === 3 ? related : products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-deep via-forest to-moss pb-20 pt-36 text-bone md:pb-28 md:pt-44">
        <Container>
          <nav aria-label="Breadcrumb" className="eyebrow flex items-center gap-3 text-sage">
            <Link href="/products" className="opacity-80 hover:opacity-100">Products</Link>
            <span className="opacity-50">/</span>
            <span>{product.category}</span>
          </nav>
          <div className="mt-8 grid gap-12 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-16">
            <div>
              <p className="mono text-xs tracking-[0.2em] text-sage">{product.number} / {product.category}</p>
              <SplitText
                as="h1"
                className="serif mt-5 text-[clamp(44px,7vw,108px)] font-light leading-[0.95] tracking-[-0.04em]"
              >
                {product.name}
              </SplitText>
              <p className="mt-8 max-w-md text-base leading-relaxed opacity-80 md:text-lg">{product.longDesc}</p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <MagneticButton href={`/contact?req=${encodeURIComponent(product.name)}`} variant="primary">
                  Request samples <ArrowRight size={16} />
                </MagneticButton>
                <a
                  href={`https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(`Hi, I'd like a quote for ${product.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-bone/30 px-7 py-4 text-sm transition-colors hover:bg-bone/10"
                >
                  WhatsApp us
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-bone/[0.04] md:aspect-square">
              <Image
                src={product.image.src}
                alt={product.image.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-8"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-bone py-20 md:py-28">
        <Container>
          <div className="grid gap-16 md:grid-cols-3 md:gap-12">
            <div>
              <p className="eyebrow text-moss">Specs</p>
              <p className="serif mt-4 text-[clamp(28px,3vw,40px)] font-light leading-tight tracking-tight text-forest-deep">
                {product.spec}
              </p>
            </div>
            <div>
              <p className="eyebrow text-moss">Features</p>
              <ul className="mt-5 grid gap-3 text-sm">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check size={16} className="mt-0.5 shrink-0 text-leaf" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-moss">Best for</p>
              <ul className="mt-5 grid gap-3 text-sm">
                {product.applications.map((a) => (
                  <li key={a} className="flex items-start gap-2.5">
                    <ArrowUpRight size={16} className="mt-0.5 shrink-0 text-leaf" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-forest-deep py-20 text-bone md:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <p className="eyebrow text-sage">More from this range</p>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100">
              All products <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 [&>*]:!w-full">
            {fallbackRelated.map((p: Product) => (
              <ProductCard key={p.slug} product={p} className="!w-full" />
            ))}
          </div>
        </Container>
      </section>

      <CTABanner />

      <JsonLd id={`ld-product-${product.slug}`} data={productSchema(product)} />
      <JsonLd
        id={`ld-breadcrumb-${product.slug}`}
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Products", href: "/products" },
          { name: product.name, href: `/products/${product.slug}` },
        ])}
      />
    </>
  );
}
