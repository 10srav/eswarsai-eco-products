"use client";

import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SplitText } from "@/components/ui/SplitText";
import { company } from "@/lib/company";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-forest-deep py-32 text-bone md:py-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(82,183,136,0.22), transparent 50%)" }}
      />
      <Container>
        <div className="relative grid gap-12 md:grid-cols-[1.5fr_1fr] md:items-end">
          <div>
            <div className="eyebrow flex items-center gap-3 text-sage">
              <span className="h-px w-6 bg-current" />
              Ready when you are
            </div>
            <SplitText
              as="h2"
              className="serif mt-8 max-w-3xl text-[clamp(40px,6vw,96px)] font-light leading-[0.95] tracking-[-0.03em]"
            >
              Send us your brief. Receive a sample in five working days.
            </SplitText>
          </div>
          <div className="flex flex-col gap-4">
            <MagneticButton href="/contact" variant="primary">
              Start an enquiry
              <ArrowRight size={16} />
            </MagneticButton>
            <a
              href={`https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent("Hi Eswar Sai, I'd like to enquire about eco-friendly bags.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-bone/30 px-7 py-4 text-sm transition-colors hover:bg-bone/10"
            >
              Or WhatsApp us directly
            </a>
            <p className="mt-2 text-xs opacity-60">
              {company.phone} · Mon–Sat 9:00–18:30 IST
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
