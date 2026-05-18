export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[150] grid place-items-center overflow-hidden bg-forest-deep text-bone"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(149,213,178,0.18), transparent 50%), radial-gradient(ellipse at 10% 90%, rgba(82,183,136,0.14), transparent 60%)",
        }}
      />

      <div className="relative flex flex-col items-center gap-12">
        <span
          aria-hidden="true"
          className="grid h-9 w-9 place-items-center rounded-full bg-leaf"
          style={{ animation: "pulse-soft 2.4s ease-in-out infinite" }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#0e2a1e">
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
          </svg>
        </span>

        <div className="serif text-center font-light italic leading-[0.95] tracking-[-0.03em] text-sage" style={{ fontSize: "clamp(28px, 4vw, 56px)" }}>
          replace plastic.
        </div>

        <div className="relative h-px w-48 overflow-hidden bg-bone/15">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-1/3 bg-leaf"
            style={{ animation: "marquee-slow 1.6s var(--ease-cinematic) infinite" }}
          />
        </div>

        <p className="eyebrow opacity-70">Loading</p>
      </div>

      <span className="sr-only">Loading the Eswar Sai Eco Products page</span>
    </div>
  );
}
