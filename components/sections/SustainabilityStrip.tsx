"use client";

import { Container } from "@/components/Container";
import { SplitText } from "@/components/ui/SplitText";
import { sustainabilityPillars } from "@/lib/products";

export function SustainabilityStrip() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest to-moss py-24 text-bone md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(149,213,178,0.18), transparent 55%)" }}
      />
      <Container>
        <div className="eyebrow flex items-center gap-3 text-sage">
          <span className="h-px w-6 bg-current" />
          Sustainability
        </div>
        <SplitText
          as="h2"
          className="serif mt-8 max-w-5xl text-[clamp(36px,6vw,84px)] font-light leading-[0.98] tracking-[-0.03em]"
        >
          Built to be reused. Designed to return.
        </SplitText>

        <div className="mt-20 grid gap-px overflow-hidden rounded-md border border-bone/15 bg-bone/15 sm:grid-cols-2">
          {sustainabilityPillars.map((p) => (
            <div key={p.title} className="bg-gradient-to-br from-forest to-forest/70 p-10 transition-colors hover:from-moss hover:to-forest">
              <div className="serif text-2xl font-light leading-tight tracking-[-0.02em] md:text-[28px]">{p.title}</div>
              <p className="mt-3 text-sm leading-relaxed opacity-75">{p.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
