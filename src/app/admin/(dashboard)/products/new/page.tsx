import { ProductForm } from "@/components/admin/product-form";
import { Flash } from "@/components/admin/ui";
import { getBrands, getCategories } from "@/lib/db";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [brands, categories, query] = await Promise.all([getBrands(), getCategories(), searchParams]);
  return (
    <div>
      {query.error && <Flash error={query.error} />}
      <ProductForm
        brands={brands.map((b) => ({ slug: b.slug, name: b.name }))}
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
      />
    </div>
  );
}
