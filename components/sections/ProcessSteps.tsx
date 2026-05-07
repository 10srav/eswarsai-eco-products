"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ClipboardList, Recycle, Scissors, Truck } from "lucide-react";
import { Container } from "@/components/Container";
import { SplitText } from "@/components/ui/SplitText";
import { processSteps } from "@/lib/products";

const ICONS = [ClipboardList, Recycle, Scissors, Truck];

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function ProcessSteps() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureRegistered();
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = el.querySelectorAll<HTMLElement>("[data-step]");
    if (items.length === 0) return;

    const animate = () =>
      gsap.fromTo(
        items,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.12, overwrite: "auto" },
      );

    const trigger = ScrollTrigger.create({
      trigger: el,
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
    return () => trigger.kill();
  }, []);

  return (
    <section id="process" className="bg-bone py-24 md:py-32">
      <Container>
        <div className="eyebrow flex items-center gap-3 text-moss">
          <span className="h-px w-6 bg-current" />
          From fibre to fold
        </div>
        <SplitText
          as="h2"
          className="serif mt-8 max-w-4xl text-[clamp(36px,6vw,84px)] font-light leading-[0.98] tracking-[-0.03em]"
        >
          Four steps. Zero compromise.
        </SplitText>

        <div ref={ref} className="mt-20 grid border-t border-forest-deep/10 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={step.number}
                data-step
                className="border-forest-deep/10 p-8 lg:py-12 lg:pr-8 [&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-r"
              >
                <div className="mono text-xs tracking-[0.15em] text-moss">{step.number} / {step.title}</div>
                <h3 className="serif mt-3 text-[26px] font-light leading-tight tracking-[-0.02em]">{step.subtitle}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-70">{step.body}</p>
                <Icon className="mt-8 text-moss" size={32} strokeWidth={1.4} />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
