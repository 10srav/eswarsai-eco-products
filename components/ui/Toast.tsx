"use client";

import { CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastState = { message: string; tone: "success" | "error" } | null;

export function Toast({ state }: { state: ToastState }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-8 left-1/2 z-[110] flex -translate-x-1/2 items-center gap-3 rounded-md border px-5 py-3 text-sm shadow-lg backdrop-blur transition-all duration-500",
        state ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-20 opacity-0",
        state?.tone === "error"
          ? "border-flame bg-flame/10 text-flame"
          : "border-leaf bg-forest-deep/95 text-bone",
      )}
    >
      {state?.tone === "error" ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} className="text-leaf" />}
      <span>{state?.message}</span>
    </div>
  );
}

export type { ToastState };
