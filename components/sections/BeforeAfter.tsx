"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/Container";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

const POS_MIN = 8;
const POS_MAX = 92;
const POS_START = 50;
const POS_INTRO = 85;
const KEY_STEP = 5;

function clampPos(p: number) {
  return Math.min(POS_MAX, Math.max(POS_MIN, p));
}

/* Both scenes share one geometry: only the palette and the props on the
   counter change. Greys in the "before" palette are desaturated ink/bone blends. */
const BEFORE = {
  wall: "#dcdad1",
  floor: "#cbc9bf",
  skirt: "#b0aea3",
  counter: "#9b998e",
  panel: "#8a887d",
  top: "#b0aea3",
  register: "#6e6c62",
  screen: "#dcdad1",
  shelf: "#8a887d",
  itemA: "#b0aea3",
  itemB: "#a3a196",
  itemC: "#8a887d",
  sign: "#6e6c62",
  signBar: "#cbc9bf",
  signSub: "#b0aea3",
  lamp: "#8a887d",
  cord: "#6e6c62",
};

const AFTER = {
  wall: "#f5f0e3",
  floor: "#e9e1cf",
  skirt: "#d4c8ab",
  counter: "#1a4d36",
  panel: "#16412d",
  top: "#2d6a4f",
  register: "#0e2a1e",
  screen: "#95d5b2",
  shelf: "#6b4f2a",
  itemA: "#52b788",
  itemB: "#95d5b2",
  itemC: "#2d6a4f",
  sign: "#0e2a1e",
  signBar: "#95d5b2",
  signSub: "#52b788",
  lamp: "#2d6a4f",
  cord: "#0e2a1e",
};

