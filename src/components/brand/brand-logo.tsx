import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Brand marks.
 *
 * Real official artwork is used where it is available. The remaining brands
 * fall back to a typographic wordmark in their own colours and lettering cues,
 * which can be replaced by an asset at any time by adding it to `brandLogos`.
 */
const brandLogos: Record<string, string> = {
  promasidor: "/brands/promasidor.png",
  cadbury: "/brands/cadbury.png",
  multipro: "/brands/multipro.png",
  blume: "/brands/sonia.png",
  johnvent: "/brands/johnvent.png",
  aava: "/brands/aava.png",
  dogan: "/brands/dogan.png",
  tinki: "/brands/tinki.png",
  sarah: "/brands/sarah.png",
  "valency-agro": "/brands/champion.png",
  "apple-pear": "/brands/laziz.png",
  "primer-food": "/brands/supreme.png",
  evans: "/brands/evans.png",
  "oriental-food": "/brands/luna.png",
  cremora: "/brands/cremora.png",
  evidence: "/brands/benilo.png",
};

export function BrandLogo({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const logoSrc = brandLogos[slug];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-10 max-w-full items-center text-navy",
        className,
      )}
    >
      {logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoSrc}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-auto max-h-9 w-auto max-w-full object-contain mix-blend-multiply"
        />
      ) : (
        marks[slug] ?? (
          <span className="font-display text-[1.15rem] font-semibold leading-none">{name}</span>
        )
      )}
    </span>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.5l2.6 6.1 6.6.5-5 4.3 1.5 6.4-5.7-3.5-5.7 3.5 1.5-6.4-5-4.3 6.6-.5L12 2.5z" />
    </svg>
  );
}

