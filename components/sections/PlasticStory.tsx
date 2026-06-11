"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Container } from "@/components/Container";
import { cn } from "@/lib/utils";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin, DrawSVGPlugin);
  registered = true;
}

/* One hero path, eight states. All shapes share the 240x280 viewBox so the
   morph stays centered. Stroke-only, single weight, abstract. */
const BAG =
  "M78 36 L78 70 L60 102 L60 230 L180 230 L180 102 L162 70 L162 36 L138 36 L138 62 L102 62 L102 36 Z";
const CRUMPLE =
  "M100 122 C112 106 140 108 148 124 C170 118 188 138 178 156 C192 168 184 194 162 196 C158 216 128 222 114 206 C92 216 70 198 78 178 C60 166 70 136 94 136 C94 128 96 126 100 122 Z";
const WAVE =
  "M36 156 C64 128 92 184 120 156 C148 128 176 184 204 156 L204 192 C176 220 148 164 120 192 C92 220 64 164 36 192 Z";
const SLAB =
  "M48 174 C48 162 70 156 120 156 C170 156 192 162 192 174 C192 186 170 192 120 192 C70 192 48 186 48 174 Z";
const TOTE =
  "M68 92 L92 92 C92 54 148 54 148 92 L172 92 L172 224 L68 224 Z";
const LOOP =
  "M120 102 C152.6 102 179 128.4 179 161 C179 193.6 152.6 220 120 220 C87.4 220 61 193.6 61 161 C61 128.4 87.4 102 120 102 Z";
const LEAF =
  "M120 56 C170 94 178 162 140 206 C132 215 124 221 120 230 C116 221 108 215 100 206 C62 162 70 94 120 56 Z";

const VEIN = "M120 222 C120 178 120 138 120 90";
const BRAND_RECT = "M98 128 L142 128 L142 166 L98 166 Z";
const BRAND_LINE = "M108 178 L132 178";
const RULE = "M24 260 L216 260";

const STAT_LINE =
  "India banned single-use plastic bags in 2022. We started replacing them in 2013.";

type Beat = {
  act: 1 | 2;
  shape: string;
  pre: string;
  em: string;
  post?: string;
  emClass: string;
  extras?: string[];
};

const BEATS: Beat[] = [
  { act: 1, shape: BAG, pre: "Carried for", em: "12 minutes.", emClass: "text-beige" },
  { act: 1, shape: CRUMPLE, pre: "Clogs a drain", em: "by monsoon.", emClass: "text-beige" },
  { act: 1, shape: WAVE, pre: "Reaches the", em: "Bay of Bengal.", emClass: "text-beige" },
  {
    act: 1,
    shape: SLAB,
    pre: "Outlives everyone who touched it.",
    em: "500 years.",
    emClass: "text-flame",
  },
  { act: 2, shape: TOTE, pre: "Carried", em: "200+ times.", emClass: "text-sage" },
  {
    act: 2,
    shape: TOTE,
    pre: "Your brand on",
    em: "every shoulder.",
    emClass: "text-sage",
    extras: [BRAND_RECT, BRAND_LINE],
  },
  { act: 2, shape: LOOP, pre: "Recycled into", em: "the next run.", emClass: "text-sage" },
  {
    act: 2,
    shape: LEAF,
    pre: "Gone in",
    em: "months,",
    post: "not centuries.",
    emClass: "text-sage",
    extras: [VEIN],
  },
];

function BeatLine({ b }: { b: Beat }) {
  return (
    <>
      {b.pre} <em className={cn("italic", b.emClass)}>{b.em}</em>
      {b.post ? <> {b.post}</> : null}
    </>
  );
}

function ShapeGlyph({
  d,
  extras,
  className,
}: {
  d: string;
  extras?: string[];
  className?: string;
}) {
  return (
    <svg viewBox="0 0 240 280" fill="none" aria-hidden="true" className={className}>
      <path
        d={d}
        stroke="currentColor"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {extras?.map((e) => (
        <path
          key={e}
          d={e}
          stroke="currentColor"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.7}
        />
      ))}
    </svg>
  );
}

