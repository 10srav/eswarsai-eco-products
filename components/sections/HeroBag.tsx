"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

type Slide = {
  src: string;
  label: string;
  sub: string;
  tone: string;
};

const SLIDES: Slide[] = [
  { src: "/images/products/non-woven-bag.jpg", label: "esep-001", sub: "loop handle · 120 gsm", tone: "leaf" },
  { src: "/images/products/d-cut-non-woven-bags-1-.avif", label: "esep-002", sub: "d-cut · 90 gsm", tone: "spectrum" },
  { src: "/images/products/non-woven-w-cut-bags-500x500-1.webp", label: "esep-003", sub: "w-cut · 80 gsm", tone: "spectrum" },
  { src: "/images/products/PP-Colored-W-Cut-Non-Woven-Bag.webp", label: "esep-004", sub: "pp coloured · 100 gsm", tone: "spectrum" },
  { src: "/images/products/printed-non-woven-carry-bag-f-20240416214534297.jpg", label: "esep-005", sub: "custom print · 120 gsm", tone: "botanical" },
];

const SLIDE_MS = 4500;
const SLIDE_S = SLIDE_MS / 1000;

const PARTICLES = Array.from({ length: 11 }).map((_, i) => ({
  size: 2 + ((i * 7) % 4),
  left: (i * 13 + 9) % 96,
  top: (i * 19 + 11) % 92,
  delay: (i * 0.37) % 4,
  duration: 9 + ((i * 3) % 7),
}));

const MOBILE_TAGS = [
  { code: "/ a01", line1: "120 gsm", line2: "non-woven" },
  { code: "/ a02", line1: "reinforced", line2: "handles" },
  { code: "/ a03", line1: "reusable", line2: "×100 trips" },
];