function Scene({ variant }: { variant: "before" | "after" }) {
  const after = variant === "after";
  const c = after ? AFTER : BEFORE;

  return (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="1600" height="1000" fill={c.wall} />
      <rect y="780" width="1600" height="220" fill={c.floor} />
      <rect y="776" width="1600" height="6" fill={c.skirt} />

      {/* pendant lamps */}
      <rect x="598" width="4" height="130" fill={c.cord} />
      <circle cx="600" cy="148" r="20" fill={c.lamp} />
      <rect x="898" width="4" height="170" fill={c.cord} />
      <circle cx="900" cy="188" r="20" fill={c.lamp} />

      {/* signboard */}
      <rect x="120" y="110" width="380" height="130" rx="8" fill={c.sign} />
      <rect x="156" y="152" width="210" height="18" rx="4" fill={c.signBar} />
      <rect x="156" y="188" width="130" height="12" rx="4" fill={c.signSub} />

      {/* wall shelves */}
      <rect x="1130" y="200" width="350" height="12" fill={c.shelf} />
      <rect x="1152" y="130" width="64" height="70" fill={c.itemA} />
      <rect x="1240" y="148" width="54" height="52" fill={c.itemB} />
      <rect x="1320" y="122" width="58" height="78" fill={c.itemC} />
      <rect x="1130" y="360" width="350" height="12" fill={c.shelf} />
      <rect x="1160" y="300" width="74" height="60" fill={c.itemB} />
      <rect x="1262" y="316" width="60" height="44" fill={c.itemC} />
      <rect x="1352" y="292" width="52" height="68" fill={c.itemA} />

      {/* counter */}
      <rect x="220" y="560" width="720" height="220" fill={c.counter} />
      <rect x="252" y="592" width="180" height="158" fill={c.panel} />
      <rect x="464" y="592" width="180" height="158" fill={c.panel} />
      <rect x="676" y="592" width="180" height="158" fill={c.panel} />
      <rect x="190" y="526" width="780" height="36" rx="6" fill={c.top} />

      {/* register + card reader */}
      <rect x="300" y="412" width="136" height="114" rx="8" fill={c.register} />
      <rect x="318" y="432" width="100" height="50" rx="4" fill={c.screen} />
      <rect x="318" y="496" width="100" height="12" rx="4" fill={c.screen} opacity="0.5" />
      <rect x="470" y="468" width="54" height="58" rx="6" fill={c.register} />

      {!after && (
        <>
          {/* thin plastic bag slumped on the counter */}
          <ellipse cx="806" cy="436" rx="13" ry="20" fill="none" stroke="#c6c4ba" strokeWidth="6" />
          <ellipse cx="870" cy="436" rx="13" ry="20" fill="none" stroke="#c6c4ba" strokeWidth="6" />
          <path d="M778 448 h120 l-6 50 q-2 28 -30 28 h-52 q-26 0 -28 -26 z" fill="#c6c4ba" />
          <path
            d="M812 462 l-8 50 M848 462 l4 48"
            stroke="#9b998e"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          {/* a bag drifting loose */}
          <g transform="rotate(-14 1060 600)">
            <ellipse cx="1036" cy="568" rx="10" ry="16" fill="none" stroke="#b8b6ac" strokeWidth="5" />
            <ellipse cx="1086" cy="568" rx="10" ry="16" fill="none" stroke="#b8b6ac" strokeWidth="5" />
            <path d="M1014 578 h96 l-6 40 q-2 22 -24 22 h-40 q-22 0 -22 -22 z" fill="#b8b6ac" />
          </g>

          {/* litter at the base */}
          <polygon points="120,920 152,894 188,910 176,944 132,946" fill="#a3a196" />
          <polygon points="500,932 524,910 548,926 536,950 506,950" fill="#b0aea3" />
          <polygon points="1130,924 1158,902 1186,918 1174,946 1138,948" fill="#a3a196" />
          <polygon points="1420,930 1444,912 1466,928 1452,950 1424,950" fill="#b0aea3" />
          <polygon points="300,938 318,920 332,940 314,952" fill="#ff6b4a" />
          <circle cx="704" cy="936" r="9" fill="#ff6b4a" />
          <rect x="960" y="924" width="48" height="9" rx="4.5" fill="#ff6b4a" transform="rotate(-16 984 928)" />
          <polygon points="1330,940 1348,924 1360,942 1342,952" fill="#ff6b4a" />
        </>
      )}

      {after && (
        <>
          {/* branded tote on the counter */}
          <path d="M796 436 v-8 q0 -24 18 -24 q18 0 18 24 v8" fill="none" stroke="#0e2a1e" strokeWidth="7" />
          <path d="M848 436 v-8 q0 -24 18 -24 q18 0 18 24 v8" fill="none" stroke="#0e2a1e" strokeWidth="7" />
          <path d="M774 436 h132 l8 90 h-148 z" fill="#52b788" />
          <path d="M771 492 h138 l2 16 h-142 z" fill="#95d5b2" />
          <path d="M836 456 q16 -4 22 12 q-18 6 -22 -12 z" fill="#0e2a1e" />

          {/* totes standing on the floor */}
          <path d="M1138 600 q0 -48 42 -48 q42 0 42 48" fill="none" stroke="#0e2a1e" strokeWidth="10" />
          <path d="M1090 600 h180 l14 180 h-208 z" fill="#52b788" />
          <path d="M1086 704 h190 l2 18 h-194 z" fill="#95d5b2" />
          <path d="M1168 650 q22 -6 30 16 q-24 8 -30 -16 z" fill="#0e2a1e" />

          <path d="M1364 656 q0 -38 34 -38 q34 0 34 38" fill="none" stroke="#2d6a4f" strokeWidth="9" />
          <path d="M1326 656 h140 l10 124 h-160 z" fill="#95d5b2" />
          <path d="M1322 728 h150 l2 14 h-154 z" fill="#52b788" />

          {/* plant by the counter */}
          <circle cx="116" cy="664" r="26" fill="#2d6a4f" />
          <circle cx="152" cy="640" r="32" fill="#52b788" />
          <circle cx="176" cy="678" r="22" fill="#95d5b2" />
          <path d="M96 706 h84 l-12 74 h-60 z" fill="#6b4f2a" />
        </>
      )}
    </svg>
  );
}

