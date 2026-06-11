"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/Container";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { company } from "@/lib/company";
import { cn } from "@/lib/utils";

let registered = false;
function ensureRegistered() {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);
  registered = true;
}

const useIsoLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const INK = "#0a1a12";
const EARTH = "#6b4f2a";
const STAGE = "#f5f0e3";

type BagTypeId = "d-cut" | "w-cut" | "u-cut" | "loop" | "box" | "jute";
type ColorId = "white" | "natural" | "leaf" | "royal" | "charcoal" | "red";
type SizeId = "S" | "M" | "L" | "XL";
type QtyId = "5K" | "10K" | "25K" | "50K" | "1L";

type BagType = { id: BagTypeId; label: string; spec: string; body: string };

const BAG_TYPES: BagType[] = [
  {
    id: "d-cut",
    label: "D-cut",
    spec: "D-CUT",
    body: "M94 86 L306 86 Q316 86 316 96 L322 384 Q322 402 304 402 L96 402 Q78 402 78 384 L84 96 Q84 86 94 86 Z",
  },
  {
    id: "w-cut",
    label: "W-cut",
    spec: "W-CUT",
    body: "M88 66 L134 66 C140 184 260 184 266 66 L312 66 Q321 68 321 84 L322 386 Q322 402 305 402 L95 402 Q78 402 78 386 L79 84 Q79 68 88 66 Z",
  },
  {
    id: "u-cut",
    label: "U-cut",
    spec: "U-CUT",
    body: "M94 78 L148 78 L148 124 Q148 152 200 152 Q252 152 252 124 L252 78 L306 78 Q315 78 315 88 L320 386 Q320 402 304 402 L96 402 Q80 402 80 386 L85 88 Q85 78 94 78 Z",
  },
  {
    id: "loop",
    label: "Loop handle",
    spec: "LOOP HANDLE",
    body: "M92 132 L308 132 Q318 132 318 142 L322 386 Q322 402 305 402 L95 402 Q78 402 78 386 L82 142 Q82 132 92 132 Z",
  },
  {
    id: "box",
    label: "Box bag",
    spec: "BOX BAG",
    body: "M94 150 L280 150 L326 128 Q334 125 334 134 L334 364 Q334 372 328 376 L286 399 Q280 402 274 402 L96 402 Q84 402 84 390 L84 160 Q84 150 94 150 Z",
  },
  {
    id: "jute",
    label: "Jute",
    spec: "JUTE",
    body: "M86 128 L314 128 Q324 128 323 138 L316 392 Q315 404 302 404 L98 404 Q85 404 84 392 L77 138 Q76 128 86 128 Z",
  },
];
const TYPE_BY_ID = Object.fromEntries(BAG_TYPES.map((t) => [t.id, t])) as Record<
  BagTypeId,
  BagType
>;

const COLORS: { id: ColorId; label: string; hex: string; ink: string }[] = [
  { id: "white", label: "White", hex: "#f5f0e3", ink: "#0e2a1e" },
  { id: "natural", label: "Natural", hex: "#e9e1cf", ink: "#0e2a1e" },
  { id: "leaf", label: "Leaf", hex: "#52b788", ink: "#0e2a1e" },
  { id: "royal", label: "Royal blue", hex: "#2456a6", ink: "#f5f0e3" },
  { id: "charcoal", label: "Charcoal", hex: "#2b2b2b", ink: "#f5f0e3" },
  { id: "red", label: "Red", hex: "#b3261e", ink: "#f5f0e3" },
];

const GSMS = [40, 60, 80, 100, 120] as const;

const SIZES: { id: SizeId; dims: string; scale: number }[] = [
  { id: "S", dims: "10x12", scale: 0.8 },
  { id: "M", dims: "12x16", scale: 0.9 },
  { id: "L", dims: "16x20", scale: 1 },
  { id: "XL", dims: "18x22", scale: 1.08 },
];

const QTYS: { id: QtyId; label: string; msg: string }[] = [
  { id: "5K", label: "5K+", msg: "5,000+" },
  { id: "10K", label: "10K+", msg: "10,000+" },
  { id: "25K", label: "25K+", msg: "25,000+" },
  { id: "50K", label: "50K+", msg: "50,000+" },
  { id: "1L", label: "1L+", msg: "1 lakh+" },
];

