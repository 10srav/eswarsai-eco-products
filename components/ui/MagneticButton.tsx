"use client";

import Link from "next/link";
import { type AnchorHTMLAttributes, type ReactNode } from "react";
import { useMagneticButton } from "@/animations/hooks/useMagneticButton";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "earth";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  children: ReactNode;
  external?: boolean;
};

const styles: Record<Variant, string> = {
  primary:
    "bg-leaf text-forest-deep hover:bg-sage shadow-[0_8px_30px_rgba(82,183,136,0.25)]",
  ghost:
    "border border-bone/30 text-bone hover:bg-bone/10",
  earth:
    "bg-earth text-cream hover:bg-bark shadow-[0_8px_30px_rgba(107,79,42,0.25)]",
};

export function MagneticButton({
  href,
  variant = "primary",
  className,
  children,
  external,
  ...rest
}: Props) {
  const ref = useMagneticButton<HTMLAnchorElement>({ strength: 0.2 });
  const cls = cn(
    "relative inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-sm font-medium tracking-wide transition-colors duration-300 will-change-transform",
    styles[variant],
    className,
  );
  if (external) {
    return (
      <a ref={ref} href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link ref={ref} href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
