"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/Container";
import { SplitText } from "@/components/ui/SplitText";
import { ProductCard } from "./ProductCard";
import { products } from "@/lib/products";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function ProductsRail() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    ensureRegistered();
    const wrap = wrapRef.current;
    const track = trackRef.current;
    const hint = hintRef.current;
    const line = lineRef.current;
    if (!wrap || !track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;

    const cards = track.querySelectorAll<HTMLElement>("[data-card]");
    const enterTrigger = ScrollTrigger.create({
      trigger: wrap,
      start: "top 80%",
      once: true,
      onEnter: () =>
        gsap.from(cards, { y: 60, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08 }),
    });

    let hintEnterTrigger: ScrollTrigger | undefined;
    if (hint && !reduce) {
      gsap.set(hint, { opacity: 0, y: 12 });
      hintEnterTrigger = ScrollTrigger.create({
        trigger: wrap,
        start: "top 70%",
        once: true,
        onEnter: () => gsap.to(hint, { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }),
      });
    }

    let pinTween: gsap.core.Tween | undefined;
    let lineTween: gsap.core.Tween | undefined;
    let hintHideTween: gsap.core.Tween | undefined;

    if (!reduce && desktop) {
      const computeDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
      pinTween = gsap.to(track, {
        x: () => -computeDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top+=80",
          end: () => "+=" + computeDistance(),
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (!hint) return;
            const scrolled = self.progress * computeDistance();
            if (scrolled > 100) {
              if (hint.dataset.hidden !== "true") {
                hint.dataset.hidden = "true";
                hintHideTween?.kill();
                hintHideTween = gsap.to(hint, {
                  opacity: 0,
                  y: 8,
                  duration: 0.4,
                  ease: "expo.out",
                });
              }
            } else if (hint.dataset.hidden === "true") {
              hint.dataset.hidden = "false";
              hintHideTween?.kill();
              hintHideTween = gsap.to(hint, { opacity: 1, y: 0, duration: 0.4, ease: "expo.out" });
            }
          },
        },
      });

      if (line) {
        gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
        lineTween = gsap.to(line, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top+=80",
            end: () => "+=" + computeDistance(),
            scrub: true,
          },
        });
      }
    } else if (line) {
      gsap.set(line, { scaleX: 1, transformOrigin: "left center" });
    }

    return () => {
      enterTrigger.kill();
      hintEnterTrigger?.kill();
      pinTween?.scrollTrigger?.kill();
      pinTween?.kill();
      lineTween?.scrollTrigger?.kill();
      lineTween?.kill();
      hintHideTween?.kill();
    };
  }, []);

  return (
    <section id="products" className="relative overflow-hidden bg-forest-deep pt-24 text-bone md:pt-32">
      <Container>
        <div className="eyebrow flex items-center gap-3 text-sage">
          <span className="h-px w-6 bg-current" />
          Our craft · 8 categories
        </div>
        <SplitText
          as="h2"
          className="serif mt-8 max-w-5xl text-[clamp(36px,6vw,84px)] font-light leading-[0.98] tracking-[-0.03em]"
        >
          Bags that brands are proud to hand over.
        </SplitText>
        <div className="mt-10 h-px w-full overflow-hidden bg-bone/10">
          <span ref={lineRef} className="block h-full w-full bg-leaf/70" />
        </div>
      </Container>

      <div
        ref={wrapRef}
        data-cursor="drag"
        className="relative mt-16 pb-32"
      >
        <div
          ref={trackRef}
          className="flex gap-6 px-6 will-change-transform md:gap-7 md:px-10 lg:flex-nowrap"
          style={{ width: "max-content" }}
        >
          {products.map((p) => (
            <div key={p.slug} data-card>
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        <div
          ref={hintRef}
          aria-hidden="true"
          className="mono pointer-events-none absolute bottom-8 right-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-bone/60 md:right-10"
        >
          <span className="inline-block h-px w-6 bg-current" />
          Drag / Scroll
        </div>
      </div>
    </section>
  );
}
