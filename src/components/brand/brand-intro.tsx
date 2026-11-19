"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GoldShimmer } from "./gold-shimmer";
import { INTRO_SESSION_KEY, prefersReducedMotion } from "@/lib/brand-events";

/**
 * A short, cinematic first-visit brand moment. It renders over the storefront,
 * never delays content rendering, and is skipped entirely for reduced motion.
 */
export function BrandIntro() {
  const [visible, setVisible] = useState(true);
  const [skipping, setSkipping] = useState(false);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    document.documentElement.removeAttribute("data-brand-intro");
    setVisible(false);
  }, []);

  useEffect(() => {
    const active = document.documentElement.getAttribute("data-brand-intro") === "active";
    if (!active || prefersReducedMotion()) {
      document.documentElement.removeAttribute("data-brand-intro");
      setVisible(false);
      return;
    }

    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      /* private mode — the intro can simply play again next time */
    }

    const skip = () => setSkipping(true);
    window.addEventListener("pointerdown", skip, { once: true, capture: true });
    window.addEventListener("keydown", skip, { once: true });
    const fallback = window.setTimeout(finish, 3200);

    return () => {
      window.removeEventListener("pointerdown", skip, true);
      window.removeEventListener("keydown", skip);
      window.clearTimeout(fallback);
    };
  }, [finish]);

  if (!visible) return null;

  return (
    <div
      className={`brand-intro fixed inset-0 z-[200] flex items-center justify-center overflow-hidden ${skipping ? "is-skipping" : ""}`}
      aria-hidden="true"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) finish();
      }}
    >
      <div className="brand-intro__bg noise absolute inset-0 bg-navy" />
      <div className="brand-intro__glow" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(217,172,66,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(217,172,66,0.35) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(circle at center, black 0%, transparent 68%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 0%, transparent 68%)",
        }}
      />

      <div className="brand-intro__stage relative flex flex-col items-center px-6">
        <div className="brand-intro__halo" aria-hidden="true" />

        <div className="brand-intro__crest relative">
          <span className="brand-intro__crown-glow" aria-hidden="true" />
          <svg
            viewBox="0 0 260 260"
            className="absolute inset-[-28px] size-[calc(100%+56px)]"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="130"
              cy="130"
              r="121"
              stroke="#D9AC42"
              strokeOpacity="0.16"
              strokeWidth="0.7"
            />
            <circle
              className="brand-intro__ring-draw"
              cx="130"
              cy="130"
              r="112"
              stroke="#D9AC42"
              strokeWidth="0.9"
              strokeLinecap="round"
            />
            <circle
              className="brand-intro__ring-draw brand-intro__ring-draw--soft"
              cx="130"
              cy="130"
              r="103"
              stroke="#F1D58B"
              strokeWidth="0.5"
              strokeDasharray="2 8"
            />
          </svg>

          <div className="brand-intro__logo relative size-[250px] overflow-hidden rounded-full border border-gold/40 bg-ivory p-1 shadow-[0_0_90px_rgba(217,172,66,0.22)] sm:size-[282px]">
            <div className="relative size-full overflow-hidden rounded-full">
              <Image
                src="/brand/logo-mark.png"
                alt=""
                fill
                priority
                sizes="220px"
                className="object-contain p-1"
              />
              <GoldShimmer active className="brand-intro__sweep" />
            </div>
          </div>
        </div>

        <p className="brand-intro__tagline mt-7 font-display text-[0.95rem] italic tracking-wide text-ivory/65">
          Quality Products. Better Life.
        </p>
      </div>

      <span className="brand-intro__hint absolute bottom-7 right-6 text-[0.48rem] font-semibold uppercase tracking-[0.28em] text-ivory/25 sm:right-10">
        Click to skip
      </span>
    </div>
  );
}
