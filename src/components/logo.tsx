import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  inverted = false,
  compact = false,
  className,
}: {
  inverted?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="JJ Ebube Enterprise — home"
      className={cn("group flex items-center gap-3", className)}
    >
      <span
        className={cn(
          "relative block size-11 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-gold/30 transition-transform duration-500 group-hover:-translate-y-0.5 md:size-12",
          inverted && "bg-ivory",
        )}
      >
        <Image
          src="/brand/logo-mark.png"
          alt="JJ Ebube Enterprise logo"
          fill
          sizes="48px"
          className="object-contain p-[1px]"
          priority
        />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-[1.28rem] font-semibold tracking-[0.015em] md:text-[1.42rem]",
              inverted ? "text-ivory" : "text-navy",
            )}
          >
            JJ EBUBE
          </span>
          <span className="mt-1.5 flex items-center gap-1.5">
            <span className="h-px w-3 bg-gold" />
            <span
              className={cn(
                "text-[0.52rem] font-extrabold uppercase tracking-[0.3em]",
                inverted ? "text-gold-soft" : "text-gold-deep",
              )}
            >
              Enterprise
            </span>
          </span>
        </span>
      )}
    </Link>
  );
}
