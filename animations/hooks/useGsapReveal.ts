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

type Direction = "y" | "x" | "scale";

export function useGsapReveal<T extends HTMLElement = HTMLDivElement>({
  direction = "y",
  start = "top 88%",
  stagger = 0.08,
  duration = 1.1,
  ease = "expo.out",
  once = true,
}: {
  direction?: Direction;
  start?: string;
  stagger?: number;
  duration?: number;
  ease?: string;
  once?: boolean;
} = {}): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    ensureRegistered();
    const el = ref.current;
    if (!el) return;

    const targets = el.dataset.children
      ? Array.from(el.querySelectorAll<HTMLElement>(el.dataset.children))
      : [el];

    if (direction === "scale") gsap.set(targets, { scale: 0.96, opacity: 0 });
    else if (direction === "x") gsap.set(targets, { x: -40, opacity: 0 });
    else gsap.set(targets, { y: 40, opacity: 0 });

    const tween = gsap.to(targets, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration,
      ease,
      stagger,
      scrollTrigger: { trigger: el, start, once },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [direction, start, stagger, duration, ease, once]);

  return ref;
}
