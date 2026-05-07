"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/Container";
import { SplitText } from "@/components/ui/SplitText";
import { industries } from "@/lib/products";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

const detail: Record<string, {
  bagsBought: string;
  moq: string;
  sample: string;
  partners: string[];
}> = {
  retail: {
    bagsBought: "D-cut and W-cut non-woven (60–90 GSM), die-cut handle, 1–4 colour flexo print. Branded for chain identity, neutral for franchise.",
    moq: "5,000 pcs per SKU, 2,000 pcs for repeat orders.",
    sample: "5 working days from approved artwork.",
    partners: ["FreshKart", "Indian Grocer Co.", "RetailMax India", "Kirana United"],
  },
  pharma: {
    bagsBought: "Food-grade non-woven (70 GSM), white/blue base, batch-traceable. D-cut for over-the-counter, drawstring for hospital pharmacies.",
    moq: "2,500 pcs per SKU.",
    sample: "Food-safety documentation included with first sample.",
    partners: ["PharmaPlus", "MedFirst", "CarePlus Chemists", "WellChem"],
  },
  fashion: {
    bagsBought: "Loop-handle non-woven (90–120 GSM) and 12-oz jute totes. Pantone-matched panels, ultrasonic-welded handles, soft-touch finish.",
    moq: "1,000 pcs per SKU — boutique-friendly batches.",
    sample: "5 working days. Express samples in 48 hours on request.",
    partners: ["Cotton & Linen", "BrandWeavers", "Sweet Bazaar", "Heritage Hotels"],
  },
  events: {
    bagsBought: "Branded promotional totes, jute and non-woven, 4–6 colour print. Per-event SKU management with rapid turnaround.",
    moq: "1,000 pcs per event.",
    sample: "48-hour express samples for confirmed orders.",
    partners: ["Wedding planners across AP & Telangana", "Corporate event agencies", "Trade-show organisers"],
  },
  fmcg: {
    bagsBought: "Heavy-duty W-cut and reinforced shoppers (90–120 GSM), food-safe inner-laminate, palletised bulk despatch.",
    moq: "10,000 pcs.",
    sample: "5 working days. Bulk orders sampled and signed-off pre-run.",
    partners: ["Saral Retail", "FreshKart", "Listed FMCG (NDA)", "Regional dairy chains"],
  },
  ecommerce: {
    bagsBought: "Drawstring pouches and mailer non-woven, multiple sizes per SKU. Insert-friendly soft-touch fabric for unboxing moments.",
    moq: "2,000 pcs per size.",
    sample: "5 working days, with packaging trial samples.",
    partners: ["D2C beauty brands", "Footwear startups", "Lifestyle subscription boxes"],
  },
};

export function IndustriesDetail() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureRegistered();
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rows = el.querySelectorAll<HTMLElement>("[data-row]");
    if (rows.length === 0) return;

    const triggers: ScrollTrigger[] = [];
    rows.forEach((row) => {
      const animate = () =>
        gsap.fromTo(
          row,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", overwrite: "auto" },
        );
      const t = ScrollTrigger.create({
        trigger: row,
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
      triggers.push(t);
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section className="bg-cream py-24 md:py-32">
      <Container>
        <div className="eyebrow flex items-center gap-3 text-moss">
          <span className="h-px w-6 bg-current" />
          The bag, the spec, the brands
        </div>
        <SplitText
          as="h2"
          className="serif mt-8 max-w-4xl text-[clamp(36px,6vw,80px)] font-light leading-[0.98] tracking-[-0.03em]"
        >
          Different counters, different bags.
        </SplitText>

        <div ref={ref} className="mt-20 flex flex-col gap-16 md:gap-24">
          {industries.map((it, i) => {
            const d = detail[it.slug];
            const reverse = i % 2 === 1;
            return (
              <article
                key={it.slug}
                data-row
                className={`grid items-start gap-10 border-t border-forest-deep/10 pt-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16 md:pt-14 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <header>
                  <div className="mono text-[11px] uppercase tracking-[0.25em] text-moss">
                    {String(i + 1).padStart(2, "0")} / {it.count}
                  </div>
                  <h3 className="serif mt-5 text-[clamp(34px,4.4vw,60px)] font-light leading-[1.0] tracking-[-0.02em] text-forest-deep">
                    {it.name}
                  </h3>
                  <p className="mt-6 max-w-md text-base leading-relaxed text-forest-deep/75">
                    {it.desc}
                  </p>
                </header>
                <div className="grid gap-7 md:grid-cols-2 md:gap-10">
                  <div>
                    <p className="eyebrow text-moss">Bags they buy</p>
                    <p className="mt-3 text-sm leading-relaxed text-forest-deep/80">{d?.bagsBought}</p>
                  </div>
                  <div>
                    <p className="eyebrow text-moss">MOQ</p>
                    <p className="mt-3 text-sm leading-relaxed text-forest-deep/80">{d?.moq}</p>
                  </div>
                  <div>
                    <p className="eyebrow text-moss">Sample timeline</p>
                    <p className="mt-3 text-sm leading-relaxed text-forest-deep/80">{d?.sample}</p>
                  </div>
                  <div>
                    <p className="eyebrow text-moss">Brand examples</p>
                    <ul className="mt-3 flex flex-col gap-1.5 text-sm text-forest-deep/80">
                      {d?.partners.map((b) => (
                        <li key={b} className="flex items-baseline gap-2">
                          <span className="text-leaf">·</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
