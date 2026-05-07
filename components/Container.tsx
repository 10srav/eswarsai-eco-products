import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Width = "default" | "wide" | "narrow";

const widths: Record<Width, string> = {
  default: "max-w-[1280px]",
  wide: "max-w-[1480px]",
  narrow: "max-w-[920px]",
};

export function Container({
  width = "default",
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { width?: Width }) {
  return <div className={cn("mx-auto w-full px-6 md:px-10", widths[width], className)} {...rest} />;
}
