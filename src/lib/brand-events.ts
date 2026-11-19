export type BrandActivity = "start" | "complete" | "quick";

const EVENT = "jje:brand-activity";

function emit(activity: BrandActivity) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<BrandActivity>(EVENT, { detail: activity }));
}

/** Begin the logo transition indicator for a meaningful action. */
export function startBrandActivity() {
  emit("start");
}

/** End the indicator once the action (navigation, submit, filter) settles. */
export function completeBrandActivity() {
  emit("complete");
}

/** A short shimmer for instant actions such as add-to-cart. */
export function flashBrand() {
  emit("quick");
}

export function subscribeBrandActivity(handler: (activity: BrandActivity) => void) {
  if (typeof window === "undefined") return () => undefined;
  const listener = (event: Event) => {
    handler((event as CustomEvent<BrandActivity>).detail ?? "quick");
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
