const items = [
  "Non-woven bags",
  "Jute totes",
  "D-cut",
  "W-cut",
  "Loop handle",
  "Custom prints",
  "Promotional",
  "Shopping",
];

export function Marquee() {
  const block = (
    <span className="marquee-item flex items-center gap-12">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-12">
          <span className={i % 2 === 1 ? "italic text-moss" : ""}>{it}</span>
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-leaf" aria-hidden="true" />
        </span>
      ))}
    </span>
  );

  return (
    <section
      aria-hidden="true"
      className="overflow-hidden border-y border-forest-deep/15 bg-cream py-7 whitespace-nowrap"
    >
      <div
        className="serif inline-flex gap-16 text-[clamp(20px,2vw,28px)] font-light tracking-tight text-forest-deep"
        style={{ animation: "scroll-x 40s linear infinite" }}
      >
        {block}
        {block}
      </div>
    </section>
  );
}
