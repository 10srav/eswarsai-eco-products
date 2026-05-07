import { Container } from "@/components/Container";

const brands = [
  "Indian Grocer Co.",
  "Sweet Bazaar",
  "RetailMax India",
  "PharmaPlus",
  "Cotton & Linen",
  "Heritage Hotels",
  "FreshKart",
  "BrandWeavers",
  "Kirana United",
  "Saral Retail",
];

export function BrandStrip() {
  return (
    <section className="relative overflow-hidden border-y border-forest-deep/10 bg-bone py-14 md:py-20">
      <Container>
        <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-center md:gap-16">
          <div className="md:max-w-[14rem]">
            <p className="eyebrow text-moss">Trusted by</p>
            <p className="serif mt-4 text-[clamp(28px,3vw,40px)] font-light leading-[1.0] tracking-[-0.02em] text-forest-deep">
              500+ brands<br />
              <span className="italic text-moss">across India.</span>
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 md:grid-cols-5 md:gap-y-4">
            {brands.map((brand, i) => (
              <li
                key={brand}
                className={
                  i % 3 === 1
                    ? "serif text-[clamp(16px,1.6vw,22px)] italic font-light tracking-tight text-forest-deep/80"
                    : i % 3 === 2
                    ? "serif outline-stroke text-[clamp(16px,1.6vw,22px)] font-light tracking-tight"
                    : "serif text-[clamp(16px,1.6vw,22px)] font-light tracking-tight text-forest-deep/55"
                }
                style={{ color: i % 3 === 2 ? "var(--color-forest-deep)" : undefined }}
              >
                {brand}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
