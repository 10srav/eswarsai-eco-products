"use client";

import Image from "next/image";
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
  image: string;
  alt: string;
  kicker: string;
  headline: string;
  caption?: string;
  side?: "left" | "right" | "center";
  height?: "tall" | "short";
  tone?: "dark" | "light";
};

const sideClasses: Record<NonNullable<Props["side"]>, string> = {
  left: "items-start text-left",
  right: "items-end text-right",
  center: "items-center text-center",
};

export function EditorialBreak({
  image,
  alt,
  kicker,
  headline,
  caption,
  side = "left",
  height = "tall",
  tone = "dark",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    ensureRegistered();
    const section = sectionRef.current;
    const imageWrap = imageWrapRef.current;
    const kickerEl = kickerRef.current;
    const headlineEl = headlineRef.current;
    const captionEl = captionRef.current;
    if (!section || !imageWrap || !headlineEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Build word splits without innerHTML.
    const text = headlineEl.textContent ?? "";
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
    headlineEl.replaceChildren(fragment);
    const headlineSpans = headlineEl.querySelectorAll<HTMLElement>(".split-mask > span");

    const parallax = gsap.fromTo(
      imageWrap,
      { y: -80 },
      {
        y: 80,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    const animate = () => {
      const tl = gsap.timeline();
      if (kickerEl) {
        tl.fromTo(
          kickerEl,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" },
        );
      }
      tl.fromTo(
        headlineSpans,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.05,
          overwrite: "auto",
        },
        kickerEl ? "-=0.4" : 0,
      );
      if (captionEl) {
        tl.fromTo(
          captionEl,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" },
          "-=0.6",
        );
      }
    };

    const reveal = ScrollTrigger.create({
      trigger: section,
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

    return () => {
      parallax.scrollTrigger?.kill();
      parallax.kill();
      reveal.kill();
    };
  }, []);

  const isTall = height === "tall";
  const heightClass = isTall ? "h-[60vh] md:h-[80vh]" : "h-[40vh] md:h-[56vh]";

  const scrimClass =
    tone === "dark"
      ? "bg-gradient-to-t from-ink/85 via-ink/40 to-ink/20"
      : "bg-gradient-to-b from-bone/30 via-bone/10 to-transparent";

  const textColor = tone === "dark" ? "text-cream" : "text-forest-deep";

  return (
    <section
      ref={sectionRef}
      className={cn("relative w-full overflow-hidden", heightClass)}
      aria-label={kicker}
    >
      <div ref={imageWrapRef} className="absolute inset-0 scale-[1.15] will-change-transform">
        <Image src={image} alt={alt} fill sizes="100vw" className="object-cover" />
      </div>

      <div aria-hidden="true" className={cn("absolute inset-0", scrimClass)} />

      <div
        className={cn("absolute inset-0 flex flex-col justify-end", sideClasses[side], textColor)}
        style={{ padding: "6vw" }}
      >
        <div ref={kickerRef} className="eyebrow opacity-80">
          {kicker}
        </div>
        <h2
          ref={headlineRef}
          className="serif mt-6 font-light leading-[1.0]"
          style={{ fontSize: "clamp(36px, 6vw, 96px)", maxWidth: "24ch" }}
        >
          {headline}
        </h2>
        {caption ? (
          <p
            ref={captionRef}
            className="mt-6 text-sm opacity-70 md:text-base"
            style={{ maxWidth: "50ch" }}
          >
            {caption}
          </p>
        ) : null}
      </div>
    </section>
  );
}
