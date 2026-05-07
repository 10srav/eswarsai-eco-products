"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/Container";
import { SplitText } from "@/components/ui/SplitText";
import { industries } from "@/lib/products";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function IndustriesGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureRegistered();
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cells = el.querySelectorAll<HTMLElement>("[data-cell]");
    if (cells.length === 0) return;

    const animate = () =>
      gsap.fromTo(
        cells,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.06, overwrite: "auto" },
      );

    const trigger = ScrollTrigger.create({
      trigger: el,
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
    <section id="industries" className="bg-bone py-24 md:py-32">
      <Container>
        <div className="eyebrow flex items-center gap-3 text-moss">
          <span className="h-px w-6 bg-current" />
          Industries we serve
        </div>
        <SplitText
          as="h2"
          className="serif mt-8 max-w-5xl text-[clamp(36px,6vw,84px)] font-light leading-[0.98] tracking-[-0.03em]"
        >
          From kirana counters to listed FMCG.
        </SplitText>

        <div ref={ref} className="mt-20 grid gap-px overflow-hidden rounded-md border border-forest-deep/10 bg-forest-deep/10 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((it) => (
            <Link
              key={it.slug}
              href="/industries"
              data-cell
              data-cursor="link"
              className="group flex min-h-[260px] flex-col justify-between bg-bone p-10 transition-colors hover:bg-forest-deep hover:text-bone"
            >
              <div>
                <div className="mono text-xs tracking-[0.15em] text-moss group-hover:text-sage">{it.count}</div>
                <h3 className="serif mt-3 text-[26px] font-light leading-tight tracking-[-0.02em]">{it.name}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-70">{it.desc}</p>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                Learn more <ArrowUpRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
