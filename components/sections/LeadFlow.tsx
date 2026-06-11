"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Container } from "@/components/Container";
import { Toast, type ToastState } from "@/components/ui/Toast";
import { company } from "@/lib/company";
import { cn } from "@/lib/utils";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

const BUSINESS_TYPES = [
  "Retail and kirana",
  "Pharmacy and healthcare",
  "Fashion and lifestyle",
  "Food and sweets",
  "Corporate and events",
  "Something else",
];

const BAG_TYPES = [
  "D-cut or W-cut basics",
  "Loop-handle totes",
  "Box or gusset bags",
  "Jute premium",
  "Not sure yet",
];

const VOLUMES = ["Under 5k", "5k-25k", "25k-1L", "1L+", "Just exploring"];

const TOTAL_STEPS = 5;
// Mirrors enquireSchema.phone exactly.
const PHONE_RE = /^[+0-9\s\-()]{7,}$/;
const EMAIL_RE = /^\S+@\S+\.\S+$/;

type ContactErrors = { name?: string; phone?: string; email?: string };

function composeMessage(args: {
  businessType: string | null;
  bags: string[];
  volume: string | null;
  city: string;
  email: string;
}): string {
  const parts: string[] = [];
  if (args.businessType) parts.push(`${args.businessType}.`);
  parts.push(args.bags.length ? `${args.bags.join(", ")}.` : "Bag type open to advice.");
  if (args.volume) parts.push(`${args.volume} monthly.`);
  if (args.city.trim()) parts.push(`Based in ${args.city.trim()}.`);
  if (args.email.trim()) parts.push(`Email: ${args.email.trim()}.`);
  parts.push("Looking for pricing and samples.");
  return parts.join(" ");
}

function chipCls(selected: boolean) {
  return cn(
    "inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-200",
    selected
      ? "border-forest-deep bg-forest-deep text-bone"
      : "border-forest-deep/30 text-forest-deep hover:border-leaf hover:bg-leaf hover:text-forest-deep",
  );
}

function inputCls(error?: string) {
  return cn(
    "w-full border-0 border-b bg-transparent py-2.5 text-base outline-none transition-colors placeholder:text-ink/45",
    error ? "border-rust" : "border-forest-deep/30 focus:border-forest-deep",
  );
}

const PILL_PRIMARY =
  "inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2.5 rounded-full bg-forest-deep px-7 text-sm font-medium tracking-wide text-bone transition-colors hover:bg-forest disabled:opacity-60";

