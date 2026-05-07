"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  delay?: number;
  stagger?: number;
  start?: string;
  triggerOnView?: boolean;
};

export function SplitText({
  as: Tag = "h2",
  className,
  children,
  delay = 0,
  stagger = 0.04,
  start = "top 85%",
  triggerOnView = true,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    ensureRegistered();
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const text = root.textContent ?? "";
    const fragment = document.createDocumentFragment();
    text.split(/(\s+)/).forEach((part) => {
      if (part === "") return;
      if (/^\s+$/.test(part)) {
        fragment.appendChild(document.createTextNode(part));
        return;
      }
      const wrap = document.createElement("span");
      wrap.className = "split-mask";
      const inner = document.createElement("span");
      inner.textContent = part;
      wrap.appendChild(inner);
      fragment.appendChild(wrap);
    });
    root.replaceChildren(fragment);

    const spans = root.querySelectorAll<HTMLElement>(".split-mask > span");
    if (spans.length === 0) return;

    // Use fromTo so gsap explicitly sets the from-state (immediateRender:true is default).
    const animate = () =>
      gsap.fromTo(
        spans,
        { yPercent: 110 },
        { yPercent: 0, duration: 1.2, ease: "expo.out", stagger, delay, overwrite: "auto" },
      );

    let trigger: ScrollTrigger | undefined;
    if (triggerOnView) {
      // Check if already in view at registration; ScrollTrigger handles this with onEnter.
      trigger = ScrollTrigger.create({
        trigger: root,
        start,
        once: true,
        onEnter: animate,
        onRefresh: (self) => {
          // If the element is already past its start at refresh time, fire animate.
          if (self.progress > 0 && !self.animation) {
            animate();
            self.kill();
          }
        },
      });
    } else {
      animate();
    }

    return () => trigger?.kill();
  }, [delay, stagger, start, triggerOnView]);

  return (
    <Tag ref={ref as never} className={cn(className)}>
      {children}
    </Tag>
  );
}
