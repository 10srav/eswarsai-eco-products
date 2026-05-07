"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/Container";
import { SplitText } from "@/components/ui/SplitText";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

const milestones = [
  {
    year: "2013",
    title: "Founded in Kakinada",
    body: "One stitching line, three operators, and a stubborn belief that India deserved manufacturers who cared about the planet.",
  },
  {
    year: "2015",
    title: "First major retail partner",
    body: "Signed our first chain account — 100,000 D-cut non-woven bags per month. Hand-folded the first run.",
  },
  {
    year: "2018",
    title: "Second production line",
    body: "Doubled capacity. Brought print in-house with flexo and screen, eliminating outsourced colour drift.",
  },
  {
    year: "2021",
    title: "Pan-India despatch",
    body: "Crossed 28 states served. Began palletised distribution to FMCG and listed retail accounts.",
  },
  {
    year: "2024",
    title: "Exports & 40M bags shipped",
    body: "First exports to GCC and SE Asia. Crossed forty million bags despatched lifetime — and counting.",
  },
];

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    ensureRegistered();
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = el.querySelectorAll<HTMLElement>("[data-mile]");
    if (items.length === 0) return;

    const animate = () =>
      gsap.fromTo(
        items,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.12, overwrite: "auto" },
      );

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
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
    <section className="bg-cream py-24 md:py-32">
      <Container>
        <div className="eyebrow flex items-center gap-3 text-moss">
          <span className="h-px w-6 bg-current" />
          The road so far
        </div>
        <SplitText
          as="h2"
          className="serif mt-8 max-w-4xl text-[clamp(36px,6vw,80px)] font-light leading-[0.98] tracking-[-0.03em]"
        >
          From one stitching line to forty million bags.
        </SplitText>

        <ol ref={ref} className="relative mt-20 border-l border-forest-deep/15 pl-8 md:pl-16">
          {milestones.map((m, i) => (
            <li
              key={m.year}
              data-mile
              className="relative pb-12 last:pb-0 md:pb-16"
            >
              <span
                aria-hidden="true"
                className="absolute -left-[34px] top-1 grid h-[14px] w-[14px] place-items-center rounded-full border border-leaf bg-cream md:-left-[66px]"
              >
                <span className="block h-1.5 w-1.5 rounded-full bg-leaf" />
              </span>

              <div className="grid gap-4 md:grid-cols-[140px_1fr] md:gap-10 md:items-start">
                <div className="flex items-baseline gap-3 md:flex-col md:items-start md:gap-1">
                  <span className="mono text-[13px] font-medium uppercase tracking-[0.2em] text-moss md:text-base">
                    {m.year}
                  </span>
                  <span className="mono text-[10px] uppercase tracking-[0.3em] text-forest-deep/40">
                    {String(i + 1).padStart(2, "0")} / {String(milestones.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="md:max-w-2xl">
                  <h3 className="serif text-[clamp(22px,2.4vw,30px)] font-light leading-[1.15] tracking-[-0.02em] text-forest-deep">
                    {m.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-forest-deep/70 md:text-base">
                    {m.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
