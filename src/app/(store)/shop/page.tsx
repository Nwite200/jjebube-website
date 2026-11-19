import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopHeader } from "@/components/shop-header";
import { ShopClient } from "@/components/shop/shop-client";
import { getBrands, getCategories, getHomeContent, getProducts } from "@/lib/db";
import { toClientProducts } from "@/lib/catalog-view";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse milk, creamers, tea, coffee, cocoa, seasoning, noodles and everyday grocery essentials at JJ Ebube Enterprise. Retail and wholesale.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [products, categories, brands, content] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
    getHomeContent(),
  ]);

  return (
    <>
      <ShopHeader
        eyebrow="The full pantry"
        title="Shop All Products"
        description={content.categoriesSubheading}
        crumbs={[{ label: "Shop All" }]}
        note="Retail · Wholesale · Bulk orders"
      />
      <Suspense
        fallback={
          <div className="container-edge grid grid-cols-2 gap-4 py-12 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton aspect-[3/4]" />
            ))}
          </div>
        }
      >
        <ShopClient
          products={toClientProducts(products, brands)}
          categories={categories
            .filter((c) => !c.href)
            .map((c) => ({ slug: c.slug, name: c.name }))}
          brands={brands.map((b) => ({ slug: b.slug, name: b.name }))}
        />
      </Suspense>
    </>
  );
}