export function BeforeAfter() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const gripRef = useRef<HTMLDivElement>(null);

  const posRef = useRef(POS_START);
  const draggingRef = useRef(false);
  const rectRef = useRef<DOMRect | null>(null);
  const interactedRef = useRef(false);
  const introTweenRef = useRef<gsap.core.Tween | null>(null);

  const applyPos = useCallback((p: number) => {
    posRef.current = p;
    if (clipRef.current) clipRef.current.style.clipPath = `inset(0 0 0 ${p}%)`;
    // Divider spans the full frame width, so % translate of itself == % of frame.
    if (dividerRef.current) dividerRef.current.style.transform = `translateX(${p - 100}%)`;
    const grip = gripRef.current;
    if (grip) {
      grip.setAttribute("aria-valuenow", String(Math.round(p)));
      grip.setAttribute("aria-valuetext", `${Math.round(100 - p)}% reusable scene visible`);
    }
  }, []);

  const stopIntro = useCallback(() => {
    interactedRef.current = true;
    introTweenRef.current?.kill();
    introTweenRef.current = null;
  }, []);

  const updateFromX = useCallback(
    (clientX: number) => {
      const rect = rectRef.current;
      if (!rect || rect.width === 0) return;
      applyPos(clampPos(((clientX - rect.left) / rect.width) * 100));
    },
    [applyPos],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame) return;
    stopIntro();
    draggingRef.current = true;
    rectRef.current = frame.getBoundingClientRect();
    frame.setPointerCapture(e.pointerId);
    gripRef.current?.focus({ preventScroll: true });
    updateFromX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) updateFromX(e.clientX);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    const frame = frameRef.current;
    if (frame?.hasPointerCapture(e.pointerId)) frame.releasePointerCapture(e.pointerId);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        next = posRef.current - KEY_STEP;
        break;
      case "ArrowRight":
      case "ArrowUp":
        next = posRef.current + KEY_STEP;
        break;
      case "Home":
        next = POS_MIN;
        break;
      case "End":
        next = POS_MAX;
        break;
      default:
        return;
    }
    e.preventDefault();
    stopIntro();
    applyPos(clampPos(next));
  };

  useEffect(() => {
    ensureRegistered();
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    applyPos(POS_INTRO);

    let started = false;
    const sweep = () => {
      if (started || interactedRef.current) return;
      started = true;
      const state = { p: POS_INTRO };
      introTweenRef.current = gsap.to(state, {
        p: POS_START,
        duration: 1.6,
        ease: "expo.out",
        onUpdate: () => {
          if (!interactedRef.current) applyPos(state.p);
        },
      });
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: frame,
        start: "top 75%",
        once: true,
        onEnter: sweep,
        onRefresh: (self) => {
          if (self.progress > 0) sweep();
        },
      });
    }, section);

    return () => {
      introTweenRef.current?.kill();
      ctx.revert();
    };
  }, [applyPos]);

  return (
    <section ref={sectionRef} className="bg-bone py-24 text-ink md:py-32">
      <Container>
        <div className="eyebrow flex items-center gap-3 text-moss">
          <span className="h-px w-6 bg-current" />
          Before and after
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <h2 className="serif max-w-3xl text-[clamp(36px,5.5vw,76px)] font-light leading-[0.98] tracking-[-0.03em]">
            The checkout counter, <em className="italic text-moss">before and after.</em>
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink/70">
            Drag the line. Same counter, same footfall, a different story at the
            till.
          </p>
        </div>

        <div
          ref={frameRef}
          role="group"
          aria-label="Illustrated comparison: a checkout counter with single-use plastic bags on the left, the same counter with reusable branded totes on the right. Drag the divider to compare."
          className="soft-shadow relative mt-12 aspect-[16/10] cursor-ew-resize select-none overflow-hidden rounded-md border border-ink/10 md:mt-16"
          style={{ touchAction: "pan-y" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div className="absolute inset-0" aria-hidden="true">
            <Scene variant="before" />
          </div>
          <div
            ref={clipRef}
            className="absolute inset-0"
            style={{ clipPath: `inset(0 0 0 ${POS_START}%)` }}
            aria-hidden="true"
          >
            <Scene variant="after" />
          </div>

          <span className="mono pointer-events-none absolute left-3 top-3 rounded-full bg-ink/75 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-bone md:left-5 md:top-5 md:text-[11px]">
            Single-use
          </span>
          <span className="mono pointer-events-none absolute right-3 top-3 rounded-full bg-forest-deep/85 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-bone md:right-5 md:top-5 md:text-[11px]">
            Reusable
          </span>

          <div
            ref={dividerRef}
            className="pointer-events-none absolute inset-y-0 left-0 w-full"
            style={{ transform: `translateX(${POS_START - 100}%)` }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-0 right-0 w-[2px] translate-x-1/2 bg-bone shadow-[0_0_0_1px_rgba(10,26,18,0.18)]"
            />
            <div
              ref={gripRef}
              role="slider"
              tabIndex={0}
              aria-label="Comparison divider"
              aria-orientation="horizontal"
              aria-valuemin={POS_MIN}
              aria-valuemax={POS_MAX}
              aria-valuenow={POS_START}
              aria-valuetext={`${100 - POS_START}% reusable scene visible`}
              onKeyDown={onKeyDown}
              className="pointer-events-auto absolute right-0 top-1/2 flex h-12 w-12 -translate-y-1/2 translate-x-1/2 cursor-ew-resize items-center justify-center rounded-full border border-ink/10 bg-bone text-forest-deep soft-shadow"
            >
              <ChevronLeft size={15} strokeWidth={2.5} aria-hidden="true" />
              <ChevronRight size={15} strokeWidth={2.5} aria-hidden="true" />
            </div>
          </div>
        </div>

        <p className="mono mt-4 text-[11px] uppercase tracking-[0.18em] text-ink/55">
          Drag the handle, or focus it and use arrow keys
        </p>
      </Container>
    </section>
  );
}
