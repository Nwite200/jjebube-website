"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import type { ClientProduct } from "@/lib/catalog-view";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

const PRICE_RANGES = [
  { id: "under-2000", label: "Under ₦2,000", min: 0, max: 2000 },
  { id: "2000-5000", label: "₦2,000 – ₦5,000", min: 2000, max: 5000 },
  { id: "5000-10000", label: "₦5,000 – ₦10,000", min: 5000, max: 10000 },
  { id: "over-10000", label: "Over ₦10,000", min: 10000, max: Infinity },
];

const SORTS = [
  { id: "popular", label: "Popular" },
  { id: "newest", label: "New arrivals" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Alphabetical" },
];

type Props = {
  products: ClientProduct[];
  categories: { slug: string; name: string }[];
  brands: { slug: string; name: string }[];
  lockedCategory?: string;
  lockedBrand?: string;
  initialQuery?: string;
};

export function ShopClient({ products, categories, brands, lockedCategory, lockedBrand, initialQuery }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [cats, setCats] = useState<string[]>(
    lockedCategory ? [lockedCategory] : searchParams.get("category")?.split(",").filter(Boolean) ?? [],
  );
  const [brandSel, setBrandSel] = useState<string[]>(
    lockedBrand ? [lockedBrand] : searchParams.get("brand")?.split(",").filter(Boolean) ?? [],
  );
  const [range, setRange] = useState<string | null>(searchParams.get("price"));
  const [inStock, setInStock] = useState(searchParams.get("stock") === "in");
  const [sizes, setSizes] = useState<string[]>(searchParams.get("size")?.split(",").filter(Boolean) ?? []);
  const [sort, setSort] = useState(searchParams.get("sort") ?? "popular");
  const [query, setQuery] = useState(initialQuery ?? searchParams.get("q") ?? "");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");

  const sizeOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) counts.set(p.packSize, (counts.get(p.packSize) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([size]) => size);
  }, [products]);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) map.set(p.categorySlug, (map.get(p.categorySlug) ?? 0) + 1);
    return map;
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const priceRange = PRICE_RANGES.find((r) => r.id === range);
    let list = products.filter((p) => {
      if (cats.length && !cats.includes(p.categorySlug)) return false;
      if (brandSel.length && !brandSel.includes(p.brandSlug)) return false;
      if (inStock && p.stock <= 0) return false;
      if (sizes.length && !sizes.includes(p.packSize)) return false;
      if (priceRange) {
        if (p.price === null) return false;
        if (p.price < priceRange.min || p.price > priceRange.max) return false;
      }
      if (q) {
        const hay = `${p.name} ${p.brand} ${p.packSize} ${p.sku} ${p.categorySlug}`.toLowerCase();
        if (!q.split(/\s+/).every((t) => hay.includes(t))) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "newest") return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
      if (sort === "price-asc") return (a.price ?? Infinity) - (b.price ?? Infinity);
      if (sort === "price-desc") return (b.price ?? -1) - (a.price ?? -1);
      if (sort === "name") return a.name.localeCompare(b.name);
      const aScore = (a.featured ? 2 : 0) + (a.tags.includes("bestseller") ? 1 : 0);
      const bScore = (b.featured ? 2 : 0) + (b.tags.includes("bestseller") ? 1 : 0);
      return bScore - aScore || a.name.localeCompare(b.name);
    });
    return list;
  }, [products, cats, brandSel, inStock, sizes, range, query, sort]);

  useEffect(() => setVisible(PAGE_SIZE), [cats, brandSel, inStock, sizes, range, query, sort]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (cats.length && !lockedCategory) params.set("category", cats.join(","));
    if (brandSel.length && !lockedBrand) params.set("brand", brandSel.join(","));
    if (range) params.set("price", range);
    if (inStock) params.set("stock", "in");
    if (sizes.length) params.set("size", sizes.join(","));
    if (sort !== "popular") params.set("sort", sort);
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    const current = window.location.search.replace(/^\?/, "");
    if (qs !== current) {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }
  }, [cats, brandSel, range, inStock, sizes, sort, query, pathname, router, lockedCategory, lockedBrand]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const activeCount =
    (lockedCategory ? 0 : cats.length) +
    (lockedBrand ? 0 : brandSel.length) +
    (range ? 1 : 0) +
    (inStock ? 1 : 0) +
    sizes.length;

  function reset() {
    if (!lockedCategory) setCats([]);
    if (!lockedBrand) setBrandSel([]);
    setRange(null);
    setInStock(false);
    setSizes([]);
    setQuery("");
  }

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  const filterPanel = (
    <div className="space-y-7" data-brand-quick>
      <div className="flex items-center justify-between">
        <p className="eyebrow text-navy/40">Refine your shelf</p>
        {activeCount > 0 && (
          <button type="button" onClick={reset} className="text-[0.62rem] font-semibold text-gold-deep underline underline-offset-2">
            Clear all
          </button>
        )}
      </div>

      <div>
        <label htmlFor="shop-search" className="field-label">
          Search
        </label>
        <div className="relative">
          <input
            id="shop-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Product, brand or SKU"
            className="field h-10 pr-8 text-[0.8rem]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-navy/35"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {!lockedCategory && (
        <FilterGroup title="Category">
          <div className="space-y-2">
            {categories.map((c) => (
              <Check
                key={c.slug}
                label={c.name}
                count={categoryCounts.get(c.slug) ?? 0}
                checked={cats.includes(c.slug)}
                onChange={() => toggle(cats, c.slug, setCats)}
              />
            ))}
          </div>
        </FilterGroup>
      )}

      {!lockedBrand && (
        <FilterGroup title="Brand">
          <input
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            placeholder="Find a brand"
            className="field mb-3 h-9 text-[0.76rem]"
          />
          <div className="scrollbar-thin max-h-52 space-y-2 overflow-y-auto pr-1">
            {brands
              .filter((b) => b.name.toLowerCase().includes(brandSearch.toLowerCase()))
              .map((b) => (
                <Check
                  key={b.slug}
                  label={b.name}
                  checked={brandSel.includes(b.slug)}
                  onChange={() => toggle(brandSel, b.slug, setBrandSel)}
                />
              ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Price">
        <div className="space-y-2">
          {PRICE_RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(range === r.id ? null : r.id)}
              className={cn(
                "flex w-full items-center justify-between border px-3 py-2 text-left text-[0.75rem] transition",
                range === r.id
                  ? "border-gold bg-gold/10 font-semibold text-navy"
                  : "border-navy/10 text-navy/65 hover:border-navy/25",
              )}
            >
              {r.label}
              {range === r.id && <span className="size-1.5 rounded-full bg-gold-deep" />}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[0.62rem] text-navy/35">
          Products marked “Price on request” are excluded from price filters.
        </p>
      </FilterGroup>

      <FilterGroup title="Availability">
        <Check label="In stock only" checked={inStock} onChange={() => setInStock((v) => !v)} />
      </FilterGroup>

      {sizeOptions.length > 0 && (
        <FilterGroup title="Pack size">
          <div className="flex flex-wrap gap-1.5">
            {sizeOptions.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggle(sizes, size, setSizes)}
                className={cn(
                  "border px-2.5 py-1.5 text-[0.62rem] font-semibold transition",
                  sizes.includes(size)
                    ? "border-navy bg-navy text-ivory"
                    : "border-navy/12 text-navy/60 hover:border-navy/30",
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </FilterGroup>
      )}

      <div className="border border-gold/30 bg-[#fbf7ec] p-4">
        <p className="font-display text-[1.05rem] text-navy">Buying in bulk?</p>
        <p className="mt-1 text-[0.7rem] leading-relaxed text-navy/50">
          Carton pricing is available for shops and businesses.
        </p>
        <a
          href="/wholesale"
          className="mt-2.5 inline-block text-[0.62rem] font-bold uppercase tracking-[0.12em] text-gold-deep underline underline-offset-2"
        >
          Request a quote
        </a>
      </div>
    </div>
  );

  return (
    <div className="container-edge pb-20 pt-8 md:pt-10">
      <div className="grid gap-8 lg:grid-cols-[248px_1fr] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-[160px] max-h-[calc(100vh-190px)] overflow-y-auto pr-2 scrollbar-thin">{filterPanel}</div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/10 pb-4">
            <p className="text-[0.7rem] font-medium text-navy/45">
              Showing <span className="font-bold text-navy">{Math.min(visible, filtered.length)}</span> of{" "}
              <span className="font-bold text-navy">{filtered.length}</span> products
              {range && <span> · {PRICE_RANGES.find((r) => r.id === range)?.label}</span>}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-9 items-center gap-2 border border-navy/15 px-3 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-navy lg:hidden"
              >
                <SlidersHorizontal className="size-3.5" />
                Filters
                {activeCount > 0 && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-gold text-[0.5rem] text-navy">
                    {activeCount}
                  </span>
                )}
              </button>
              <div className="relative">
                <select
                  value={sort}
                  data-brand-quick
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort products"
                  className="h-9 appearance-none border border-navy/15 bg-white pl-3 pr-8 text-[0.68rem] font-semibold text-navy outline-none focus:border-gold"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-navy/45" />
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
              <p className="font-display text-3xl text-navy">Nothing on this shelf yet.</p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-navy/50">
                Try a broader filter or a different search. If you need a specific product, our team can check
                availability for you.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={reset} className="btn btn-navy h-11">
                  Clear filters
                </button>
                <a
                  href="https://wa.me/2347062129563?text=Hello%20JJ%20Ebube%20Enterprise%2C%20please%20help%20me%20find%20a%20product."
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline h-11"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {filtered.slice(0, visible).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {visible < filtered.length && (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <button type="button" data-brand-quick onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn btn-outline min-w-[220px]">
                    Load more products
                  </button>
                  <p className="text-[0.62rem] font-medium uppercase tracking-[0.12em] text-navy/35">
                    {filtered.length - visible} more to explore
                  </p>
                </div>
              )}

              {visible >= filtered.length && filtered.length > PAGE_SIZE && (
                <p className="mt-10 text-center text-[0.62rem] font-medium uppercase tracking-[0.14em] text-navy/30">
                  You&apos;ve reached the end of this collection
                </p>
              )}
            </>
          )}

          {!lockedBrand && (
            <div className="mt-16 border-t border-navy/10 pt-6">
              <p className="text-[0.7rem] text-navy/40">
                Looking for a specific pack or carton?{" "}
                <a href="/contact" className="font-semibold text-navy underline decoration-gold underline-offset-2">
                  Ask our team
                </a>{" "}
                — we&apos;ll confirm availability and pricing.
              </p>
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[88] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy/55 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close filters"
          />
          <div className="animate-float-in absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto bg-ivory p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-navy/10 pb-4">
              <h2 className="font-display text-xl text-navy">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex size-9 items-center justify-center border border-navy/10"
                aria-label="Close filters"
              >
                <X className="size-4" />
              </button>
            </div>
            {filterPanel}
            <button type="button" onClick={() => setMobileOpen(false)} className="btn btn-gold mt-6 w-full">
              Show {filtered.length} products
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-navy">{title}</h3>
      {children}
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  return (
    <button type="button" onClick={onChange} className="group flex w-full items-center gap-2.5 text-left">
      <span
        className={cn(
          "flex size-3.5 shrink-0 items-center justify-center border transition",
          checked ? "border-navy bg-navy text-ivory" : "border-navy/25 bg-white group-hover:border-navy/50",
        )}
      >
        {checked && (
          <svg viewBox="0 0 10 8" className="size-2 fill-none stroke-current" strokeWidth="1.8">
            <path d="M1 4 L3.7 6.7 L9 1" />
          </svg>
        )}
      </span>
      <span className={cn("flex-1 text-[0.76rem] transition", checked ? "font-semibold text-navy" : "text-navy/60 group-hover:text-navy")}>
        {label}
      </span>
      {count !== undefined && <span className="text-[0.6rem] text-navy/30">{count}</span>}
    </button>
  );
}
