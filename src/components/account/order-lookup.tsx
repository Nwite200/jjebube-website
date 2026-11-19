"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, CheckCircle2, Clock, PackageSearch, Truck } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import { ProductImage } from "@/components/product-image";

type LookupOrder = {
  number: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  items: { name: string; packSize: string; quantity: number; image: string }[];
  delivery: string;
};

export function OrderLookup() {
  const [number, setNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<LookupOrder | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("jje-orders") || "[]") as string[];
      setRecent(stored.slice(0, 5));
    } catch {
      setRecent([]);
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number, phone }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; order?: LookupOrder };
      if (!res.ok || !json.ok || !json.order) {
        setError(json.error || "We couldn't find that order.");
        return;
      }
      setOrder(json.order);
      setRecent((prev) => [json.order!.number, ...prev.filter((n) => n !== json.order!.number)].slice(0, 5));
      try {
        const stored = JSON.parse(localStorage.getItem("jje-orders") || "[]") as string[];
        localStorage.setItem(
          "jje-orders",
          JSON.stringify([json.order.number, ...stored.filter((n) => n !== json.order!.number)].slice(0, 20)),
        );
      } catch {
        /* ignore */
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
      <div>
        <div className="border border-navy/10 bg-white p-6 md:p-8">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full border border-gold/35 bg-ivory">
              <PackageSearch className="size-5 text-gold-deep" strokeWidth={1.5} />
            </span>
            <div>
              <h2 className="font-display text-xl text-navy">Track your order</h2>
              <p className="text-[0.7rem] text-navy/45">Use the order number from your confirmation.</p>
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">Order number</span>
              <input
                required
                value={number}
                onChange={(e) => setNumber(e.target.value.toUpperCase())}
                placeholder="JJE-20261119-XXXX"
                className="field font-mono text-[0.8rem]"
              />
            </label>
            <label className="block">
              <span className="field-label">Phone number used</span>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0803 123 4567"
                className="field"
                inputMode="tel"
              />
            </label>
            <div className="sm:col-span-2">
              <button type="submit" disabled={loading} className="btn btn-navy h-11 w-full sm:w-auto">
                {loading ? "Looking up…" : "Find my order"} <ArrowRight className="size-3.5" />
              </button>
            </div>
          </form>

          {error && (
            <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-[0.75rem] text-red-700">{error}</p>
          )}
        </div>

        {order && (
          <div className="animate-float-in mt-5 border border-navy/10 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/10 px-5 py-4">
              <div>
                <p className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-navy/35">Order</p>
                <p className="font-mono text-[0.85rem] font-bold text-navy">{order.number}</p>
              </div>
              <div className="flex gap-2">
                <span className="bg-navy px-2.5 py-1 text-[0.52rem] font-bold uppercase tracking-[0.1em] text-gold-soft">
                  {order.status}
                </span>
                <span
                  className={`px-2.5 py-1 text-[0.52rem] font-bold uppercase tracking-[0.1em] ${
                    order.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {order.paymentStatus === "paid" ? "Paid" : "Payment pending"}
                </span>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto]">
              <div>
                <ul className="space-y-3">
                  {order.items.map((item) => (
                    <li key={item.name} className="flex items-center gap-3">
                      <span className="relative size-12 shrink-0 overflow-hidden border border-navy/8 bg-[#fbf9f4]">
                        <ProductImage src={item.image} alt={item.name} brand={item.name} sizes="48px" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.75rem] font-semibold text-navy">{item.name}</span>
                        <span className="text-[0.62rem] text-navy/40">
                          {item.packSize} × {item.quantity}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-right">
                <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-navy/35">Total</p>
                <p className="mt-1 font-display text-2xl text-navy">{formatNaira(order.total)}</p>
                <p className="mt-2 text-[0.65rem] capitalize text-navy/40">{order.paymentMethod.replace(/-/g, " ")}</p>
                <p className="mt-1 text-[0.65rem] text-navy/40">{order.delivery}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-navy/10 bg-ivory/60 px-5 py-3.5">
              <p className="flex items-center gap-2 text-[0.65rem] text-navy/45">
                <Clock className="size-3.5 text-gold-deep" />
                Placed {new Date(order.createdAt).toLocaleDateString("en-NG")}
              </p>
              <Link
                href={`/checkout/success/${order.number}`}
                className="inline-flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-navy underline decoration-gold underline-offset-2"
              >
                View full order <ArrowUpRight className="size-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      <aside className="space-y-4">
        <div className="border border-navy/10 bg-white p-5">
          <h3 className="font-display text-lg text-navy">Orders on this device</h3>
          {recent.length === 0 ? (
            <p className="mt-2 text-[0.72rem] leading-relaxed text-navy/45">
              Orders you place in this browser will appear here for quick access.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-navy/8">
              {recent.map((n) => (
                <li key={n} className="flex items-center justify-between py-2.5">
                  <span className="font-mono text-[0.7rem] font-semibold text-navy">{n}</span>
                  <Link href={`/checkout/success/${n}`} className="text-[0.6rem] font-semibold text-gold-deep">
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border border-gold/30 bg-[#fbf7ec] p-5">
          <h3 className="font-display text-lg text-navy">Need a hand?</h3>
          <p className="mt-2 text-[0.72rem] leading-relaxed text-navy/50">
            Message our team with your order number and we&apos;ll help with delivery, payment or changes.
          </p>
          <a
            href="https://wa.me/2347062129563?text=Hello%20JJ%20Ebube%20Enterprise%2C%20I%20need%20help%20with%20an%20order."
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-gold-deep underline underline-offset-2"
          >
            Chat with support <ArrowUpRight className="size-3" />
          </a>
        </div>

        <div className="border border-navy/10 bg-navy p-5 text-ivory">
          <Truck className="size-5 text-gold" strokeWidth={1.5} />
          <h3 className="mt-3 font-display text-lg">Delivery, simplified.</h3>
          <p className="mt-1.5 text-[0.72rem] leading-relaxed text-ivory/50">
            We deliver nationwide. Delivery fees are confirmed at checkout and free delivery applies on qualifying
            orders.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[0.62rem] text-gold-soft">
            <CheckCircle2 className="size-3.5" /> Order updates on WhatsApp
          </div>
        </div>
      </aside>
    </div>
  );
}