export function PlasticStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    ensureRegistered();
    const root = sectionRef.current;
    if (!root) return;

    // gsap.matchMedia is a gsap.context under the hood; mm.revert() reverts
    // every tween, ScrollTrigger and inline style created inside it.
    const mm = gsap.matchMedia(root);

    mm.add("(min-width: 768px)", () => {
      const pinEl = root.querySelector<HTMLElement>(".ps-pin");
      const hero = root.querySelector<SVGPathElement>(".ps-hero");
      const rule = root.querySelector<SVGPathElement>(".ps-rule");
      const vein = root.querySelector<SVGPathElement>(".ps-vein");
      const title1 = root.querySelector<HTMLElement>(".ps-title-1");
      const title2 = root.querySelector<HTMLElement>(".ps-title-2");
      const stat = root.querySelector<HTMLElement>(".ps-stat");
      const brand = Array.from(root.querySelectorAll<SVGPathElement>(".ps-brand path"));
      const beats = Array.from(root.querySelectorAll<HTMLElement>(".ps-beat"));
      const rail = Array.from(root.querySelectorAll<HTMLElement>(".ps-rail-item"));
      if (!pinEl || !hero || !rule || !vein || !title1 || !title2 || !stat) return;
      if (beats.length !== BEATS.length) return;

      // Beats live in normal flow (readable without JS); JS stacks them for
      // the crossfade. mm.revert() restores the flow layout.
      gsap.set(beats, { position: "absolute", top: 0, left: 0, width: "100%", margin: 0 });
      gsap.set(beats.slice(1), { opacity: 0, y: 44 });
      gsap.set(title2, { opacity: 0.35 });
      gsap.set(stat, { opacity: 0, y: 14 });
      gsap.set([...brand, vein], { drawSVG: "0%" });

      const STEP = 1.6;
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: "+=400%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      for (let i = 1; i < BEATS.length; i++) {
        const at = i * STEP;
        tl.to(beats[i - 1], { opacity: 0, y: -40, duration: 0.5, ease: "power3.in" }, at).to(
          beats[i],
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          at + 0.22,
        );
        if (BEATS[i].shape !== BEATS[i - 1].shape) {
          tl.to(hero, { morphSVG: BEATS[i].shape, duration: 0.9 }, at);
        }
        tl.to(rail[i - 1], { opacity: 0.4, duration: 0.3 }, at).to(
          rail[i],
          { opacity: 1, duration: 0.3 },
          at,
        );
      }

      // Act change: plastic to non-woven.
      tl.to(hero, { stroke: "#52b788", duration: 0.9 }, 4 * STEP)
        .to(title1, { opacity: 0.35, duration: 0.6 }, 4 * STEP)
        .to(title2, { opacity: 1, duration: 0.6 }, 4 * STEP);

      // Beat 6: the brand mark prints onto the tote.
      tl.to(brand, { drawSVG: "100%", duration: 0.6, stagger: 0.12 }, 5 * STEP + 0.25).to(
        brand,
        { opacity: 0, duration: 0.4 },
        6 * STEP,
      );

      // Beat 8: leaf vein draws, stat line settles in.
      tl.to(vein, { drawSVG: "100%", duration: 0.7 }, 7 * STEP + 0.3)
        .to(stat, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 7 * STEP + 0.7)
        .to({}, { duration: 0.5 }, 7 * STEP + 1.3);

      // Timeline rule draws across the full story.
      tl.fromTo(
        rule,
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: tl.duration(), ease: "none" },
        0,
      );

      const onFonts = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(onFonts).catch(() => {});
    });

    mm.add("(max-width: 767px)", () => {
      const items = Array.from(
        root.querySelectorAll<HTMLElement>(".ps-m-beat, .ps-stat"),
      );
      if (items.length === 0) return;
      gsap.set(items, { opacity: 0, y: 28 });
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            gsap.to(entry.target, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
            io.unobserve(entry.target);
          }
        },
        { threshold: 0.2 },
      );
      items.forEach((el) => io.observe(el));
      return () => io.disconnect();
    });

    return () => mm.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <section key="ps-static" className="bg-forest-deep py-24 text-bone md:py-32">
        <Container>
          <div className="eyebrow flex items-center gap-3 text-sage">
            <span className="h-px w-6 bg-current" />
            The life of a bag
          </div>
          <h2 className="serif mt-8 max-w-3xl text-[clamp(32px,4vw,56px)] font-light leading-[1.02] tracking-[-0.03em]">
            One plastic bag. <em className="italic text-sage">One better bag.</em>
          </h2>
          <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-12">
            {([1, 2] as const).map((act) => (
              <div key={act}>
                <div className="flex items-end justify-between gap-6">
                  <span className="mono text-[11px] uppercase tracking-[0.24em] text-bone/60">
                    {act === 1 ? "Act I · Plastic" : "Act II · Non-woven"}
                  </span>
                  <ShapeGlyph
                    d={act === 1 ? BAG : LEAF}
                    extras={act === 2 ? [VEIN] : undefined}
                    className={cn("w-12", act === 1 ? "text-beige" : "text-leaf")}
                  />
                </div>
                <ol className="mt-6 space-y-6 border-t border-bone/15 pt-8">
                  {BEATS.filter((b) => b.act === act).map((b, i) => (
                    <li key={b.em} className="flex items-baseline gap-5">
                      <span className="mono text-[11px] tracking-[0.18em] text-sage/70">
                        {String((act === 1 ? 0 : 4) + i + 1).padStart(2, "0")}
                      </span>
                      <p className="serif text-[clamp(22px,2.4vw,30px)] font-light leading-[1.1] tracking-[-0.02em]">
                        <BeatLine b={b} />
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <p className="mono mt-16 max-w-md text-[12px] leading-relaxed tracking-[0.08em] text-bone/75">
            {STAT_LINE}
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section key="ps-animated" ref={sectionRef} className="relative bg-forest-deep text-bone">
      <div className="ps-pin relative flex min-h-screen flex-col justify-center py-24 md:py-0">
        <Container className="w-full">
          <div className="md:grid md:grid-cols-12 md:items-center md:gap-12">
            <div className="md:col-span-7">
              <div className="eyebrow flex items-center gap-3 text-sage">
                <span className="h-px w-6 bg-current" />
                The life of a bag
              </div>
              <h2 className="serif mt-8 text-[clamp(28px,3vw,46px)] font-light leading-[1.05] tracking-[-0.03em]">
                <span className="ps-title-1 block">One plastic bag.</span>
                <span className="ps-title-2 block italic text-sage">One better bag.</span>
              </h2>

              {/* Desktop: beats stack in flow without JS; GSAP layers them for the scrubbed crossfade. */}
              <div className="ps-beats relative mt-10 hidden min-h-[3.6em] text-[clamp(32px,5vw,72px)] leading-[1.02] tracking-[-0.03em] md:block">
                {BEATS.map((b) => (
                  <p key={b.em} className="ps-beat serif mt-8 font-light first:mt-0">
                    <BeatLine b={b} />
                  </p>
                ))}
              </div>

              {/* Mobile: vertical sequence, static SVG keyframes, IO-triggered fades. */}
              <div className="mt-14 space-y-14 md:hidden">
                {BEATS.map((b, i) => (
                  <div key={b.em} className="ps-m-beat flex items-start gap-5">
                    <ShapeGlyph
                      d={b.shape}
                      extras={b.extras}
                      className={cn(
                        "w-14 shrink-0",
                        b.act === 1 ? "text-beige" : "text-leaf",
                      )}
                    />
                    <div>
                      <div className="mono text-[11px] tracking-[0.18em] text-sage/70">
                        {String(i + 1).padStart(2, "0")} / 08
                      </div>
                      <p className="serif mt-2 text-[clamp(26px,7vw,34px)] font-light leading-[1.05] tracking-[-0.03em]">
                        <BeatLine b={b} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="ps-stat mono mt-12 max-w-md text-[12px] leading-relaxed tracking-[0.08em] text-bone/75 md:mt-14">
                {STAT_LINE}
              </p>
            </div>

            <div className="hidden md:col-span-5 md:flex md:items-center md:gap-10">
              <svg
                className="ps-stage w-full max-w-[440px]"
                viewBox="0 0 240 280"
                fill="none"
                aria-hidden="true"
              >
                <path
                  className="ps-rule"
                  d={RULE}
                  stroke="currentColor"
                  strokeOpacity={0.25}
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                />
                <path
                  className="ps-hero"
                  d={BEATS[0].shape}
                  stroke="#e9e1cf"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <g className="ps-brand" stroke="#95d5b2" strokeWidth={1.5}>
                  <path d={BRAND_RECT} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                  <path d={BRAND_LINE} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                </g>
                <path
                  className="ps-vein"
                  d={VEIN}
                  stroke="#95d5b2"
                  strokeWidth={1.5}
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex shrink-0 flex-col gap-4 text-right" aria-hidden="true">
                {BEATS.map((b, i) => (
                  <span
                    key={b.em}
                    className={cn(
                      "ps-rail-item mono text-[11px] tracking-[0.18em]",
                      i === 0 ? "opacity-100" : "opacity-40",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
