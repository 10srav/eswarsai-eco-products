"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

const HeroParticles = dynamic(
  () => import("@/components/three/HeroParticles").then((m) => m.HeroParticles),
  { ssr: false },
);

export function HeroParticlesMount() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(0);
  const [supported, setSupported] = useState(false);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const probe = document.createElement("canvas");
    const gl = probe.getContext("webgl2") ?? probe.getContext("webgl");
    if (mq.matches || !gl) return;
    setSupported(true);
    const onChange = () => {
      if (mq.matches) setSupported(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!supported) return;
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "240px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [supported]);

  useEffect(() => {
    if (!supported) return;
    ensureRegistered();
    const el = wrapRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el.closest("section") ?? el,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });
    progressRef.current = st.progress;
    return () => st.kill();
  }, [supported]);

  if (!supported) return null;

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {near ? <HeroParticles progress={progressRef} active={visible} /> : null}
    </div>
  );
}
