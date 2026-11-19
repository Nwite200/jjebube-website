"use client";

import { cn } from "@/lib/utils";

/**
 * A reusable metallic highlight that sweeps across the logo container. Screen
 * blending leaves white backgrounds untouched while catching the gold artwork.
 */
export function GoldShimmer({
  active,
  className,
}: {
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("gold-shimmer", active && "is-active", className)}
    />
  );
}
