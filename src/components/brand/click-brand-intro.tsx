"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GoldShimmer } from "./gold-shimmer";

const DURATION = 460;
const MAX_MOVE = 10;
const MAX_CLICK_MS = 900;

/**
 * A very short version of the brand intro, played on real pointer clicks and
 * taps only. It is purely visual: pointer-events are disabled, nothing is
 * prevented, and it is skipped while the full cinematic intro is on screen.
 */
export function ClickBrandIntro() {
  const [playing, setPlaying] = useState(false);
  const busy = useRef(false);
  const timer = useRef<number | null>(null);

  const play = useCallback(() => {
    if (busy.current) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.getAttribute("data-brand-intro") === "active") return;
    busy.current = true;
    setPlaying(true);
    timer.current = window.setTimeout(() => {
      setPlaying(false);
      busy.current = false;
    }, DURATION);
  }, []);

  useEffect(() => {
    let down: { x: number; y: number; t: number; id: number } | null = null;

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      down = { x: event.clientX, y: event.clientY, t: Date.now(), id: event.pointerId };
    };

    const onUp = (event: PointerEvent) => {
      if (!down || event.pointerId !== down.id) return;
      const moved = Math.hypot(event.clientX - down.x, event.clientY - down.y);
      const elapsed = Date.now() - down.t;
      down = null;
      if (moved > MAX_MOVE || elapsed > MAX_CLICK_MS) return;
      const target = event.target as Element | null;
      if (target && typeof target.closest === "function" && target.closest(".brand-intro")) return;
      play();
    };

    const onCancel = () => {
      down = null;
    };

    document.addEventListener("pointerdown", onDown, { capture: true, passive: true });
    document.addEventListener("pointerup", onUp, { capture: true, passive: true });
    document.addEventListener("pointercancel", onCancel, { capture: true, passive: true });
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("pointercancel", onCancel, true);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [play]);

  if (!playing) return null;

  return (
    <div className="click-brand-intro fixed inset-0 z-[190]" aria-hidden="true">
      <div className="click-brand-intro__veil" />
      <div className="click-brand-intro__glow" />
      <div className="click-brand-intro__stage">
        <div className="click-brand-intro__logo">
          <Image src="/brand/logo-mark.png" alt="" fill sizes="120px" className="object-contain p-1" />
          <GoldShimmer active className="z-10" />
          <span className="click-brand-intro__ring" />
        </div>
        <p className="click-brand-intro__word">JJ EBUBE</p>
        <p className="click-brand-intro__sub">ENTERPRISE</p>
      </div>
    </div>
  );
}
