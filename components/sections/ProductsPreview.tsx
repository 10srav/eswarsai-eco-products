"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/Container";
import { SplitText } from "@/components/ui/SplitText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ProductCard } from "./ProductCard";
import { products } from "@/lib/products";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function ProductsPreview() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const top4 = products.slice(0, 4);

  useEffect(() => {
    ensureRegistered();
    const wrap = wrapRef.current;
    const line = lineRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = wrap.querySelectorAll<HTMLElement>("[data-card]");
    if (cards.length === 0) return;

    const animate = () => {
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.08, overwrite: "auto" },
      );
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.4, ease: "expo.out", overwrite: "auto" },
        );
      }
    };

    const trigger = ScrollTrigger.create({
      trigger: wrap,
      start: "top 85%",
      once: true,
      onEnter: animate,
      onRefresh: (self) => {
        if (self.progress > 0) {
          animate();
          self.kill();
        }
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <section id="products-preview" className="relative overflow-hidden bg-forest-deep py-24 text-bone md:py-32">
      <div aria-hidden="true" className="paper-fiber pointer-events-none absolute inset-0 opacity-30" />
      <Container>
        <div className="eyebrow flex items-center gap-3 text-sage">
          <span className="h-px w-6 bg-current" />
          Our craft
        </div>
        <SplitText
          as="h2"
          className="serif mt-8 max-w-5xl text-[clamp(36px,6vw,84px)] font-light leading-[0.98] tracking-[-0.03em]"
        >
          Bags engineered for every use case.
        </SplitText>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-bone/70 md:text-lg">
          Eight categories, every gauge, every print method — engineered in-house at our Kakinada line. Here&apos;s a taste.
        </p>
        <div className="mt-10 h-px w-full overflow-hidden bg-bone/10">
          <span ref={lineRef} className="block h-full w-full origin-left bg-leaf/70" style={{ transform: "scaleX(1)" }} />
        </div>
      </Container>

      <div ref={wrapRef} className="mt-16 md:mt-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 [&>*]:!w-full">
            {top4.map((p) => (
              <div key={p.slug} data-card>
                <ProductCard product={p} className="!w-full" />
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-bone/15 pt-10 md:mt-20">
            <p className="serif max-w-md text-[clamp(20px,2vw,28px)] font-light italic leading-snug text-bone/80">
              Four shown. Four more waiting — including custom-engineered builds.
            </p>
            <MagneticButton href="/products" variant="primary">
              View all 8 products
              <ArrowRight size={16} />
            </MagneticButton>
          </div>
        </Container>
      </div>
    </section>
  );
}
