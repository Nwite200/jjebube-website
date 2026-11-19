import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { ClientProduct } from "@/lib/catalog-view";
import { ProductImage } from "@/components/product-image";
import { formatNaira } from "@/lib/utils";

export function PromoBanner({
  products,
  eyebrow,
  title,
  body,
  button,
  href,
}: {
  products: ClientProduct[];
  eyebrow: string;
  title: string;
  body: string;
  button: string;
  href: string;
}) {
  const picks = products.slice(0, 3);
  const sentences = title
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section className="noise relative overflow-hidden bg-navy py-16 text-ivory md:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[10%] top-[-40%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(217,172,66,0.12),transparent_65%)]" />
        <div className="absolute bottom-0 right-[6%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(217,172,66,0.08),transparent_70%)]" />
        <svg className="absolute bottom-[-10%] left-[2%] h-[360px] w-[360px] opacity-20" viewBox="0 0 300 300" fill="none">
          <circle cx="150" cy="150" r="148" stroke="#D9AC42" strokeWidth="0.5" />
          <circle cx="150" cy="150" r="112" stroke="#D9AC42" strokeWidth="0.4" strokeDasharray="3 7" />
        </svg>
      </div>

      <div className="container-edge relative grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
        <div>
          <div className="flex items-center gap-3">
            <Sparkles className="size-3.5 text-gold" />
            <p className="eyebrow text-gold-soft/80">{eyebrow}</p>
          </div>
          <h2 className="mt-5 max-w-[560px] font-display text-[clamp(2.4rem,4.5vw,4.3rem)] leading-[1.02] tracking-[-0.02em]">
            {sentences.map((line, i) => (
              <span key={line} className={`block ${i === 1 ? "italic text-gold-soft" : "text-ivory"}`}>
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-5 max-w-[420px] text-[0.9rem] leading-relaxed text-ivory/55">{body}</p>
          <Link href={href} className="btn btn-gold group mt-8">
            {button}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <p className="mt-5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ivory/35">
            Prices in naira · Updated in store
          </p>
        </div>

        <div className="relative mx-auto h-[330px] w-full max-w-[480px] sm:h-[380px] lg:h-[400px]">
          <div className="absolute inset-x-[6%] bottom-[8%] top-[16%] rounded-t-[200px] border border-gold/20 bg-[linear-gradient(180deg,rgba(247,244,237,0.06),transparent)]" />
          <div className="absolute left-1/2 top-1/2 size-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10 sm:size-[330px]" />

          {picks[0] && (
            <Link
              href={`/product/${picks[0].slug}`}
              className="group absolute right-[4%] top-[2%] z-30 w-[47%] rotate-[3deg] bg-white p-2.5 shadow-[0_34px_70px_-20px_rgba(4,17,39,0.8)] transition-transform duration-500 hover:rotate-0"
            >
              <div className="relative aspect-square bg-white">
                <ProductImage src={picks[0].image} alt={picks[0].name} brand={picks[0].brand} sizes="200px" />
              </div>
              <div className="flex items-center justify-between gap-2 px-0.5 pt-2">
                <span className="truncate text-[0.55rem] font-bold uppercase tracking-[0.12em] text-navy/50">
                  {picks[0].brand}
                </span>
                {picks[0].price !== null && (
                  <span className="text-[0.65rem] font-bold text-navy">{formatNaira(picks[0].price)}</span>
                )}
              </div>
            </Link>
          )}

          {picks[1] && (
            <Link
              href={`/product/${picks[1].slug}`}
              className="group absolute bottom-[4%] left-[2%] z-20 w-[42%] -rotate-[5deg] bg-white p-2.5 shadow-[0_34px_70px_-20px_rgba(4,17,39,0.8)] transition-transform duration-500 hover:rotate-0"
            >
              <div className="relative aspect-square bg-white">
                <ProductImage src={picks[1].image} alt={picks[1].name} brand={picks[1].brand} sizes="200px" />
              </div>
              <div className="flex items-center justify-between gap-2 px-0.5 pt-2">
                <span className="truncate text-[0.55rem] font-bold uppercase tracking-[0.12em] text-navy/50">
                  {picks[1].brand}
                </span>
                {picks[1].price !== null && (
                  <span className="text-[0.65rem] font-bold text-navy">{formatNaira(picks[1].price)}</span>
                )}
              </div>
            </Link>
          )}

          {picks[2] && (
            <Link
              href={`/product/${picks[2].slug}`}
              className="group absolute left-[30%] top-[26%] z-10 w-[38%] rotate-[7deg] bg-white p-2.5 shadow-[0_34px_70px_-20px_rgba(4,17,39,0.8)] transition-transform duration-500 hover:rotate-0"
            >
              <div className="relative aspect-square bg-white">
                <ProductImage src={picks[2].image} alt={picks[2].name} brand={picks[2].brand} sizes="180px" />
              </div>
              <div className="px-0.5 pt-2">
                <span className="block truncate text-[0.55rem] font-bold uppercase tracking-[0.12em] text-navy/50">
                  {picks[2].brand}
                </span>
              </div>
            </Link>
          )}

          <div className="absolute bottom-[6%] right-[2%] z-40 flex flex-col items-center justify-center rounded-full border border-gold/50 bg-navy/90 size-[92px] text-center shadow-[0_16px_36px_-10px_rgba(4,17,39,0.8)] backdrop-blur sm:size-[104px]">
            <span className="font-display text-xl italic leading-none text-gold-soft">Value</span>
            <span className="mt-1 text-[0.42rem] font-bold uppercase tracking-[0.18em] text-ivory/55">
              in every bag
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
