"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/Container";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function SustainabilityManifesto() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureRegistered();
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const paras = el.querySelectorAll<HTMLElement>("[data-para]");
    if (paras.length === 0) return;

    const animate = () =>
      gsap.fromTo(
        paras,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.12, overwrite: "auto" },
      );

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
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
    <section className="relative overflow-hidden bg-bone py-24 md:py-32">
      <div aria-hidden="true" className="paper-fiber pointer-events-none absolute inset-0 opacity-50" />
      <Container width="narrow">
        <div className="eyebrow flex items-center gap-3 text-moss">
          <span className="h-px w-6 bg-current" />
          The manifesto
        </div>
        <h2 className="serif mt-8 text-[clamp(34px,5vw,64px)] font-light leading-[1.0] tracking-[-0.03em] text-forest-deep">
          We don&apos;t market sustainability. <em className="italic text-moss">We measure it.</em>
        </h2>

        <div ref={ref} className="mt-14 flex flex-col gap-10 text-forest-deep">
          <p
            data-para
            className="serif drop-cap text-[clamp(18px,1.6vw,22px)] font-light leading-[1.6] tracking-tight text-pretty"
          >
            Twelve years ago, we started with one stitching line in Kakinada and a stubborn belief: India deserves bag manufacturers who care about both the product they ship and the planet they ship it on. The market in 2013 was full of plastic — cheap, single-use, forever-lasting plastic. We knew the math was broken. A five-second carry that lingers for five centuries is not a fair trade. So we set up a non-woven line, then a jute line, and started doing the unglamorous work of replacement: one order, one brand, one bag at a time.
          </p>
          <p
            data-para
            className="serif text-[clamp(17px,1.45vw,20px)] font-light leading-[1.65] tracking-tight text-forest-deep/80 text-pretty"
          >
            Sustainability is easy to claim and hard to prove, so we work in numbers we can defend. Forty million bags shipped. An estimated eight thousand tonnes of single-use plastic avoided. A reusable lifecycle of two hundred uses per bag, validated by independent testing. Mills audited for labour and environmental practices, with certificates we will share on request. We do not greenwash because the math doesn&apos;t require it: a 90-GSM non-woven bag, reused weekly for two years, beats single-use plastic on the carbon ledger by month one.
          </p>
          <p
            data-para
            className="serif text-[clamp(17px,1.45vw,20px)] font-light leading-[1.65] tracking-tight text-forest-deep/80 text-pretty"
          >
            What comes next is harder. Reusable is good; circular is better. We are working with our brand partners to test take-back programs for end-of-life bags — recycle the polypropylene back into fibre, compost the jute into the soil it came from. That work is messy, slow, and unglamorous. But it&apos;s the work that matters. If you&apos;re a brand that wants to replace plastic with intent, we&apos;re building the bag, the supply chain, and the next chapter alongside you. Twelve years in. Still stubborn. Still counting.
          </p>
        </div>

        <div className="mono mt-14 text-xs uppercase tracking-[0.3em] text-moss">
          — Eswar Sai Eco Products · Kakinada, Andhra Pradesh · Since 2013
        </div>
      </Container>
    </section>
  );
}
