import { Container } from "@/components/Container";
import { SplitText } from "@/components/ui/SplitText";

type Props = {
  eyebrow: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  variant?: "forest" | "cream" | "bone";
};

const variants: Record<NonNullable<Props["variant"]>, string> = {
  forest: "bg-gradient-to-b from-forest-deep via-forest to-moss text-bone",
  cream: "bg-cream text-forest-deep",
  bone: "bg-bone text-forest-deep",
};

export function PageHero({ eyebrow, title, lede, align = "left", variant = "forest" }: Props) {
  return (
    <section className={`relative overflow-hidden ${variants[variant]} pb-16 pt-40 md:pb-24 md:pt-44`}>
      {variant === "forest" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(149,213,178,0.18), transparent 55%)" }}
        />
      )}
      <Container>
        <div className={align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-5xl"}>
          <p className={`eyebrow flex items-center gap-3 ${variant === "forest" ? "text-sage" : "text-moss"} ${align === "center" ? "justify-center" : ""}`}>
            <span className="h-px w-6 bg-current" />
            {eyebrow}
          </p>
          <SplitText
            as="h1"
            className="serif mt-6 text-[clamp(48px,8vw,128px)] font-light leading-[0.95] tracking-[-0.04em]"
          >
            {title}
          </SplitText>
          {lede && (
            <p className={`mt-8 max-w-2xl text-base leading-relaxed opacity-80 md:text-lg ${align === "center" ? "mx-auto" : ""}`}>
              {lede}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
