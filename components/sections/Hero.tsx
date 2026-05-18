"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { Counter } from "@/components/ui/Counter";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HeroBag } from "@/components/sections/HeroBag";
import { company } from "@/lib/company";
import { cn } from "@/lib/utils";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

const ROTATING_WORDS = [
  "with non-woven.",
  "with jute.",
  "with care.",
  "with craft.",
  "with science.",
];
const LONGEST_WORD = ROTATING_WORDS.reduce((a, b) => (b.length > a.length ? b : a));

type Status = { time: string; day: string };

function nowIST(): Status {
  const fmtTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const fmtDay = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
  });
  const d = new Date();
  return { time: fmtTime.format(d), day: fmtDay.format(d) };
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [activeWord, setActiveWord] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setStatus(nowIST());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setActiveWord((i) => (i + 1) % ROTATING_WORDS.length);
    }, 3500);
    return () => clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    ensureRegistered();
    const hero = heroRef.current;
    const titleGroup = titleGroupRef.current;
    if (!hero || !titleGroup) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
      tl.fromTo(
          ".hero-status",
          { opacity: 0, y: 8 },
          { opacity: 0.7, y: 0, duration: 0.9 },
          0.2,
        )
        .fromTo(
          ".hero-line-1",
          { yPercent: 110 },
          { yPercent: 0, duration: 1.2 },
          0.3,
        )
        .fromTo(
          ".hero-line-2",
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1 },
          0.55,
        )
        .fromTo(
          ".hero-lede",
          { opacity: 0, y: 18 },
          { opacity: 0.85, y: 0, duration: 0.9 },
          0.8,
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 },
          0.9,
        )
        .fromTo(
          ".hero-stat",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 },
          1.05,
        )
        .fromTo(
          ".hero-edge",
          { opacity: 0 },
          { opacity: 0.55, duration: 0.9 },
          1.3,
        )
        .fromTo(
          ".scroll-cue",
          { opacity: 0 },
          { opacity: 0.6, duration: 0.9 },
          1.45,
        );

      gsap.to(titleGroup, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, hero);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={heroRef}
      aria-label="Home hero"
      className="relative isolate flex min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-b from-forest-deep via-forest to-moss px-6 pb-10 pt-24 text-bone md:px-10 md:pt-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(149,213,178,0.28), transparent 50%), radial-gradient(ellipse at 10% 90%, rgba(82,183,136,0.22), transparent 60%)",
        }}
      />

      <div
        className="hero-edge pointer-events-none absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 origin-right rotate-[-90deg] whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.3em] text-bone opacity-[0.55] md:block"
        aria-hidden="true"
      >
        EST. 2013 · KAKINADA · NON-WOVEN · JUTE · INDIA
      </div>

      <div className="relative z-10">
        <div className="hero-status flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] opacity-70">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-leaf" />
            LIVE
          </span>
          <span aria-hidden="true">·</span>
          <span suppressHydrationWarning>
            {status ? `${status.time} IST` : "LIVE"}
          </span>
          <span aria-hidden="true">·</span>
          <span suppressHydrationWarning>{status ? status.day : "KAKINADA"}</span>
          <span aria-hidden="true">·</span>
          <span>Kakinada · Andhra Pradesh</span>
          <span aria-hidden="true">·</span>
          <span>EST. 2013 · 28 STATES</span>
        </div>

        <div ref={titleGroupRef} className="relative z-10 mt-10 max-w-[60%]">
          <h1
            className="serif font-light"
            style={{
              fontSize: "clamp(56px, 9vw, 168px)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
            }}
          >
            <span className="block overflow-hidden">
              <span className="hero-line-1 block will-change-transform">
                Replace plastic.
              </span>
            </span>
            <span className="relative mt-1 block overflow-hidden italic text-sage">
              <span className="hero-line-2 block will-change-transform">
                <span className="relative inline-block align-top">
                  <span
                    aria-hidden="true"
                    className="invisible block whitespace-nowrap italic"
                  >
                    {LONGEST_WORD}
                  </span>
                  <span
                    key={mounted ? activeWord : "ssr"}
                    className={cn(
                      "absolute left-0 top-0 block whitespace-nowrap",
                      mounted && !reduced
                        ? "animate-word-in [clip-path:inset(0_0_0_0)] opacity-100"
                        : "opacity-100 [clip-path:inset(0_0_0_0)]",
                    )}
                  >
                    {ROTATING_WORDS[mounted ? activeWord : 0]}
                  </span>
                </span>
              </span>
            </span>
          </h1>
        </div>
      </div>

      <HeroBag />

      <div className="relative z-10">
        <div className="mt-6 flex flex-wrap items-end justify-between gap-10 md:mt-10">
          <p className="hero-lede max-w-md text-base leading-relaxed opacity-85 md:text-[17px]">
            We manufacture premium non-woven and jute bags for forward-thinking
            brands. Custom prints, every gauge, every shape — built to be reused,
            not thrown away.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="hero-cta">
              <MagneticButton href="/contact" variant="primary">
                Request samples
                <ArrowRight size={16} />
              </MagneticButton>
            </span>
            <span className="hero-cta">
              <Link
                href="/products"

                className="group relative inline-flex items-center gap-2 px-1 py-2 text-sm font-medium tracking-wide text-bone"
              >
                <span className="relative">
                  See the range
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-bone transition-transform duration-500 ease-[cubic-bezier(.7,0,.3,1)] group-hover:scale-x-100"
                  />
                </span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </Link>
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-6 border-t border-bone/20 pt-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {company.stats.map((s) => (
            <div key={s.label} className="hero-stat">
              <div
                className="serif font-light leading-none tracking-tight"
                style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
              >
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="eyebrow mt-2 opacity-60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="scroll-cue pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-[10px] uppercase tracking-[0.32em] opacity-60"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="rotate-90">SCROLL</span>
          <span className="block h-10 w-px origin-top animate-drop bg-current" />
        </div>
      </div>
    </section>
  );
}
