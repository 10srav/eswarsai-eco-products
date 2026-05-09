"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/Container";
import { SplitText } from "@/components/ui/SplitText";
import { galleryShowcase } from "@/lib/products";
import { cn } from "@/lib/utils";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

// Editorial layout: 14 tiles in a 12-col grid. Rows alternate 7+5 / 4+4+4 / 6+6
// so the eye lands on a hero shot, then scans triplets, then settles into pairs.
const TILE_LAYOUT: { col: string; aspect: string }[] = [
  { col: "md:col-span-7", aspect: "aspect-[5/4]" },
  { col: "md:col-span-5", aspect: "aspect-[5/4]" },
  { col: "md:col-span-4", aspect: "aspect-[4/5]" },
  { col: "md:col-span-4", aspect: "aspect-[4/5]" },
  { col: "md:col-span-4", aspect: "aspect-[4/5]" },
  { col: "md:col-span-6", aspect: "aspect-[5/4]" },
  { col: "md:col-span-6", aspect: "aspect-[5/4]" },
  { col: "md:col-span-4", aspect: "aspect-[4/5]" },
  { col: "md:col-span-4", aspect: "aspect-[4/5]" },
  { col: "md:col-span-4", aspect: "aspect-[4/5]" },
  { col: "md:col-span-6", aspect: "aspect-[3/4]" },
  { col: "md:col-span-6", aspect: "aspect-[3/4]" },
  { col: "md:col-span-6", aspect: "aspect-[5/3]" },
  { col: "md:col-span-6", aspect: "aspect-[5/3]" },
];

function layoutFor(i: number) {
  return TILE_LAYOUT[i % TILE_LAYOUT.length];
}

export function GalleryShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    ensureRegistered();
    const root = sectionRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      videoRef.current?.pause();
      return;
    }

    const tiles = root.querySelectorAll<HTMLElement>("[data-showcase-tile]");
    if (tiles.length === 0) return;

    const trigger = ScrollTrigger.batch(tiles, {
      start: "top 90%",
      onEnter: (batch) =>
        gsap.fromTo(
          batch,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.06,
            overwrite: "auto",
          },
        ),
    });

    return () => {
      trigger.forEach((t) => t.kill());
    };
  }, []);

  const [hero, ...tiles] = galleryShowcase;

  return (
    <section ref={sectionRef} className="relative bg-bone py-16 md:py-24">
      <Container width="wide">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow flex items-center gap-3 text-moss">
              <span className="h-px w-6 bg-current" />
              Real client work
            </p>
            <SplitText
              as="h2"
              className="serif mt-6 text-[clamp(36px,6vw,84px)] font-light leading-[0.98] tracking-[-0.03em] text-forest-deep"
            >
              Bags we&rsquo;ve made. Brands we&rsquo;ve carried.
            </SplitText>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-forest-deep/70 md:text-right">
            Cooperative banks, weddings, hospitals, boutiques — every print run that left our line.
            Photographed on the floor, before despatch.
          </p>
        </div>

        {hero?.kind === "video" && (
          <figure
            data-showcase-tile
            className="group relative mt-12 aspect-video overflow-hidden rounded-md bg-forest-deep md:mt-16"
          >
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src={hero.src}
              poster={hero.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={hero.alt}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-6 pb-6 md:px-10 md:pb-10">
              <div>
                <p className="eyebrow text-sage/90">{hero.sub}</p>
                <p className="serif mt-2 text-2xl font-light leading-tight text-bone md:text-4xl">
                  {hero.caption}
                </p>
              </div>
              <span className="mono hidden items-center gap-2 rounded-full border border-bone/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-bone/80 md:inline-flex">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-leaf" />
                Live on the floor
              </span>
            </figcaption>
          </figure>
        )}

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-8 md:grid-cols-12 md:gap-4">
          {tiles.map((tile, i) => {
            const layout = layoutFor(i);
            return (
              <figure
                key={tile.src}
                data-showcase-tile
                className={cn(
                  "group relative overflow-hidden rounded-md bg-cream",
                  layout.col,
                  layout.aspect,
                )}
              >
                {tile.kind === "image" && (
                  <Image
                    src={tile.src}
                    alt={tile.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                )}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 px-4 pb-4 text-bone opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 md:px-5 md:pb-5">
                  <p className="serif text-lg font-light leading-tight md:text-xl">
                    {tile.caption}
                  </p>
                  {tile.sub && (
                    <p className="mono mt-1 text-[10px] uppercase tracking-[0.2em] text-bone/75">
                      {tile.sub}
                    </p>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
