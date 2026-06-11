"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { MagneticButton } from "@/components/ui/MagneticButton";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

const REUSES_PER_BAG = 200;
const VIEWS_PER_OUTING = 3;
const PLASTIC_BAG_KG = 0.008;
const CO2E_PER_KG_PLASTIC = 2.7;

const BAGS_MIN = 500;
const BAGS_MAX = 200_000;
const LN_MIN = Math.log(BAGS_MIN);
const LN_MAX = Math.log(BAGS_MAX);
const SLIDER_MAX = 1000;

const COST_MIN = 0.5;
const COST_MAX = 5;
const STORES_MIN = 1;
const STORES_MAX = 500;

function clamp(v: number, min: number, max: number) {
  if (!Number.isFinite(v)) return min;
  return Math.min(max, Math.max(min, v));
}

// Snap to readable increments so the log slider lands on round numbers.
function niceBags(v: number) {
  const c = clamp(v, BAGS_MIN, BAGS_MAX);
  const step = c < 2_000 ? 50 : c < 10_000 ? 100 : c < 50_000 ? 500 : 1_000;
  return clamp(Math.round(c / step) * step, BAGS_MIN, BAGS_MAX);
}

function bagsToSlider(bags: number) {
  const c = clamp(bags, BAGS_MIN, BAGS_MAX);
  return Math.round(((Math.log(c) - LN_MIN) / (LN_MAX - LN_MIN)) * SLIDER_MAX);
}

function sliderToBags(t: number) {
  return niceBags(Math.exp(LN_MIN + (clamp(t, 0, SLIDER_MAX) / SLIDER_MAX) * (LN_MAX - LN_MIN)));
}

const int = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const inrPaise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type OutputKey = "spend" | "yearly" | "impressions" | "plastic" | "co2";

function compute(bags: number, cost: number, stores: number): Record<OutputKey, number> {
  const yearly = bags * stores * 12;
  const plastic = yearly * PLASTIC_BAG_KG;
  return {
    spend: yearly * cost,
    yearly,
    impressions: yearly * REUSES_PER_BAG * VIEWS_PER_OUTING,
    plastic,
    co2: plastic * CO2E_PER_KG_PLASTIC,
  };
}

const OUTPUTS: { key: OutputKey; label: string; note?: string; fmt: (v: number) => string }[] = [
  { key: "spend", label: "Current plastic spend / yr", fmt: (v) => inr.format(Math.round(v)) },
  { key: "yearly", label: "Bags / yr", fmt: (v) => int.format(Math.round(v)) },
  {
    key: "impressions",
    label: "Brand impressions / yr",
    note: `assumes ~${REUSES_PER_BAG} reuses × ${VIEWS_PER_OUTING} views per outing`,
    fmt: (v) => int.format(Math.round(v)),
  },
  { key: "plastic", label: "Plastic avoided, kg / yr", fmt: (v) => int.format(Math.round(v)) },
  { key: "co2", label: "CO2e avoided, kg / yr", fmt: (v) => int.format(Math.round(v)) },
];

const DEFAULTS = { bags: 20_000, cost: 1.5, stores: 25 };

