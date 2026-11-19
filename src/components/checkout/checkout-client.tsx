"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Banknote, Check, ChevronDown, CreditCard, Lock, MessageCircle, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { useCartDetails, useStoreData } from "@/components/store-provider";
import { ProductImage } from "@/components/product-image";
import { useCartStore } from "@/lib/store";
import { cn, formatNaira, whatsappUrl } from "@/lib/utils";
import { Money } from "@/components/money";
import { CheckoutProgress } from "./checkout-progress";
import { NIGERIAN_STATES } from "@/lib/nigeria";

type Zone = { id: string; name: string; fee: number };

const PAYMENT_LABELS: Record<string, string> = {
  paystack: "Card payment",
  "bank-transfer": "Bank transfer",
  "pay-on-delivery": "Pay on delivery",
  whatsapp: "Order via WhatsApp",
};

export function CheckoutClient({
  zones,
  threshold,
  paystackEnabled,
  bank,
  whatsapp,
}: {
  zones: Zone[];
  threshold: number;
  paystackEnabled: boolean;
  bank: { bankName: string; accountName: string; accountNumber: string };
  whatsapp: string;
}) {
  const router = useRouter();
  const { lines, subtotal, hydrated } = useCartDetails();
  const clear = useCartStore((s) => s.clear);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    state: "Lagos",
    city: "",
    notes: "",
  });
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? "lagos");
  const [payment, setPayment] = useState("bank-transfer");
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const zone = zones.find((z) => z.id === zoneId) ?? zones[0];
  const deliveryFee = !zone || zone.fee === 0 || subtotal >= threshold ? 0 : zone.fee;
  const total = subtotal + deliveryFee;

  const paymentOptions = useMemo(
    () =>
      [
        {
          id: "bank-transfer",
          icon: Banknote,
          title: "Bank transfer",
          body: "Place your order and receive our account details to complete payment.",
          note: "Recommended",
        },
        {
          id: "pay-on-delivery",
          icon: PackageCheck,
          title: "Pay on delivery",
          body: "Pay when your order reaches you. Subject to confirmation by our team.",
        },
        ...(paystackEnabled
          ? [
              {
                id: "paystack",
                icon: CreditCard,
                title: "Card payment",
                body: "Pay securely by card. Verified on our server before your order is marked paid.",
              },
            ]
          : []),
        {
          id: "whatsapp",
          icon: MessageCircle,
          title: "Order via WhatsApp",
          body: "Send your order to our team and complete the details in chat.",
        },
      ] as { id: string; icon: typeof Banknote; title: string; body: string; note?: string }[],
    [paystackEnabled],
  );

  if (!hydrated) {
    return (
      <div className="container-edge py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-4">
            <div className="skeleton h-64" />
            <div className="skeleton h-64" />
          </div>
          <div className="skeleton h-96" />
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-edge flex flex-col items-center justify-center py-20 text-center">
        <h2 className="font-display text-[2rem] text-navy">There is nothing to check out yet.</h2>
        <p className="mt-3 max-w-sm text-sm text-navy/50">
          Add products to your bag, then return here to complete your order.
        </p>
        <Link href="/shop" className="btn btn-gold mt-6">
          Shop all products <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!confirm) {
      setError("Please confirm that your delivery details are correct.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
          zoneId,
          paymentMethod: payment,
          customer: form,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        orderNumber?: string;
        authorizationUrl?: string;
      };
      if (!res.ok || !json.ok || !json.orderNumber) {
        setError(json.error || "We couldn't place your order. Please try again.");
        setSubmitting(false);
        return;
      }
      try {
        const existing = JSON.parse(localStorage.getItem("jje-orders") || "[]") as string[];
        localStorage.setItem("jje-orders", JSON.stringify([json.orderNumber, ...existing].slice(0, 20)));
      } catch {
        /* ignore storage errors */
      }
      clear();
      if (json.authorizationUrl) {
        window.location.href = json.authorizationUrl;
        return;
      }
      router.push(`/checkout/success/${json.orderNumber}`);
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="container-edge py-10 md:py-14">
      <CheckoutProgress />
      <div className="grid gap-10 lg:grid-cols-[1fr_390px] lg:gap-14">
        <div className="space-y-10">
          <section id="checkout-step-1" data-checkout-step="1" className="scroll-mt-40">
            <SectionTitle step="01" title="Contact details" body="So we can confirm your order and keep you updated." />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="e.g. Ada Okafor"
                  className="field"
                  autoComplete="name"
                />
              </Field>
              <Field label="Phone number" required>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="e.g. 0803 123 4567"
                  className="field"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Email address" required>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@example.com"
                    className="field"
                    autoComplete="email"
                  />
                </Field>
              </div>
            </div>
          </section>

          <section id="checkout-step-2" data-checkout-step="2" className="scroll-mt-40">
            <SectionTitle step="02" title="Delivery details" body="Where should we send your order?" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Delivery address" required>
                  <input
                    required
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="Street, building, landmark"
                    className="field"
                    autoComplete="street-address"
                  />
                </Field>
              </div>
              <Field label="State" required>
                <Select value={form.state} onChange={(v) => update("state", v)}>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
              </Field>
              <Field label="City / area" required>
                <input
                  required
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="e.g. Ikeja"
                  className="field"
                  autoComplete="address-level2"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Delivery instructions (optional)">
                  <textarea
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    rows={3}
                    placeholder="Gate colour, preferred delivery time, or anything else we should know."
                    className="field h-auto py-3"
                  />
                </Field>
              </div>
            </div>

            <div className="mt-5">
              <p className="field-label">Delivery option</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {zones.map((z) => {
                  const fee = z.fee === 0 || subtotal >= threshold ? 0 : z.fee;
                  return (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => setZoneId(z.id)}
                      className={cn(
                        "flex items-center justify-between border px-4 py-3 text-left transition",
                        zoneId === z.id ? "border-gold bg-gold/5" : "border-navy/12 bg-white hover:border-navy/30",
                      )}
                    >
                      <span>
                        <span className="block text-[0.78rem] font-semibold text-navy">{z.name}</span>
                        <span className="mt-0.5 block text-[0.62rem] text-navy/40">
                          {fee === 0 ? "Free delivery" : formatNaira(fee)}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "flex size-4 items-center justify-center rounded-full border",
                          zoneId === z.id ? "border-gold-deep bg-gold-deep text-white" : "border-navy/20",
                        )}
                      >
                        {zoneId === z.id && <Check className="size-2.5" strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>
              {subtotal >= threshold && (
                <p className="mt-2 flex items-center gap-1.5 text-[0.65rem] font-semibold text-emerald-700">
                  <Truck className="size-3.5" /> Your order qualifies for free delivery.
                </p>
              )}
            </div>
          </section>

          <section id="checkout-step-3" data-checkout-step="3" className="scroll-mt-40">
            <SectionTitle step="03" title="Payment" body="Choose how you would like to complete your order." />
            <div className="mt-5 space-y-2">
              {paymentOptions.map((opt) => {
                const Icon = opt.icon;
                const active = payment === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPayment(opt.id)}
                    className={cn(
                      "flex w-full items-start gap-3.5 border px-4 py-4 text-left transition",
                      active ? "border-gold bg-gold/5" : "border-navy/12 bg-white hover:border-navy/30",
                    )}
                  >
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-navy/10 bg-white">
                      <Icon className="size-4 text-gold-deep" strokeWidth={1.6} />
                    </span>
                    <span className="flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-[0.8rem] font-semibold text-navy">{opt.title}</span>
                        {opt.note && (
                          <span className="bg-gold/15 px-1.5 py-0.5 text-[0.48rem] font-bold uppercase tracking-[0.1em] text-gold-deep">
                            {opt.note}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[0.7rem] leading-relaxed text-navy/45">{opt.body}</span>
                    </span>
                    <span
                      className={cn(
                        "mt-1 flex size-4 items-center justify-center rounded-full border",
                        active ? "border-gold-deep bg-gold-deep text-white" : "border-navy/20",
                      )}
                    >
                      {active && <Check className="size-2.5" strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>

            {payment === "bank-transfer" && (
              <div className="mt-3 border border-navy/10 bg-white p-4 text-[0.72rem] leading-relaxed text-navy/55">
                {bank.bankName && bank.accountNumber ? (
                  <>
                    <p className="font-semibold text-navy">Transfer to:</p>
                    <p className="mt-1">{bank.bankName}</p>
                    <p>{bank.accountName}</p>
                    <p className="font-mono text-[0.85rem] font-bold tracking-wide text-navy">{bank.accountNumber}</p>
                    <p className="mt-2 text-[0.65rem] text-navy/40">
                      Use your order number as the transfer reference. We&apos;ll confirm payment before dispatch.
                    </p>
                  </>
                ) : (
                  <p>
                    Place your order and our team will share the account details with you on WhatsApp, along with
                    confirmation of your total.
                  </p>
                )}
              </div>
            )}
          </section>

          <label className="flex cursor-pointer items-start gap-3 border-t border-navy/10 pt-5">
            <input
              type="checkbox"
              checked={confirm}
              onChange={(e) => setConfirm(e.target.checked)}
              className="mt-0.5 size-4 accent-[#d9ac42]"
            />
            <span className="text-[0.72rem] leading-relaxed text-navy/55">
              I confirm my delivery details are correct and understand that payment is only complete once confirmed by
              JJ Ebube Enterprise.
            </span>
          </label>

          {error && (
            <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-[0.78rem] text-red-700">
              {error}
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn btn-gold h-13 w-full disabled:opacity-70 sm:hidden">
            {submitting ? "Placing order…" : `Place order · ${formatNaira(total)}`}
          </button>
        </div>

        <aside className="lg:sticky lg:top-[150px] lg:self-start">
          <div className="border border-navy/10 bg-white">
            <div className="flex items-center justify-between border-b border-navy/10 px-5 py-4">
              <h2 className="font-display text-xl text-navy">Order summary</h2>
              <Link href="/cart" className="text-[0.6rem] font-semibold text-navy/45 underline underline-offset-2 hover:text-navy">
                Edit bag
              </Link>
            </div>

            <ul className="max-h-[300px] divide-y divide-navy/6 overflow-y-auto px-5">
              {lines.map((line) => (
                <li key={line.product.id} className="flex items-center gap-3 py-3.5">
                  <span className="relative size-14 shrink-0 overflow-hidden border border-navy/8 bg-[#fbf9f4]">
                    <ProductImage src={line.product.image} alt={line.product.name} brand={line.product.brand} sizes="56px" />
                    <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-navy text-[0.48rem] font-bold text-ivory">
                      {line.quantity}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.74rem] font-semibold text-navy">{line.product.name}</span>
                    <span className="mt-0.5 block text-[0.62rem] text-navy/40">{line.product.packSize}</span>
                  </span>
                  <span className="text-[0.74rem] font-semibold text-navy">{formatNaira(line.lineTotal)}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t border-navy/10 px-5 pt-4 text-[0.78rem]">
              <div className="flex justify-between text-navy/55">
                <span>Subtotal</span>
                <span className="font-semibold text-navy">{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between text-navy/55">
                <span>Delivery</span>
                <span className="font-semibold text-navy">{deliveryFee === 0 ? "Free" : formatNaira(deliveryFee)}</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-navy/10 pt-3">
                <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-navy">Total</span>
                <Money value={total} className="font-display text-[1.65rem] text-navy" />
              </div>
            </div>

            <div className="p-5 pt-4">
              <button type="submit" disabled={submitting} className="btn btn-gold hidden w-full disabled:opacity-70 sm:flex">
                {submitting ? (
                  "Placing order…"
                ) : (
                  <>
                    Place order <ArrowRight className="size-4" />
                  </>
                )}
              </button>
              <div className="mt-3 space-y-2 text-[0.62rem] text-navy/40">
                <p className="flex items-center gap-2">
                  <Lock className="size-3 text-gold-deep" /> Secure, encrypted checkout
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="size-3 text-gold-deep" /> Server-verified payments
                </p>
                <p className="flex items-center gap-2">
                  <Truck className="size-3 text-gold-deep" /> Delivery across Nigeria
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 border border-gold/25 bg-gold/5 px-5 py-4">
            <p className="text-[0.7rem] font-semibold text-navy">Prefer to order in chat?</p>
            <p className="mt-1 text-[0.65rem] leading-relaxed text-navy/50">
              Send your bag to our team on WhatsApp and we&apos;ll confirm stock, delivery and payment.
            </p>
            <a
              href={whatsappUrl(
                whatsapp,
                lines.length
                  ? [
                      "Hello JJ Ebube Enterprise, I would like to order:",
                      "",
                      ...lines.map((l, i) => `${i + 1}. ${l.product.name} — ${l.product.packSize} — ${l.quantity} × ${formatNaira(l.product.price)}`),
                      "",
                      `Subtotal: ${formatNaira(subtotal)}`,
                      `Delivery: ${zone?.name ?? ""}`,
                      "Please confirm availability.",
                    ].join("\n")
                  : undefined,
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-gold-deep underline underline-offset-2"
            >
              Order on WhatsApp <ArrowUpRight className="size-3" />
            </a>
          </div>
        </aside>
      </div>
    </form>
  );
}

function SectionTitle({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div className="flex items-start gap-4 border-b border-navy/10 pb-3">
      <span className="pt-0.5 font-display text-[0.8rem] italic text-gold-deep">{step}</span>
      <div>
        <h2 className="font-display text-[1.4rem] leading-none text-navy">{title}</h2>
        <p className="mt-1.5 text-[0.72rem] text-navy/45">{body}</p>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="field-label">
        {label} {required && <span className="text-gold-deep">*</span>}
      </span>
      {children}
    </label>
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="field appearance-none pr-9">
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-navy/40" />
    </div>
  );
}