const marks: Record<string, ReactNode> = {
  promasidor: (
    <span className="inline-flex items-baseline gap-1">
      <span className="font-sans text-[1.32rem] font-extrabold leading-none tracking-[-0.05em] text-[#F26A21]">
        promasidor
      </span>
      <span className="mb-1 block size-1.5 rounded-full bg-[#F9B233]" />
    </span>
  ),
  cadbury: (
    <span className="relative inline-flex flex-col">
      <span className="font-display text-[1.5rem] font-semibold italic leading-none tracking-[-0.01em] text-[#4A2A83]">
        Cadbury
      </span>
      <svg
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        className="mt-0.5 h-1.5 w-full text-[#C9A227]"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 6c18-5 36-5 54-1 12 2 24 2 42-2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  ),
  multipro: (
    <span className="inline-flex items-baseline leading-none">
      <span className="font-sans text-[1.26rem] font-extrabold tracking-[-0.035em] text-[#0B4F9E]">
        Multi
      </span>
      <span className="font-sans text-[1.26rem] font-extrabold tracking-[-0.035em] text-[#E63946]">
        Pro
      </span>
    </span>
  ),
  blume: (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 24 24" className="size-5 text-[#C9A227]" fill="currentColor" aria-hidden="true">
        <path d="M12 12C10.4 8.6 11.1 4.9 12 3.5c.9 1.4 1.6 5.1 0 8.5Z" />
        <path d="M12 12c3.4-1.6 7.1-.9 8.5 0-1.4.9-5.1 1.6-8.5 0Z" />
        <path d="M12 12c1.6 3.4.9 7.1 0 8.5-.9-1.4-1.6-5.1 0-8.5Z" />
        <path d="M12 12c-3.4 1.6-7.1.9-8.5 0 1.4-.9 5.1-1.6 8.5 0Z" />
      </svg>
      <span className="font-display text-[1.42rem] font-semibold leading-none tracking-[0.01em] text-[#123D2E]">
        blume
      </span>
    </span>
  ),
  johnvent: (
    <span className="inline-flex flex-col items-start gap-1">
      <span className="font-sans text-[0.94rem] font-extrabold uppercase leading-none tracking-[0.18em] text-[#0B2B5B]">
        Johnvent
      </span>
      <span className="h-px w-8 bg-[#C9A227]" />
    </span>
  ),
  aava: (
    <span className="inline-flex items-center gap-2">
      <span className="block size-1.5 rotate-45 bg-[#0E7490]" />
      <span className="font-sans text-[1.26rem] font-extrabold leading-none tracking-[0.16em] text-[#0E7490]">
        AAVA
      </span>
    </span>
  ),
  dogan: (
    <span className="inline-flex flex-col items-start">
      <span className="font-sans text-[1.34rem] font-extrabold leading-none tracking-[-0.03em] text-[#D8232A]">
        Dogan&rsquo;s
      </span>
      <span className="mt-1 h-[3px] w-8 rounded-full bg-[#1F7A3D]" />
    </span>
  ),
  tinki: (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-sans text-[1.44rem] font-extrabold lowercase leading-none tracking-[-0.045em] text-[#243B9B]">
        tinki
      </span>
      <span className="mb-1 block size-1.5 rounded-full bg-[#A3D34A]" />
    </span>
  ),
  sarah: (
    <span className="inline-flex items-end gap-1">
      <span className="font-display text-[1.5rem] font-bold italic leading-none text-[#6B2D8B]">
        Sarah
      </span>
      <span className="mb-1.5 flex gap-0.5 text-[#6B2D8B]">
        <Star className="size-2" />
        <Star className="size-1.5" />
      </span>
    </span>
  ),
  "valency-agro": (
    <span className="inline-flex items-baseline gap-1.5 leading-none">
      <span className="font-sans text-[0.92rem] font-extrabold uppercase tracking-[0.06em] text-[#1F7A3D]">
        Valency
      </span>
      <span className="font-sans text-[0.5rem] font-bold uppercase tracking-[0.26em] text-[#C9A227]">
        Agro
      </span>
    </span>
  ),
  "apple-pear": (
    <span className="inline-flex items-center gap-2">
      <span className="flex flex-col items-center">
        <span className="block size-2 rounded-full rounded-bl-none bg-[#B23A48]" />
        <span className="mt-0.5 block size-1.5 rounded-full rounded-tr-none bg-[#1F7A3D]" />
      </span>
      <span className="font-display text-[1.18rem] font-semibold leading-none text-[#6E2C2C]">
        Apple <span className="italic text-[#C9A227]">&amp;</span> Pear
      </span>
    </span>
  ),
  "primer-food": (
    <span className="inline-flex flex-col items-start leading-none">
      <span className="font-sans text-[1.18rem] font-extrabold tracking-[-0.02em] text-[#0B2B5B]">
        Primer
      </span>
      <span className="mt-1 font-sans text-[0.46rem] font-bold uppercase tracking-[0.32em] text-[#C9A227]">
        Food
      </span>
    </span>
  ),
  evans: (
    <span className="inline-flex flex-col items-start leading-none">
      <span className="font-sans text-[1.4rem] font-extrabold lowercase tracking-[-0.045em] text-[#1E5AA8]">
        evans
      </span>
      <span className="mt-0.5 font-sans text-[0.42rem] font-bold uppercase tracking-[0.24em] text-[#0B2B5B]/55">
        baroque
      </span>
    </span>
  ),
  "oriental-food": (
    <span className="inline-flex flex-col items-start leading-none">
      <span className="font-display text-[1.24rem] font-semibold italic leading-none text-[#C8102E]">
        Oriental
      </span>
      <span className="mt-0.5 font-sans text-[0.44rem] font-bold uppercase tracking-[0.3em] text-[#0B2B5B]/55">
        Food
      </span>
    </span>
  ),
  "good-brand": (
    <span className="inline-flex items-baseline gap-1.5 leading-none">
      <span className="font-display text-[1.4rem] font-bold italic tracking-[-0.01em] text-[#5A3A22]">
        Ogoody
      </span>
      <span className="mb-1 block size-1.5 rounded-full bg-[#2E7D32]" />
    </span>
  ),
  cremora: (
    <span className="inline-flex items-center rounded-full border-2 border-[#D71920] px-3 py-1.5">
      <span className="font-display text-[1rem] font-bold leading-none tracking-[0.02em] text-[#D71920]">
        Cremora
      </span>
    </span>
  ),
  evidence: (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-sans text-[1.1rem] font-bold leading-none tracking-[0.02em] text-[#3B2A1A]">
        Evidence
      </span>
      <span className="block size-1.5 rounded-full bg-[#C9A227]" />
    </span>
  ),
};