export function RoiCalculator() {
  const sectionRef = useRef<HTMLElement>(null);
  const numRefs = useRef<Partial<Record<OutputKey, HTMLSpanElement | null>>>({});
  const display = useRef<Record<OutputKey, number>>(
    compute(DEFAULTS.bags, DEFAULTS.cost, DEFAULTS.stores),
  );
  const firstRun = useRef(true);
  const baseId = useId();

  const [bags, setBags] = useState<number>(DEFAULTS.bags);
  const [cost, setCost] = useState<number>(DEFAULTS.cost);
  const [stores, setStores] = useState<number>(DEFAULTS.stores);

  const safeBags = niceBags(bags);
  const safeCost = Math.round(clamp(cost, COST_MIN, COST_MAX) * 10) / 10;
  const safeStores = Math.round(clamp(stores, STORES_MIN, STORES_MAX));

  const targets = useMemo(
    () => compute(safeBags, safeCost, safeStores),
    [safeBags, safeCost, safeStores],
  );

  // Outputs tween imperatively via textContent: no React re-render per frame.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const write = () => {
      for (const o of OUTPUTS) {
        const el = numRefs.current[o.key];
        if (el) el.textContent = o.fmt(display.current[o.key]);
      }
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      Object.assign(display.current, targets);
      write();
      return;
    }
    const tween = gsap.to(display.current, {
      ...targets,
      duration: 0.8,
      ease: "power3.out",
      overwrite: true,
      onUpdate: write,
    });
    return () => {
      tween.kill();
    };
  }, [targets]);

  useEffect(() => {
    ensureRegistered();
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-roi-row]",
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: section, start: "top 72%", once: true },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="ROI calculator"
      className="paper-fiber relative overflow-hidden bg-cream py-24 text-ink md:py-32"
    >
      <style>{`
        .roi-range{appearance:none;-webkit-appearance:none;width:100%;height:44px;background:transparent;cursor:pointer}
        .roi-range::-webkit-slider-runnable-track{height:2px;border-radius:1px;background:rgba(10,26,18,0.18)}
        .roi-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;margin-top:-9px;height:20px;width:20px;border-radius:9999px;background:var(--color-moss);border:3px solid var(--color-bone);box-shadow:0 1px 4px rgba(14,42,30,0.35)}
        .roi-range::-moz-range-track{height:2px;border-radius:1px;background:rgba(10,26,18,0.18)}
        .roi-range::-moz-range-thumb{height:20px;width:20px;border-radius:9999px;background:var(--color-moss);border:3px solid var(--color-bone);box-shadow:0 1px 4px rgba(14,42,30,0.35)}
      `}</style>

      <Container>
        <div className="eyebrow flex items-center gap-3 text-moss">
          <span className="h-px w-6 bg-current" />
          The business case
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <h2 className="serif max-w-3xl text-[clamp(36px,5.5vw,76px)] font-light leading-[0.98] tracking-[-0.03em]">
            The switch <em className="italic text-moss">pays for itself.</em>
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink/70">
            Three inputs from your ops. Five numbers for your board. Move the
            sliders, watch the case build itself.
          </p>
        </div>

        <div className="mt-14 grid gap-12 md:mt-16 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-9 lg:col-span-5">
            <div data-roi-row>
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor={`${baseId}-bags`} className="text-sm font-medium">
                  Monthly bags per store
                </label>
                <span className="mono text-xs text-moss">{int.format(safeBags)} / mo</span>
              </div>
              <input
                id={`${baseId}-bags`}
                type="number"
                inputMode="numeric"
                min={BAGS_MIN}
                max={BAGS_MAX}
                step={50}
                value={Number.isFinite(bags) ? bags : ""}
                onChange={(e) => setBags(e.target.valueAsNumber)}
                onBlur={() => setBags(niceBags(bags))}
                className="mono mt-2.5 w-full rounded-[6px] border border-ink/15 bg-bone px-3.5 py-2.5 text-sm"
              />
              <input
                type="range"
                min={0}
                max={SLIDER_MAX}
                step={1}
                value={bagsToSlider(safeBags)}
                onChange={(e) => setBags(sliderToBags(e.target.valueAsNumber))}
                aria-label="Monthly bags per store"
                aria-valuetext={`${int.format(safeBags)} bags per month`}
                className="roi-range mt-1 w-full"
              />
            </div>

            <div data-roi-row>
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor={`${baseId}-cost`} className="text-sm font-medium">
                  Current cost per plastic bag
                </label>
                <span className="mono text-xs text-moss">{inrPaise.format(safeCost)}</span>
              </div>
              <input
                id={`${baseId}-cost`}
                type="number"
                inputMode="decimal"
                min={COST_MIN}
                max={COST_MAX}
                step={0.1}
                value={Number.isFinite(cost) ? cost : ""}
                onChange={(e) => setCost(e.target.valueAsNumber)}
                onBlur={() => setCost(Math.round(clamp(cost, COST_MIN, COST_MAX) * 10) / 10)}
                className="mono mt-2.5 w-full rounded-[6px] border border-ink/15 bg-bone px-3.5 py-2.5 text-sm"
              />
              <input
                type="range"
                min={COST_MIN}
                max={COST_MAX}
                step={0.1}
                value={safeCost}
                onChange={(e) => setCost(e.target.valueAsNumber)}
                aria-label="Current cost per plastic bag in rupees"
                aria-valuetext={`${inrPaise.format(safeCost)} per bag`}
                className="roi-range mt-1 w-full"
              />
            </div>

            <div data-roi-row>
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor={`${baseId}-stores`} className="text-sm font-medium">
                  Stores
                </label>
                <span className="mono text-xs text-moss">
                  {int.format(safeStores)} {safeStores === 1 ? "store" : "stores"}
                </span>
              </div>
              <input
                id={`${baseId}-stores`}
                type="number"
                inputMode="numeric"
                min={STORES_MIN}
                max={STORES_MAX}
                step={1}
                value={Number.isFinite(stores) ? stores : ""}
                onChange={(e) => setStores(e.target.valueAsNumber)}
                onBlur={() => setStores(Math.round(clamp(stores, STORES_MIN, STORES_MAX)))}
                className="mono mt-2.5 w-full rounded-[6px] border border-ink/15 bg-bone px-3.5 py-2.5 text-sm"
              />
              <input
                type="range"
                min={STORES_MIN}
                max={STORES_MAX}
                step={1}
                value={safeStores}
                onChange={(e) => setStores(e.target.valueAsNumber)}
                aria-label="Number of stores"
                aria-valuetext={`${int.format(safeStores)} stores`}
                className="roi-range mt-1 w-full"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="border-t border-ink/15">
              {OUTPUTS.map((o) => (
                <div
                  key={o.key}
                  data-roi-row
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-ink/10 py-5"
                >
                  <div>
                    <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink/60">
                      {o.label}
                    </div>
                    {o.note && <div className="mono mt-1 text-[10px] text-moss">{o.note}</div>}
                  </div>
                  <div className="serif text-[clamp(28px,3.4vw,52px)] font-light leading-none tracking-tight">
                    <span
                      ref={(el) => {
                        numRefs.current[o.key] = el;
                      }}
                    >
                      {o.fmt(display.current[o.key])}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p data-roi-row className="mono mt-5 max-w-xl text-[11px] leading-relaxed text-ink/55">
              Directional estimates, not a quote. Assumes {REUSES_PER_BAG} reuses
              per bag, {VIEWS_PER_OUTING} views per outing, 8 g per single-use
              plastic bag, and {CO2E_PER_KG_PLASTIC} kg CO2e per kg of plastic,
              an industry-average figure. Actuals vary by gauge, route and reuse
              habits.
            </p>

            <div data-roi-row className="mt-8">
              <MagneticButton href="/contact" variant="primary">
                Run these numbers with us
                <ArrowRight size={16} />
              </MagneticButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
