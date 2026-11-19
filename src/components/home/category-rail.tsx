"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { ProductImage } from "@/components/product-image";
import { cn } from "@/lib/utils";

export function CategoryRail({
  categories,
  heading,
  subheading,
}: {
  categories: Category[];
  heading: string;
  subheading: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 600), behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-ivory py-16 md:py-20 lg:py-24">
      <div className="container-edge">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <p className="eyebrow text-gold-deep">Curated for every kitchen</p>
            </div>
            <h2 className="mt-4 max-w-[520px] font-display text-[clamp(2rem,3.6vw,3.3rem)] leading-[1.04] text-navy">
              {heading}
            </h2>
            <p className="mt-3 text-[0.88rem] text-navy/50">{subheading}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/categories" className="link-underline mr-2 text-navy/70 hover:text-navy">
              All categories
            </Link>
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Scroll categories left"
              className="flex size-10 items-center justify-center rounded-full border border-navy/15 text-navy transition-all duration-300 hover:border-gold hover:bg-white"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Scroll categories right"
              className="flex size-10 items-center justify-center rounded-full border border-navy/15 text-navy transition-all duration-300 hover:border-gold hover:bg-white"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="relative mt-9">
          <div
            ref={railRef}
            className="rail -mx-5 px-5 pb-4 md:mx-0 md:px-0"
            aria-label="Shop by category"
          >
            {categories.map((cat, i) => (
              <Link
                key={cat.slug}
                href={cat.href ?? `/category/${cat.slug}`}
                className="group relative flex w-[212px] flex-col overflow-hidden border border-navy/8 bg-white transition-all duration-500 hover:border-gold/40 hover:shadow-[0_24px_44px_-24px_rgba(7,26,58,0.28)] sm:w-[238px] lg:w-[254px]"
              >
                <div className="relative aspect-[4/4.4] overflow-hidden bg-white">
                  <span className="absolute left-4 top-4 z-10 font-display text-[0.7rem] italic text-gold-deep/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="absolute inset-0 px-6 pb-5 pt-10">
                    <ProductImage
                      src={cat.image}
                      alt={cat.name}
                      brand={cat.name}
                      sizes="(max-width: 640px) 50vw, 260px"
                      padded={false}
                      imageClassName="group-hover:scale-[1.05]"
                    />
                  </div>
                  <span className="absolute bottom-4 right-4 z-10 flex size-8 items-center justify-center rounded-full border border-navy/10 bg-white/80 text-navy backdrop-blur transition-all duration-300 group-hover:border-navy group-hover:bg-navy group-hover:text-gold-soft">
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
                <div className="border-t border-navy/8 px-5 py-4">
                  <h3 className="font-display text-[1.05rem] leading-tight text-navy transition-colors duration-300 group-hover:text-gold-deep">
                    {cat.name}
                  </h3>
                  <p className="mt-1 truncate text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-navy/35">
                    {cat.tagline}
                  </p>
                </div>
              </Link>
            ))}

            <Link
              href="/shop"
              className={cn(
                "group relative flex w-[212px] flex-col overflow-hidden border border-navy/10 bg-navy text-ivory sm:w-[238px] lg:w-[254px]",
              )}
            >
              <div className="relative flex aspect-[4/4.4] flex-col justify-between overflow-hidden p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(217,172,66,0.18),transparent_60%)]" />
                <svg className="absolute -right-10 -top-10 size-48 opacity-25" viewBox="0 0 200 200" fill="none">
                  <circle cx="100" cy="100" r="98" stroke="#D9AC42" strokeWidth="0.6" />
                  <circle cx="100" cy="100" r="70" stroke="#D9AC42" strokeWidth="0.4" strokeDasharray="2 5" />
                </svg>
                <span className="relative font-display text-[0.7rem] italic text-gold-soft/80">
                  The full shelf
                </span>
                <div className="relative">
                  <p className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-gold-soft/70">
                    Browse everything
                  </p>
                  <h3 className="mt-2 font-display text-[1.9rem] leading-[1.05]">
                    All
                    <br />
                    Products
                  </h3>
                  <span className="mt-5 flex size-9 items-center justify-center rounded-full border border-gold/50 text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-navy">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-ivory/10 px-5 py-4">
                <span className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-ivory/45">
                  Shop the range
                </span>
                <ArrowRight className="size-3.5 text-gold" />
              </div>
            </Link>
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-ivory to-transparent lg:block" />
        </div>
      </div>
    </section>
  );
}
