"use client";

import Image from "next/image";
import { useState } from "react";
import { cn, initials } from "@/lib/utils";

export function ProductImage({
  src,
  alt,
  brand,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  className,
  imageClassName,
  priority = false,
  padded = true,
}: {
  src: string;
  alt: string;
  brand?: string;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  padded?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={cn(
          "relative flex size-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_35%_20%,#fffdf8_0%,#f1ecdf_55%,#e7dfcb_100%)]",
          className,
        )}
      >
        <div className="absolute inset-4 rounded-full border border-gold/25" />
        <span className="font-display text-2xl text-navy/35">{initials(brand || alt || "JJ")}</span>
        <span className="mt-2 text-[0.5rem] font-bold uppercase tracking-[0.22em] text-navy/30">
          Image coming soon
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative size-full overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
        className={cn(
          "object-contain transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          padded && "p-2",
          imageClassName,
        )}
      />
    </div>
  );
}
