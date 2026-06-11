"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/Container";
import { SplitText } from "@/components/ui/SplitText";
import { cn } from "@/lib/utils";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

const FOUNDERS = [
  { name: "P. Mallikharjuna Rao", role: "Founder" },
  { name: "Suresh Adapa", role: "Founder" },
];

const FACTS = ["EST. 2013", "KAKINADA, AP", "500+ BRANDS"];

const DUO_ALT =
  "P. Mallikharjuna Rao and Suresh Adapa, founders of NextGen Eco Bags";
const SOLO_ALT = "NextGen Eco Bags founder at the Kakinada office";

type Props = {
  variant?: "full" | "compact";
};

export function FoundersSection({ variant = "full" }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const photoColRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const duoParallaxRef = useRef<HTMLDivElement>(null);
  const soloParallaxRef = useRef<HTMLDivElement>(null);
  const isFull = variant === "full";

  useEffect(() => {
    ensureRegistered();
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Parallax lives on outer wrappers, reveal on inner cards, so the two
    // never fight over the same transform.
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const drifts: Array<[HTMLElement | null, number, number]> = [
        [duoParallaxRef.current, 24, -32],
        [soloParallaxRef.current, 52, -14],
      ];
      drifts.forEach(([el, from, to]) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: from },
          {
            y: to,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    });

    const ctx = gsap.context(() => {
      const revealGroup = (trigger: HTMLElement | null, animate: () => void) => {
        if (!trigger) return;
        ScrollTrigger.create({
          trigger,
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
      };

      const cards = Array.from(section.querySelectorAll<HTMLElement>(".f-card"));
      revealGroup(photoColRef.current, () => {
        gsap.fromTo(
          cards,
          { y: 56, scale: 0.95, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.16,
            overwrite: "auto",
          },
        );
      });

      const fades = Array.from(section.querySelectorAll<HTMLElement>(".f-fade"));
      revealGroup(textColRef.current, () => {
        gsap.fromTo(
          fades,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            overwrite: "auto",
          },
        );
      });
    }, section);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [variant]);

  return (
    <section
      ref={sectionRef}
      id="founders"
      aria-label="The founders of NextGen Eco Bags"
      className={cn("relative bg-bone", isFull ? "py-24 md:py-32" : "py-20 md:py-24")}
    >
      <Container>
        <div className="eyebrow flex items-center gap-3 text-moss">
          <span className="h-px w-6 bg-current" aria-hidden="true" />
          The people behind the line
        </div>
        <SplitText
          as="h2"
          className={cn(
            "serif mt-8 max-w-4xl font-light leading-[0.98] tracking-[-0.03em]",
            isFull ? "text-[clamp(40px,6vw,84px)]" : "text-[clamp(32px,5vw,64px)]",
          )}
        >
          Two founders. One refusal: plastic.
        </SplitText>

        <div
          className={cn(
            "grid gap-14 md:grid-cols-12 md:gap-10",
            isFull ? "mt-16 md:mt-24" : "mt-12 md:mt-16",
          )}
        >
          <div
            ref={photoColRef}
            className={cn(
              "relative pb-14 md:pb-16",
              isFull ? "md:col-span-5" : "md:col-span-4",
            )}
          >
            <div ref={duoParallaxRef} className="will-change-transform">
              <div className="f-card overflow-hidden rounded-md soft-shadow will-change-transform">
                <div className="relative aspect-[3/4]">
                  <Image
                    src="/images/founders/founders-together.png"
                    alt={DUO_ALT}
                    fill
                    sizes={
                      isFull
                        ? "(min-width: 1280px) 460px, (min-width: 768px) 38vw, 90vw"
                        : "(min-width: 1280px) 380px, (min-width: 768px) 30vw, 90vw"
                    }
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div
              ref={soloParallaxRef}
              className={cn(
                "absolute bottom-0 z-10 will-change-transform",
                isFull ? "right-0 w-[46%] md:-right-6" : "right-0 w-[44%] md:-right-4",
              )}
            >
              <div className="f-card -rotate-2 overflow-hidden rounded-md soft-shadow will-change-transform">
                <Image
                  src="/images/founders/founder-portrait.png"
                  alt={SOLO_ALT}
                  width={681}
                  height={985}
                  sizes={
                    isFull
                      ? "(min-width: 1280px) 220px, (min-width: 768px) 18vw, 42vw"
                      : "(min-width: 1280px) 180px, (min-width: 768px) 14vw, 42vw"
                  }
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>

          <div
            ref={textColRef}
            className={cn(isFull ? "md:col-span-6 md:col-start-7" : "md:col-span-7 md:col-start-6")}
          >
            <div className={cn(isFull ? "space-y-10" : "space-y-7")}>
              {FOUNDERS.map((f) => (
                <div key={f.name}>
                  <SplitText
                    as="h3"
                    className={cn(
                      "serif font-light leading-[1.02] tracking-[-0.03em]",
                      isFull
                        ? "text-[clamp(28px,4vw,56px)]"
                        : "text-[clamp(26px,3.2vw,44px)]",
                    )}
                  >
                    {f.name}
                  </SplitText>
                  <div className="eyebrow mt-3 flex items-center gap-3 text-moss">
                    <span className="h-px w-6 bg-current" aria-hidden="true" />
                    {f.role}
                  </div>
                </div>
              ))}
            </div>

            {isFull && (
              <figure className="f-fade mt-12 max-w-[44ch]">
                <blockquote className="serif text-xl font-light italic leading-[1.35] text-forest md:text-2xl">
                  &ldquo;We watched plastic choke the drains of our own town. So
                  we built the alternative ourselves.&rdquo;
                </blockquote>
                <figcaption className="eyebrow mt-4 text-moss">
                  The founders
                </figcaption>
              </figure>
            )}

            <p
              className={cn(
                "f-fade max-w-[52ch] text-base leading-relaxed text-ink/80",
                isFull ? "mt-10" : "mt-8",
              )}
            >
              They started in 2013 with one stitching line in Kakinada. That
              line is now two automated lines running custom prints for 500+
              brands: 40 million bags shipped, and counting.
            </p>

            <ul
              aria-label="Company facts"
              className={cn(
                "mono flex flex-wrap gap-3 text-[11px] tracking-[0.18em] text-forest",
                isFull ? "mt-10" : "mt-8",
              )}
            >
              {FACTS.map((f) => (
                <li key={f} className="rounded-full border border-forest-deep/25 px-4 py-2">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
