import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ShopHeader } from "@/components/shop-header";
import { ProductImage } from "@/components/product-image";
import { getBrands, getCategories, getProducts } from "@/lib/db";

export const metadata: Metadata = {
  title: "Shop by Category",
  description:
    "Explore every aisle at JJ Ebube Enterprise — milk and creamers, tea and coffee, cocoa, sugar, seasonings, noodles, evaporated milk and grocery essentials.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const [categories, products, brands] = await Promise.all([
    getCategories(),
    getProducts(),
    getBrands(),
  ]);

  return (
    <>
      <ShopHeader
        eyebrow="Every aisle, curated"
        title="Shop by Category"
        description="Everything you need for the home, the shop and the kitchen — organised into beautifully simple aisles."
        crumbs={[{ label: "Categories" }]}
        note="Retail · Wholesale · Bulk orders"
      />

      <div className="container-edge py-12 md:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            const count = products.filter((p) => p.categorySlug === cat.slug).length;
            const href = cat.href ?? `/category/${cat.slug}`;
            if (cat.href) {
              return (
                <Link
                  key={cat.slug}
                  href={href}
                  className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden bg-navy p-7 text-ivory"
                >
                  <div className="absolute inset-0 opacity-40">
                    <ProductImage src={cat.image} alt={cat.name} brand={cat.name} sizes="33vw" imageClassName="object-cover" padded={false} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/20" />
                  <span className="relative text-[0.55rem] font-bold uppercase tracking-[0.2em] text-gold-soft">
                    Business
                  </span>
                  <div className="relative">
                    <h2 className="font-display text-[1.9rem] leading-tight">{cat.name}</h2>
                    <p className="mt-2 max-w-[280px] text-[0.78rem] text-ivory/55">{cat.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-gold">
                      Talk to our team <ArrowUpRight className="size-3.5" />
                    </span>
                  </div>
                </Link>
              );
            }
            return (
              <Link
                key={cat.slug}
                href={href}
                className="group flex flex-col overflow-hidden border border-navy/8 bg-white transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_26px_50px_-26px_rgba(7,26,58,0.3)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-white">
                  <span className="absolute left-4 top-4 font-display text-[0.68rem] italic text-gold-deep/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="absolute inset-0 px-12 py-6">
                    <ProductImage src={cat.image} alt={cat.name} brand={cat.name} sizes="(max-width: 1024px) 100vw, 33vw" padded={false} imageClassName="group-hover:scale-105" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-[1.4rem] text-navy">{cat.name}</h2>
                    <span className="flex size-8 items-center justify-center rounded-full border border-navy/10 transition group-hover:border-navy group-hover:bg-navy group-hover:text-gold">
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </div>
                  <p className="mt-2 flex-1 text-[0.8rem] leading-relaxed text-navy/45">{cat.description}</p>
                  <p className="mt-5 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-gold-deep">
                    {count} product{count === 1 ? "" : "s"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="mt-10 text-center text-[0.7rem] text-navy/40">
          Can&apos;t find what you need?{" "}
          <Link href="/contact" className="font-semibold text-navy underline decoration-gold underline-offset-2">
            Tell us what you&apos;re looking for
          </Link>
          .
        </p>
      </div>
    </>
  );
}
