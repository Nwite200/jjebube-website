"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Pencil, Search, Star, Trash2 } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/product-image";
import { formatNaira, stockLabel } from "@/lib/utils";
import { deleteProductAction, toggleFeaturedAction } from "@/app/admin/actions";

export function ProductsTable({
  products,
  brands,
  categories,
}: {
  products: Product[];
  brands: { slug: string; name: string }[];
  categories: { slug: string; name: string }[];
}) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  const brandName = useMemo(() => new Map(brands.map((b) => [b.slug, b.name])), [brands]);
  const categoryName = useMemo(() => new Map(categories.map((c) => [c.slug, c.name])), [categories]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (q) {
        const hay = `${p.name} ${p.sku} ${brandName.get(p.brandSlug)}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      if (category && p.categorySlug !== category) return false;
      if (stock === "low" && !(p.stock > 0 && p.stock <= 8)) return false;
      if (stock === "out" && p.stock > 0) return false;
      if (stock === "in" && p.stock <= 0) return false;
      return true;
    });
  }, [products, q, category, stock, brandName]);

  return (
    <div className="border border-navy/10 bg-white">
      <div className="flex flex-col gap-3 border-b border-navy/8 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-navy/30" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, brand or SKU"
            className="field h-9 pl-9 text-[0.78rem]"
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="field h-9 w-auto text-[0.72rem]">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={stock} onChange={(e) => setStock(e.target.value)} className="field h-9 w-auto text-[0.72rem]">
          <option value="">All stock</option>
          <option value="in">In stock</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>
        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-navy/35">
          {filtered.length} of {products.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left">
          <thead>
            <tr className="border-b border-navy/8 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-navy/35">
              <th className="px-4 py-2.5">Product</th>
              <th className="px-3 py-2.5">Brand</th>
              <th className="px-3 py-2.5">Category</th>
              <th className="px-3 py-2.5">Price</th>
              <th className="px-3 py-2.5">Stock</th>
              <th className="px-3 py-2.5">Featured</th>
              <th className="px-4 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/6">
            {filtered.map((p) => {
              const s = stockLabel(p.stock);
              return (
                <tr key={p.id} className="text-[0.72rem] transition hover:bg-ivory/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative size-11 shrink-0 overflow-hidden border border-navy/8 bg-ivory">
                        <ProductImage src={p.image} alt={p.name} brand={p.brandSlug} sizes="44px" />
                      </span>
                      <span className="min-w-0 max-w-[260px]">
                        <span className="block truncate font-semibold text-navy">{p.name}</span>
                        <span className="block text-[0.58rem] text-navy/35">
                          {p.packSize} · {p.sku}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-navy/55">{brandName.get(p.brandSlug) ?? p.brandSlug}</td>
                  <td className="px-3 py-3 text-navy/55">{categoryName.get(p.categorySlug) ?? p.categorySlug}</td>
                  <td className="px-3 py-3 font-semibold text-navy">
                    {p.price !== null ? formatNaira(p.price) : <span className="text-[0.62rem] italic text-navy/35">On request</span>}
                  </td>
                  <td className="px-3 py-3">
                    {p.price === null && p.stock === 0 ? (
                      <span className="text-[0.62rem] italic text-navy/35">On request</span>
                    ) : (
                      <span className={s.tone === "out" ? "font-semibold text-red-600" : s.tone === "low" ? "font-semibold text-amber-700" : "text-navy/55"}>
                        {p.stock}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <form action={toggleFeaturedAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" aria-label={p.featured ? "Unfeature" : "Feature"} className={p.featured ? "text-gold-deep" : "text-navy/20 hover:text-gold-deep"}>
                        <Star className={`size-4 ${p.featured ? "fill-gold-deep" : ""}`} />
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/product/${p.slug}`} target="_blank" className="flex size-7 items-center justify-center text-navy/35 hover:text-navy" aria-label="View product">
                        <ArrowUpRight className="size-3.5" />
                      </Link>
                      <Link href={`/admin/products/${p.id}`} className="flex size-7 items-center justify-center text-navy/35 hover:text-gold-deep" aria-label="Edit product">
                        <Pencil className="size-3.5" />
                      </Link>
                      <form
                        action={deleteProductAction}
                        onSubmit={(e) => {
                          if (!window.confirm(`Delete “${p.name}”? This cannot be undone.`)) e.preventDefault();
                        }}
                      >
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="flex size-7 items-center justify-center text-navy/25 hover:text-red-600" aria-label="Delete product">
                          <Trash2 className="size-3.5" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-12 text-center text-[0.75rem] text-navy/35">No products match those filters.</p>
        )}
      </div>
    </div>
  );
}
