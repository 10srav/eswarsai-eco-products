"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Container } from "@/components/Container";
import { cn } from "@/lib/utils";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
  registered = true;
}

type Tone = "bone" | "cream" | "forest";

type Media =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string };

type Stage = {
  num: string;
  name: string;
  desc: string;
  spec: string;
  tone: Tone;
  media?: Media;
};

const STAGES: Stage[] = [
  {
    num: "01",
    name: "Raw fibre",
    desc: "Virgin polypropylene granules and raw jute bales, batch-sampled before a single metre is made.",
    spec: "100% VIRGIN PP",
    tone: "bone",
  },
  {
    num: "02",
    name: "Fabric",
    desc: "Spunbond non-woven rolled in-house, every gauge from carry-light to crate-heavy.",
    spec: "60-120 GSM",
    tone: "cream",
    media: {
      kind: "image",
      src: "/images/products/nextgen-eco-bags-kakinada-manufacturing-line.jpg",
      alt: "Non-woven fabric rolls feeding the manufacturing line at the Kakinada plant",
    },
  },
  {
    num: "03",
    name: "Printing",
    desc: "Flexo, screen and digital lines under one roof. Your Pantone, matched exactly, not approximately.",
    spec: "PANTONE-MATCHED",
    tone: "bone",
    media: { kind: "video", src: "/images/gallery/factory-floor.mp4" },
  },
  {
    num: "04",
    name: "Cutting",
    desc: "Die-cut to the millimetre. D-cut, W-cut and U-cut profiles from a single press run.",
    spec: "D / W / U PROFILES",
    tone: "forest",
  },
  {
    num: "05",
    name: "Stitching",
    desc: "Ultrasonic seams where the bag folds, stitched thread lines where it carries.",
    spec: "ULTRASONIC SEAL",
    tone: "cream",
  },
  {
    num: "06",
    name: "Quality check",
    desc: "GSM verified, print inspected, and every batch load-tested well past six kilos.",
    spec: "6 KG LOAD-TESTED",
    tone: "bone",
    media: {
      kind: "image",
      src: "/images/factory/non-woven-shopping-bag.jpg",
      alt: "Finished non-woven shopping bag held up for quality inspection",
    },
  },
  {
    num: "07",
    name: "Despatch",
    desc: "Packed, manifested, moving. Twenty-eight states served, 98% despatched on schedule.",
    spec: "98% ON-TIME",
    tone: "cream",
  },
];

const TOTAL_LABEL = String(STAGES.length).padStart(2, "0");

// Meandering thread across 7 panels (each panel = 100 viewBox units wide).
const THREAD_D =
  "M0 70 C25 70 35 30 60 30 S95 72 120 70 S155 28 180 30 S215 70 240 70 S275 32 300 32 S335 72 360 70 S395 30 420 30 S455 70 480 70 S515 30 540 32 S575 72 600 70 S635 30 660 32 S692 58 700 56";

const toneBg: Record<Tone, string> = {
  bone: "bg-bone text-ink",
  cream: "bg-cream text-ink",
  forest: "bg-forest-deep text-bone",
};

function FactoryVideo({ src, reduced }: { src: string; reduced: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(video);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [reduced]);

  return (
    <figure className="relative h-[36vh] overflow-hidden rounded-md soft-shadow md:h-[52vh]">
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="h-full w-full object-cover"
      />
      <figcaption className="sr-only">
        Printing and production lines running on the NextGen Eco Bags factory floor in Kakinada.
      </figcaption>
      <span
        aria-hidden="true"
        className="mono absolute bottom-3 left-3 rounded-full bg-forest-deep/85 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-bone"
      >
        Live from the floor
      </span>
    </figure>
  );
}

