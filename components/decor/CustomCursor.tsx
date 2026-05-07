"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type CursorMode = "default" | "view" | "drag" | "link";

const SCALE: Record<CursorMode, number> = {
  default: 1,
  view: 80 / 40,
  drag: 96 / 40,
  link: 56 / 40,
};

const LABEL: Record<CursorMode, string> = {
  default: "",
  view: "VIEW",
  drag: "DRAG",
  link: "",
};

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let visible = false;
    let mode: CursorMode = "default";
    let raf = 0;

    const setVisible = () => {
      if (visible) return;
      visible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      setVisible();
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    // ~0.15s catch-up at 60fps. t per frame ≈ 1 - exp(-frame/(rate * tau)) ≈ 0.18.
    const tick = () => {
      ringX = lerp(ringX, targetX, 0.18);
      ringY = lerp(ringY, targetY, 0.18);
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const setMode = (next: CursorMode) => {
      if (mode === next) return;
      mode = next;
      gsap.to(ring, {
        scale: SCALE[next],
        duration: 0.4,
        ease: "power3.out",
      });
      const text = LABEL[next];
      label.textContent = text;
      gsap.to(label, {
        opacity: text ? 1 : 0,
        duration: 0.25,
        ease: "power2.out",
      });
    };

    const resolveMode = (el: Element | null): CursorMode => {
      if (!el) return "default";
      const cur = el.closest<HTMLElement>("[data-cursor]");
      if (cur) {
        const v = cur.dataset.cursor;
        if (v === "view" || v === "drag" || v === "link") return v;
      }
      if (el.closest("a, button")) return "link";
      return "default";
    };

    const onOver = (e: MouseEvent) => {
      setMode(resolveMode(e.target as Element | null));
    };

    const onLeaveWindow = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeaveWindow);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="custom-cursor-root" aria-hidden="true">
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[60] h-2 w-2 rounded-full opacity-0 will-change-transform"
        style={{
          backgroundColor: "#ffffff",
          mixBlendMode: "difference",
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
        }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[60] flex h-10 w-10 items-center justify-center rounded-full border opacity-0 will-change-transform"
        style={{
          borderColor: "#ffffff",
          color: "#ffffff",
          mixBlendMode: "difference",
          transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
        }}
      >
        <span
          ref={labelRef}
          className="select-none font-mono text-[10px] uppercase tracking-[0.18em] opacity-0"
        />
      </div>
      <style>{`
        @media (hover: none) {
          .custom-cursor-root { display: none; }
        }
      `}</style>
    </div>
  );
}
