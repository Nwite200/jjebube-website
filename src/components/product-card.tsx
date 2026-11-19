"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Heart, Plus, ShoppingBag } from "lucide-react";
import type { ClientProduct } from "@/lib/catalog-view";
import { cn, formatNaira, stockLabel } from "@/lib/utils";
import { useCartStore, useUIStore, useWishlistStore } from "@/lib/store";
import { ProductImage } from "./product-image";

export function ProductCard({
  product,
  priority = false,
  compact = false,
}: {
  product: ClientProduct;
  priority?: boolean;
  compact?: boolean;
}) {
  const add = useCartStore((s) => s.add);
  const saved = useWishlistStore((s) => s.ids.includes(product.id));
  const toggleWish = useWishlistStore((s) => s.toggle);
  const pushToast = useUIStore((s) => s.pushToast);
  const [added, setAdded] = useState(false);

  const stock = stockLabel(product.stock);
  const isOut = product.stock <= 0;
  const canBuy = product.price !== null && !isOut;
  const badge = product.isNew
    ? "New in"
    : product.tags.includes("bestseller")
      ? "Bestseller"
      : product.tags.includes("wholesale")
        ? "Wholesale"
        : null;

  function handleAdd() {
    if (!canBuy || product.price === null) return;
    add(product.id, 1);
    setAdded(true);
    pushToast({
      title: "Added to your cart.",
      message: `${product.name} · ${product.packSize}`,
      href: "/checkout",
      actionLabel: "View bag →",
    });
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col border border-navy/8 bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-gold/45 hover:shadow-[0_26px_50px_-26px_rgba(7,26,58,0.3)]",
      )}
    >
      <div className="relative overflow-hidden bg-white">
        <Link
          href={`/product/${product.slug}`}
          className={cn("relative block", compact ? "aspect-square" : "aspect-[4/3.7]")}
          aria-label={product.name}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-6">
            <ProductImage
              src={product.image}
              alt={`${product.name} ${product.packSize}`}
              brand={product.brand}
              priority={priority}
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
              imageClassName="group-hover:scale-[1.06]"
            />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>

        {badge && (
          <span
            className={cn(
              "absolute left-3 top-3 z-10 px-2.5 py-1 text-[0.5rem] font-extrabold uppercase tracking-[0.14em]",
              badge === "New in"
                ? "bg-navy text-gold-soft"
                : badge === "Wholesale"
                  ? "bg-gold-soft text-navy"
                  : "bg-white/95 text-navy ring-1 ring-navy/10",
            )}
          >
            {badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => {
            toggleWish(product.id);
            pushToast({
              title: saved ? "Removed from wishlist" : "Saved to wishlist",
              message: product.name,
              href: "/wishlist",
              actionLabel: "View wishlist →",
            });
          }}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={cn(
            "absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full border bg-white/90 backdrop-blur transition-all duration-300",
            saved
              ? "border-gold text-gold-deep"
              : "border-navy/10 text-navy/45 hover:border-gold hover:text-gold-deep",
          )}
        >
          <Heart className={cn("size-3.5", saved && "fill-gold-deep")} strokeWidth={1.8} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[0.54rem] font-extrabold uppercase tracking-[0.16em] text-gold-deep">
            {product.brand}
          </p>
          <span
            className={cn(
              "flex shrink-0 items-center gap-1 text-[0.56rem] font-semibold",
              stock.tone === "in" && "text-emerald-700/80",
              stock.tone === "low" && "text-amber-700",
              stock.tone === "out" && "text-red-600/80",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                stock.tone === "in" && "bg-emerald-600",
                stock.tone === "low" && "bg-amber-500",
                stock.tone === "out" && "bg-red-500",
              )}
            />
            {stock.label}
          </span>
        </div>

        <Link
          href={`/product/${product.slug}`}
          className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-[0.84rem] font-semibold leading-[1.4] text-navy transition-colors duration-300 hover:text-gold-deep md:text-[0.9rem]"
        >
          {product.name}
        </Link>

        <p className="mt-1 text-[0.68rem] text-navy/45">
          {product.packSize} · per {product.unit}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className={cn("text-[0.95rem] font-bold tracking-tight text-navy md:text-base", product.price === null && "text-[0.72rem] font-medium italic text-navy/45")}>
                {formatNaira(product.price)}
              </p>
              {product.compareAtPrice && product.price !== null && product.compareAtPrice > product.price && (
                <p className="text-[0.65rem] text-navy/35 line-through">{formatNaira(product.compareAtPrice)}</p>
              )}
            </div>
          </div>

          {canBuy ? (
            <button
              type="button"
              onClick={handleAdd}
              className={cn(
                "mt-3 flex h-10 w-full items-center justify-center gap-2 text-[0.62rem] font-extrabold uppercase tracking-[0.12em] transition-all duration-300",
                added
                  ? "gold-pulse bg-navy text-gold-soft"
                  : "bg-gold text-navy hover:bg-navy hover:text-gold-soft",
              )}
              aria-label={`Add ${product.name} to bag`}
            >
              {added ? (
                <>
                  <Check className="size-3.5" strokeWidth={3} /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="size-3.5" strokeWidth={2} /> Add to bag
                </>
              )}
            </button>
          ) : (
            <Link
              href={`/product/${product.slug}#enquire`}
              className="mt-3 flex h-10 w-full items-center justify-center gap-2 border border-navy/15 text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-navy transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-ivory"
            >
              {isOut ? "Out of stock" : "Request price"} <Plus className="size-3.5" />
            </Link>
          )}
        </div>
      </div>

    </article>
  );
}
