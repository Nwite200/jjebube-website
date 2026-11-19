"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function EditorialImage({
  src,
  alt,
  className,
  imageClassName,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority = false,
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-navy", className)}>
      {!failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#14305d_0%,#071a3a_60%,#041127_100%)]">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(217,172,66,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(217,172,66,0.18)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-7xl italic text-gold/20">JJ</span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