type Business = {
  id: string;
  label: string;
  preset: { type: BagTypeId; color: ColorId; gsm: (typeof GSMS)[number]; size: SizeId };
  line: string;
};

const BUSINESSES: Business[] = [
  {
    id: "pharmacy",
    label: "Pharmacy",
    preset: { type: "w-cut", color: "white", gsm: 40, size: "M" },
    line: "High volume, light loads, lowest cost per carry.",
  },
  {
    id: "grocery",
    label: "Grocery & kirana",
    preset: { type: "loop", color: "leaf", gsm: 80, size: "XL" },
    line: "Stitched loops take 10 kg of rice and atta, trip after trip.",
  },
  {
    id: "fashion",
    label: "Fashion retail",
    preset: { type: "d-cut", color: "charcoal", gsm: 100, size: "L" },
    line: "Stiff face, clean drape. The bag is the billboard.",
  },
  {
    id: "jewellery",
    label: "Jewellery",
    preset: { type: "jute", color: "red", gsm: 120, size: "S" },
    line: "Small, dense weave, gift-grade. Reads premium at the counter.",
  },
  {
    id: "sweets",
    label: "Sweets & bakery",
    preset: { type: "box", color: "natural", gsm: 100, size: "M" },
    line: "A flat base keeps a 1 kg box level. No tilt, no mess.",
  },
  {
    id: "corporate",
    label: "Corporate gifting",
    preset: { type: "jute", color: "natural", gsm: 120, size: "L" },
    line: "Built for years of reuse. Your logo stays in circulation.",
  },
];

function loopStrap(cx: number, y: number) {
  return [
    `M${cx - 30} ${y}`,
    `C${cx - 30} ${y - 88} ${cx + 30} ${y - 88} ${cx + 30} ${y}`,
    `L${cx + 16} ${y}`,
    `C${cx + 16} ${y - 70} ${cx - 16} ${y - 70} ${cx - 16} ${y}`,
    "Z",
  ].join(" ");
}

function StrapPair({ cxs, y, fill }: { cxs: [number, number]; y: number; fill: string }) {
  return (
    <>
      {cxs.map((cx) => (
        <path
          key={cx}
          d={loopStrap(cx, y)}
          fill={fill}
          stroke={INK}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      ))}
    </>
  );
}

function StitchBox({ cx, cy, ink }: { cx: number; cy: number; ink: string }) {
  return (
    <g stroke={ink} strokeWidth="1.1" opacity="0.55" fill="none">
      <rect x={cx - 10} y={cy - 7} width="20" height="14" rx="1" />
      <path
        d={`M${cx - 10} ${cy - 7} L${cx + 10} ${cy + 7} M${cx + 10} ${cy - 7} L${cx - 10} ${cy + 7}`}
      />
    </g>
  );
}

function BehindDetails({ type, fabric }: { type: BagTypeId; fabric: string }) {
  if (type === "loop") return <StrapPair cxs={[145, 255]} y={136} fill={fabric} />;
  if (type === "box") return <StrapPair cxs={[138, 226]} y={156} fill={fabric} />;
  if (type === "jute") return <StrapPair cxs={[142, 258]} y={134} fill={EARTH} />;
  return null;
}

