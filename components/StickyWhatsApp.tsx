"use client";

import { company } from "@/lib/company";

export function StickyWhatsApp() {
  const url = `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(
    `Hi ${company.name}, I'd like a quote for eco-friendly bags.`,
  )}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-5 right-5 z-80 flex items-center gap-0 overflow-hidden rounded-full bg-[#075E54] text-white shadow-[0_8px_28px_-6px_rgba(7,94,84,0.55)] transition-[gap,padding,box-shadow] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:shadow-[0_12px_36px_-4px_rgba(7,94,84,0.65)] hover:gap-2 hover:pr-5 md:bottom-6 md:right-6"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1.5 rounded-full border border-[#25D366]/40"
        style={{ animation: "wa-ring 2.8s infinite" }}
      />
      <span className="relative grid h-14 w-14 place-items-center md:h-[60px] md:w-[60px]">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1-1.1 2.5 0 1.5 1.1 2.9 1.2 3.1.2.2 2.2 3.4 5.4 4.7.8.3 1.4.5 1.8.7.8.2 1.5.2 2 .1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" />
          <path d="M20.5 3.5C18.3 1.2 15.3 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12 0-3.3-1.2-6.3-3.5-8.3zM12 22c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-3.7 1 .9-3.6-.2-.4C2.4 15.7 2 13.9 2 12 2 6.5 6.5 2 12 2c2.7 0 5.2 1 7.1 2.9 1.9 1.9 2.9 4.4 2.9 7.1 0 5.5-4.5 10-10 10z" opacity=".7" />
        </svg>
      </span>
      <span className="hidden w-0 overflow-hidden whitespace-nowrap text-xs font-medium uppercase tracking-[0.18em] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:w-auto group-hover:opacity-100 md:inline">
        Quote on WhatsApp
      </span>
    </a>
  );
}
