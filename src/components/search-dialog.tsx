"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useStoreData } from "./store-provider";
import { useUIStore } from "@/lib/store";
import { ProductImage } from "./product-image";
import { formatNaira } from "@/lib/utils";

const POPULAR = ["Milk", "Tea", "Seasoning", "Noodles", "Sugar", "Cocoa"];

export function SearchDialog() {
  const open = useUIStore((s) => s.searchOpen);
  const close = useUIStore((s) => s.closeSearch);
  const { products } = useStoreData();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const matched = products.filter((p) => {
      const haystack = `${p.name} ${p.brand} ${p.categorySlug} ${p.packSize} ${p.sku}`.toLowerCase();
      return q.split(/\s+/).every((term) => haystack.includes(term));
    });
    return matched
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
        const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
        return aStarts - bStarts || a.name.localeCompare(b.name);
      })
      .slice(0, 8);
  }, [query, products]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Search products">
      <button
        type="button"
        aria-label="Close search"
        onClick={close}
        className="absolute inset-0 cursor-default bg-navy/60 backdrop-blur-[3px]"
      />
      <div className="container-edge relative mx-auto mt-[8vh] max-w-3xl">
        <div className="animate-float-in overflow-hidden bg-ivory shadow-[0_40px_100px_-20px_rgba(4,17,39,0.65)]">
          <div className="flex items-center gap-4 border-b border-navy/10 px-5 py-4 md:px-7 md:py-5">
            <Search className="size-5 shrink-0 text-gold-deep" strokeWidth={1.8} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search milk, tea, seasoning, brands…"
              className="h-9 w-full bg-transparent font-display text-lg text-navy outline-none placeholder:font-sans placeholder:text-sm placeholder:font-medium placeholder:text-navy/40 md:text-xl"
              aria-label="Search products"
            />
            <button
              type="button"
              onClick={close}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-navy/50 transition hover:bg-navy/5 hover:text-navy"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="max-h-[58vh] overflow-y-auto">
            {query.trim() === "" ? (
              <div className="p-6 md:p-8">
                <p className="eyebrow text-navy/40">Popular right now</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {POPULAR.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="border border-navy/12 bg-white px-4 py-2 text-xs font-semibold text-navy transition hover:border-gold hover:bg-gold/5"
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <div className="mt-8 grid gap-2 sm:grid-cols-2">
                  <Link
                    href="/shop"
                    onClick={close}
                    className="group flex items-center justify-between border border-navy/10 bg-white px-5 py-4 transition hover:border-gold/60"
                  >
                    <span>
                      <span className="block text-[0.6rem] font-bold uppercase tracking-[0.18em] text-gold-deep">
                        Browse
                      </span>
                      <span className="mt-1 block font-display text-lg text-navy">Shop all products</span>
                    </span>
                    <ArrowUpRight className="size-4 text-navy/40 transition group-hover:text-gold-deep" />
                  </Link>
                  <Link
                    href="/wholesale"
                    onClick={close}
                    className="group flex items-center justify-between border border-navy/10 bg-white px-5 py-4 transition hover:border-gold/60"
                  >
                    <span>
                      <span className="block text-[0.6rem] font-bold uppercase tracking-[0.18em] text-gold-deep">
                        Business
                      </span>
                      <span className="mt-1 block font-display text-lg text-navy">Wholesale enquiries</span>
                    </span>
                    <ArrowUpRight className="size-4 text-navy/40 transition group-hover:text-gold-deep" />
                  </Link>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="px-6 py-12 text-center md:px-8">
                <p className="font-display text-xl text-navy">No products match “{query}”.</p>
                <p className="mt-2 text-sm text-navy/55">
                  Try a brand, a product type or a pack size — or ask us on WhatsApp and we&apos;ll check stock.
                </p>
                <Link href="/shop" onClick={close} className="link-underline mt-5 text-navy">
                  Browse the full shop <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-navy/8">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={close}
                      className="group flex items-center gap-4 px-4 py-3.5 transition hover:bg-white md:px-6"
                    >
                      <span className="relative size-16 shrink-0 overflow-hidden border border-navy/8 bg-white">
                        <ProductImage
                          src={product.image}
                          alt={product.name}
                          brand={product.brand}
                          sizes="64px"
                          imageClassName="group-hover:scale-105"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.56rem] font-bold uppercase tracking-[0.16em] text-gold-deep">
                          {product.brand}
                        </span>
                        <span className="mt-0.5 block truncate text-sm font-semibold text-navy">
                          {product.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-navy/45">
                          {product.packSize} · {product.categorySlug.replace(/-/g, " ")}
                        </span>
                      </span>
                      <span className="shrink-0 text-right text-sm font-semibold text-navy">
                        {product.price !== null ? formatNaira(product.price) : "On request"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-navy/10 bg-white/60 px-5 py-3 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-navy/40 md:px-7">
            <span>Real products. Real stock.</span>
            <span className="hidden sm:inline">Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
