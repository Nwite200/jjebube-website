"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Animates the incoming route without remounting the router subtree.
 * Remounting via a key can trip React 19's conditional `use()` checks inside
 * Next's layout router, so we toggle a CSS class instead.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [entering, setEntering] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setEntering(true);
    const timer = window.setTimeout(() => setEntering(false), 480);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return <div className={entering ? "page-transition" : undefined}>{children}</div>;
}
