"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    ensureRegistered();

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      syncTouch: false,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // Refresh after children mount so ScrollTriggers recompute against Lenis-controlled scroll.
    const raf1 = requestAnimationFrame(() => ScrollTrigger.refresh());
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 250);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 1000);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    let fontsAborted = false;
    if (document.fonts) {
      document.fonts.ready.then(() => {
        if (!fontsAborted) ScrollTrigger.refresh();
      });
    }

    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("load", onLoad);
      fontsAborted = true;
      gsap.ticker.remove(tickerFn);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
