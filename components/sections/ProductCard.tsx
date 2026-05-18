"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    ensureRegistered();
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Subtle entrance — image scales/fades from 0.96 to 1. Card is visible by default;
    // animation enhances rather than gates visibility.
    const trigger = ScrollTrigger.create({
      trigger: card,
      start: "top 92%",
      once: true,
      onEnter: () => {
        gsap.fromTo(
          card,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" },
        );
      },
      onRefresh: (self) => {
        if (self.progress > 0) {
          gsap.set(card, { y: 0, opacity: 1 });
          self.kill();
        }
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <Link
      ref={cardRef}
      href={`/products/${product.slug}`}
      className={cn(
        "group relative flex h-[540px] w-[380px] shrink-0 flex-col overflow-hidden rounded-md border bg-gradient-to-b from-forest-deep to-ink text-bone transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-2 hover:shadow-[0_30px_60px_-20px_rgba(14,42,30,0.45)]",
        product.highlight
          ? "border-leaf/40 from-forest/60 via-leaf/10 to-ink"
          : "border-bone/[0.12]",
        className,
      )}
    >
      <div className="relative h-[65%] w-full overflow-hidden bg-forest/40">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(max-width: 768px) 80vw, 380px"
          className="object-cover saturate-[0.85] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.07] group-hover:saturate-100"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-forest-deep/85 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-2 overflow-hidden rounded-full bg-leaf py-2 pl-2 pr-2 text-[11px] uppercase tracking-[0.18em] text-forest-deep opacity-0 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:pr-4 group-hover:opacity-100"
        >
          <span className="grid h-6 w-6 place-items-center">
            <ArrowUpRight size={14} strokeWidth={2.25} />
          </span>
          <span className="hidden w-0 whitespace-nowrap opacity-0 transition-all duration-500 group-hover:inline group-hover:w-auto group-hover:opacity-100">View</span>
        </span>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 translate-y-full bg-forest-deep/85 px-6 py-3 mono text-[10px] uppercase tracking-[0.22em] text-sage backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:translate-y-0"
        >
          {product.spec}
        </div>
      </div>

      <div className="flex h-[35%] flex-col justify-between px-6 py-5">
        <div className="mono text-[11px] tracking-[0.18em] text-bone/55">
          {product.number} · {product.category.toUpperCase()}
        </div>
        <div className="flex items-end justify-between gap-4">
          <h3 className="serif text-[22px] font-light leading-[1.1] tracking-[-0.02em] transition-colors duration-300 group-hover:text-sage">
            {product.name}
          </h3>
          <span className="mono shrink-0 rounded-full bg-sage/15 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-sage">
            {product.tag}
          </span>
        </div>
      </div>
    </Link>
  );
}
