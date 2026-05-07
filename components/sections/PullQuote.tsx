"use client";

import { Container } from "@/components/Container";
import { SplitText } from "@/components/ui/SplitText";

export function PullQuote() {
  return (
    <section className="relative bg-bone py-32 md:py-40">
      <Container>
        <div className="serif relative mx-auto max-w-5xl text-center">
          <span aria-hidden="true" className="serif absolute -top-6 left-0 text-[160px] leading-none text-leaf/30 md:-top-10 md:text-[220px]">
            &ldquo;
          </span>
          <SplitText
            as="blockquote"
            className="relative text-[clamp(28px,4vw,52px)] font-light leading-[1.15] tracking-[-0.02em] text-forest-deep"
          >
            Where nature meets design. Bringing fresh ideas and greener spaces to life.
          </SplitText>
          <div className="mono mt-10 text-xs uppercase tracking-[0.3em] text-moss">
            — Eswar Sai Eco Products · Manufacturing since 2013
          </div>
        </div>
      </Container>
    </section>
  );
}
