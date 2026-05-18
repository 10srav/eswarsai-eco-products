"use client";

import { useEffect, useRef } from "react";
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
  value: number;
  prefix?: string;
  suffix?: string;
  unit?: string;
  decimals?: number;
  className?: string;
  unitClassName?: string;
  duration?: number;
  format?: "compact" | "indian" | "raw";
};

function formatNum(v: number, decimals: number, format: "compact" | "indian" | "raw") {
  if (format === "compact") {
    return v.toLocaleString("en-IN", { notation: "compact", maximumFractionDigits: 1 });
  }
  if (format === "indian") {
    return v.toLocaleString("en-IN", {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    });
  }
  return v.toFixed(decimals);
}

export function Counter({
  value,
  prefix = "",
  suffix = "",
  unit = "",
  decimals = 0,
  className,
  unitClassName,
  duration = 2.4,
  format = "raw",
}: Props) {
  const numRef = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const finalLabel = prefix + formatNum(value, decimals, format);

  useEffect(() => {
    ensureRegistered();
    const wrap = wrapRef.current;
    const numEl = numRef.current;
    if (!wrap || !numEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      numEl.textContent = finalLabel;
      return;
    }

    const obj = { v: 0 };
    let started = false;
    const startAnim = () => {
      if (started) return;
      started = true;
      numEl.textContent = prefix + formatNum(0, decimals, format);
      tweenRef.current = gsap.to(obj, {
        v: value,
        duration,
        ease: "expo.out",
        onUpdate: () => {
          numEl.textContent = prefix + formatNum(obj.v, decimals, format);
        },
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: wrap,
      start: "top 92%",
      once: true,
      onEnter: startAnim,
      onRefresh: (self) => {
        if (self.progress > 0) startAnim();
      },
    });

    return () => {
      tweenRef.current?.kill();
      tweenRef.current = null;
      trigger.kill();
    };
  }, [value, prefix, decimals, duration, format, finalLabel]);

  return (
    <span ref={wrapRef} className={cn("inline-flex items-baseline gap-1", className)}>
      <span ref={numRef}>{finalLabel}</span>
      {suffix && <span>{suffix}</span>}
      {unit && (
        <span className={cn("text-[0.4em] italic text-moss", unitClassName)}>{unit}</span>
      )}
    </span>
  );
}
