import { Plus } from "lucide-react";
import { Container } from "@/components/Container";
import { faqSchema } from "@/lib/schema";

type Question = {
  "@type": "Question";
  name: string;
  acceptedAnswer: { "@type": "Answer"; text: string };
};

const faqs: Question[] = (faqSchema.mainEntity as Question[]) ?? [];

export function FAQAccordion() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <Container width="narrow">
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <div>
            <p className="eyebrow flex items-center gap-3 text-moss">
              <span className="h-px w-6 bg-current" />
              Frequently asked
            </p>
            <h2 className="serif mt-6 text-[clamp(34px,5vw,64px)] font-light leading-[1.0] tracking-[-0.03em] text-forest-deep">
              Things buyers ask before they brief us.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-forest-deep/70">
              Don&apos;t see your question? WhatsApp us, or email{" "}
              <a className="underline decoration-leaf decoration-1 underline-offset-4 hover:text-moss" href="mailto:hello@eswarsaiecoproducts.com">
                hello@eswarsaiecoproducts.com
              </a>
              . Real humans answer.
            </p>
          </div>

          <ul className="flex flex-col">
            {faqs.map((q, i) => (
              <li key={q.name} className="border-t border-forest-deep/15 first:border-t-0">
                <details className="group py-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                    <span className="serif text-[clamp(20px,2vw,26px)] font-light leading-[1.25] tracking-[-0.01em] text-forest-deep">
                      <span className="mono mr-3 align-middle text-[10px] font-medium uppercase tracking-[0.3em] text-moss/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {q.name}
                    </span>
                    <span
                      aria-hidden="true"
                      className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-forest-deep/25 transition-transform duration-500 group-open:rotate-45 group-open:border-leaf group-open:bg-leaf group-open:text-forest-deep"
                    >
                      <Plus size={16} strokeWidth={1.5} />
                    </span>
                  </summary>
                  <div className="mt-4 max-w-xl text-[15px] leading-relaxed text-forest-deep/75 md:text-base">
                    {q.acceptedAnswer.text}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
