"use client";

import { useEffect } from "react";
import { prefersReducedMotion, pulseBrand } from "@/lib/brand-events";

/**
 * One listener for the whole site. Every primary click or tap gives the header
 * logo a brief gold response — without delaying the action itself. The logo
 * has its own stronger response and is excluded to avoid a double pulse.
 */
export function GlobalClickFeedback() {
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      if (prefersReducedMotion()) return;
      const target = event.target as Element | null;
      if (!target || typeof target.closest !== "function") return;
      if (target.closest("[data-brand-logo]")) return;
      if (target.closest(".brand-intro")) return;
      pulseBrand("soft");
    };

    document.addEventListener("pointerdown", onPointerDown, { capture: true, passive: true });
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  return null;
}
