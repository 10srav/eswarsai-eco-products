"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function useParallax<T extends HTMLElement = HTMLDivElement>({
  speed = 0.4,
  rotation = 0,
  trigger,
  start = "top top",
  end = "bottom top",
}: {
  speed?: number;
  rotation?: number;
  trigger?: string;
  start?: string;
  end?: string;
} = {}): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    ensureRegistered();
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.to(el, {
      y: () => window.innerHeight * speed,
      rotation,
      ease: "none",
      scrollTrigger: { trigger: trigger ?? el, start, end, scrub: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed, rotation, trigger, start, end]);

  return ref;
}
