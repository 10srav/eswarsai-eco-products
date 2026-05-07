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

const TRASH_PATH =
  "M9 2v3h6V2h2v3h1a3 3 0 0 1 3 3v1H3V8a3 3 0 0 1 3-3h1V2h2zm-6 9h18l-1.5 11a2 2 0 0 1-2 1.8H6.5a2 2 0 0 1-2-1.8L3 11z";
const LEAF_PATH =
  "M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z";

function makeIcon({ x, d, dl, sz, fill, anim, pathD }: {
  x: number; d: number; dl: number; sz: number; fill: string; anim: "fall" | "leaffall"; pathD: string;
}) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", fill);
  svg.setAttribute("aria-hidden", "true");
  svg.style.cssText = `position:absolute;left:${x}%;top:-30px;width:${sz}px;animation: ${anim} ${d}s ${anim === "fall" ? "linear" : "ease-in"} ${dl}s infinite;`;
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathD);
  svg.appendChild(path);
  return svg;
}

export function StoryPanels() {
  const sectionRef = useRef<HTMLElement>(null);
  const badRef = useRef<HTMLDivElement>(null);
  const goodRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureRegistered();
    const bad = badRef.current;
    const good = goodRef.current;
    const section = sectionRef.current;
    if (!bad || !good || !section) return;

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (let i = 0; i < 24; i++) {
        bad.appendChild(
          makeIcon({
            x: Math.random() * 100,
            d: 4 + Math.random() * 6,
            dl: Math.random() * 5,
            sz: 14 + Math.random() * 18,
            fill: "#cfc8b8",
            anim: "fall",
            pathD: TRASH_PATH,
          }),
        );
      }
      for (let i = 0; i < 18; i++) {
        good.appendChild(
          makeIcon({
            x: Math.random() * 100,
            d: 6 + Math.random() * 5,
            dl: Math.random() * 6,
            sz: 18 + Math.random() * 14,
            fill: "#95d5b2",
            anim: "leaffall",
            pathD: LEAF_PATH,
          }),
        );
      }
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 75%",
      once: true,
      onEnter: () => {
        gsap.from(bad.parentElement!, { x: -40, opacity: 0, duration: 1.1, ease: "expo.out" });
        gsap.from(good.parentElement!, { x: 40, opacity: 0, duration: 1.1, ease: "expo.out", delay: 0.15 });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section ref={sectionRef} id="story" className="relative overflow-hidden bg-bone py-24 md:py-32">
      <Container>
        <div className="eyebrow flex items-center gap-3 text-moss">
          <span className="h-px w-6 bg-current" />
          The honest truth
        </div>
        <SplitText
          as="h2"
          className="serif mt-8 max-w-5xl text-[clamp(36px,6vw,84px)] font-light leading-[0.98] tracking-[-0.03em]"
        >
          Plastic isn&apos;t single-use. It&apos;s forever-use. We make a better answer.
        </SplitText>

        <div className="mt-20 grid gap-6 md:grid-cols-2 md:gap-12">
          <article className="story-bad relative flex min-h-[480px] flex-col justify-between overflow-hidden rounded-md border border-forest-deep/20 bg-gradient-to-br from-[#1a1410] to-[#2a1d12] p-10 text-cream md:p-12">
            <div ref={badRef} className="pointer-events-none absolute inset-0 opacity-[0.18]" aria-hidden="true" />
            <div className="relative">
              <div className="eyebrow flex items-center gap-2.5 opacity-70">
                <span className="text-lg text-flame">✕</span> Plastic bags
              </div>
              <h3 className="serif mt-6 text-[clamp(28px,3.4vw,46px)] font-light leading-[1.05] tracking-[-0.02em]">
                A 5-second carry. <em className="italic">A 500-year stain.</em>
              </h3>
            </div>
            <div className="relative mt-10 flex flex-wrap gap-10">
              <div>
                <div className="serif text-[clamp(32px,4vw,52px)] font-light leading-none">5T</div>
                <div className="eyebrow mt-2 max-w-[180px] opacity-60">tonnes of plastic enter oceans every minute</div>
              </div>
              <div>
                <div className="serif text-[clamp(32px,4vw,52px)] font-light leading-none">1%</div>
                <div className="eyebrow mt-2 max-w-[180px] opacity-60">of plastic bags are ever recycled globally</div>
              </div>
            </div>
          </article>

          <article className="story-good relative flex min-h-[480px] flex-col justify-between overflow-hidden rounded-md border border-leaf/30 bg-gradient-to-br from-forest to-moss p-10 text-bone md:p-12">
            <div ref={goodRef} className="pointer-events-none absolute inset-0 opacity-[0.22]" aria-hidden="true" />
            <div className="relative">
              <div className="eyebrow flex items-center gap-2.5 opacity-70">
                <span className="text-lg text-sage">✓</span> Non-woven & jute
              </div>
              <h3 className="serif mt-6 text-[clamp(28px,3.4vw,46px)] font-light leading-[1.05] tracking-[-0.02em]">
                Used <em className="italic">hundreds</em> of times. Composted in months.
              </h3>
            </div>
            <div className="relative mt-10 flex flex-wrap gap-10">
              <div>
                <div className="serif text-[clamp(32px,4vw,52px)] font-light leading-none">200×</div>
                <div className="eyebrow mt-2 max-w-[180px] opacity-60">reusable lifecycle vs single-use plastic</div>
              </div>
              <div>
                <div className="serif text-[clamp(32px,4vw,52px)] font-light leading-none">100%</div>
                <div className="eyebrow mt-2 max-w-[180px] opacity-60">recyclable, breathable, food-safe fabric</div>
              </div>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
