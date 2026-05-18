"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navigation } from "@/lib/company";
import { cn } from "@/lib/utils";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    const previouslyFocused = (document.activeElement as HTMLElement | null) ?? null;

    const focusables = dialog
      ? Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      : [];
    focusables[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !dialog) return;
      const current = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (current.length === 0) return;
      const first = current[0];
      const last = current[current.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused && previouslyFocused !== document.body) {
        previouslyFocused.focus();
      } else {
        toggleRef.current?.focus();
      }
    };
  }, [open]);

  return (
    <header className="contents">
      <nav
        aria-label="Primary"
        className={cn(
          "fixed inset-x-0 top-0 z-[90] flex items-center justify-between px-6 transition-[padding,backdrop-filter] duration-500 md:px-10",
          scrolled ? "py-3 md:py-3.5" : "py-4 md:py-5",
          "text-cream",
        )}
        style={{ mixBlendMode: "difference" }}
      >
        <Link
          href="/"
          className="group flex items-center gap-3 font-semibold tracking-tight"
          aria-label="Eswar Sai Eco Products home"
        >
          <span className="relative grid h-7 w-7 place-items-center rounded-full bg-leaf transition-transform duration-500 group-hover:rotate-[20deg]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#0e2a1e">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
            </svg>
          </span>
          <span className="text-base md:text-lg">
            Eswar Sai <span className="font-light opacity-70">— Eco Products</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 text-sm md:flex">
          {navigation.slice(1).map((item) => {
            const active =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative py-1 transition-opacity",
                  active ? "opacity-100" : "opacity-80 hover:opacity-100",
                )}
              >
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px origin-left bg-current transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)]",
                    active ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden items-center gap-2 rounded-full border border-current px-4 py-2 text-xs sm:inline-flex"
          >
            <span className="h-1.5 w-1.5 animate-[pulse-soft_2s_infinite] rounded-full bg-leaf" />
            Get a quote
          </Link>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((s) => !s)}
            className="rounded-full border border-current p-2.5 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav-dialog"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      <div
        ref={dialogRef}
        id="mobile-nav-dialog"
        role="dialog"
        aria-modal={open ? "true" : undefined}
        aria-label="Mobile navigation"
        inert={!open}
        className={cn(
          "fixed inset-0 z-[80] bg-forest-deep/95 backdrop-blur-xl transition-all duration-500 md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex h-full flex-col justify-between p-8 pt-24 text-bone">
          <ul className="flex flex-col gap-6 font-display text-4xl">
            {navigation.map((item, i) => {
              const active =
                pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <li key={item.href} style={{ transitionDelay: `${i * 60}ms` }}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    tabIndex={open ? 0 : -1}
                    className="block transition-colors hover:text-sage"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="text-sm opacity-70">
            <p>+91 91210 53678</p>
            <p>hello@eswarsaiecoproducts.com</p>
            <p>Kakinada, Andhra Pradesh</p>
          </div>
        </div>
      </div>
    </header>
  );
}
