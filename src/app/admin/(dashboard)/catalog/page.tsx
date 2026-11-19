import { ArrowUpRight, Plus } from "lucide-react";
import { AdminCard, AdminField, AdminPageHeader, Flash } from "@/components/admin/ui";
import {
  deleteBrandAction,
  deleteCategoryAction,
  saveBrandAction,
  saveCategoryAction,
} from "@/app/admin/actions";
import { getBrands, getCategories, getProducts } from "@/lib/db";

export default async function AdminCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  const [categories, brands, products, query] = await Promise.all([
    getCategories(),
    getBrands(),
    getProducts(),
    searchParams,
  ]);

  const catCount = (slug: string) => products.filter((p) => p.categorySlug === slug).length;
  const brandCount = (slug: string) => products.filter((p) => p.brandSlug === slug).length;

  return (
    <div>
      <AdminPageHeader
        eyebrow="Taxonomy"
        title="Categories & Brands"
        description="The structure behind the catalogue. Categories and brands cannot be deleted while products still use them."
      />
      <div className="mt-5">
        <Flash saved={query.saved || query.deleted} error={query.error} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminCard title={`Categories (${categories.length})`}>
          <div className="divide-y divide-navy/8">
            {categories.map((category) => (
              <details key={category.id} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-3.5 hover:bg-ivory/50">
                  <span>
                    <span className="block text-[0.78rem] font-semibold text-navy">{category.name}</span>
                    <span className="block text-[0.58rem] text-navy/35">
                      /{category.slug} · {catCount(category.slug)} products
                    </span>
                  </span>
                  <span className="text-[0.58rem] text-gold-deep group-open:hidden">Edit</span>
                  <span className="hidden text-[0.58rem] text-gold-deep group-open:block">Close</span>
                </summary>
                <form action={saveCategoryAction} className="space-y-3 bg-ivory/40 px-5 py-4">
                  <input type="hidden" name="id" value={category.id} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <AdminField label="Name" name="name" defaultValue={category.name} required />
                    <AdminField label="Slug" name="slug" defaultValue={category.slug} />
                    <AdminField label="Tagline" name="tagline" defaultValue={category.tagline} />
                    <AdminField label="Order" name="order" type="number" defaultValue={category.order} />
                    <div className="sm:col-span-2">
                      <AdminField label="Image URL" name="image" defaultValue={category.image} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block">
                        <span className="field-label">Replace image</span>
                        <input type="file" name="imageFile" accept="image/*" className="block w-full text-[0.68rem] text-navy/50 file:mr-3 file:border-0 file:bg-navy file:px-3 file:py-2 file:text-[0.58rem] file:font-semibold file:text-ivory" />
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block">
                        <span className="field-label">Description</span>
                        <textarea name="description" rows={2} defaultValue={category.description} className="field h-auto py-2 text-[0.75rem]" />
                      </label>
                    </div>
                    <AdminField label="Custom link (optional)" name="href" defaultValue={category.href} hint="e.g. /wholesale" />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <a href={`/category/${category.slug}`} target="_blank" className="inline-flex items-center gap-1 text-[0.58rem] font-semibold text-navy/45 hover:text-gold-deep">
                      View <ArrowUpRight className="size-3" />
                    </a>
                    <div className="flex gap-2">
                      <button type="submit" className="h-8 bg-navy px-3 text-[0.55rem] font-bold uppercase tracking-[0.08em] text-ivory">Save</button>
                    </div>
                  </div>
                </form>
                <form action={deleteCategoryAction} className="bg-ivory/40 px-5 pb-4">
                  <input type="hidden" name="id" value={category.id} />
                  <button
                    type="submit"
                    disabled={catCount(category.slug) > 0}
                    className="text-[0.58rem] font-semibold text-red-600/70 underline underline-offset-2 disabled:cursor-not-allowed disabled:text-navy/20 disabled:no-underline"
                  >
                    {catCount(category.slug) > 0 ? "Move products before deleting" : "Delete category"}
                  </button>
                </form>
              </details>
            ))}
          </div>

          <div className="border-t border-navy/10 bg-ivory/50 p-5">
            <p className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-gold-deep">
              <Plus className="size-3.5" /> New category
            </p>
            <form action={saveCategoryAction} className="mt-3 grid gap-3 sm:grid-cols-2">
              <AdminField label="Name" name="name" required placeholder="Cooking oils" />
              <AdminField label="Tagline" name="tagline" placeholder="For the everyday kitchen" />
              <AdminField label="Image URL" name="image" placeholder="/products/mamador-vegetable-oil-1l.webp" />
              <AdminField label="Order" name="order" type="number" placeholder="12" />
              <label className="block sm:col-span-2">
                <span className="field-label">Or upload image</span>
                <input type="file" name="imageFile" accept="image/*" className="block w-full text-[0.68rem] text-navy/50 file:mr-3 file:border-0 file:bg-navy file:px-3 file:py-2 file:text-[0.58rem] file:font-semibold file:text-ivory" />
              </label>
              <div className="sm:col-span-2">
                <label className="block">
                  <span className="field-label">Description</span>
                  <textarea name="description" rows={2} className="field h-auto py-2 text-[0.75rem]" />
                </label>
              </div>
              <button type="submit" className="h-9 bg-gold text-[0.58rem] font-bold uppercase tracking-[0.1em] text-navy">Create category</button>
            </form>
          </div>
        </AdminCard>

        <AdminCard title={`Brands (${brands.length})`}>
          <div className="divide-y divide-navy/8">
            {brands.map((brand) => (
              <details key={brand.id} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 hover:bg-ivory/50">
                  <span>
                    <span className="block text-[0.76rem] font-semibold text-navy">{brand.name}</span>
                    <span className="block text-[0.56rem] text-navy/35">
                      /{brand.slug} · {brandCount(brand.slug)} products
                    </span>
                  </span>
                  <span className="text-[0.58rem] text-gold-deep group-open:hidden">Edit</span>
                  <span className="hidden text-[0.58rem] text-gold-deep group-open:block">Close</span>
                </summary>
                <form action={saveBrandAction} className="space-y-3 bg-ivory/40 px-5 py-4">
                  <input type="hidden" name="id" value={brand.id} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <AdminField label="Name" name="name" defaultValue={brand.name} required />
                    <AdminField label="Slug" name="slug" defaultValue={brand.slug} />
                    <AdminField label="Note" name="note" defaultValue={brand.note} placeholder="Dairy" />
                    <AdminField label="Order" name="order" type="number" defaultValue={brand.order} />
                  </div>
                  <button type="submit" className="h-8 bg-navy px-3 text-[0.55rem] font-bold uppercase tracking-[0.08em] text-ivory">Save</button>
                </form>
                <form action={deleteBrandAction} className="bg-ivory/40 px-5 pb-4">
                  <input type="hidden" name="id" value={brand.id} />
                  <button
                    type="submit"
                    disabled={brandCount(brand.slug) > 0}
                    className="text-[0.58rem] font-semibold text-red-600/70 underline underline-offset-2 disabled:cursor-not-allowed disabled:text-navy/20 disabled:no-underline"
                  >
                    {brandCount(brand.slug) > 0 ? "Reassign products before deleting" : "Delete brand"}
                  </button>
                </form>
              </details>
            ))}
          </div>

          <div className="border-t border-navy/10 bg-ivory/50 p-5">
            <p className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-gold-deep">
              <Plus className="size-3.5" /> New brand
            </p>
            <form action={saveBrandAction} className="mt-3 grid gap-3 sm:grid-cols-2">
              <AdminField label="Name" name="name" required placeholder="Brand name" />
              <AdminField label="Note" name="note" placeholder="Category / descriptor" />
              <AdminField label="Order" name="order" type="number" placeholder="50" />
              <div className="flex items-end">
                <button type="submit" className="h-10 w-full bg-gold text-[0.58rem] font-bold uppercase tracking-[0.1em] text-navy">Create brand</button>
              </div>
            </form>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
