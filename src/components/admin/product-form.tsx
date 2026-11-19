import { AdminField, AdminPageHeader, AdminTextarea } from "@/components/admin/ui";
import { saveProductAction } from "@/app/admin/actions";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/product-image";

export function ProductForm({
  product,
  brands,
  categories,
}: {
  product?: Product;
  brands: { slug: string; name: string }[];
  categories: { slug: string; name: string }[];
}) {
  return (
    <form action={saveProductAction} encType="multipart/form-data">
      {product && <input type="hidden" name="id" value={product.id} />}
      <AdminPageHeader
        eyebrow={product ? "Edit product" : "New product"}
        title={product ? product.name : "Add a product"}
        description="Everything here can be changed at any time. Prices left blank show as “Price on request” on the storefront."
        action={
          <div className="flex gap-2">
            <a href="/admin/products" className="btn btn-outline h-10 text-[0.62rem]">
              Cancel
            </a>
            <button type="submit" className="btn btn-navy h-10 text-[0.62rem]">
              Save product
            </button>
          </div>
        }
      />

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <section className="border border-navy/10 bg-white p-5">
            <h2 className="font-display text-lg text-navy">Product details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <AdminField label="Product name" name="name" defaultValue={product?.name} required placeholder="Dano Cool Cow Instant Filled Milk Powder" />
              </div>
              <AdminField
                label="URL slug"
                name="slug"
                defaultValue={product?.slug}
                placeholder="dano-cool-cow-1kg"
                hint="Leave blank to generate from the name"
              />
              <AdminField label="SKU" name="sku" defaultValue={product?.sku} placeholder="JJE-DAN-1KG" />
              <label className="block">
                <span className="field-label">Brand</span>
                <select name="brandSlug" defaultValue={product?.brandSlug ?? brands[0]?.slug} className="field h-10 text-[0.8rem]">
                  {brands.map((b) => (
                    <option key={b.slug} value={b.slug}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="field-label">Category</span>
                <select name="categorySlug" defaultValue={product?.categorySlug ?? categories[0]?.slug} className="field h-10 text-[0.8rem]">
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <AdminField label="Pack size" name="packSize" defaultValue={product?.packSize} required placeholder="1kg" />
              <AdminField label="Selling unit" name="unit" defaultValue={product?.unit ?? "pack"} required placeholder="tin / box / carton" />
            </div>
          </section>

          <section className="border border-navy/10 bg-white p-5">
            <h2 className="font-display text-lg text-navy">Pricing &amp; stock</h2>
            <p className="mt-1 text-[0.66rem] text-navy/40">
              Never enter a price you haven&apos;t verified. Leave blank to show “Price on request”.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <AdminField label="Retail price (₦)" name="price" type="number" step="1" defaultValue={product?.price ?? ""} placeholder="3800" />
              <AdminField
                label="Compare-at price (₦)"
                name="compareAtPrice"
                type="number"
                step="1"
                defaultValue={product?.compareAtPrice ?? ""}
                hint="Only if a genuine higher price applies"
              />
              <AdminField label="Wholesale price (₦)" name="wholesalePrice" type="number" step="1" defaultValue={product?.wholesalePrice ?? ""} />
              <AdminField label="Stock quantity" name="stock" type="number" step="1" defaultValue={product?.stock ?? 0} />
            </div>
            <div className="mt-4 flex flex-wrap gap-5">
              <label className="flex items-center gap-2 text-[0.75rem] text-navy/65">
                <input type="checkbox" name="featured" defaultChecked={product?.featured} className="size-4 accent-[#d9ac42]" />
                Feature on homepage
              </label>
              <label className="flex items-center gap-2 text-[0.75rem] text-navy/65">
                <input type="checkbox" name="isNew" defaultChecked={product?.isNew} className="size-4 accent-[#d9ac42]" />
                Mark as new arrival
              </label>
            </div>
          </section>

          <section className="border border-navy/10 bg-white p-5">
            <h2 className="font-display text-lg text-navy">Description &amp; details</h2>
            <div className="mt-4 space-y-4">
              <AdminTextarea label="Short description" name="description" defaultValue={product?.description} rows={4} />
              <AdminTextarea
                label="Product details"
                name="details"
                defaultValue={product?.details.join("\n")}
                rows={4}
                hint="One detail per line"
              />
              <AdminField
                label="Tags"
                name="tags"
                defaultValue={product?.tags.join(", ")}
                placeholder="dairy, bestseller"
                hint="Comma separated. “bestseller” and “wholesale” control card badges."
              />
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="border border-navy/10 bg-white p-5">
            <h2 className="font-display text-lg text-navy">Product image</h2>
            <div className="mt-3 aspect-square border border-navy/8 bg-ivory">
              <ProductImage src={product?.image ?? ""} alt={product?.name ?? "Product image"} brand={product?.brandSlug} sizes="320px" />
            </div>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="field-label">Image URL</span>
                <input
                  name="imageUrl"
                  defaultValue={product?.image}
                  placeholder="/products/dano-cool-cow-1kg.webp"
                  className="field h-10 text-[0.76rem]"
                />
              </label>
              <label className="block">
                <span className="field-label">Or upload an image</span>
                <input type="file" name="imageFile" accept="image/*" className="block w-full text-[0.7rem] text-navy/50 file:mr-3 file:border-0 file:bg-navy file:px-3 file:py-2 file:text-[0.62rem] file:font-semibold file:text-ivory" />
                <span className="mt-1 block text-[0.6rem] text-navy/35">JPG, PNG, WebP up to 4MB.</span>
              </label>
            </div>
          </section>

          <section className="border border-navy/10 bg-white p-5">
            <h2 className="font-display text-lg text-navy">Gallery</h2>
            <p className="mt-1 text-[0.65rem] text-navy/40">Optional additional images, one URL per line.</p>
            <textarea
              name="gallery"
              rows={5}
              defaultValue={product?.gallery.join("\n")}
              className="field mt-3 h-auto py-2.5 text-[0.75rem]"
            />
          </section>

          <div className="flex flex-col gap-2 border border-navy/10 bg-white p-5">
            <button type="submit" className="btn btn-navy w-full">
              Save product
            </button>
            <p className="text-center text-[0.62rem] text-navy/35">Changes go live immediately after saving.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
