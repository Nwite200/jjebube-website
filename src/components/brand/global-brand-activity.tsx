"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  completeBrandActivity,
  flashBrand,
  startBrandActivity,
} from "@/lib/brand-events";

const MIN_VISIBLE_MS = 320;
const MAX_VISIBLE_MS = 8000;

function isPlainLeftClick(event: MouseEvent) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

/**
 * One listener for the storefront. The header logo becomes a small gold
 * progress ring while real work is happening: internal navigation, filtering,
 * cart actions and form submissions. It never prevents the action and never
 * runs on idle clicks, typing or pointer movement.
 */
export function GlobalBrandActivity() {
  const pathname = usePathname();
  const active = useRef(false);
  const fallback = useRef<number | null>(null);
  const lastPath = useRef(pathname);

  useEffect(() => {
    function finish() {
      if (!active.current) return;
      active.current = false;
      if (fallback.current) window.clearTimeout(fallback.current);
      fallback.current = null;
      completeBrandActivity();
    }

    function begin() {
      if (active.current) return;
      active.current = true;
      startBrandActivity();
      if (fallback.current) window.clearTimeout(fallback.current);
      fallback.current = window.setTimeout(finish, MAX_VISIBLE_MS);
    }

    const onClick = (event: MouseEvent) => {
      if (!isPlainLeftClick(event) || event.defaultPrevented) return;
      const target = event.target as Element | null;
      if (!target || typeof target.closest !== "function") return;
      if (target.closest("[data-no-brand-activity]")) return;
      if (target.closest("[data-brand-logo]")) return;

      // Links are navigation: show the loader until the route settles.
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (anchor) {
        if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
        const href = anchor.getAttribute("href") || "";
        if (
          !href ||
          href.startsWith("#") ||
          href.startsWith("mailto:") ||
          href.startsWith("tel:") ||
          href.startsWith("javascript:")
        ) {
          return;
        }
        try {
          if (new URL(anchor.href, window.location.href).origin !== window.location.origin) return;
        } catch {
          return;
        }
        begin();
        return;
      }

      // Deliberately marked instant actions (filters, cart, wishlist, etc.).
      if (target.closest("[data-brand-quick]")) {
        if (!active.current) flashBrand();
        return;
      }

      // Buttons/controls that may take a moment.
      if (target.closest("[data-brand-loading]")) begin();
    };

    const onSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement | null;
      if (!form || typeof form.closest !== "function") return;
      if (form.closest("[data-no-brand-activity]")) return;
      begin();
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
      if (fallback.current) window.clearTimeout(fallback.current);
    };
  }, []);

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    if (!active.current) return;
    const timer = window.setTimeout(() => {
      if (!active.current) return;
      active.current = false;
      completeBrandActivity();
    }, MIN_VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
