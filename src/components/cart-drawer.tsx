"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { useCartDetails, useStoreData } from "./store-provider";
import { useCartStore, useUIStore } from "@/lib/store";
import { ProductImage } from "./product-image";
import { formatNaira, whatsappUrl } from "@/lib/utils";
import { Money } from "./money";

export function CartDrawer() {
  const open = useUIStore((s) => s.cartOpen);
  const close = useUIStore((s) => s.closeCart);
  const { config } = useStoreData();
  const { lines, subtotal, count, hydrated } = useCartDetails();
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  if (!open) return null;

  const remaining = Math.max(0, config.freeShippingThreshold - subtotal);
  const progress =
    config.freeShippingThreshold > 0
      ? Math.min(100, (subtotal / config.freeShippingThreshold) * 100)
      : 0;

  const waMessage =
    lines.length > 0
      ? [
          "Hello JJ Ebube Enterprise, I would like to order:",
          "",
          ...lines.map(
            (line, i) =>
              `${i + 1}. ${line.product.name} — ${line.product.packSize} — ${line.quantity} × ${formatNaira(line.product.price)}`,
          ),
          "",
          `Subtotal: ${formatNaira(subtotal)}`,
          "Please confirm availability and delivery.",
        ].join("\n")
      : "Hello JJ Ebube Enterprise, I would like to place an order.";

  return (
    <div className="fixed inset-0 z-[95]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button
        type="button"
        onClick={close}
        aria-label="Close bag"
        className="absolute inset-0 bg-navy/55 backdrop-blur-[2px]"
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-ivory shadow-[-30px_0_80px_-20px_rgba(4,17,39,0.5)]">
        <div className="flex items-center justify-between border-b border-navy/10 bg-white px-5 py-5 md:px-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="size-5 text-gold-deep" strokeWidth={1.6} />
            <div>
              <h2 className="font-display text-xl leading-none text-navy">Your bag</h2>
              <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-navy/40">
                {hydrated ? `${count} item${count === 1 ? "" : "s"}` : "Loading"} · JJ Ebube
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex size-9 items-center justify-center rounded-full text-navy/50 transition hover:bg-navy/5 hover:text-navy"
            aria-label="Close bag"
          >
            <X className="size-5" />
          </button>
        </div>

        {hydrated && lines.length > 0 && (
          <div className="border-b border-navy/8 bg-white px-5 py-3.5 md:px-6">
            <div className="flex items-center gap-2 text-[0.68rem] font-medium text-navy/70">
              <Truck className="size-3.5 text-gold-deep" />
              {remaining > 0 ? (
                <span>
                  Spend <strong className="font-bold text-navy">{formatNaira(remaining)}</strong> more for free delivery
                </span>
              ) : (
                <span className="font-semibold text-navy">You&apos;ve qualified for free delivery</span>
              )}
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-navy/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold-soft transition-[width] duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {!hydrated ? (
            <div className="space-y-4 p-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="skeleton size-20" />
                  <div className="flex-1 space-y-2 py-2">
                    <div className="skeleton h-2.5 w-1/3" />
                    <div className="skeleton h-3 w-3/4" />
                    <div className="skeleton h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center">
              <span className="flex size-16 items-center justify-center rounded-full border border-gold/30 bg-white">
                <ShoppingBag className="size-6 text-gold-deep" strokeWidth={1.4} />
              </span>
              <h3 className="mt-6 font-display text-2xl text-navy">Your bag is waiting.</h3>
              <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-navy/55">
                Everyday essentials, trusted brands and better prices — all in one place.
              </p>
              <Link
                href="/shop"
                onClick={close}
                className="btn btn-navy mt-7 w-full max-w-[240px]"
              >
                Start shopping <ArrowRight className="size-4" />
              </Link>
              <a
                href={whatsappUrl(config.whatsapp, waMessage)}
                target="_blank"
                rel="noreferrer"
                className="mt-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-navy/55 underline decoration-gold decoration-1 underline-offset-4"
              >
                Or order on WhatsApp
              </a>
            </div>
          ) : (
            <ul className="divide-y divide-navy/8 px-5 md:px-6">
              {lines.map((line) => {
                const maxed = line.quantity >= line.product.stock;
                return (
                  <li key={line.product.id} className="flex gap-4 py-5">
                    <Link
                      href={`/product/${line.product.slug}`}
                      onClick={close}
                      className="relative size-[76px] shrink-0 overflow-hidden border border-navy/8 bg-white"
                    >
                      <ProductImage
                        src={line.product.image}
                        alt={line.product.name}
                        brand={line.product.brand}
                        sizes="76px"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-gold-deep">
                        {line.product.brand}
                      </p>
                      <Link
                        href={`/product/${line.product.slug}`}
                        onClick={close}
                        className="mt-0.5 block pr-6 text-[0.82rem] font-semibold leading-snug text-navy hover:text-gold-deep"
                      >
                        {line.product.name}
                      </Link>
                      <p className="mt-0.5 text-[0.68rem] text-navy/45">
                        {line.product.packSize} · {formatNaira(line.product.price)} each
                      </p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex h-8 items-center border border-navy/12 bg-white">
                          <button
                            type="button"
                            onClick={() => setQuantity(line.product.id, line.quantity - 1)}
                            className="flex size-8 items-center justify-center text-navy/60 transition hover:text-navy disabled:opacity-40"
                            disabled={busyId === line.product.id}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold text-navy">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (maxed) return;
                              setBusyId(line.product.id);
                              setQuantity(line.product.id, line.quantity + 1);
                              setBusyId(null);
                            }}
                            className="flex size-8 items-center justify-center text-navy/60 transition hover:text-navy disabled:opacity-30"
                            disabled={maxed}
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <span className="text-[0.82rem] font-bold text-navy">
                          {formatNaira(line.lineTotal)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.product.id)}
                      className="h-fit self-start p-1 text-navy/25 transition hover:text-red-600"
                      aria-label={`Remove ${line.product.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {hydrated && lines.length > 0 && (
          <div className="border-t border-navy/10 bg-white px-5 pb-5 pt-4 md:px-6">
            <div className="flex items-baseline justify-between">
              <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-navy/50">Subtotal</span>
              <Money value={subtotal} className="font-display text-2xl text-navy" />
            </div>
            <p className="mt-1 text-[0.66rem] text-navy/40">
              Delivery calculated at checkout. Prices in Nigerian naira.
            </p>
            <Link
              href="/checkout"
              onClick={close}
              className="btn btn-gold mt-4 w-full"
            >
              Proceed to checkout <ArrowRight className="size-4" />
            </Link>
            <a
              href={whatsappUrl(config.whatsapp, waMessage)}
              target="_blank"
              rel="noreferrer"
              className="mt-2.5 flex h-11 w-full items-center justify-center gap-2 border border-navy/15 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-navy transition hover:border-navy"
            >
              Order on WhatsApp
            </a>
            <div className="mt-3 flex items-center justify-between text-[0.6rem] text-navy/40">
              <button type="button" onClick={close} className="font-semibold underline underline-offset-2 hover:text-navy">
                Continue shopping
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Clear your bag?")) clear();
                }}
                className="transition hover:text-red-600"
              >
                Clear bag
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
