import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { Flash } from "@/components/admin/ui";
import { getBrands, getCategories, getProducts } from "@/lib/db";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, query, products, brands, categories] = await Promise.all([
    params,
    searchParams,
    getProducts(),
    getBrands(),
    getCategories(),
  ]);
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <div>
      {query.error && <Flash error={query.error} />}
      <ProductForm
        product={product}
        brands={brands.map((b) => ({ slug: b.slug, name: b.name }))}
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
      />
    </div>
  );
}
