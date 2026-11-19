"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Heart,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type { ClientProduct } from "@/lib/catalog-view";
import { ProductImage } from "@/components/product-image";
import { Money } from "@/components/money";
import { useCartStore, useUIStore, useWishlistStore } from "@/lib/store";
import { cn, formatNaira, stockLabel, whatsappUrl } from "@/lib/utils";

export function ProductDetail({ product, whatsapp }: { product: ClientProduct; whatsapp: string }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const add = useCartStore((s) => s.add);
  const saved = useWishlistStore((s) => s.ids.includes(product.id));
  const toggleWish = useWishlistStore((s) => s.toggle);
  const pushToast = useUIStore((s) => s.pushToast);
  const stock = stockLabel(product.stock);
  const images = [product.image, ...product.gallery].filter(Boolean);
  const isOut = product.stock <= 0;
  const canBuy = product.price !== null && !isOut;

  const waMessage = `Hello JJ Ebube Enterprise, I'd like to ask about:\n\n${product.name}\nPack size: ${product.packSize}\nBrand: ${product.brand}\nQuantity: ${quantity}\n\nPlease confirm availability and price.`;

  function addToBag() {
    if (!canBuy) return;
    add(product.id, quantity);
    setAdded(true);
    pushToast({
      title: "Added to your cart.",
      message: `${quantity} × ${product.name} · ${product.packSize}`,
      href: "/checkout",
      actionLabel: "Checkout →",
    });
    window.setTimeout(() => setAdded(false), 1800);
  }

  function buyNow() {
    if (!canBuy) return;
    add(product.id, quantity);
    router.push("/checkout");
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
      <div className="lg:sticky lg:top-[150px] lg:self-start">
        <div className="relative overflow-hidden border border-navy/8 bg-white">
          <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-navy px-2.5 py-1 text-[0.5rem] font-extrabold uppercase tracking-[0.14em] text-gold-soft">
                New in
              </span>
            )}
            {product.tags.includes("bestseller") && (
              <span className="bg-white/95 px-2.5 py-1 text-[0.5rem] font-extrabold uppercase tracking-[0.14em] text-navy ring-1 ring-navy/10">
                Bestseller
              </span>
            )}
          </div>
          <div className="group relative aspect-square">
            <ProductImage
              src={images[activeImage] ?? product.image}
              alt={`${product.name} — ${product.packSize}`}
              brand={product.brand}
              sizes="(max-width: 1024px) 100vw, 48vw"
              priority
              padded={false}
              imageClassName="p-6 md:p-10 duration-700 group-hover:scale-[1.035]"
            />
          </div>
          <span className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1.5 border border-navy/8 bg-white/85 px-2.5 py-1.5 text-[0.52rem] font-bold uppercase tracking-[0.12em] text-navy/40 backdrop-blur">
            <ArrowUpRight className="size-3" /> Hover to zoom
          </span>
        </div>

        {images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {images.map((img, i) => (
              <button
                key={`${img}-${i}`}
                type="button"
                onClick={() => setActiveImage(i)}
                className={cn(
                  "relative size-20 overflow-hidden border bg-white transition",
                  activeImage === i ? "border-gold" : "border-navy/10 hover:border-navy/30",
                )}
                aria-label={`View image ${i + 1}`}
              >
                <ProductImage src={img} alt={`${product.name} view ${i + 1}`} brand={product.brand} sizes="80px" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-3 grid grid-cols-3 border border-navy/8 bg-white">
          {[
            { icon: ShieldCheck, label: "Genuine product" },
            { icon: Truck, label: "Nationwide delivery" },
            { icon: Package, label: "Bulk available" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 border-r border-navy/8 px-2 py-3.5 text-center last:border-r-0">
              <Icon className="size-4 text-gold-deep" strokeWidth={1.6} />
              <span className="text-[0.52rem] font-semibold uppercase tracking-[0.08em] text-navy/45">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/brands/${product.brandSlug}`}
              className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-gold-deep transition hover:text-navy"
            >
              {product.brand}
            </Link>
            <h1 className="mt-2 font-display text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.08] text-navy">
              {product.name}
            </h1>
            <p className="mt-2 text-[0.82rem] text-navy/45">
              {product.packSize} · per {product.unit} · SKU {product.sku}
            </p>
          </div>
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
            className={cn(
              "mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border transition",
              saved ? "border-gold bg-gold/10 text-gold-deep" : "border-navy/15 text-navy/45 hover:border-gold hover:text-gold-deep",
            )}
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          >
            <Heart className={cn("size-4", saved && "fill-gold-deep")} strokeWidth={1.7} />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em]",
              stock.tone === "in" && "text-emerald-700",
              stock.tone === "low" && "text-amber-700",
              stock.tone === "out" && "text-red-600",
            )}
          >
            <span className={cn("size-1.5 rounded-full", stock.tone === "in" && "bg-emerald-600", stock.tone === "low" && "bg-amber-500", stock.tone === "out" && "bg-red-500")} />
            {stock.label}
          </span>
          <span className="h-3 w-px bg-navy/15" />
          <span className="text-[0.65rem] font-medium text-navy/40">Sold in {product.unit}s</span>
        </div>

        <div className="mt-6 flex items-end gap-4 border-y border-navy/10 py-5">
          <div>
            <p className="text-[0.55rem] font-bold uppercase tracking-[0.16em] text-navy/35">
              {product.price !== null ? "Price" : "Pricing"}
            </p>
            <Money
              value={product.price}
              className={cn("mt-1 block font-display text-[2rem] leading-none text-navy md:text-[2.3rem]", product.price === null && "text-[1.35rem] italic text-navy/55")}
            />
          </div>
          {product.compareAtPrice && product.price !== null && product.compareAtPrice > product.price && (
            <p className="pb-1 text-sm text-navy/35 line-through">{formatNaira(product.compareAtPrice)}</p>
          )}
          {product.wholesalePrice !== null && (
            <p className="ml-auto pb-1 text-right text-[0.65rem] text-navy/45">
              Wholesale <span className="block font-bold text-navy">{formatNaira(product.wholesalePrice)}</span>
            </p>
          )}
        </div>

        {product.price === null && (
          <p className="mt-3 border border-gold/25 bg-gold/5 px-4 py-3 text-[0.72rem] leading-relaxed text-navy/60">
            This pack is available to order, but its online price hasn&apos;t been published yet. Send us a message
            and we&apos;ll confirm the current price and availability.
          </p>
        )}

        <div className="mt-6">
          <p className="field-label">Quantity</p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 items-center border border-navy/15 bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex size-12 items-center justify-center text-navy/60 transition hover:text-navy"
                aria-label="Decrease quantity"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="w-9 text-center text-sm font-bold text-navy">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                className="flex size-12 items-center justify-center text-navy/60 transition hover:text-navy disabled:opacity-30"
                disabled={quantity >= product.stock}
                aria-label="Increase quantity"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
            <p className="text-[0.68rem] text-navy/40">
              {product.stock > 0 ? `${product.stock} ${product.unit}${product.stock === 1 ? "" : "s"} available` : "Currently out of stock"}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {canBuy ? (
            <button type="button" onClick={addToBag} className={cn("btn h-12 w-full", added ? "gold-pulse btn-navy" : "btn-gold")}>
              {added ? (
                <>
                  <Check className="size-4" strokeWidth={3} /> Added to bag
                </>
              ) : (
                <>
                  <ShoppingBag className="size-4" /> Add to bag
                </>
              )}
            </button>
          ) : (
            <a href="#enquire" className="btn btn-navy h-12 w-full">
              {isOut ? "Ask about restock" : "Request price"} <ArrowUpRight className="size-4" />
            </a>
          )}
          {canBuy && (
            <button type="button" onClick={buyNow} className="btn btn-outline h-12 w-full">
              Buy now <ArrowUpRight className="size-4" />
            </button>
          )}
        </div>

        <a
          id="enquire"
          href={whatsappUrl(whatsapp, waMessage)}
          target="_blank"
          rel="noreferrer"
          className="mt-2.5 flex h-11 w-full items-center justify-center gap-2 border border-[#1FA855]/30 bg-[#1FA855]/5 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-[#137a3c] transition hover:border-[#1FA855]/60 hover:bg-[#1FA855]/10"
        >
          <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
            <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2 22l5.36-1.41a9.86 9.86 0 0 0 4.68 1.19h.01c5.43 0 9.85-4.42 9.85-9.86S17.47 2 12.04 2Zm0 18.02h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.15 8.15 0 0 1-1.25-4.32c0-4.5 3.67-8.16 8.2-8.16a8.16 8.16 0 0 1 8.17 8.17c0 4.5-3.67 8.15-8.17 8.15Zm4.47-6.1c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
          </svg>
          Ask about this product on WhatsApp
        </a>

        <div className="mt-8 border-t border-navy/10">
          <Detail title="Product description" defaultOpen>
            <p className="text-[0.82rem] leading-relaxed text-navy/55">{product.description}</p>
            {product.details.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {product.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-[0.78rem] text-navy/55">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-gold-deep" strokeWidth={2} />
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </Detail>
          <Detail title="Delivery & collection">
            <p className="text-[0.8rem] leading-relaxed text-navy/55">
              We deliver across Nigeria. Delivery is calculated at checkout based on your location, and larger or
              bulk orders may be quoted separately. You can also arrange pickup from our store.
            </p>
          </Detail>
          <Detail title="Wholesale & bulk pricing">
            <p className="text-[0.8rem] leading-relaxed text-navy/55">
              Buying this product in cartons? Send your quantity and delivery location through our{" "}
              <Link href="/wholesale" className="font-semibold text-navy underline decoration-gold underline-offset-2">
                wholesale enquiry form
              </Link>{" "}
              for business pricing.
            </p>
          </Detail>
        </div>
      </div>
    </div>
  );
}

function Detail({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-navy/10 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[0.72rem] font-bold uppercase tracking-[0.12em] text-navy">
        {title}
        <ChevronDown className="size-4 text-navy/35 transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <div className="pt-3">{children}</div>
    </details>
  );
}
