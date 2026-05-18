"use client";

import { useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { Container } from "@/components/Container";
import { SplitText } from "@/components/ui/SplitText";
import { Toast, type ToastState } from "@/components/ui/Toast";
import { company } from "@/lib/company";
import { products } from "@/lib/products";
import { enquireSchema, type EnquireInput } from "@/lib/enquire-schema";
import { cn } from "@/lib/utils";

const requirementOptions = [
  ...products.map((p) => p.name),
  "Custom — specify in WhatsApp",
];

export function EnquireForm() {
  const [toast, setToast] = useState<ToastState>(null);
  const [submitting, setSubmitting] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const nameId = useId();
  const phoneId = useId();
  const businessId = useId();
  const requirementId = useId();
  const quantityId = useId();
  const timeId = useId();
  const notesId = useId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquireInput>({ resolver: zodResolver(enquireSchema) });

  const onSubmit = async (data: EnquireInput) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const message =
          res.status === 422
            ? "Please check the form and try again."
            : res.status === 429
              ? "Too many requests. Please try again in a minute."
              : "Something went wrong. Please WhatsApp us directly.";
        setToast({ tone: "error", message });
        setTimeout(() => setToast(null), 4000);
        return;
      }

      const text = `Hello ${company.name}, I'd like to enquire about eco-friendly bags.

Name: ${data.name}
Phone: ${data.phone}
Business: ${data.business || "—"}
Requirement: ${data.requirement}
Quantity: ${data.quantity || "—"}
Preferred Time: ${data.time || "—"}${data.notes ? `\nNotes: ${data.notes}` : ""}`;

      const url = `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(text)}`;
      const successText = "Enquiry sent. Opening WhatsApp…";
      setToast({ tone: "success", message: successText });
      setSuccessMessage(successText);
      // Announce success to assistive tech before navigating away.
      successRef.current?.focus();
      setTimeout(() => {
        setToast(null);
        reset();
        setSuccessMessage("");
        window.open(url, "_blank", "noopener,noreferrer");
      }, 700);
    } catch {
      setToast({ tone: "error", message: "Network error. Please WhatsApp us directly." });
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
                { lbl: "Call", value: company.phone, href: `tel:${company.phoneE164}`, external: false },
                { lbl: "Email", value: company.email, href: `mailto:${company.email}`, external: false },
                { lbl: "Visit", value: `${company.address.line2}, ${company.address.locality} ${company.address.postal}`, href: company.socials.googleMaps, external: true },
                { lbl: "Hours", value: company.hours, href: null, external: false },
              ].map((row, i) => (
                <li key={row.lbl} className={cn("border-bone/15 py-3.5 transition-all hover:pl-2", i === 0 ? "border-t border-b" : "border-b")}>
                  {row.href ? (
                    <a href={row.href} className="flex flex-wrap items-center gap-3 text-sm" target={row.external ? "_blank" : undefined} rel={row.external ? "noopener noreferrer" : undefined}>
                      <span className="eyebrow min-w-[80px] opacity-50">{row.lbl}</span>
                      <span>{row.value}{row.external ? <span className="sr-only"> (opens in new tab)</span> : null}</span>
                    </a>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="eyebrow min-w-[80px] opacity-50">{row.lbl}</span>
                      <span>{row.value}</span>
                    </div>
                  )}
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
              <Field id={nameId} label="Your name" required error={errors.name?.message}>
                <input
                  id={nameId}
                  type="text"
                  placeholder="Full name"
                  required
                  aria-required="true"
                  aria-invalid={errors.name ? "true" : undefined}
                  aria-describedby={errors.name ? `${nameId}-err` : undefined}
                  {...register("name")}
                  className={inputCls(errors.name)}
                />
              </Field>
              <Field id={phoneId} label="Phone" required error={errors.phone?.message}>
                <input
                  id={phoneId}
                  type="tel"
                  placeholder="+91 91210 53678"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  aria-required="true"
                  aria-invalid={errors.phone ? "true" : undefined}
                  aria-describedby={errors.phone ? `${phoneId}-err` : undefined}
                  {...register("phone")}
                  className={inputCls(errors.phone)}
                />
              </Field>
            </div>

            <Field
              id={businessId}
              label="Business / Brand"
              error={errors.business?.message}
              className="mt-5"
            >
              <input
                id={businessId}
                type="text"
                placeholder="Company name (optional)"
                aria-invalid={errors.business ? "true" : undefined}
                aria-describedby={errors.business ? `${businessId}-err` : undefined}
                {...register("business")}
                className={inputCls(errors.business)}
              />
            </Field>

            <Field
              id={requirementId}
              label="Requirement"
              required
              error={errors.requirement?.message}
              className="mt-5"
            >
              <select
                id={requirementId}
                required
                aria-required="true"
                aria-invalid={errors.requirement ? "true" : undefined}
                aria-describedby={errors.requirement ? `${requirementId}-err` : undefined}
                {...register("requirement")}
                className={cn(inputCls(errors.requirement), "appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%2395d5b2%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5%22%2F%3E%3C%2Fsvg%3E')] bg-[length:18px] bg-[right_0_center] bg-no-repeat pr-7")}
              >
                <option value="">Select a product</option>
                {requirementOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </Field>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field id={quantityId} label="Quantity">
                <input
                  id={quantityId}
                  type="text"
                  placeholder="e.g. 5,000 pcs"
                  {...register("quantity")}
                  className={inputCls()}
                />
              </Field>
              <Field id={timeId} label="Preferred callback">
                <select
                  id={timeId}
                  {...register("time")}
                  className={cn(inputCls(), "appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%2395d5b2%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5%22%2F%3E%3C%2Fsvg%3E')] bg-[length:18px] bg-[right_0_center] bg-no-repeat pr-7")}
                >
                  <option value="">Anytime</option>
                  <option>Morning (9 – 12)</option>
                  <option>Afternoon (12 – 16)</option>
                  <option>Evening (16 – 19)</option>
                </select>
              </Field>
            </div>

            <Field id={notesId} label="Notes (optional)" className="mt-5">
              <textarea
                id={notesId}
                rows={3}
                placeholder="Print colour count, size, GSM…"
                {...register("notes")}
                className={cn(inputCls(), "resize-y")}
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-md bg-leaf py-5 text-sm font-medium tracking-wide text-forest-deep transition-colors hover:bg-sage disabled:opacity-60"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
              {submitting ? "Sending…" : "Send via WhatsApp"}
            </button>

            <div
              ref={successRef}
              tabIndex={-1}
              role="status"
              aria-live="polite"
              className="sr-only"
            >
              {successMessage}
            </div>

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
  id,
  label,
  error,
  required,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={id} className="eyebrow mb-2.5 flex items-center gap-1.5 opacity-60">
        <span>{label}</span>
        {required ? (
          <span aria-hidden="true" className="text-leaf">*</span>
        ) : null}
      </label>
      <div className="relative">
        {children}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-[320ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] peer-focus:scale-x-100",
            error ? "scale-x-100 bg-flame" : "bg-leaf",
          )}
        />
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-[11px] text-flame">
          {error}
        </p>
      )}
    </div>
  );
}

function inputCls(error?: { message?: string }) {
  return cn(
    "peer w-full bg-transparent border-0 border-b border-bone/25 py-2.5 text-base outline-none transition-colors placeholder:text-bone/70 focus:border-bone/40",
    error?.message && "border-flame/60",
  );
}
