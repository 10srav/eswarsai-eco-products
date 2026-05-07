"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { Container } from "@/components/Container";
import { ProductCard } from "@/components/sections/ProductCard";
import { products, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Non-woven", "Jute", "Promotional", "Shopping", "Specialty", "Custom"] as const;
type Category = (typeof CATEGORIES)[number];

function countFor(cat: Category) {
  if (cat === "All") return products.length;
  return products.filter((p) => p.category === cat).length;
}

export function ProductsFilterableGrid() {
  const [active, setActive] = useState<Category>("All");
  const gridRef = useRef<HTMLDivElement>(null);

  const visible: Product[] = useMemo(
    () => (active === "All" ? products : products.filter((p) => p.category === active)),
    [active],
  );

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = grid.querySelectorAll<HTMLElement>("[data-card]");
    if (cards.length === 0) return;
    gsap.fromTo(
      cards,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "expo.out", stagger: 0.04, overwrite: "auto" },
    );
  }, [active]);

  return (
    <section className="bg-forest-deep py-16 md:py-24">
      <div className="sticky top-[68px] z-30 mb-10 border-y border-bone/10 bg-forest-deep/95 py-4 backdrop-blur-md md:top-[80px] md:mb-14">
        <Container>
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {CATEGORIES.map((cat) => {
              const isActive = cat === active;
              const count = countFor(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  data-cursor="link"
                  aria-pressed={isActive}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors md:text-[11px]",
                    isActive
                      ? "border-leaf bg-leaf text-forest-deep"
                      : "border-bone/25 text-bone/80 hover:border-bone/55 hover:text-bone",
                  )}
                >
                  <span>{cat}</span>
                  <span
                    className={cn(
                      "mono rounded-full px-1.5 py-0.5 text-[10px]",
                      isActive ? "bg-forest-deep/15 text-forest-deep" : "bg-bone/10 text-bone/60",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      <Container>
        <div
          ref={gridRef}
          key={active}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 [&>*]:!w-full"
        >
          {visible.map((p) => (
            <div key={p.slug} data-card>
              <ProductCard product={p} className="!w-full" />
            </div>
          ))}
        </div>
        {visible.length === 0 && (
          <p className="mt-10 text-center text-sm text-bone/60">No products match this filter.</p>
        )}
      </Container>
    </section>
  );
}
