"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { Container } from "@/components/Container";
import { galleryImages, products } from "@/lib/products";
import { cn } from "@/lib/utils";

type Category = "All" | "Bags" | "Manufacturing" | "Detail";

type Tile = {
  src: string;
  alt: string;
  category: Exclude<Category, "All">;
};

function classify(src: string, alt: string): Exclude<Category, "All"> {
  const path = src.toLowerCase();
  const a = alt.toLowerCase();
  if (path.includes("/factory/") || a.includes("worker") || a.includes("machine") || a.includes("warehouse") || a.includes("rolls") || a.includes("line") || a.includes("pile") || a.includes("pallet")) {
    return "Manufacturing";
  }
  if (a.includes("close") || a.includes("detail") || path.includes("close") || path.includes("detail")) {
    return "Detail";
  }
  return "Bags";
}

const ALL_TILES: Tile[] = (() => {
  const seen = new Set<string>();
  const tiles: Tile[] = [];
  const add = (src: string, alt: string) => {
    if (seen.has(src)) return;
    seen.add(src);
    tiles.push({ src, alt, category: classify(src, alt) });
  };
  galleryImages.forEach((g) => add(g.src, g.alt));
  products.forEach((p) => add(p.image.src, p.image.alt));
  return tiles;
})();

const CATEGORIES: Category[] = ["All", "Bags", "Manufacturing", "Detail"];

function spanFor(i: number) {
  // Vary row spans every few tiles for editorial rhythm.
  const m = i % 7;
  if (m === 0) return "row-span-2";
  if (m === 3) return "row-span-2";
  if (m === 5) return "row-span-3";
  return "row-span-1";
}

export function GalleryMasonry() {
  const [active, setActive] = useState<Category>("All");
  const gridRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () => (active === "All" ? ALL_TILES : ALL_TILES.filter((t) => t.category === active)),
    [active],
  );

  const counts = useMemo(() => {
    const c: Record<Category, number> = { All: ALL_TILES.length, Bags: 0, Manufacturing: 0, Detail: 0 };
    ALL_TILES.forEach((t) => {
      c[t.category] += 1;
    });
    return c;
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tiles = grid.querySelectorAll<HTMLElement>("[data-tile]");
    if (tiles.length === 0) return;
    gsap.fromTo(
      tiles,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "expo.out", stagger: 0.04, overwrite: "auto" },
    );
  }, [active]);

  return (
    <>
      <div className="sticky top-[68px] z-30 border-y border-forest-deep/10 bg-bone/95 py-4 backdrop-blur-md md:top-[80px]">
        <Container width="wide">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {CATEGORIES.map((cat) => {
              const isActive = cat === active;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  data-cursor="link"
                  aria-pressed={isActive}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors md:text-[11px]",
                    isActive
                      ? "border-forest-deep bg-forest-deep text-bone"
                      : "border-forest-deep/25 text-forest-deep/80 hover:border-forest-deep/55 hover:text-forest-deep",
                  )}
                >
                  <span>{cat}</span>
                  <span
                    className={cn(
                      "mono rounded-full px-1.5 py-0.5 text-[10px]",
                      isActive ? "bg-bone/15 text-bone" : "bg-forest-deep/10 text-forest-deep/60",
                    )}
                  >
                    {counts[cat]}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      <section className="bg-bone py-16 md:py-24">
        <Container width="wide">
          <div
            ref={gridRef}
            key={active}
            className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4"
            style={{ gridAutoRows: "200px", gridAutoFlow: "row dense" }}
          >
            {visible.map((img, i) => (
              <figure
                key={`${img.src}-${i}`}
                data-tile
                data-cursor="view"
                className={cn(
                  "group relative overflow-hidden rounded-md bg-cream",
                  spanFor(i),
                )}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <figcaption
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/80 to-transparent px-4 pb-3 pt-10 text-[11px] uppercase tracking-[0.18em] text-bone/0 transition-all duration-500 group-hover:translate-y-0 group-hover:text-bone/90"
                >
                  {img.alt}
                </figcaption>
              </figure>
            ))}
          </div>
          {visible.length === 0 && (
            <p className="mt-10 text-center text-sm text-forest-deep/60">No images in this category yet.</p>
          )}
        </Container>
      </section>
    </>
  );
}