export function HeroBag() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pendulumRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const platterRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const mobileTagsRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevIndexRef = useRef(0);
  const pausedRef = useRef(false);

  const [reduced, setReduced] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let alive = true;
    const tween = gsap.to(
      {},
      {
        duration: SLIDE_S,
        repeat: -1,
        delay: 2.4,
        ease: "none",
        onRepeat: () => {
          if (alive && !pausedRef.current) {
            setIndex((i) => (i + 1) % SLIDES.length);
          }
        },
      },
    );
    return () => {
      alive = false;
      tween.kill();
    };
  }, [reduced]);

  useEffect(() => {
    const prev = slideRefs.current[prevIndexRef.current];
    const next = slideRefs.current[index];

    if (reduced) {
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          opacity: i === index ? 1 : 0,
          zIndex: i === index ? 2 : 0,
          clearProps: "yPercent,scale,filter",
        });
      });
    } else if (prev && next && prev !== next) {
      const tl = gsap.timeline();
      tl.set(next, { zIndex: 3 }, 0);
      tl.set(prev, { zIndex: 2 }, 0);
      tl.to(prev, { yPercent: -32, scale: 0.92, opacity: 0, filter: "blur(10px)", duration: 0.65, ease: "expo.in" }, 0);
      tl.fromTo(
        next,
        { yPercent: 38, scale: 1.07, opacity: 0, filter: "blur(12px)" },
        { yPercent: 0, scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.05, ease: "expo.out" },
        0.12,
      );
      tl.set(prev, { zIndex: 1 });
      tl.set(next, { zIndex: 2 });
    }

    if (captionRef.current && !reduced) {
      gsap.fromTo(captionRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.55, ease: "expo.out", delay: 0.25 });
    }
    if (counterRef.current && !reduced) {
      gsap.fromTo(counterRef.current, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.55, ease: "expo.out", delay: 0.25 });
    }

    progressRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.killTweensOf(el);
      if (i < index) gsap.set(el, { scaleX: 1 });
      else if (i > index) gsap.set(el, { scaleX: 0 });
      else if (reduced) gsap.set(el, { scaleX: 1 });
      else gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: SLIDE_S, ease: "none" });
    });

    prevIndexRef.current = index;
  }, [index, reduced]);

  useEffect(() => {
    ensureRegistered();
    const wrap = wrapRef.current;
    const ring = ringRef.current;
    const pendulum = pendulumRef.current;
    const tilt = tiltRef.current;
    const platter = platterRef.current;
    const stack = stackRef.current;
    const shimmer = shimmerRef.current;
    const shadow = shadowRef.current;
    const tags = tagsRef.current;
    const mobileTags = mobileTagsRef.current;
    if (!wrap || !ring || !pendulum || !tilt || !platter || !stack || !shimmer || !shadow || !tags || !mobileTags) return;

    const mobileTagEls = Array.from(
      mobileTags.querySelectorAll<HTMLElement>(".bag-mobile-tag"),
    );

    const ctx = gsap.context(() => {
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          opacity: i === 0 ? 1 : 0,
          yPercent: i === 0 ? 0 : 38,
          scale: i === 0 ? 1 : 1.07,
          filter: i === 0 ? "blur(0px)" : "blur(12px)",
          zIndex: i === 0 ? 2 : 1,
        });
      });

      if (reduced) {
        gsap.fromTo(platter, { clipPath: "inset(0 50% 0 50%)", opacity: 0 }, { clipPath: "inset(0 0% 0 0%)", opacity: 1, duration: 0.6 });
        gsap.set([shadow, tags, ring, mobileTags], { opacity: 1 });
        if (mobileTagEls.length) gsap.set(mobileTagEls, { opacity: 1, y: 0 });
        return;
      }

      // Stage initial states
      gsap.set(platter, { clipPath: "inset(0 50% 0 50%)", scale: 0.94, rotation: -7, opacity: 0 });
      gsap.set(stack, { scale: 1.12, y: 24 });
      gsap.set(shadow, { scaleX: 0.35, opacity: 0 });
      gsap.set(ring, { scale: 0.6, opacity: 0, rotation: -30 });
      gsap.set(shimmer, { opacity: 0 });
      gsap.set(".bag-tag", { opacity: 0, y: 14 });
      gsap.set(".bag-tag-line", { strokeDashoffset: 240 });
      gsap.set(".bag-corner-frame", { opacity: 0, scale: 0.5 });
      gsap.set(".bag-particle", { opacity: 0 });
      if (mobileTagEls.length) gsap.set(mobileTagEls, { opacity: 0, y: 14 });

      // Entrance timeline (shared)
      const tl = gsap.timeline({ delay: 0.2, defaults: { ease: "expo.out" } });
      tl.to(ring, { scale: 1, rotation: 0, opacity: 1, duration: 1.6 }, 0)
        .to(platter, { clipPath: "inset(0 0% 0 0%)", scale: 1, rotation: -3, opacity: 1, duration: 1.5 }, 0.1)
        .to(stack, { scale: 1, y: 0, duration: 1.6 }, 0.2)
        .to(shadow, { scaleX: 1, opacity: 0.85, duration: 1.4 }, 0.35)
        .to(".bag-corner-frame", { opacity: 1, scale: 1, duration: 0.7, stagger: { each: 0.06, from: "random" } }, 0.95)
        .to(".bag-particle", { opacity: 1, duration: 0.6, stagger: { each: 0.04, from: "random" } }, 0.95)
        .to(".bag-tag-line", { strokeDashoffset: 0, duration: 1.0, stagger: 0.12, ease: "expo.out" }, 1.05)
        .to(".bag-tag", { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "expo.out" }, 1.2)
        .fromTo(progressRefs.current[0], { scaleX: 0 }, { scaleX: 1, duration: SLIDE_S, ease: "none" }, 1.4);

      if (mobileTagEls.length) {
        tl.to(mobileTagEls, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "expo.out" }, 1.2);
      }

      // Idle motion (shared)
      gsap.to(pendulum, {
        rotation: 2.4,
        yoyo: true,
        repeat: -1,
        duration: 6.4,
        ease: "sine.inOut",
        transformOrigin: "50% 0%",
      });
      gsap.to(platter, { y: -10, yoyo: true, repeat: -1, duration: 4.8, ease: "sine.inOut", delay: 1.7 });
      gsap.to(shadow, { scaleX: 0.78, opacity: 0.55, yoyo: true, repeat: -1, duration: 4.8, ease: "sine.inOut", delay: 1.7 });
      gsap.to(ring, { rotation: 360, repeat: -1, duration: 70, ease: "none" });

      // Scroll-driven motion (shared)
      gsap.to(pendulum, {
        yPercent: 20,
        rotation: -5,
        ease: "none",
        scrollTrigger: { trigger: wrap, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      gsap.to(ring, {
        scale: 1.18,
        opacity: 0.5,
        ease: "none",
        scrollTrigger: { trigger: wrap, start: "top top", end: "bottom top", scrub: 0.8 },
      });
      gsap.fromTo(
        wrap,
        { filter: "blur(0px)", opacity: 1 },
        {
          filter: "blur(6px)",
          opacity: 0.55,
          ease: "none",
          scrollTrigger: { trigger: wrap, start: "top top", end: "bottom top", scrub: 0.7 },
        },
      );

      // Breakpoint-specific (matchMedia auto-cleans on resize)
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Desktop: cursor parallax + slider hover-pause + side-tag scroll fade
        const setRotY = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "expo.out" });
        const setRotX = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "expo.out" });
        const setStackX = gsap.quickTo(stack, "x", { duration: 0.9, ease: "expo.out" });
        const setStackY = gsap.quickTo(stack, "y", { duration: 0.9, ease: "expo.out" });
        const setShadowX = gsap.quickTo(shadow, "x", { duration: 1.0, ease: "expo.out" });
        const setShimX = gsap.quickSetter(shimmer, "x", "px");
        const setShimY = gsap.quickSetter(shimmer, "y", "px");

        const onEnter = () => {
          pausedRef.current = true;
        };
        const onMove = (e: PointerEvent) => {
          const rect = wrap.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / rect.width - 0.5;
          const ny = (e.clientY - rect.top) / rect.height - 0.5;
          setRotY(nx * 14);
          setRotX(-ny * 10);
          setStackX(-nx * 14);
          setStackY(-ny * 10);
          setShadowX(nx * 22);
          setShimX(e.clientX - rect.left);
          setShimY(e.clientY - rect.top);
          gsap.to(shimmer, { opacity: 0.55, duration: 0.35, overwrite: "auto" });
        };
        const onLeave = () => {
          pausedRef.current = false;
          setRotY(0);
          setRotX(0);
          setStackX(0);
          setStackY(0);
          setShadowX(0);
          gsap.to(shimmer, { opacity: 0, duration: 0.6, overwrite: "auto" });
        };

        wrap.addEventListener("pointerenter", onEnter);
        wrap.addEventListener("pointermove", onMove);
        wrap.addEventListener("pointerleave", onLeave);

        gsap.to(tags, {
          opacity: 0,
          y: -50,
          ease: "power2.out",
          scrollTrigger: { trigger: wrap, start: "top top", end: "30% top", scrub: 0.5 },
        });

        return () => {
          wrap.removeEventListener("pointerenter", onEnter);
          wrap.removeEventListener("pointermove", onMove);
          wrap.removeEventListener("pointerleave", onLeave);
        };
      });

      mm.add("(max-width: 767px)", () => {
        // Mobile: scroll-driven micro-tilt replaces cursor parallax (no hover on touch)
        gsap.to(tilt, {
          rotationY: -8,
          rotationX: 4,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top 85%",
            end: "bottom 15%",
            scrub: 1.0,
          },
        });
        // Mobile inline tags fade with scroll past the hero
        if (mobileTagEls.length) {
          gsap.to(mobileTagEls, {
            opacity: 0,
            y: -20,
            ease: "power2.out",
            scrollTrigger: {
              trigger: mobileTags,
              start: "top 60%",
              end: "bottom 20%",
              scrub: 0.5,
            },
          });
        }
      });
    }, wrap);

    return () => ctx.revert();
  }, [reduced]);

  const slide = SLIDES[index];
  const count = SLIDES.length;

  return (
    <>
      <div
        ref={wrapRef}
        aria-hidden="true"
        className="hero-bag pointer-events-auto relative z-10 mx-auto mb-2 mt-4 block aspect-[4/5] w-[78vw] max-w-[320px] md:absolute md:right-[4%] md:top-[6%] md:z-0 md:m-0 md:aspect-auto md:h-[62vh] md:w-[min(40vh,440px)] md:max-w-none"
        style={{
          perspective: "1400px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Ambient ring — lighter blur on mobile for perf */}
        <div
          ref={ringRef}
          aria-hidden="true"
          className="pointer-events-none absolute [filter:blur(26px)] md:[filter:blur(50px)]"
          style={{
            inset: "-12%",
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(149,213,178,0.16) 80deg, transparent 160deg, rgba(82,183,136,0.10) 260deg, transparent 360deg)",
            borderRadius: "50%",
            mixBlendMode: "screen",
            willChange: "transform, opacity",
          }}
        />

        {/* Particles — first 6 on all viewports, rest desktop only */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className={`bag-particle absolute block rounded-full ${i >= 6 ? "hidden md:block" : ""}`}
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                left: `${p.left}%`,
                top: `${p.top}%`,
                background: i % 3 === 0 ? "rgba(245,240,227,0.85)" : "rgba(149,213,178,0.6)",
                boxShadow: "0 0 6px rgba(149,213,178,0.35)",
                animation: `bag-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
                filter: "blur(0.4px)",
                opacity: 0,
              }}
            />
          ))}
        </div>

        <div ref={pendulumRef} className="absolute inset-0" style={{ transformOrigin: "50% 0%", willChange: "transform" }}>
          <div ref={tiltRef} className="relative h-full w-full" style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
            <div
              ref={platterRef}
              className="paper-fiber absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[8px] bg-bone"
              style={{
                width: "82%",
                height: "82%",
                boxShadow:
                  "0 30px 90px -20px rgba(10,26,18,0.55), 0 8px 24px -8px rgba(10,26,18,0.35), inset 0 0 0 1px rgba(61,47,31,0.08)",
                willChange: "clip-path, transform, opacity",
                backfaceVisibility: "hidden",
              }}
            >
              <div ref={stackRef} className="relative h-full w-full" style={{ willChange: "transform" }}>
                {SLIDES.map((s, i) => (
                  <div
                    key={s.src}
                    ref={(el) => {
                      slideRefs.current[i] = el;
                    }}
                    className="absolute inset-0"
                    style={{ willChange: "transform, opacity, filter" }}
                  >
                    <Image
                      src={s.src}
                      alt=""
                      fill
                      priority={i === 0}
                      loading={i === 0 ? "eager" : "lazy"}
                      sizes="(max-width: 768px) 80vw, 50vw"
                      className="object-contain"
                      style={{ filter: "contrast(1.04) saturate(1.08)" }}
                    />
                  </div>
                ))}
              </div>

              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(61,47,31,0.12) 100%)",
                }}
              />

              <span className="bag-corner-frame pointer-events-none absolute left-3 top-3 h-5 w-5 border-l border-t border-bark/40" style={{ animation: "bag-corner 3.6s ease-in-out 0.0s infinite" }} />
              <span className="bag-corner-frame pointer-events-none absolute right-3 top-3 h-5 w-5 border-r border-t border-bark/40" style={{ animation: "bag-corner 3.6s ease-in-out 0.6s infinite" }} />
              <span className="bag-corner-frame pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b border-l border-bark/40" style={{ animation: "bag-corner 3.6s ease-in-out 1.2s infinite" }} />
              <span className="bag-corner-frame pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b border-r border-bark/40" style={{ animation: "bag-corner 3.6s ease-in-out 1.8s infinite" }} />

              <div ref={counterRef} className="bag-corner-frame pointer-events-none absolute left-5 top-4 font-mono text-[10px] uppercase tracking-[0.3em]">
                <span className="text-bark/85">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-bark/40"> / {String(count).padStart(2, "0")}</span>
              </div>

              <div className="bag-corner-frame pointer-events-none absolute right-5 top-4 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-bark/55 md:block">
                kakinada / india
              </div>

              <div ref={captionRef} className="bag-corner-frame pointer-events-none absolute bottom-5 left-5 font-mono text-[10px] uppercase leading-tight tracking-[0.22em] text-bark/65">
                <div className="text-bark/85">ref · {slide.label}</div>
                <div className="opacity-70">{slide.sub}</div>
              </div>

              <div className="bag-corner-frame pointer-events-none absolute bottom-2 left-5 right-5 flex gap-1.5">
                {SLIDES.map((_, i) => (
                  <div key={i} className="relative h-px flex-1 overflow-hidden bg-bark/15">
                    <div
                      ref={(el) => {
                        progressRefs.current[i] = el;
                      }}
                      className="absolute left-0 top-0 h-full w-full origin-left bg-bark/70"
                      style={{ transform: "scaleX(0)" }}
                    />
                  </div>
                ))}
              </div>

              <div
                ref={shimmerRef}
                className="pointer-events-none absolute hidden h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 md:block"
                style={{
                  left: 0,
                  top: 0,
                  background:
                    "radial-gradient(circle, rgba(255,250,235,0.85) 0%, rgba(149,213,178,0.35) 30%, transparent 70%)",
                  mixBlendMode: "soft-light",
                  opacity: 0,
                  willChange: "transform, opacity",
                }}
              />
            </div>
          </div>
        </div>

        {/* Contact shadow — lighter blur on mobile */}
        <div
          ref={shadowRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 [filter:blur(10px)] md:[filter:blur(18px)]"
          style={{
            bottom: "4%",
            width: "60%",
            height: "34px",
            background: "radial-gradient(ellipse, rgba(10,26,18,0.75), transparent 70%)",
            transformOrigin: "center",
            willChange: "transform, opacity",
          }}
        />

        {/* Side-floating editorial annotations — desktop only */}
        <div ref={tagsRef} className="pointer-events-none absolute inset-0 z-10 hidden md:block">
          <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path className="bag-tag-line" d="M 92 6 Q 82 22 62 36" fill="none" stroke="rgba(245,240,227,0.55)" strokeWidth="0.18" strokeDasharray="240" vectorEffect="non-scaling-stroke" />
            <path className="bag-tag-line" d="M 12 6 Q 26 14 42 22" fill="none" stroke="rgba(245,240,227,0.55)" strokeWidth="0.18" strokeDasharray="240" vectorEffect="non-scaling-stroke" />
            <path className="bag-tag-line" d="M 88 94 Q 75 88 58 75" fill="none" stroke="rgba(245,240,227,0.55)" strokeWidth="0.18" strokeDasharray="240" vectorEffect="non-scaling-stroke" />
            <circle cx="62" cy="36" r="0.5" fill="rgba(255,107,74,0.95)" />
            <circle cx="42" cy="22" r="0.5" fill="rgba(255,107,74,0.95)" />
            <circle cx="58" cy="75" r="0.5" fill="rgba(255,107,74,0.95)" />
          </svg>

          <div className="bag-tag absolute text-right font-mono text-[10px] uppercase tracking-[0.2em] text-bone/85" style={{ top: "0.5%", right: "0%" }}>
            <div className="mb-1 text-flame/90">/ a01</div>
            <div className="leading-snug">120 gsm</div>
            <div className="leading-snug opacity-65">non-woven</div>
          </div>
          <div className="bag-tag absolute font-mono text-[10px] uppercase tracking-[0.2em] text-bone/85" style={{ top: "0.5%", left: "0%" }}>
            <div className="mb-1 text-flame/90">/ a02</div>
            <div className="leading-snug">reinforced</div>
            <div className="leading-snug opacity-65">handles</div>
          </div>
          <div className="bag-tag absolute text-right font-mono text-[10px] uppercase tracking-[0.2em] text-bone/85" style={{ bottom: "0.5%", right: "0%" }}>
            <div className="mb-1 text-flame/90">/ a03</div>
            <div className="leading-snug">reusable</div>
            <div className="leading-snug opacity-65">×100 trips</div>
          </div>
        </div>
      </div>

      {/* Inline editorial tag strip — mobile only, sits directly under the platter */}
      <div
        ref={mobileTagsRef}
        aria-hidden="true"
        className="mx-auto mb-6 mt-2 grid w-[78vw] max-w-[320px] grid-cols-3 gap-3 px-1 font-mono text-[9px] uppercase leading-tight tracking-[0.18em] text-bone/85 md:hidden"
      >
        {MOBILE_TAGS.map((t) => (
          <div key={t.code} className="bag-mobile-tag flex flex-col gap-0.5 border-l border-bone/25 pl-2">
            <span className="text-flame/90">{t.code}</span>
            <span className="text-bone/90">{t.line1}</span>
            <span className="opacity-60">{t.line2}</span>
          </div>
        ))}
      </div>
    </>
  );
}
