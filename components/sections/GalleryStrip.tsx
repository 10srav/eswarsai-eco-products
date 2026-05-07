"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/Container";
import { SplitText } from "@/components/ui/SplitText";
import { galleryImages } from "@/lib/products";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function GalleryStrip() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureRegistered();
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = el.querySelectorAll<HTMLElement>("[data-tile]");
    if (items.length === 0) return;

    const animate = () =>
      gsap.fromTo(
        items,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.1, overwrite: "auto" },
      );

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: animate,
      onRefresh: (self) => {
        if (self.progress > 0) {
          animate();
          self.kill();
        }
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <section className="bg-cream py-24 md:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="eyebrow flex items-center gap-3 text-moss">
              <span className="h-px w-6 bg-current" />
              From the line
            </div>
            <SplitText
              as="h2"
              className="serif mt-8 max-w-3xl text-[clamp(36px,6vw,84px)] font-light leading-[0.98] tracking-[-0.03em]"
            >
              Inside the line. Bag by bag.
            </SplitText>
          </div>
          <Link
            href="/gallery"
            data-cursor="link"
            className="inline-flex items-center gap-2 self-start rounded-full border border-forest-deep/25 px-6 py-3 text-sm transition-colors hover:bg-forest-deep hover:text-bone"
          >
            View full gallery <ArrowUpRight size={14} />
          </Link>
        </div>

        <div ref={ref} className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {galleryImages.slice(0, 4).map((img, i) => (
            <div
              key={img.src}
              data-tile
              data-cursor="view"
              className={`group relative overflow-hidden rounded-md bg-forest/10 ${
                i === 0 ? "aspect-[3/4] sm:row-span-2 sm:aspect-[3/4] lg:col-span-2 lg:aspect-[8/5]" : "aspect-[4/3] lg:aspect-[4/5]"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
