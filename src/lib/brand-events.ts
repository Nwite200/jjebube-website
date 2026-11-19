export type BrandPulseKind = "soft" | "full";

const EVENT = "jje:brand-pulse";

export function pulseBrand(kind: BrandPulseKind = "soft") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<BrandPulseKind>(EVENT, { detail: kind }));
}

export function subscribeBrandPulse(handler: (kind: BrandPulseKind) => void) {
  if (typeof window === "undefined") return () => undefined;
  const listener = (event: Event) => {
    handler((event as CustomEvent<BrandPulseKind>).detail ?? "soft");
  };
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export const INTRO_SESSION_KEY = "jje-brand-intro-seen";
