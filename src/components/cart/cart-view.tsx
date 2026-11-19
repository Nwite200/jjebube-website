"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useCartDetails, useStoreData } from "@/components/store-provider";
import { ProductImage } from "@/components/product-image";
import { useCartStore } from "@/lib/store";
import { formatNaira, whatsappUrl } from "@/lib/utils";
import { Money } from "@/components/money";

export function CartView() {
  const { config } = useStoreData();
  const { lines, subtotal, count, hydrated } = useCartDetails();
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);

  if (!hydrated) {
    return (
      <div className="container-edge py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-28" />
            ))}
          </div>
          <div className="skeleton h-72" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-edge flex flex-col items-center justify-center py-20 text-center md:py-28">
        <span className="flex size-20 items-center justify-center rounded-full border border-gold/30 bg-white">
          <ShoppingBag className="size-7 text-gold-deep" strokeWidth={1.4} />
        </span>
        <h2 className="mt-7 font-display text-[2rem] text-navy">Your bag is waiting.</h2>
        <p className="mt-3 max-w-sm text-[0.9rem] leading-relaxed text-navy/50">
          Add a few everyday essentials and they&apos;ll appear here. Retail packs and bulk quantities are both
          available.
        </p>
        <Link href="/shop" className="btn btn-gold mt-7">
          Shop all products <ArrowRight className="size-4" />
        </Link>
        <Link href="/wholesale" className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-navy/50 underline decoration-gold underline-offset-4">
          Or make a wholesale enquiry
        </Link>
      </div>
    );
  }

  const remaining = Math.max(0, config.freeShippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / config.freeShippingThreshold) * 100);
  const waMessage = [
    "Hello JJ Ebube Enterprise, I would like to order:",
    "",
    ...lines.map(
      (line, i) =>
        `${i + 1}. ${line.product.name} — ${line.product.packSize} — ${line.quantity} × ${formatNaira(line.product.price)}`,
    ),
    "",
    `Subtotal: ${formatNaira(subtotal)}`,
    "Please confirm availability and delivery.",
  ].join("\n");

  return (
    <div className="container-edge py-10 md:py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_370px] lg:gap-14">
        <div>
          <div className="flex items-center justify-between border-b border-navy/10 pb-4">
            <h2 className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-navy">
              {count} item{count === 1 ? "" : "s"} in your bag
            </h2>
            <Link href="/shop" className="text-[0.66rem] font-semibold text-navy/45 underline underline-offset-2 hover:text-navy">
              Continue shopping
            </Link>
          </div>

          <ul className="divide-y divide-navy/8">
            {lines.map((line) => (
              <li key={line.product.id} className="flex gap-4 py-6 md:gap-6">
                <Link
                  href={`/product/${line.product.slug}`}
                  className="relative size-24 shrink-0 overflow-hidden border border-navy/8 bg-[#fbf9f4] md:size-28"
                >
                  <ProductImage src={line.product.image} alt={line.product.name} brand={line.product.brand} sizes="112px" />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[0.55rem] font-extrabold uppercase tracking-[0.16em] text-gold-deep">
                        {line.product.brand}
                      </p>
                      <Link
                        href={`/product/${line.product.slug}`}
                        className="mt-0.5 block font-display text-[1.1rem] leading-snug text-navy hover:text-gold-deep md:text-[1.2rem]"
                      >
                        {line.product.name}
                      </Link>
                      <p className="mt-1 text-[0.68rem] text-navy/45">
                        {line.product.packSize} · {formatNaira(line.product.price)} each
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.product.id)}
                      className="p-1 text-navy/25 transition hover:text-red-600"
                      aria-label={`Remove ${line.product.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                    <div className="flex h-9 items-center border border-navy/15 bg-white">
                      <button
                        type="button"
                        onClick={() => setQuantity(line.product.id, line.quantity - 1)}
                        className="flex size-9 items-center justify-center text-navy/55 hover:text-navy"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-navy">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(line.product.id, line.quantity + 1)}
                        disabled={line.quantity >= line.product.stock}
                        className="flex size-9 items-center justify-center text-navy/55 hover:text-navy disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <p className="text-[0.95rem] font-bold text-navy">{formatNaira(line.lineTotal)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-2 flex flex-wrap items-center gap-4 border-t border-navy/10 py-5 text-[0.68rem] text-navy/45">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-gold-deep" /> Genuine products
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="size-3.5 text-gold-deep" /> Delivery across Nigeria
            </span>
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="size-3.5 text-gold-deep" /> Bulk quantities available
            </span>
          </div>
        </div>

        <aside className="lg:sticky lg:top-[160px] lg:self-start">
          <div className="border border-navy/10 bg-white">
            <div className="border-b border-navy/10 px-5 py-4">
              <h2 className="font-display text-xl text-navy">Order summary</h2>
            </div>
            <div className="p-5">
              <div className="mb-4">
                <div className="flex items-center justify-between text-[0.68rem] text-navy/50">
                  <span>{remaining > 0 ? "Add for free delivery" : "Free delivery unlocked"}</span>
                  <span>{remaining > 0 ? formatNaira(remaining) : "✓"}</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-navy/8">
                  <div className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold-soft" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="space-y-2 border-t border-navy/8 pt-4 text-[0.8rem]">
                <div className="flex items-center justify-between text-navy/55">
                  <span>Subtotal</span>
                  <span className="font-semibold text-navy">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-navy/55">
                  <span>Delivery</span>
                  <span className="text-[0.7rem] italic text-navy/40">Calculated at checkout</span>
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between border-t border-navy/10 pt-4">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-navy">Subtotal</span>
                <Money value={subtotal} className="font-display text-[1.7rem] text-navy" />
              </div>

              <Link href="/checkout" className="btn btn-gold mt-5 w-full">
                Proceed to checkout <ArrowRight className="size-4" />
              </Link>
              <a
                href={whatsappUrl(config.whatsapp, waMessage)}
                target="_blank"
                rel="noreferrer"
                className="mt-2.5 flex h-11 w-full items-center justify-center gap-2 border border-navy/15 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-navy transition hover:border-navy"
              >
                Order on WhatsApp <ArrowUpRight className="size-3.5" />
              </a>
              <p className="mt-4 text-center text-[0.62rem] leading-relaxed text-navy/35">
                Secure checkout. No card details are stored on this website.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
