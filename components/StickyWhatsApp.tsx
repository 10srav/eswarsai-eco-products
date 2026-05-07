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
      className="fixed bottom-5 right-5 z-80 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_40px_rgba(37,211,102,0.4)] transition-transform duration-500 will-change-transform hover:scale-110 md:bottom-6 md:right-6 md:h-15 md:w-15"
    >
      <span
        aria-hidden="true"
        className="absolute -inset-1.5 rounded-full border-2 border-[#25D366] opacity-50"
        style={{ animation: "wa-ring 2.4s infinite" }}
      />
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1-1.1 2.5 0 1.5 1.1 2.9 1.2 3.1.2.2 2.2 3.4 5.4 4.7.8.3 1.4.5 1.8.7.8.2 1.5.2 2 .1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z" />
        <path d="M20.5 3.5C18.3 1.2 15.3 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12 0-3.3-1.2-6.3-3.5-8.3zM12 22c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-3.7 1 .9-3.6-.2-.4C2.4 15.7 2 13.9 2 12 2 6.5 6.5 2 12 2c2.7 0 5.2 1 7.1 2.9 1.9 1.9 2.9 4.4 2.9 7.1 0 5.5-4.5 10-10 10z" opacity=".7" />
      </svg>
    </a>
  );
}
