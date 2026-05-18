"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { company } from "@/lib/company";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

const productLinks = [
  { href: "/products/d-cut-non-woven", label: "D-cut non-woven" },
  { href: "/products/w-cut-non-woven", label: "W-cut non-woven" },
  { href: "/products/loop-handle", label: "Loop handle" },
  { href: "/products/classic-jute-tote", label: "Jute totes" },
  { href: "/products/branded-promotional", label: "Custom print" },
];

const companyLinks = [
  { href: "/sustainability", label: "Sustainability" },
  { href: "/industries", label: "Industries" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const bigRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureRegistered();
    const el = bigRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const parent = el.parentElement;
    if (!parent) return;
    const tween = gsap.to(el, {
      x: -240,
      ease: "none",
      scrollTrigger: { trigger: parent, start: "top bottom", end: "bottom bottom", scrub: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <footer className="relative overflow-hidden bg-ink px-6 pb-10 pt-24 text-cream md:px-10">
      <div
        ref={bigRef}
        aria-hidden="true"
        className="serif pointer-events-none whitespace-nowrap font-light leading-[0.9] tracking-[-0.04em]"
        style={{ color: "var(--color-forest)", fontSize: "clamp(60px, 12vw, 220px)" }}
      >
        replace plastic. <em className="not-italic text-moss" style={{ fontStyle: "italic" }}>save nature.</em>
      </div>

      <div className="mt-20 grid gap-10 border-t border-cream/15 pt-14 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-full bg-leaf">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#0e2a1e" aria-hidden="true" focusable="false">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
              </svg>
            </span>
            <span>Eswar Sai Eco Products</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-65">
            Premium non-woven & jute bag manufacturing. Built for businesses replacing plastic with purpose.
          </p>
        </div>

        <div>
          <h3 className="eyebrow opacity-50">Products</h3>
          <ul className="mt-5 flex flex-col gap-2 text-sm">
            {productLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-[24px] items-center opacity-85 transition-all hover:translate-x-1 hover:text-sage hover:opacity-100">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow opacity-50">Company</h3>
          <ul className="mt-5 flex flex-col gap-2 text-sm">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-[24px] items-center opacity-85 transition-all hover:translate-x-1 hover:text-sage hover:opacity-100">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow opacity-50">Reach</h3>
          <ul className="mt-5 flex flex-col gap-2 text-sm">
            <li><a href={`tel:${company.phoneE164}`} className="inline-flex min-h-[24px] items-center opacity-85 hover:text-sage hover:opacity-100">{company.phone}</a></li>
            <li><a href={`mailto:${company.email}`} className="inline-flex min-h-[24px] items-center opacity-85 hover:text-sage hover:opacity-100">hello@eswar…</a></li>
            <li><a href={`https://wa.me/${company.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[24px] items-center opacity-85 hover:text-sage hover:opacity-100">WhatsApp <span className="sr-only">(opens in new tab)</span></a></li>
            <li><a href={company.socials.googleMaps} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[24px] items-center opacity-85 hover:text-sage hover:opacity-100">{company.address.locality}, AP <span className="sr-only">(opens in new tab)</span></a></li>
          </ul>
        </div>
      </div>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-cream/10 pt-6 text-xs opacity-50">
        <span>© 2026 {company.legalName} · All rights reserved</span>
        <span>Made with care, in {company.address.region}.</span>
      </div>
    </footer>
  );
}