function FrontDetails({ type, ink }: { type: BagTypeId; ink: string }) {
  switch (type) {
    case "d-cut":
      return (
        <g>
          <ellipse
            cx="200"
            cy="130"
            rx="60"
            ry="26"
            fill="none"
            stroke={ink}
            strokeWidth="1.2"
            strokeDasharray="4 5"
            opacity="0.5"
          />
          <ellipse
            cx="200"
            cy="130"
            rx="52"
            ry="18"
            fill={STAGE}
            stroke={INK}
            strokeWidth="1.5"
          />
        </g>
      );
    case "w-cut":
      return (
        <g stroke={ink} strokeWidth="1.2" strokeDasharray="4 5" opacity="0.5" fill="none">
          <path d="M90 76 L132 76 M268 76 L310 76" />
          <path d="M138 76 C144 176 256 176 262 76" />
        </g>
      );
    case "u-cut":
      return (
        <path
          d="M140 80 L140 124 Q140 160 200 160 Q260 160 260 124 L260 80"
          fill="none"
          stroke={ink}
          strokeWidth="1.2"
          strokeDasharray="4 5"
          opacity="0.5"
        />
      );
    case "loop":
      return (
        <g>
          {[122, 168, 232, 278].map((x) => (
            <StitchBox key={x} cx={x} cy={146} ink={ink} />
          ))}
        </g>
      );
    case "box":
      return (
        <g>
          <path d="M280 152 L280 400" stroke={ink} strokeWidth="1.2" opacity="0.4" fill="none" />
          <path
            d="M308 142 L308 384"
            stroke={ink}
            strokeWidth="1"
            strokeDasharray="4 5"
            opacity="0.35"
            fill="none"
          />
          {[115, 161, 203, 249].map((x) => (
            <StitchBox key={x} cx={x} cy={168} ink={ink} />
          ))}
        </g>
      );
    case "jute":
      return (
        <g>
          <rect x="60" y="30" width="290" height="390" fill="url(#bs-weave)" opacity="0.3" />
          <path d="M70 128 L330 128 L330 158 L70 158 Z" fill={INK} opacity="0.08" />
          <path
            d="M70 162 L330 162"
            stroke={ink}
            strokeWidth="1.2"
            strokeDasharray="4 5"
            opacity="0.5"
            fill="none"
          />
          {[119, 165, 235, 281].map((x) => (
            <StitchBox key={x} cx={x} cy={146} ink={ink} />
          ))}
        </g>
      );
  }
}

function FieldLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="mono flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-moss">
      <span className="opacity-60">{index}</span>
      <span>{children}</span>
    </div>
  );
}

const chipBase =
  "inline-flex min-h-[44px] items-center justify-center rounded-full border px-4 text-sm transition-colors duration-200";
const chipOff = "border-ink/20 text-ink hover:border-ink/50";
const chipOn = "border-forest-deep bg-forest-deep text-bone";