function Panel({
  stage,
  horizontal,
  reduced,
}: {
  stage: Stage;
  horizontal: boolean;
  reduced: boolean;
}) {
  const { num, name, desc, spec, tone, media } = stage;
  const dark = tone === "forest";

  return (
    <article
      className={cn(
        "journey-panel relative overflow-hidden",
        toneBg[tone],
        horizontal ? "h-full w-screen shrink-0" : "w-full",
      )}
    >
      {!horizontal && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-6 top-[4.75rem] z-[2] h-2 w-2 -translate-x-[3px] rounded-full",
            dark ? "bg-sage" : "bg-leaf",
          )}
        />
      )}
      <div
        className={cn(
          "relative z-10 mx-auto w-full max-w-[1480px] pl-14 pr-6 md:px-16",
          horizontal ? "flex h-full items-center" : "py-16 md:py-20",
        )}
      >
        <div
          className={cn(
            "journey-inner grid w-full items-center gap-10 md:gap-16",
            media && "md:grid-cols-12",
          )}
        >
          <div className={cn(media && "md:col-span-7")}>
            <div
              aria-hidden="true"
              className={cn(
                "mono outline-stroke select-none text-[clamp(88px,12vw,200px)] font-light leading-none",
                dark ? "text-sage/50" : "text-moss/40",
              )}
            >
              {num}
            </div>
            <h3 className="serif mt-3 text-[clamp(30px,3.4vw,56px)] font-light leading-[1.02] tracking-[-0.03em]">
              <span className="sr-only">{`Stage ${num}: `}</span>
              {name}
            </h3>
            <p
              className={cn(
                "mt-4 max-w-[46ch] text-[15px] leading-relaxed md:text-base",
                dark ? "opacity-80" : "opacity-75",
              )}
            >
              {desc}
            </p>
            <span
              className={cn(
                "mono mt-7 inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.18em]",
                dark ? "border-bone/30 text-sage" : "border-ink/20 text-moss",
              )}
            >
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-current" />
              {spec}
            </span>
          </div>

          {media && (
            <div className="md:col-span-5">
              {media.kind === "video" ? (
                <FactoryVideo src={media.src} reduced={reduced} />
              ) : (
                <figure className="relative h-[36vh] overflow-hidden rounded-md soft-shadow md:h-[52vh]">
                  <Image
                    src={media.src}
                    alt={media.alt}
                    fill
                    sizes="(min-width: 768px) 38vw, 92vw"
                    className="object-cover"
                  />
                </figure>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function JourneyLine() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const threadDesktopRef = useRef<SVGPathElement>(null);
  const threadMobileRef = useRef<SVGPathElement>(null);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const stageCounterRef = useRef<HTMLSpanElement>(null);
  const [reduced, setReduced] = useState(false);
  // Horizontal mode is opt-in after JS confirms md+ and motion is allowed,
  // so SSR / no-JS / reduced-motion all get the vertical stacked list.
  const [horizontal, setHorizontal] = useState(false);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const widthMq = window.matchMedia("(min-width: 768px)");
    const update = () => {
      setReduced(motionMq.matches);
      setHorizontal(widthMq.matches && !motionMq.matches);
    };
    update();
    motionMq.addEventListener("change", update);
    widthMq.addEventListener("change", update);
    return () => {
      motionMq.removeEventListener("change", update);
      widthMq.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    ensureRegistered();
    const section = sectionRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!section || !stage || !track) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".journey-head > *",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".journey-head", start: "top 85%", once: true },
        },
      );

      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" },
        (mmCtx) => {
          const cond = (mmCtx.conditions ?? {}) as { desktop?: boolean; mobile?: boolean };
          const panels = gsap.utils.toArray<HTMLElement>(".journey-panel", track);
          const steps = panels.length - 1;

          if (cond.desktop && horizontal) {
            const distance = () => track.scrollWidth - window.innerWidth;
            const counterEl = stageCounterRef.current;

            const tl = gsap.timeline({
              defaults: { ease: "none", duration: 1 },
              scrollTrigger: {
                trigger: stage,
                start: "top top",
                end: () => `+=${distance()}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  if (!counterEl) return;
                  const idx = Math.min(steps, Math.round(self.progress * steps)) + 1;
                  counterEl.textContent = `${String(idx).padStart(2, "0")} / ${TOTAL_LABEL}`;
                },
              },
            });

            tl.to(track, { x: () => -distance() }, 0);
            if (threadDesktopRef.current) {
              tl.fromTo(threadDesktopRef.current, { drawSVG: "0%" }, { drawSVG: "100%" }, 0);
            }
            if (progressFillRef.current) {
              tl.fromTo(
                progressFillRef.current,
                { scaleX: 0, transformOrigin: "left center" },
                { scaleX: 1 },
                0,
              );
            }

            panels.forEach((panel, i) => {
              if (i === 0) return;
              const inner = panel.querySelector(".journey-inner");
              if (!inner) return;
              tl.fromTo(
                inner,
                { y: 56, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4 / steps, ease: "power3.out" },
                (i - 0.45) / steps,
              );
            });
          }

          if (cond.mobile) {
            panels.forEach((panel) => {
              const inner = panel.querySelector(".journey-inner");
              if (!inner) return;
              gsap.fromTo(
                inner,
                { y: 32, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.9,
                  ease: "power3.out",
                  scrollTrigger: { trigger: panel, start: "top 80%", once: true },
                },
              );
            });
            if (threadMobileRef.current) {
              gsap.fromTo(
                threadMobileRef.current,
                { drawSVG: "0%" },
                {
                  drawSVG: "100%",
                  ease: "none",
                  scrollTrigger: {
                    trigger: track,
                    start: "top 75%",
                    end: "bottom 70%",
                    scrub: 1,
                  },
                },
              );
            }
          }
        },
      );
    }, section);

    return () => ctx.revert();
  }, [horizontal, reduced]);

  return (
    <section
      ref={sectionRef}
      id="journey"
      aria-label="Manufacturing journey, from fibre to fold"
      className="relative bg-bone"
    >
      <Container className="journey-head pb-14 pt-24 md:pb-20 md:pt-32">
        <div className="eyebrow flex items-center gap-3 text-moss">
          <span className="h-px w-6 bg-current" />
          The making
        </div>
        <h2 className="serif mt-8 max-w-4xl text-[clamp(40px,6vw,88px)] font-light leading-[0.98] tracking-[-0.03em]">
          From fibre <em className="italic text-moss">to fold.</em>
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed opacity-75">
          Seven stages, one roof. Granule to despatch dock in Kakinada, nothing
          outsourced, nothing left to chance.
        </p>
      </Container>

      <div ref={stageRef} className="relative overflow-hidden">
        <div
          ref={trackRef}
          className={cn(
            "relative",
            horizontal ? "flex h-screen w-max flex-row" : "flex w-full flex-col",
          )}
        >
          {STAGES.map((stage) => (
            <Panel key={stage.num} stage={stage} horizontal={horizontal} reduced={reduced} />
          ))}

          {horizontal && (
            <svg
              className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
              viewBox="0 0 700 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                ref={threadDesktopRef}
                d={THREAD_D}
                fill="none"
                stroke="#52b788"
                strokeWidth={0.18}
                strokeLinecap="round"
                opacity={0.55}
              />
            </svg>
          )}
        </div>

        {!horizontal && (
          <svg
            className="pointer-events-none absolute inset-y-0 left-6 z-[1] w-[2px]"
            viewBox="0 0 2 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              ref={threadMobileRef}
              d="M1 0 L1 100"
              fill="none"
              stroke="#52b788"
              strokeWidth={2}
              opacity={0.55}
            />
          </svg>
        )}

        {horizontal && (
          <div
            className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2"
            aria-hidden="true"
          >
            <div className="mono flex items-center gap-4 rounded-full border border-bone/20 bg-forest-deep px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-bone">
              <span>Scroll</span>
              <span className="relative block h-[2px] w-24 overflow-hidden rounded-full bg-bone/25">
                <span
                  ref={progressFillRef}
                  className="absolute inset-0 origin-left scale-x-0 bg-leaf"
                />
              </span>
              <span ref={stageCounterRef}>01 / {TOTAL_LABEL}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
