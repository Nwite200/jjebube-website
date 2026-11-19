"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { subscribeBrandActivity } from "@/lib/brand-events";
import { GoldShimmer } from "./gold-shimmer";

type Visual = "idle" | "loading" | "completing" | "soft" | "full";

export function AnimatedBrandLogo({
  inverted = false,
  compact = false,
  className,
}: {
  inverted?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const [visual, setVisual] = useState<Visual>("idle");
  const visualRef = useRef<Visual>("idle");
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const timer of timers.current) window.clearTimeout(timer);
    timers.current = [];
  }, []);

  const transition = useCallback(
    (next: Visual, resetAfter?: number) => {
      if (visualRef.current === next && next === "loading") return;
      clearTimers();
      visualRef.current = next;
      setVisual(next);
      if (resetAfter) {
        timers.current.push(
          window.setTimeout(() => {
            if (visualRef.current !== next) return;
            visualRef.current = "idle";
            setVisual("idle");
          }, resetAfter),
        );
      }
    },
    [clearTimers],
  );

  useEffect(() => {
    const unsubscribe = subscribeBrandActivity((activity) => {
      if (activity === "start") {
        if (visualRef.current === "loading") return;
        transition("loading");
        // Safety net: never leave a ring spinning if a route never settles.
        timers.current.push(
          window.setTimeout(() => {
            if (visualRef.current === "loading") transition("idle");
          }, 10000),
        );
      } else if (activity === "complete") {
        if (visualRef.current !== "loading") return;
        transition("completing", 420);
      } else if (activity === "quick") {
        if (visualRef.current === "loading") return;
        transition("soft", 620);
      }
    });
    return () => {
      unsubscribe();
      clearTimers();
    };
  }, [transition, clearTimers]);

  function handleLogoClick() {
    if (visualRef.current !== "loading") transition("full", 700);
  }

  return (
    <Link
      href="/"
      onClick={handleLogoClick}
      data-brand-logo
      aria-label="JJ Ebube Enterprise — home"
      className={cn("group flex items-center gap-3 outline-none", className)}
    >
      <span
        className={cn(
          "brand-mark relative block size-11 shrink-0 rounded-full md:size-12",
          visual === "loading" && "is-loading",
          visual === "completing" && "is-completing",
          visual === "soft" && "is-shimmering",
          visual === "full" && "is-clicked",
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
        <GoldShimmer
          key={`${visual}-${visualRef.current}`}
          active={visual === "soft" || visual === "full" || visual === "completing"}
          className="z-20"
        />
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
