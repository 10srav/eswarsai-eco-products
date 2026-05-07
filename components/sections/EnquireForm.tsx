"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { Container } from "@/components/Container";
import { SplitText } from "@/components/ui/SplitText";
import { Toast, type ToastState } from "@/components/ui/Toast";
import { company } from "@/lib/company";
import { products } from "@/lib/products";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  phone: z.string().regex(/^[+0-9\s\-()]{7,}$/i, "Enter a valid phone number"),
  business: z.string().optional(),
  requirement: z.string().min(1, "Please choose a product"),
  quantity: z.string().optional(),
  time: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const requirementOptions = [
  ...products.map((p) => p.name),
  "Custom — specify in WhatsApp",
];

export function EnquireForm() {
  const [toast, setToast] = useState<ToastState>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      await fetch("/api/enquire", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => null);

      const text = `Hello ${company.name}, I'd like to enquire about eco-friendly bags.

Name: ${data.name}
Phone: ${data.phone}
Business: ${data.business || "—"}
Requirement: ${data.requirement}
Quantity: ${data.quantity || "—"}
Preferred Time: ${data.time || "—"}${data.notes ? `\nNotes: ${data.notes}` : ""}`;

      const url = `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(text)}`;
      setToast({ tone: "success", message: "Opening WhatsApp…" });
      setTimeout(() => {
        setToast(null);
        reset();
        window.open(url, "_blank", "noopener,noreferrer");
      }, 700);
    } catch {
      setToast({ tone: "error", message: "Something went wrong. Please WhatsApp us directly." });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="enquire" className="relative overflow-hidden bg-forest-deep py-24 text-bone md:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 25% 40%, rgba(82,183,136,0.22), transparent 55%)" }}
      />
      <Container>
        <div className="relative grid gap-16 md:grid-cols-[1fr_1.2fr] md:gap-20">
          <div>
            <div className="eyebrow flex items-center gap-3 text-sage">
              <span className="h-px w-6 bg-current" />
              Let&apos;s talk
            </div>
            <SplitText
              as="h2"
              className="serif mt-8 text-[clamp(40px,5vw,76px)] font-light leading-[1.0] tracking-[-0.03em]"
            >
              Send us your brief on WhatsApp.
            </SplitText>
            <p className="mt-6 max-w-md text-base leading-relaxed opacity-75">
              Fill the form — we&apos;ll prefill a WhatsApp message you can review and send. We typically respond within 30 minutes during business hours.
            </p>

            <ul className="mt-10 flex flex-col">
              {[
                { lbl: "Call", value: company.phone, href: `tel:${company.phoneE164}` },
                { lbl: "Email", value: company.email, href: `mailto:${company.email}` },
                { lbl: "Visit", value: `${company.address.line2}, ${company.address.locality} ${company.address.postal}`, href: company.socials.googleMaps },
                { lbl: "Hours", value: company.hours, href: "#" },
              ].map((row, i) => (
                <li key={row.lbl} className={cn("border-bone/15 py-3.5 transition-all hover:pl-2", i === 0 ? "border-t border-b" : "border-b")}>
                  <a href={row.href} className="flex flex-wrap items-center gap-3 text-sm" target={row.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    <span className="eyebrow min-w-[80px] opacity-50">{row.lbl}</span>
                    <span>{row.value}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-lg border border-bone/15 bg-bone/[0.04] p-8 backdrop-blur-md md:p-12"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Your name *" error={errors.name?.message}>
                <input
                  type="text"
                  placeholder="Full name"
                  {...register("name")}
                  className={inputCls(errors.name)}
                />
              </Field>
              <Field label="Phone *" error={errors.phone?.message}>
                <input
                  type="tel"
                  placeholder="+91 91210 53678"
                  inputMode="tel"
                  autoComplete="tel"
                  {...register("phone")}
                  className={inputCls(errors.phone)}
                />
              </Field>
            </div>

            <Field label="Business / Brand" error={errors.business?.message} className="mt-5">
              <input
                type="text"
                placeholder="Company name (optional)"
                {...register("business")}
                className={inputCls(errors.business)}
              />
            </Field>

            <Field label="Requirement *" error={errors.requirement?.message} className="mt-5">
              <select {...register("requirement")} className={cn(inputCls(errors.requirement), "appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%2395d5b2%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5%22%2F%3E%3C%2Fsvg%3E')] bg-[length:18px] bg-[right_0_center] bg-no-repeat pr-7")}>
                <option value="">Select a product</option>
                {requirementOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </Field>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Quantity">
                <input
                  type="text"
                  placeholder="e.g. 5,000 pcs"
                  {...register("quantity")}
                  className={inputCls()}
                />
              </Field>
              <Field label="Preferred callback">
                <select {...register("time")} className={cn(inputCls(), "appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%2395d5b2%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5%22%2F%3E%3C%2Fsvg%3E')] bg-[length:18px] bg-[right_0_center] bg-no-repeat pr-7")}>
                  <option value="">Anytime</option>
                  <option>Morning (9 – 12)</option>
                  <option>Afternoon (12 – 16)</option>
                  <option>Evening (16 – 19)</option>
                </select>
              </Field>
            </div>

            <Field label="Notes (optional)" className="mt-5">
              <textarea
                rows={3}
                placeholder="Print colour count, size, GSM…"
                {...register("notes")}
                className={cn(inputCls(), "resize-y")}
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-md bg-leaf py-5 text-sm font-medium tracking-wide text-forest-deep transition-colors hover:bg-sage disabled:opacity-60"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              {submitting ? "Sending…" : "Send via WhatsApp"}
            </button>

            <p className="mt-4 text-center text-[11px] uppercase tracking-[0.2em] opacity-50">
              We never spam · Your data stays with us
            </p>
          </form>
        </div>
      </Container>

      <Toast state={toast} />
    </section>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("flex flex-col", className)}>
      <span className="eyebrow mb-2.5 opacity-60">{label}</span>
      {children}
      {error && <span className="mt-1.5 text-[11px] text-flame">{error}</span>}
    </label>
  );
}

function inputCls(error?: { message?: string }) {
  return cn(
    "w-full bg-transparent border-0 border-b border-bone/25 py-2.5 text-base outline-none transition-colors placeholder:text-bone/35 focus:border-leaf",
    error?.message && "border-flame focus:border-flame",
  );
}