export function BagStudio() {
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<SVGPathElement>(null);
  const bagGroupRef = useRef<SVGGElement>(null);
  const behindRef = useRef<SVGGElement>(null);
  const frontRef = useRef<SVGGElement>(null);
  const specRef = useRef<HTMLParagraphElement>(null);
  const reasonRef = useRef<HTMLParagraphElement>(null);

  const [bagType, setBagType] = useState<BagTypeId>("loop");
  const [colorId, setColorId] = useState<ColorId>("leaf");
  const [gsm, setGsm] = useState<(typeof GSMS)[number]>(100);
  const [sizeId, setSizeId] = useState<SizeId>("L");
  const [qtyId, setQtyId] = useState<QtyId>("5K");
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);

  const type = TYPE_BY_ID[bagType];
  const color = COLORS.find((c) => c.id === colorId) ?? COLORS[2];
  const size = SIZES.find((s) => s.id === sizeId) ?? SIZES[2];
  const qty = QTYS.find((q) => q.id === qtyId) ?? QTYS[0];
  const business = BUSINESSES.find((b) => b.id === businessId) ?? null;

  const strokeW = 1.4 + (gsm - 40) * 0.02;
  const fillOpacity = 0.86 + (gsm - 40) * 0.0016;
  const texOpacity = 0.18 + gsm * 0.0009;

  const specLine = `${type.spec} / ${gsm} GSM / ${size.dims} IN / ${color.label.toUpperCase()} / QTY ${qty.label}`;
  const waMessage = `Hi ${company.name}, I would like a quote for this spec from the bag studio:\n${type.label}, ${gsm} GSM, ${size.dims} in (${size.id}), ${color.label}, quantity ${qty.msg}.\nPlease share unit pricing, print options and lead time.`;
  const waHref = `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    ensureRegistered();
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bs-reveal",
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: section, start: "top 72%", once: true },
        },
      );
      gsap.fromTo(
        ".bs-stage",
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: section, start: "top 72%", once: true },
        },
      );
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  // Morph the silhouette between cut types; crossfade the per-type detail layers.
  const prevTypeRef = useRef<BagTypeId>(bagType);
  const lastDRef = useRef<string | null>(null);
  useIsoLayoutEffect(() => {
    const prev = prevTypeRef.current;
    prevTypeRef.current = bagType;
    if (prev === bagType) return;
    if (reduced) {
      lastDRef.current = null;
      return;
    }
    ensureRegistered();
    const body = bodyRef.current;
    const tweens: gsap.core.Tween[] = [];
    if (body) {
      tweens.push(
        gsap.fromTo(
          body,
          { morphSVG: lastDRef.current ?? TYPE_BY_ID[prev].body },
          {
            morphSVG: TYPE_BY_ID[bagType].body,
            duration: 0.7,
            ease: "power3.inOut",
            overwrite: "auto",
            onUpdate: () => {
              lastDRef.current = body.getAttribute("d");
            },
            onComplete: () => {
              lastDRef.current = null;
            },
          },
        ),
      );
    }
    const details = [behindRef.current, frontRef.current].filter(
      (el): el is SVGGElement => el !== null,
    );
    if (details.length) {
      tweens.push(
        gsap.fromTo(
          details,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, delay: 0.22, ease: "power3.out", overwrite: "auto" },
        ),
      );
    }
    return () => tweens.forEach((t) => t.kill());
  }, [bagType, reduced]);

  useEffect(() => {
    const g = bagGroupRef.current;
    if (!g) return;
    if (reduced) {
      gsap.set(g, { scale: size.scale, transformOrigin: "50% 92%" });
      return;
    }
    const tw = gsap.to(g, {
      scale: size.scale,
      duration: 0.7,
      ease: "expo.out",
      transformOrigin: "50% 92%",
      overwrite: "auto",
    });
    return () => {
      tw.kill();
    };
  }, [size.scale, reduced]);

  const skipDipRef = useRef(true);
  useEffect(() => {
    if (skipDipRef.current) {
      skipDipRef.current = false;
      return;
    }
    if (reduced) return;
    const body = bodyRef.current;
    if (!body) return;
    const tw = gsap.fromTo(
      body,
      { opacity: 0.6 },
      { opacity: 1, duration: 0.5, ease: "power3.out", overwrite: "auto" },
    );
    return () => {
      tw.kill();
    };
  }, [colorId, gsm, reduced]);

  const skipSpecRef = useRef(true);
  useEffect(() => {
    if (skipSpecRef.current) {
      skipSpecRef.current = false;
      return;
    }
    if (reduced) return;
    const el = specRef.current;
    if (!el) return;
    const tw = gsap.fromTo(
      el,
      { opacity: 0.3, y: 5 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", overwrite: "auto" },
    );
    return () => {
      tw.kill();
    };
  }, [specLine, reduced]);

  useEffect(() => {
    if (!businessId || reduced) return;
    const el = reasonRef.current;
    if (!el) return;
    const tw = gsap.fromTo(
      el,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", overwrite: "auto" },
    );
    return () => {
      tw.kill();
    };
  }, [businessId, reduced]);

  const selectType = (id: BagTypeId) => {
    setBusinessId(null);
    setBagType(id);
  };
  const selectColor = (id: ColorId) => {
    setBusinessId(null);
    setColorId(id);
  };
  const selectGsm = (g: (typeof GSMS)[number]) => {
    setBusinessId(null);
    setGsm(g);
  };
  const selectSize = (id: SizeId) => {
    setBusinessId(null);
    setSizeId(id);
  };
  const applyBusiness = (b: Business) => {
    setBusinessId(b.id);
    setBagType(b.preset.type);
    setColorId(b.preset.color);
    setGsm(b.preset.gsm);
    setSizeId(b.preset.size);
  };

  const reasonText = business
    ? `${business.label.toUpperCase()}: ${TYPE_BY_ID[business.preset.type].spec} / ${business.preset.gsm} GSM / ${business.preset.size} / ${(COLORS.find((c) => c.id === business.preset.color)?.label ?? "").toUpperCase()}. ${business.line}`
    : "Recommended starting points. Tune anything after.";

  return (
    <section
      ref={sectionRef}
      aria-labelledby="bag-studio-title"
      className="relative overflow-hidden bg-bone py-24 md:py-32"
    >
      <Container>
        <div className="eyebrow flex items-center gap-3 text-moss">
          <span className="h-px w-6 bg-current" />
          Bag studio
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <h2
            id="bag-studio-title"
            className="serif max-w-3xl text-[clamp(36px,5.5vw,76px)] font-light leading-[0.98] tracking-[-0.03em]"
          >
            Build your bag. <em className="italic text-moss">Watch it take shape.</em>
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink/70">
            Six cuts, five gauges, four sizes, any colour we can dye. Set each one
            yourself, or start from your trade and tune.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Preview */}
          <div className="bs-stage lg:sticky lg:top-24 lg:self-start">
            <div className="paper-fiber soft-shadow relative overflow-hidden rounded-md border border-ink/10 bg-cream p-6 md:p-10">
              <div className="mono flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-ink/50">
                <span>Preview · Front</span>
                <span>{gsm} GSM</span>
              </div>

              <svg
                viewBox="0 0 400 440"
                role="img"
                aria-label={`Bag preview: ${type.label}, ${color.label}, ${gsm} GSM, ${size.dims} inches`}
                className="mx-auto mt-2 h-auto w-full max-w-[460px]"
              >
                <defs>
                  <filter id="bs-noise" x="-10%" y="-10%" width="120%" height="120%">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.85"
                      numOctaves="2"
                      stitchTiles="stitch"
                      result="n"
                    />
                    <feColorMatrix
                      in="n"
                      type="matrix"
                      values="0 0 0 0 0.04  0 0 0 0 0.10  0 0 0 0 0.07  0 0 0 0.7 0"
                    />
                  </filter>
                  <pattern id="bs-weave" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M0 2.5 H10 M0 7.5 H10" stroke={INK} strokeWidth="1.1" opacity="0.5" />
                    <path d="M2.5 0 V10 M7.5 0 V10" stroke={INK} strokeWidth="1.1" opacity="0.35" />
                  </pattern>
                  <clipPath id="bs-clip">
                    <use href="#bs-body" />
                  </clipPath>
                </defs>

                <g ref={bagGroupRef}>
                  <ellipse cx="200" cy="416" rx="118" ry="9" fill={INK} opacity="0.08" />

                  <g key={`${bagType}-behind`} ref={behindRef}>
                    <BehindDetails type={bagType} fabric={color.hex} />
                  </g>

                  <path
                    id="bs-body"
                    ref={bodyRef}
                    d={type.body}
                    fill={color.hex}
                    fillOpacity={fillOpacity}
                    stroke={INK}
                    strokeWidth={strokeW}
                    strokeLinejoin="round"
                  />

                  <g clipPath="url(#bs-clip)">
                    <rect
                      x="60"
                      y="30"
                      width="290"
                      height="390"
                      filter="url(#bs-noise)"
                      opacity={texOpacity}
                    />
                    <g key={`${bagType}-front`} ref={frontRef}>
                      <FrontDetails type={bagType} ink={color.ink} />
                    </g>
                  </g>

                  <g
                    opacity="0.9"
                    transform={bagType === "box" ? "translate(-16 0)" : undefined}
                  >
                    <rect
                      x="142"
                      y="226"
                      width="116"
                      height="62"
                      rx="2"
                      fill="none"
                      stroke={color.ink}
                      strokeWidth="1.4"
                    />
                    <text
                      x="200"
                      y="252"
                      textAnchor="middle"
                      fill={color.ink}
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "0.25em",
                      }}
                    >
                      YOUR
                    </text>
                    <text
                      x="200"
                      y="272"
                      textAnchor="middle"
                      fill={color.ink}
                      style={{
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "0.25em",
                      }}
                    >
                      LOGO
                    </text>
                  </g>
                </g>
              </svg>

              <div className="mono mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-ink/50">
                <span>{type.spec}</span>
                <span>
                  {size.dims} in · {color.label}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-9">
            <div className="bs-reveal" role="group" aria-label="Bag type">
              <FieldLabel index="01">Bag type</FieldLabel>
              <div className="mt-3 flex flex-wrap gap-2">
                {BAG_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => selectType(t.id)}
                    aria-pressed={t.id === bagType}
                    className={cn(chipBase, t.id === bagType ? chipOn : chipOff)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bs-reveal" role="group" aria-label="Colour">
              <FieldLabel index="02">Colour</FieldLabel>
              <div className="mt-3 flex flex-wrap gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectColor(c.id)}
                    aria-pressed={c.id === colorId}
                    aria-label={`Colour: ${c.label}`}
                    title={c.label}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 transition-shadow duration-200",
                      c.id === colorId &&
                        "ring-2 ring-forest-deep ring-offset-2 ring-offset-bone",
                    )}
                    style={{ backgroundColor: c.hex }}
                  >
                    {c.id === colorId && (
                      <Check size={18} strokeWidth={3} color={c.ink} aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bs-reveal" role="group" aria-label="Fabric weight in GSM">
              <FieldLabel index="03">Fabric weight</FieldLabel>
              <div className="mt-3 flex flex-wrap gap-2">
                {GSMS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => selectGsm(g)}
                    aria-pressed={g === gsm}
                    aria-label={`${g} GSM`}
                    className={cn(chipBase, "mono", g === gsm ? chipOn : chipOff)}
                  >
                    {g}
                  </button>
                ))}
                <span className="mono ml-1 inline-flex min-h-[44px] items-center text-[11px] uppercase tracking-[0.18em] text-ink/50">
                  GSM
                </span>
              </div>
            </div>

            <div className="bs-reveal" role="group" aria-label="Size">
              <FieldLabel index="04">Size</FieldLabel>
              <div className="mt-3 flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectSize(s.id)}
                    aria-pressed={s.id === sizeId}
                    aria-label={`Size ${s.id}, ${s.dims} inches`}
                    className={cn(
                      "flex min-h-[52px] flex-col items-center justify-center rounded-md border px-4 py-2 transition-colors duration-200",
                      s.id === sizeId ? chipOn : chipOff,
                    )}
                  >
                    <span className="text-sm font-medium">{s.id}</span>
                    <span className="mono text-[10px] tracking-[0.12em] opacity-70">
                      {s.dims}&quot;
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bs-reveal" role="group" aria-label="Start from your trade">
              <FieldLabel index="05">Or start from your trade</FieldLabel>
              <div className="mt-3 flex flex-wrap gap-2">
                {BUSINESSES.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => applyBusiness(b)}
                    aria-pressed={b.id === businessId}
                    className={cn(
                      chipBase,
                      b.id === businessId
                        ? "border-moss bg-moss text-bone"
                        : chipOff,
                    )}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              <p
                ref={reasonRef}
                aria-live="polite"
                className={cn(
                  "mono mt-3 min-h-[40px] max-w-xl text-xs leading-relaxed",
                  business ? "text-moss" : "text-ink/50",
                )}
              >
                {reasonText}
              </p>
            </div>

            <div className="bs-reveal soft-shadow rounded-md bg-forest-deep p-6 text-bone md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="eyebrow flex items-center gap-2 text-sage">
                  <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-leaf" />
                  Live spec
                </span>
                <span className="mono text-[10px] uppercase tracking-[0.2em] opacity-50">
                  Ex-works Kakinada
                </span>
              </div>

              <p
                ref={specRef}
                aria-live="polite"
                className="mono mt-4 text-sm leading-relaxed text-sage md:text-[15px]"
              >
                {specLine}
              </p>

              <div
                className="mt-6 border-t border-bone/15 pt-5"
                role="group"
                aria-label="Order quantity"
              >
                <div className="mono text-[11px] uppercase tracking-[0.2em] opacity-60">
                  Quantity
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {QTYS.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setQtyId(q.id)}
                      aria-pressed={q.id === qtyId}
                      aria-label={`Quantity ${q.msg}`}
                      className={cn(
                        chipBase,
                        "mono",
                        q.id === qtyId
                          ? "border-leaf bg-leaf text-forest-deep"
                          : "border-bone/30 text-bone hover:border-bone/70",
                      )}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <MagneticButton href={waHref} variant="primary" external>
                  Get a quote for this spec
                  <ArrowRight size={16} />
                </MagneticButton>
                <Link
                  href="/contact"
                  className="group inline-flex min-h-[44px] items-center gap-2 px-1 text-sm font-medium tracking-wide text-bone"
                >
                  <span className="relative">
                    Prefer a call? Contact us
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-bone transition-transform duration-500 ease-[cubic-bezier(.7,0,.3,1)] group-hover:scale-x-100"
                    />
                  </span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-500 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
