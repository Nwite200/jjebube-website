import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ShopHeader } from "@/components/shop-header";
import { ShopClient } from "@/components/shop/shop-client";
import { getBrands, getCategories, getCategory, getProducts } from "@/lib/db";
import { toClientProducts } from "@/lib/catalog-view";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description: `${category.description} Shop ${category.name.toLowerCase()} at JJ Ebube Enterprise.`,
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: { title: `${category.name} | JJ Ebube Enterprise`, description: category.description },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const [category, products, categories, brands] = await Promise.all([
    getCategory(slug),
    getProducts(),
    getCategories(),
    getBrands(),
  ]);

  if (!category) notFound();
  if (category.href) redirect(category.href);

  const list = toClientProducts(products, brands).filter((p) => p.categorySlug === slug);

  return (
    <>
      <ShopHeader
        eyebrow="Shop by category"
        title={category.name}
        description={category.description}
        crumbs={[{ label: "Categories", href: "/categories" }, { label: category.name }]}
        image={category.image}
        note={`${list.length} product${list.length === 1 ? "" : "s"} · Retail & wholesale`}
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
          products={list}
          categories={categories
            .filter((c) => !c.href)
            .map((c) => ({ slug: c.slug, name: c.name }))}
          brands={brands.map((b) => ({ slug: b.slug, name: b.name }))}
          lockedCategory={slug}
        />
      </Suspense>
    </>
  );
}