export function LeadFlow() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const outTweenRef = useRef<gsap.core.Tween | null>(null);
  const dirRef = useRef(1);
  const firstRenderRef = useRef(true);

  const [reduced, setReduced] = useState(false);
  const [phase, setPhase] = useState<"flow" | "success">("flow");
  const [step, setStep] = useState(0);

  const [businessType, setBusinessType] = useState<string | null>(null);
  const [bags, setBags] = useState<string[]>([]);
  const [volume, setVolume] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [messageEdited, setMessageEdited] = useState(false);

  const [stepError, setStepError] = useState<string | null>(null);
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const cityId = useId();
  const messageId = useId();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    return () => {
      outTweenRef.current?.kill();
    };
  }, []);

  // Section entrance on scroll.
  useEffect(() => {
    if (reduced) return;
    ensureRegistered();
    const root = sectionRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [".lf-head", ".lf-card"],
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        },
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  // Per-step slide-in + focus the question for keyboard and SR users.
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    if (reduced) return;
    const panel = panelRef.current;
    if (!panel) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel,
        { opacity: 0, x: 30 * dirRef.current },
        { opacity: 1, x: 0, duration: 0.55, ease: "expo.out", clearProps: "transform" },
      );
    }, panel);
    return () => ctx.revert();
  }, [step, phase, reduced]);

  const goTo = (next: number) => {
    if (next === 4 && !messageEdited) {
      setMessage(composeMessage({ businessType, bags, volume, city, email }));
    }
    dirRef.current = next > step ? 1 : -1;
    setStepError(null);
    const panel = panelRef.current;
    if (reduced || !panel) {
      setStep(next);
      return;
    }
    outTweenRef.current?.kill();
    outTweenRef.current = gsap.to(panel, {
      opacity: 0,
      x: -30 * dirRef.current,
      duration: 0.26,
      ease: "power3.inOut",
      overwrite: "auto",
      onComplete: () => setStep(next),
    });
  };

  const toggleBag = (b: string) => {
    setStepError(null);
    setBags((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));
  };

  const onContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs: ContactErrors = {};
    if (name.trim().length < 2) errs.name = "Tell us your name.";
    if (!PHONE_RE.test(phone.trim())) errs.phone = "Enter a valid phone number.";
    if (email.trim() && !EMAIL_RE.test(email.trim())) errs.email = "That email looks off.";
    setContactErrors(errs);
    if (Object.keys(errs).length > 0) return;
    goTo(4);
  };

  const waText = () => {
    const lines = [
      `Hello ${company.name}, I'd like a quote.`,
      "",
      name.trim() ? `Name: ${name.trim()}` : null,
      phone.trim() ? `Phone: ${phone.trim()}` : null,
      message.trim() || composeMessage({ businessType, bags, volume, city, email }),
    ].filter((l): l is string => l !== null);
    return lines.join("\n");
  };
  const waHref = `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(waText())}`;

  const onReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        business: businessType,
        requirement: (bags.length ? bags.join(", ") : "Not sure yet").slice(0, 160),
        quantity: volume,
        notes: message.trim().slice(0, 800) || null,
      };
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg =
          res.status === 422
            ? "Please check your details and try again."
            : res.status === 429
              ? "Too many requests. Please try again in a minute."
              : "Something went wrong. WhatsApp works below.";
        setSubmitError(msg);
        setToast({ tone: "error", message: msg });
        window.setTimeout(() => setToast(null), 4000);
        return;
      }
      setPhase("success");
    } catch {
      const msg = "Network error. WhatsApp works below.";
      setSubmitError(msg);
      setToast({ tone: "error", message: msg });
      window.setTimeout(() => setToast(null), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const resetAll = () => {
    setPhase("flow");
    setStep(0);
    setBusinessType(null);
    setBags([]);
    setVolume(null);
    setName("");
    setPhone("");
    setEmail("");
    setCity("");
    setMessage("");
    setMessageEdited(false);
    setStepError(null);
    setContactErrors({});
    setSubmitError(null);
    dirRef.current = 1;
  };

  const question = (text: React.ReactNode) => (
    <h2
      ref={headingRef}
      tabIndex={-1}
      className="serif font-light leading-[1.05] tracking-[-0.03em] outline-none"
      style={{ fontSize: "clamp(26px, 3.4vw, 44px)" }}
    >
      <span className="sr-only">{`Step ${step + 1} of ${TOTAL_STEPS}. `}</span>
      {text}
    </h2>
  );

  const micro = (text: string) => (
    <p className="mono mt-3 text-[11px] uppercase tracking-[0.2em] text-ink/70">{text}</p>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            {question(
              <>
                What kind of <em className="italic text-moss">business</em> are you?
              </>,
            )}
            {micro("Pick one")}
            <div className="mt-8 flex flex-wrap gap-3">
              {BUSINESS_TYPES.map((b) => (
                <button
                  key={b}
                  type="button"
                  aria-pressed={businessType === b}
                  className={chipCls(businessType === b)}
                  onClick={() => {
                    setBusinessType(b);
                    goTo(1);
                  }}
                >
                  {businessType === b && <Check size={14} aria-hidden="true" />}
                  {b}
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            {question(
              <>
                What are you <em className="italic text-moss">carrying</em>?
              </>,
            )}
            {micro("Pick as many as apply")}
            <div className="mt-8 flex flex-wrap gap-3">
              {BAG_TYPES.map((b) => {
                const selected = bags.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    aria-pressed={selected}
                    className={chipCls(selected)}
                    onClick={() => toggleBag(b)}
                  >
                    {selected && <Check size={14} aria-hidden="true" />}
                    {b}
                  </button>
                );
              })}
            </div>
            {stepError && (
              <p role="alert" className="mt-4 text-sm font-medium text-rust">
                {stepError}
              </p>
            )}
            <button
              type="button"
              className={cn(PILL_PRIMARY, "mt-10")}
              onClick={() => {
                if (bags.length === 0) {
                  setStepError("Pick at least one, or choose Not sure yet.");
                  return;
                }
                goTo(2);
              }}
            >
              Continue
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            {question(
              <>
                <em className="italic text-moss">Monthly</em> volume?
              </>,
            )}
            {micro("Rough numbers are fine")}
            <div className="mt-8 flex flex-wrap gap-3">
              {VOLUMES.map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={volume === v}
                  className={cn(chipCls(volume === v), "mono text-[13px]")}
                  onClick={() => {
                    setVolume(v);
                    goTo(3);
                  }}
                >
                  {volume === v && <Check size={14} aria-hidden="true" />}
                  {v}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <form noValidate onSubmit={onContactSubmit}>
            {question(
              <>
                Where do we <em className="italic text-moss">reach</em> you?
              </>,
            )}
            {micro("We call or WhatsApp. No spam.")}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor={nameId} className="eyebrow mb-2.5 text-ink/70">
                  Your name <span aria-hidden="true" className="text-moss">*</span>
                </label>
                <input
                  id={nameId}
                  type="text"
                  autoComplete="name"
                  maxLength={120}
                  placeholder="Full name"
                  required
                  aria-required="true"
                  aria-invalid={contactErrors.name ? "true" : undefined}
                  aria-describedby={contactErrors.name ? `${nameId}-err` : undefined}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setContactErrors((p) => ({ ...p, name: undefined }));
                  }}
                  className={inputCls(contactErrors.name)}
                />
                {contactErrors.name && (
                  <p id={`${nameId}-err`} role="alert" className="mt-1.5 text-sm font-medium text-rust">
                    {contactErrors.name}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor={phoneId} className="eyebrow mb-2.5 text-ink/70">
                  Phone <span aria-hidden="true" className="text-moss">*</span>
                </label>
                <input
                  id={phoneId}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={20}
                  placeholder="98765 43210"
                  required
                  aria-required="true"
                  aria-invalid={contactErrors.phone ? "true" : undefined}
                  aria-describedby={
                    contactErrors.phone ? `${phoneId}-hint ${phoneId}-err` : `${phoneId}-hint`
                  }
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setContactErrors((p) => ({ ...p, phone: undefined }));
                  }}
                  className={inputCls(contactErrors.phone)}
                />
                <p id={`${phoneId}-hint`} className="mono mt-1.5 text-[11px] tracking-[0.08em] text-ink/70">
                  10 digits, +91 optional
                </p>
                {contactErrors.phone && (
                  <p id={`${phoneId}-err`} role="alert" className="mt-1 text-sm font-medium text-rust">
                    {contactErrors.phone}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor={emailId} className="eyebrow mb-2.5 text-ink/70">
                  Email <span className="normal-case tracking-normal opacity-60">(optional)</span>
                </label>
                <input
                  id={emailId}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={160}
                  placeholder="you@company.in"
                  aria-invalid={contactErrors.email ? "true" : undefined}
                  aria-describedby={contactErrors.email ? `${emailId}-err` : undefined}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setContactErrors((p) => ({ ...p, email: undefined }));
                  }}
                  className={inputCls(contactErrors.email)}
                />
                {contactErrors.email && (
                  <p id={`${emailId}-err`} role="alert" className="mt-1.5 text-sm font-medium text-rust">
                    {contactErrors.email}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor={cityId} className="eyebrow mb-2.5 text-ink/70">
                  City <span className="normal-case tracking-normal opacity-60">(optional)</span>
                </label>
                <input
                  id={cityId}
                  type="text"
                  autoComplete="address-level2"
                  maxLength={80}
                  placeholder="Kakinada, Vizag, Hyderabad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputCls()}
                />
              </div>
            </div>
            <button type="submit" className={cn(PILL_PRIMARY, "mt-10")}>
              Continue
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </form>
        );
      case 4:
        return (
          <form noValidate onSubmit={onReviewSubmit}>
            {question(
              <>
                Read it <em className="italic text-moss">back</em>.
              </>,
            )}
            {micro("Edit anything before it goes")}
            <div className="mt-8 flex flex-col">
              <div className="mb-2.5 flex items-baseline justify-between gap-4">
                <label htmlFor={messageId} className="eyebrow text-ink/70">
                  Your message
                </label>
                <span aria-hidden="true" className="mono text-[11px] text-ink/70">
                  {message.length} / 800
                </span>
              </div>
              <textarea
                id={messageId}
                rows={5}
                maxLength={800}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setMessageEdited(true);
                }}
                className="w-full resize-y rounded-md border border-forest-deep/30 bg-bone p-4 text-base leading-relaxed outline-none transition-colors focus:border-forest-deep"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              className={cn(PILL_PRIMARY, "mt-8 px-8")}
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <ArrowRight size={16} aria-hidden="true" />
              )}
              {submitting ? "Sending…" : "Send enquiry"}
            </button>
            <p className="mono mt-4 text-[11px] uppercase tracking-[0.2em] text-ink/70">
              We reply within one working day · No spam
            </p>
            {submitError && (
              <div role="alert" className="mt-5 rounded-md border border-rust/40 p-4 text-sm text-rust">
                <p className="font-medium">{submitError}</p>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex min-h-[44px] items-center gap-2 font-medium underline underline-offset-4"
                >
                  <MessageCircle size={14} aria-hidden="true" />
                  Continue on WhatsApp instead
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </div>
            )}
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="lead-flow"
      aria-label="Start an enquiry"
      className="relative overflow-hidden bg-bone py-24 md:py-32"
    >
      <Container width="narrow">
        <div className="lf-head">
          <div className="eyebrow flex items-center gap-3 text-moss">
            <span className="h-px w-6 bg-current" />
            Start an enquiry
          </div>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink/75">
            Five quick taps, then your details. A quote lands within one working day.
          </p>
        </div>

        <div className="lf-card paper-fiber soft-shadow mt-10 rounded-md border border-forest-deep/10 bg-cream p-6 sm:p-8 md:p-12">
          {phase === "flow" ? (
            <>
              <div className="flex min-h-[44px] items-center justify-between gap-4">
                <div className="flex items-center gap-4" aria-hidden="true">
                  <span className="mono text-[12px] tracking-[0.18em] text-moss">
                    {String(step + 1).padStart(2, "0")} / {String(TOTAL_STEPS).padStart(2, "0")}
                  </span>
                  <span className="flex gap-2">
                    {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                          i <= step ? "bg-moss" : "bg-forest-deep/20",
                        )}
                      />
                    ))}
                  </span>
                </div>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => goTo(step - 1)}
                    className="mono -mx-2 inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 px-2 text-[11px] uppercase tracking-[0.2em] text-ink/70 transition-colors hover:text-ink"
                  >
                    <ArrowLeft size={13} aria-hidden="true" />
                    Back
                  </button>
                )}
              </div>
              <div ref={panelRef} className="mt-8 min-h-[420px] sm:min-h-[360px]">
                {renderStep()}
              </div>
            </>
          ) : (
            <div ref={panelRef} role="status" className="min-h-[420px] sm:min-h-[360px]">
              <CheckCircle2 size={28} className="text-moss" aria-hidden="true" />
              <h2
                ref={headingRef}
                tabIndex={-1}
                className="serif mt-6 font-light leading-[1.05] tracking-[-0.03em] outline-none"
                style={{ fontSize: "clamp(26px, 3.4vw, 44px)" }}
              >
                Received. <em className="italic text-moss">We&apos;re on it.</em>
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink/75">
                Your enquiry is with our despatch desk in Kakinada. We reply within one
                working day, {company.hours}.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href={waHref} target="_blank" rel="noopener noreferrer" className={PILL_PRIMARY}>
                  <MessageCircle size={15} aria-hidden="true" />
                  Faster on WhatsApp
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
                <a
                  href={`tel:${company.phoneE164}`}
                  className="inline-flex min-h-[48px] cursor-pointer items-center gap-2.5 rounded-full border border-forest-deep/30 px-7 text-sm font-medium tracking-wide text-forest-deep transition-colors hover:border-leaf hover:bg-leaf"
                >
                  <Phone size={14} aria-hidden="true" />
                  {company.phone}
                </a>
              </div>
              <button
                type="button"
                onClick={resetAll}
                className="mono mt-10 inline-flex min-h-[44px] cursor-pointer items-center text-[11px] uppercase tracking-[0.2em] text-ink/70 underline underline-offset-4 transition-colors hover:text-ink"
              >
                Start another enquiry
              </button>
            </div>
          )}
        </div>
      </Container>

      <Toast state={toast} />
    </section>
  );
}

export function LeadFlowTeaser() {
  return (
    <section aria-label="Quick enquiry" className="bg-forest-deep text-bone">
      <Container className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5 py-8 md:py-10">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <span className="mono text-[11px] uppercase tracking-[0.24em] text-sage">
            Enquiry · 60 seconds
          </span>
          <p
            className="serif font-light tracking-[-0.02em]"
            style={{ fontSize: "clamp(20px, 2.4vw, 30px)" }}
          >
            Tell us what you carry. <em className="italic text-sage">Five taps.</em>
          </p>
        </div>
        <Link
          href="/contact#lead-flow"
          className="group inline-flex min-h-[48px] cursor-pointer items-center gap-2.5 rounded-full border border-bone/30 px-6 text-sm font-medium tracking-wide transition-colors hover:bg-bone/10"
        >
          Start the enquiry
          <ArrowRight
            size={14}
            aria-hidden="true"
            className="transition-transform duration-500 group-hover:translate-x-1"
          />
        </Link>
      </Container>
    </section>
  );
}
