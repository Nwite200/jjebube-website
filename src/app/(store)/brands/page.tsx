import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Building2 } from "lucide-react";
import { ShopHeader } from "@/components/shop-header";
import { getBrands, getProducts } from "@/lib/db";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our Brands",
  description:
    "Discover the trusted brands stocked by JJ Ebube Enterprise — from Promasidor and Cadbury to Dano, Lipton, Nestlé and more.",
  alternates: { canonical: "/brands" },
};

export default async function BrandsPage() {
  const [brands, products] = await Promise.all([getBrands(), getProducts()]);

  const counts: Record<string, number> = {};
  for (const p of products) counts[p.brandSlug] = (counts[p.brandSlug] ?? 0) + 1;

  const stocked = brands.filter((b) => (counts[b.slug] ?? 0) > 0);
  const partners = brands.filter((b) => (counts[b.slug] ?? 0) === 0);

  return (
    <>
      <ShopHeader
        eyebrow="The names behind the shelf"
        title="Brands You Know. Quality You Trust."
        description="We stock the food, drinks and household names that Nigerian homes and businesses reach for every day."
        crumbs={[{ label: "Brands" }]}
        note="Stocked for retail and wholesale"
      />

      <div className="container-edge py-12 md:py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-[1.8rem] text-navy md:text-[2.2rem]">In our catalogue</h2>
            <p className="mt-1.5 text-[0.82rem] text-navy/45">
              {stocked.length} brands with products available to shop today.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 border-l border-t border-navy/10 sm:grid-cols-3 lg:grid-cols-4">
          {stocked.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="group flex min-h-[170px] flex-col justify-between border-b border-r border-navy/10 p-6 transition-colors duration-500 hover:bg-navy"
            >
              <span className="flex size-10 items-center justify-center rounded-full border border-gold/35 font-display text-sm text-gold-deep transition group-hover:border-gold/60 group-hover:text-gold-soft">
                {brand.name.slice(0, 1)}
              </span>
              <div>
                <h3 className="font-display text-[1.35rem] leading-tight text-navy transition group-hover:text-ivory">
                  {brand.name}
                </h3>
                <div className="mt-1.5 flex items-center justify-between">
                  <p className="text-[0.56rem] font-bold uppercase tracking-[0.12em] text-navy/35 transition group-hover:text-ivory/45">
                    {counts[brand.slug]} product{counts[brand.slug] === 1 ? "" : "s"}
                  </p>
                  <ArrowUpRight className="size-3.5 text-navy/25 transition group-hover:text-gold" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <h2 className="font-display text-[1.8rem] text-navy md:text-[2.2rem]">Our distribution partners</h2>
          </div>
          <p className="mt-2 max-w-[560px] text-[0.82rem] leading-relaxed text-navy/45">
            These brands form part of our wider supply network. Ask us about availability, carton quantities and
            pricing.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {partners.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="group flex items-center justify-between border border-navy/10 bg-white px-4 py-4 transition hover:border-gold/60"
              >
                <span>
                  <span className="block font-display text-[1.02rem] text-navy group-hover:text-gold-deep">
                    {brand.name}
                  </span>
                  <span className="mt-0.5 block text-[0.5rem] font-bold uppercase tracking-[0.12em] text-navy/30">
                    {brand.note ?? "Brand"}
                  </span>
                </span>
                <ArrowUpRight className="size-3 text-navy/25 transition group-hover:text-gold-deep" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-5 border border-navy/10 bg-white p-6 sm:flex-row sm:items-center md:p-8">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-ivory">
              <Building2 className="size-5 text-gold-deep" strokeWidth={1.5} />
            </span>
            <div>
              <h2 className="font-display text-xl text-navy">Stocking these brands in your business?</h2>
              <p className="mt-1 text-[0.8rem] text-navy/45">
                Ask about bulk quantities and business pricing for your shop, kitchen or store.
              </p>
            </div>
          </div>
          <Link href="/wholesale" className={cn("btn btn-navy h-11 shrink-0")}>
            Wholesale enquiries <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}
