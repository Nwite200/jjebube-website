import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles, Tag } from "lucide-react";
import { ShopHeader } from "@/components/shop-header";
import { ProductCard } from "@/components/product-card";
import { getBrands, getHomeContent, getProducts, getPromotions, getSettings } from "@/lib/db";
import { toClientProducts } from "@/lib/catalog-view";

export const metadata: Metadata = {
  title: "Deals & Everyday Value",
  description:
    "Honest everyday value on trusted grocery essentials at JJ Ebube Enterprise. Shop current offers and value picks.",
  alternates: { canonical: "/deals" },
};

export default async function DealsPage() {
  const [products, brands, promotions, content, settings] = await Promise.all([
    getProducts(),
    getBrands(),
    getPromotions(),
    getHomeContent(),
    getSettings(),
  ]);

  const client = toClientProducts(products, brands);
  const priced = client.filter((p) => p.price !== null);
  const valuePicks = [...priced, ...client.filter((p) => p.price === null && p.featured)].slice(0, 8);
  const active = promotions.filter((p) => p.active);

  return (
    <>
      <ShopHeader
        eyebrow="Current offers"
        title="Deals & Everyday Value"
        description="No invented countdowns. No inflated “was” prices. Just honest value on the products you use every day."
        crumbs={[{ label: "Deals" }]}
        note="Prices in naira · Updated in store"
      />

      <section className="noise relative overflow-hidden bg-navy py-14 text-ivory md:py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-[5%] top-[-40%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(217,172,66,0.15),transparent_65%)]" />
          <svg className="absolute bottom-[-30%] left-[10%] h-[380px] w-[380px] opacity-20" viewBox="0 0 300 300" fill="none">
            <circle cx="150" cy="150" r="148" stroke="#D9AC42" strokeWidth="0.6" />
            <circle cx="150" cy="150" r="110" stroke="#D9AC42" strokeWidth="0.4" strokeDasharray="3 7" />
          </svg>
        </div>
        <div className="container-edge relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="flex items-center gap-3">
              <Sparkles className="size-3.5 text-gold" />
              <p className="eyebrow text-gold-soft/80">{content.promoEyebrow}</p>
            </div>
            <h2 className="mt-4 max-w-[620px] font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.04]">
              {content.promoTitle.split(". ").map((line, i) => (
                <span key={line} className={i === 1 ? "block italic text-gold-soft" : "block"}>
                  {line.replace(/\.$/, "")}.
                </span>
              ))}
            </h2>
            <p className="mt-4 max-w-md text-[0.85rem] text-ivory/55">{content.promoBody}</p>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Link href="/shop" className="btn btn-gold">
              Shop all products <ArrowRight className="size-4" />
            </Link>
            <Link href="/wholesale" className="btn btn-outline-light">
              Business pricing <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="container-edge">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold" />
                <p className="eyebrow text-gold-deep">On the value shelf</p>
              </div>
              <h2 className="mt-3 font-display text-[clamp(1.9rem,3.4vw,2.9rem)] text-navy">This week&apos;s picks</h2>
              <p className="mt-2 max-w-lg text-[0.85rem] text-navy/45">
                Everyday essentials with a published price. Products marked “price on request” are available — ask us
                for current pricing.
              </p>
            </div>
            <Link href="/shop" className="link-underline text-navy">
              Browse everything <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {valuePicks.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {active.length > 0 && (
        <section className="border-t border-navy/8 bg-ivory py-14 md:py-20">
          <div className="container-edge">
            <div className="flex items-center gap-3">
              <Tag className="size-4 text-gold-deep" />
              <h2 className="font-display text-[1.8rem] text-navy md:text-[2.2rem]">Current campaigns</h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {active.map((promo) => (
                <Link
                  key={promo.id}
                  href={promo.href}
                  className="group flex flex-col justify-between border border-navy/10 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_24px_44px_-24px_rgba(7,26,58,0.25)] md:p-8"
                >
                  <div>
                    <p className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-gold-deep">Offer</p>
                    <h3 className="mt-2 font-display text-[1.6rem] leading-tight text-navy">{promo.title}</h3>
                    <p className="mt-2 max-w-md text-[0.8rem] leading-relaxed text-navy/45">{promo.subtitle}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-navy">
                    {promo.label}
                    <ArrowUpRight className="size-3.5 text-gold-deep transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-navy/8 bg-ivory-deep/40 py-12">
        <div className="container-edge flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="max-w-lg text-[0.8rem] leading-relaxed text-navy/50">
            Running a shop? Ask about business pricing on cartons and larger quantities. Our team will put together a
            quote for your order.
          </p>
          <Link href="/wholesale" className="btn btn-navy h-11 shrink-0">
            Wholesale enquiry <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
