"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { subscribeBrandPulse, type BrandPulseKind } from "@/lib/brand-events";
import { GoldShimmer } from "./gold-shimmer";

export function AnimatedBrandLogo({
  inverted = false,
  compact = false,
  className,
}: {
  inverted?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const [pulse, setPulse] = useState<{ kind: BrandPulseKind; id: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frame = useRef<number | null>(null);

  const trigger = useCallback((kind: BrandPulseKind) => {
    // Remove the class for one frame so every click restarts the animation,
    // even when the customer taps rapidly.
    setPulse(null);
    if (timer.current) clearTimeout(timer.current);
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      setPulse({ kind, id: Date.now() + Math.random() });
      timer.current = setTimeout(() => setPulse(null), kind === "full" ? 700 : 640);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeBrandPulse(trigger);
    return () => {
      unsubscribe();
      if (timer.current) clearTimeout(timer.current);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [trigger]);

  return (
    <Link
      href="/"
      onClick={() => trigger("full")}
      data-brand-logo
      aria-label="JJ Ebube Enterprise — home"
      className={cn("group flex items-center gap-3 outline-none", className)}
    >
      <span
        className={cn(
          "brand-mark relative block size-11 shrink-0 md:size-12",
          pulse?.kind === "full" && "is-clicked",
          pulse?.kind === "soft" && "is-shimmering",
        )}
      >
        <span className="brand-mark__ring" aria-hidden="true" />
        <span className="absolute inset-0 z-10 overflow-hidden rounded-full bg-white ring-1 ring-gold/30">
          <Image
            src="/brand/logo-mark.png"
            alt="JJ Ebube Enterprise logo"
            fill
            sizes="48px"
            priority
            className="object-contain p-[1px] transition-transform duration-500 group-hover:-translate-y-0.5"
          />
        </span>
        <GoldShimmer key={pulse?.id ?? "idle"} active={pulse?.kind === "full"} className="z-20" />
      </span>

      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-[1.28rem] font-semibold tracking-[0.015em] md:text-[1.42rem]",
              inverted ? "text-ivory" : "text-navy",
            )}
          >
            JJ EBUBE
          </span>
          <span className="mt-1.5 flex items-center gap-1.5">
            <span className="h-px w-3 bg-gold" />
            <span
              className={cn(
                "text-[0.52rem] font-extrabold uppercase tracking-[0.3em]",
                inverted ? "text-gold-soft" : "text-gold-deep",
              )}
            >
              Enterprise
            </span>
          </span>
        </span>
      )}
    </Link>
  );
}
