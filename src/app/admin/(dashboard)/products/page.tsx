import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPageHeader, Flash } from "@/components/admin/ui";
import { ProductsTable } from "@/components/admin/products-table";
import { getBrands, getCategories, getProducts } from "@/lib/db";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const [products, brands, categories, query] = await Promise.all([
    getProducts(),
    getBrands(),
    getCategories(),
    searchParams,
  ]);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Products"
        description="Create, edit and feature products. Blank prices display as “Price on request”."
        action={
          <Link href="/admin/products/new" className="btn btn-navy h-10 text-[0.62rem]">
            <Plus className="size-3.5" /> Add product
          </Link>
        }
      />
      <div className="mt-5">
        <Flash saved={query.saved || query.deleted} error={query.error} />
      </div>
      <ProductsTable
        products={products}
        brands={brands.map((b) => ({ slug: b.slug, name: b.name }))}
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
      />
    </div>
  );
}
