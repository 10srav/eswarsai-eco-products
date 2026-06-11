"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Container } from "@/components/Container";
import { cn } from "@/lib/utils";

const DeliveryGlobe = dynamic(
  () => import("@/components/three/DeliveryGlobe").then((m) => m.DeliveryGlobe),
  { ssr: false },
);

type Corridor = {
  name: string;
  lat: number;
  lon: number;
  volume: string;
  hq?: boolean;
};

// Mirrors CITIES in components/three/DeliveryGlobe.tsx. Kept local so the
// three.js chunk stays out of the section bundle. Volumes are illustrative
// shares of the real 40M+ cumulative total.
const CORRIDORS: Corridor[] = [
  { name: "Kakinada", lat: 16.99, lon: 82.25, volume: "40M+ bags since 2013", hq: true },
  { name: "Hyderabad", lat: 17.38, lon: 78.48, volume: "1.4M+ bags / yr" },
  { name: "Visakhapatnam", lat: 17.69, lon: 83.22, volume: "1.1M+ bags / yr" },
  { name: "Vijayawada", lat: 16.51, lon: 80.65, volume: "950K+ bags / yr" },
  { name: "Chennai", lat: 13.08, lon: 80.27, volume: "820K+ bags / yr" },
  { name: "Bengaluru", lat: 12.97, lon: 77.59, volume: "760K+ bags / yr" },
  { name: "Mumbai", lat: 19.08, lon: 72.88, volume: "610K+ bags / yr" },
  { name: "Delhi", lat: 28.61, lon: 77.21, volume: "540K+ bags / yr" },
  { name: "Kolkata", lat: 22.57, lon: 88.36, volume: "430K+ bags / yr" },
  { name: "Pune", lat: 18.52, lon: 73.86, volume: "380K+ bags / yr" },
  { name: "Ahmedabad", lat: 23.02, lon: 72.57, volume: "310K+ bags / yr" },
];

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

function project(lat: number, lon: number): [number, number] {
  return [(lon - 70) * 14 + 20, (33 - lat) * 14 + 10];
}

function IndiaDotMap() {
  const hq = CORRIDORS.find((c) => c.hq);
  if (!hq) return null;
  const [hx, hy] = project(hq.lat, hq.lon);
  return (
    <svg
      viewBox="0 0 320 360"
      aria-hidden="true"
      className="mx-auto w-full max-w-[480px]"
    >
      <circle cx={hx} cy={hy} r={36} fill="none" stroke="#95d5b2" strokeOpacity={0.14} />
      <circle cx={hx} cy={hy} r={72} fill="none" stroke="#95d5b2" strokeOpacity={0.09} />
      <circle cx={hx} cy={hy} r={108} fill="none" stroke="#95d5b2" strokeOpacity={0.05} />
      {CORRIDORS.filter((c) => !c.hq).map((c) => {
        const [x, y] = project(c.lat, c.lon);
        return (
          <g key={c.name}>
            <line
              x1={hx}
              y1={hy}
              x2={x}
              y2={y}
              stroke="#52b788"
              strokeOpacity={0.3}
              strokeWidth={1}
              strokeDasharray="2 4"
            />
            <circle cx={x} cy={y} r={3.5} fill="#52b788" />
          </g>
        );
      })}
      <circle cx={hx} cy={hy} r={5} fill="#ff6b4a" />
      <circle cx={hx} cy={hy} r={9} fill="none" stroke="#ff6b4a" strokeOpacity={0.5} />
    </svg>
  );
}

export function IndiaReach() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [globeMounted, setGlobeMounted] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    setWebgl(supportsWebGL());
    return () => mq.removeEventListener("change", update);
  }, []);

  const showGlobe = webgl && !reduced;

  useEffect(() => {
    if (!showGlobe) return;
    const el = frameRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) setGlobeMounted(true);
        setInView(entry.isIntersecting);
      },
      { rootMargin: "240px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [showGlobe]);

  return (
    <section
      aria-labelledby="india-reach-heading"
      className="relative overflow-hidden bg-forest-deep py-24 text-bone md:py-32"
    >
      <Container>
        <div className="eyebrow flex items-center gap-3 text-sage">
          <span className="h-px w-6 bg-current" />
          Where our bags travel
        </div>
        <h2
          id="india-reach-heading"
          className="serif mt-8 max-w-4xl text-[clamp(36px,6vw,84px)] font-light leading-[0.98] tracking-[-0.03em]"
        >
          Made in Kakinada. <em className="italic text-sage">Carried across India.</em>
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed opacity-80 md:text-[17px]">
          One plant in Andhra Pradesh, despatching to 28 states and export
          markets beyond. Eleven corridors carry most of the volume, kirana
          counters to national retail.
        </p>

        <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            {showGlobe ? (
              <>
                <div
                  ref={frameRef}
                  className="relative mx-auto aspect-square w-full max-w-[640px]"
                >
                  {!globeMounted && (
                    <div
                      aria-hidden="true"
                      className="absolute inset-[6%] rounded-full border border-sage/15"
                    />
                  )}
                  {globeMounted && <DeliveryGlobe active={inView} />}
                </div>
                <p className="mono mt-4 text-center text-[11px] uppercase tracking-[0.24em] text-bone/60">
                  Drag to rotate
                </p>
              </>
            ) : (
              <IndiaDotMap />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="mono text-[11px] uppercase tracking-[0.24em] text-sage">
              Despatch corridors
            </h3>
            <ul className="mt-5 divide-y divide-bone/10 border-y border-bone/10">
              {CORRIDORS.map((c) => (
                <li
                  key={c.name}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        c.hq ? "bg-flame" : "bg-leaf",
                      )}
                    />
                    <span className="serif truncate text-lg font-light">{c.name}</span>
                    {c.hq && (
                      <span className="mono shrink-0 text-[10px] uppercase tracking-[0.2em] text-flame">
                        HQ
                      </span>
                    )}
                  </span>
                  <span className="mono shrink-0 text-right text-xs text-sage">
                    {c.volume}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mono mt-5 max-w-md text-[11px] leading-relaxed text-bone/60">
              City figures are illustrative shares of 40M+ bags produced since
              2013. Exports on request.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
