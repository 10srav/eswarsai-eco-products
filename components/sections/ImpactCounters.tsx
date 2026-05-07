"use client";

import { Container } from "@/components/Container";
import { Counter } from "@/components/ui/Counter";
import { SplitText } from "@/components/ui/SplitText";
import { company } from "@/lib/company";
import { cn } from "@/lib/utils";

export function ImpactCounters() {
  return (
    <section id="impact" className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div aria-hidden="true" className="paper-fiber pointer-events-none absolute inset-0 opacity-60" />
      <Container>
        <div className="grid gap-12 md:grid-cols-[auto_1fr] md:items-end md:gap-20">
          <div className="md:max-w-md">
            <p className="eyebrow flex items-center gap-3 text-moss">
              <span className="h-px w-6 bg-current" />
              Impact since {company.founded}
            </p>
            <SplitText
              as="h2"
              className="serif mt-8 text-[clamp(40px,7vw,96px)] font-light leading-[0.95] tracking-[-0.04em]"
            >
              Numbers we measure, so the planet doesn&apos;t have to.
            </SplitText>
          </div>
          <p className="serif drop-cap text-[clamp(18px,1.6vw,22px)] font-light leading-[1.5] tracking-tight text-forest-deep/80 md:max-w-lg">
            We don&apos;t guess our impact — we count it. Every bag despatched. Every tonne of plastic avoided. Every brand that chose reusable over single-use. The math is honest because it&apos;s math.
          </p>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden border-t border-forest-deep/15 bg-forest-deep/15 sm:grid-cols-2 lg:grid-cols-4">
          {company.impact.map((cell, i) => (
            <div
              key={cell.label}
              className={cn("relative bg-cream px-6 py-10 md:px-8 md:py-12")}
            >
              <span
                aria-hidden="true"
                className="mono absolute right-6 top-6 text-[10px] tracking-[0.3em] text-moss/50"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div
                className="serif font-light leading-none tracking-[-0.04em] text-forest-deep"
                style={{ fontSize: "clamp(48px, 6vw, 88px)" }}
              >
                <Counter value={cell.value} format="raw" />
                <span className="text-[0.55em] italic text-moss">{cell.unit}</span>
              </div>
              <div className="eyebrow mt-5 text-moss">{cell.label}</div>
              <p className="mt-3 max-w-[26ch] text-sm leading-relaxed text-forest-deep/65 text-pretty">
                {cell.sub}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
