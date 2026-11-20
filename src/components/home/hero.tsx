import Link from "next/link";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/product-image";
import { formatNaira } from "@/lib/utils";

const HERO_SLUGS = [
  "lipton-box",
  "dano-1kg-fullcream",
  "kerrygold-750g",
  "cremora",
  "onga-cube-beef-x100",
];

export function Hero({
  products,
  eyebrow,
  title,
  highlight,
  body,
}: {
  products: Product[];
  eyebrow: string;
  title: string;
  highlight: string;
  body: string;
}) {
  const picks = HERO_SLUGS.map((slug) => products.find((p) => p.slug === slug)).filter(
    (p): p is Product => Boolean(p),
  );
  const [lipton, dano, kerrygold, cremora, onga] = picks;

  const lines = title.includes(highlight) ? title.split(highlight) : [title];

  return (
    <section className="noise relative overflow-hidden bg-navy text-ivory">
      {/* Ambient light + fine gold geometry */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[12%] -top-[30%] h-[720px] w-[720px] rounded-full bg-[radial-gradient(circle,rgba(217,172,66,0.16)_0%,rgba(217,172,66,0.03)_42%,transparent_68%)]" />
        <div className="absolute -left-[18%] bottom-[-30%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(16,38,75,0.9)_0%,transparent_70%)]" />
        <svg
          className="absolute right-[-4%] top-[6%] hidden h-[560px] w-[560px] opacity-[0.18] lg:block"
          viewBox="0 0 500 500"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="250" cy="250" r="238" stroke="#D9AC42" strokeWidth="0.6" />
          <circle cx="250" cy="250" r="206" stroke="#D9AC42" strokeWidth="0.4" strokeDasharray="2 6" />
          <circle cx="250" cy="250" r="150" stroke="#D9AC42" strokeWidth="0.4" />
        </svg>
        <div className="gold-rule absolute inset-x-0 bottom-0 opacity-40" />
      </div>

      <div className="container-edge relative grid items-center gap-10 py-12 md:py-14 lg:min-h-[596px] lg:grid-cols-[1.04fr_0.96fr] lg:gap-4 lg:py-0">
        <div className="relative z-10 max-w-[620px] animate-float-in lg:py-16">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <p className="eyebrow text-gold-soft/90">{eyebrow}</p>
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.7rem,5.4vw,5.15rem)] font-medium leading-[0.98] tracking-[-0.03em] text-ivory">
            {lines[0]}
            {lines.length > 1 && (
              <span className="relative mt-1 block w-fit italic text-gold-soft">
                {highlight}
                <svg
                  viewBox="0 0 340 14"
                  className="absolute -bottom-1 left-0 h-3 w-full text-gold/70"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M2 9 C78 3, 190 2, 338 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M8 13 C100 8, 210 8, 330 11" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
            )}
            {lines.length > 1 && <span className="mt-1 block">{lines[1]}</span>}
          </h1>

          <p className="mt-7 max-w-[450px] text-[0.92rem] leading-relaxed text-ivory/60 md:text-[0.98rem]">
            {body}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/shop" className="btn btn-gold group">
              Shop our products
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href="/brands" className="btn btn-outline-light group">
              Explore brands
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ivory/45">
              <ShieldCheck className="size-3.5 text-gold" strokeWidth={1.8} />
              Authentic products
            </span>
            <span className="size-1 rounded-full bg-gold/50" />
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ivory/45">
              Retail • Wholesale • Bulk Orders
            </span>
          </div>
        </div>

        {/* Product composition */}
        <div className="relative mx-auto h-[400px] w-full max-w-[520px] animate-float-in sm:h-[470px] lg:h-[560px] lg:max-w-none">
          <div className="absolute inset-x-[4%] top-[4%] h-[88%] rounded-t-[999px] border border-gold/20 bg-[linear-gradient(180deg,rgba(247,244,237,0.07)_0%,rgba(247,244,237,0.015)_55%,transparent_100%)]" />
          <div className="absolute inset-x-[10%] top-[9%] h-[80%] rounded-t-[999px] border border-ivory/5" />

          <svg
            className="absolute inset-0 size-full opacity-20"
            aria-hidden="true"
            viewBox="0 0 400 500"
            fill="none"
          >
            <path d="M20 380 C120 300, 300 320, 400 250" stroke="#D9AC42" strokeWidth="0.5" />
            <path d="M0 420 C130 340, 300 360, 400 290" stroke="#D9AC42" strokeWidth="0.3" />
          </svg>

          {dano && (
            <HeroCard
              product={dano}
              className="right-[4%] top-[4%] z-30 w-[48%] rotate-[2deg]"
              priority
            />
          )}
          {lipton && (
            <HeroCard
              product={lipton}
              className="left-[-1%] top-[16%] z-20 w-[33%] -rotate-[6deg]"
            />
          )}
          {kerrygold && (
            <HeroCard
              product={kerrygold}
              className="left-[11%] bottom-[0%] z-40 w-[36%] -rotate-[2deg]"
            />
          )}
          {cremora && (
            <HeroCard
              product={cremora}
              className="hidden sm:block left-[43%] top-[-1%] z-10 w-[25%] rotate-[5deg]"
            />
          )}
          {onga && (
            <HeroCard
              product={onga}
              className="bottom-[3%] right-[-2%] z-30 w-[31%] rotate-[4deg]"
            />
          )}

          <div className="absolute -right-1 top-[-2%] z-40 flex size-[86px] animate-[pop_800ms_cubic-bezier(0.22,1,0.36,1)_both] flex-col items-center justify-center rounded-full border border-gold/50 bg-navy/90 text-center shadow-[0_16px_36px_-10px_rgba(4,17,39,0.8)] backdrop-blur md:size-[96px] lg:-right-3">
            <span className="font-display text-lg leading-none text-gold">100%</span>
            <span className="mt-1 text-[0.42rem] font-bold uppercase tracking-[0.16em] text-ivory/65">
              Authentic
              <br />
              products
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}

function HeroCard({
  product,
  className,
  priority = false,
}: {
  product: Product;
  className: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className={`group absolute block bg-white p-2 shadow-[0_30px_60px_-18px_rgba(4,17,39,0.65)] transition-all duration-500 hover:z-50 hover:-translate-y-1.5 hover:rotate-0 ${className}`}
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <div className="absolute inset-0 p-1.5">
          <ProductImage
            src={product.image}
            alt={product.name}
            brand={product.brandSlug}
            sizes="(max-width: 1024px) 40vw, 260px"
            priority={priority}
            imageClassName="group-hover:scale-105"
          />
        </div>
      </div>
    </Link>
  );
}
