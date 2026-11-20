import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleDollarSign,
  Clock,
  MapPin,
  Package,
  Phone,
  Truck,
} from "lucide-react";
import { getOrder, getSettings } from "@/lib/db";
import { formatNaira, whatsappUrl } from "@/lib/utils";
import { ProductImage } from "@/components/product-image";
import { Money } from "@/components/money";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

const STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"] as const;

export default async function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ number: string }>;
  searchParams: Promise<{ payment?: string }>;
}) {
  const { number } = await params;
  const { payment } = await searchParams;
  const [order, settings] = await Promise.all([getOrder(number), getSettings()]);
  if (!order) notFound();

  const zone = settings.deliveryZones.find((z) => z.id === order.zoneId);
  const currentStep = STEPS.indexOf(order.status as (typeof STEPS)[number]);
  const firstName = order.customer.fullName.split(" ")[0];

  const waMessage = [
    `Hello JJ Ebube Enterprise, I just placed order ${order.number}.`,
    "",
    ...order.items.map((i) => `${i.quantity} × ${i.name} (${i.packSize})`),
    "",
    `Total: ${formatNaira(order.total)}`,
    `Delivery: ${zone?.name ?? ""} — ${order.customer.address}, ${order.customer.city}, ${order.customer.state}`,
    `Payment: ${order.paymentMethod.replace(/-/g, " ")}`,
    "",
    "Please confirm my order.",
  ].join("\n");

  return (
    <div className="bg-ivory">
      <div className="border-b border-navy/8 bg-white">
        <div className="container-edge py-10 text-center md:py-14">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10 md:size-20">
            <Check className="size-8 text-gold-deep md:size-9" strokeWidth={1.6} />
          </span>
          <p className="mt-5 eyebrow text-gold-deep">Order received</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.04] text-navy">
            Thank you, {firstName}.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[0.9rem] leading-relaxed text-navy/50">
            Your order has been saved and our team will confirm availability, delivery and payment details with you.
            {order.paymentStatus === "paid"
              ? " Your payment has been verified."
              : " No payment has been taken yet."}
          </p>
          <div className="mt-6 inline-flex items-center gap-2 border border-navy/12 bg-ivory px-5 py-3">
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-navy/40">Order number</span>
            <span className="font-mono text-[0.85rem] font-bold tracking-wide text-navy">{order.number}</span>
          </div>
          {payment === "failed" && (
            <p className="mx-auto mt-4 max-w-md border border-red-200 bg-red-50 px-4 py-3 text-[0.75rem] text-red-700">
              We could not verify the card payment. Your order is still pending — please contact us or choose another
              payment method.
            </p>
          )}
        </div>
      </div>

      <div className="container-edge py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-14">
          <div className="space-y-8">
            <section className="border border-navy/10 bg-white">
              <div className="border-b border-navy/10 px-5 py-4">
                <h2 className="font-display text-xl text-navy">Order status</h2>
              </div>
              <div className="px-5 py-6">
                {order.status === "cancelled" ? (
                  <p className="text-sm font-semibold text-red-600">This order has been cancelled.</p>
                ) : (
                  <ol className="grid gap-4 sm:grid-cols-5">
                    {STEPS.map((step, i) => {
                      const done = i <= currentStep;
                      return (
                        <li key={step} className="flex items-start gap-3 sm:block">
                          <span
                            className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-[0.55rem] font-bold sm:mx-auto ${
                              done ? "border-gold bg-gold text-navy" : "border-navy/15 bg-white text-navy/30"
                            }`}
                          >
                            {done ? <Check className="size-3" strokeWidth={3} /> : i + 1}
                          </span>
                          <span className={`mt-1 text-[0.62rem] font-semibold capitalize sm:mt-2 sm:block sm:text-center ${done ? "text-navy" : "text-navy/35"}`}>
                            {step === "pending" ? "Received" : step}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                )}
                <p className="mt-6 flex items-center gap-2 text-[0.68rem] text-navy/40">
                  <Clock className="size-3.5 text-gold-deep" />
                  Placed{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </section>

            <section className="border border-navy/10 bg-white">
              <div className="border-b border-navy/10 px-5 py-4">
                <h2 className="font-display text-xl text-navy">Your items</h2>
              </div>
              <ul className="divide-y divide-navy/8 px-5">
                {order.items.map((item) => (
                  <li key={item.productId} className="flex items-center gap-4 py-4">
                    <span className="relative size-16 shrink-0 overflow-hidden border border-navy/8 bg-[#fbf9f4]">
                      <ProductImage src={item.image} alt={item.name} brand={item.brand} sizes="64px" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.78rem] font-semibold text-navy">{item.name}</span>
                      <span className="mt-0.5 block text-[0.65rem] text-navy/40">
                        {item.packSize} · Qty {item.quantity} · {formatNaira(item.unitPrice)} each
                      </span>
                    </span>
                    <span className="text-[0.78rem] font-bold text-navy">
                      {formatNaira(item.unitPrice * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="space-y-2 border-t border-navy/10 px-5 py-4 text-[0.78rem]">
                <div className="flex justify-between text-navy/55">
                  <span>Subtotal</span>
                  <span className="font-semibold text-navy">{formatNaira(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-navy/55">
                  <span>Delivery {zone ? `· ${zone.name}` : ""}</span>
                  <span className="font-semibold text-navy">
                    {order.deliveryFee === 0 ? "Free" : formatNaira(order.deliveryFee)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-navy/10 pt-2">
                  <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.14em] text-navy">Total</span>
                  <Money value={order.total} className="font-display text-2xl text-navy" />
                </div>
              </div>
            </section>

            <section className="border border-navy/10 bg-white p-5">
              <h2 className="font-display text-xl text-navy">Delivery details</h2>
              <div className="mt-3 grid gap-3 text-[0.78rem] text-navy/60 sm:grid-cols-2">
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-gold-deep" />
                  <span>
                    {order.customer.address}
                    <br />
                    {order.customer.city}, {order.customer.state}
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <Phone className="mt-0.5 size-4 shrink-0 text-gold-deep" />
                  <span>
                    {order.customer.fullName}
                    <br />
                    {order.customer.phone}
                  </span>
                </p>
              </div>
              {order.customer.notes && (
                <p className="mt-3 border-t border-navy/8 pt-3 text-[0.72rem] italic text-navy/45">
                  “{order.customer.notes}”
                </p>
              )}
            </section>
          </div>

          <aside className="space-y-3">
            <div className="border border-navy/10 bg-white p-5">
              <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-navy/40">Payment</p>
              <p className="mt-1.5 font-display text-xl capitalize text-navy">
                {order.paymentMethod.replace(/-/g, " ")}
              </p>
              <p className="mt-1 text-[0.7rem] text-navy/45">
                Status:{" "}
                <span className={order.paymentStatus === "paid" ? "font-semibold text-emerald-700" : "font-semibold text-amber-700"}>
                  {order.paymentStatus === "paid" ? "Paid & verified" : "Pending"}
                </span>
              </p>

              {order.paymentMethod === "bank-transfer" && order.paymentStatus !== "paid" && (
                <div className="mt-4 border-t border-navy/8 pt-4 text-[0.72rem] leading-relaxed text-navy/55">
                  {settings.bankTransfer.bankName && settings.bankTransfer.accountNumber ? (
                    <>
                      <p className="font-semibold text-navy">Transfer details</p>
                      <p className="mt-1">{settings.bankTransfer.bankName}</p>
                      <p>{settings.bankTransfer.accountName}</p>
                      <p className="font-mono text-[0.85rem] font-bold text-navy">{settings.bankTransfer.accountNumber}</p>
                      <p className="mt-2 text-[0.65rem] text-navy/40">
                        Use <strong>{order.number}</strong> as the transfer reference.
                      </p>
                    </>
                  ) : (
                    <p>
                      Our team will send the bank transfer details to you on WhatsApp, quoting order{" "}
                      <strong>{order.number}</strong>.
                    </p>
                  )}
                </div>
              )}

              {order.paymentMethod === "pay-on-delivery" && (
                <p className="mt-4 border-t border-navy/8 pt-4 text-[0.72rem] leading-relaxed text-navy/50">
                  Please have the total ready when your order arrives. Our team will confirm the delivery window with
                  you first.
                </p>
              )}

              <a
                href={whatsappUrl(settings.whatsapp, waMessage)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 bg-[#1FA855] text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#188f47]"
              >
                <Phone className="size-4" /> Confirm on WhatsApp
              </a>
              <a
                href={`tel:${settings.phone}`}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 border border-navy/15 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-navy transition hover:border-navy"
              >
                Call {settings.phone}{settings.phoneAlt ? ` or ${settings.phoneAlt}` : ""}
              </a>
            </div>

            <div className="border border-gold/30 bg-[#fbf7ec] p-5">
              <p className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-gold-deep">
                <CircleDollarSign className="size-3.5" /> Nothing charged yet
              </p>
              <p className="mt-2 text-[0.7rem] leading-relaxed text-navy/50">
                This is an order request. We confirm stock and delivery before any payment is taken, and card payments
                are only marked paid after server verification.
              </p>
            </div>

            <div className="border border-navy/10 bg-white p-5">
              <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-navy/40">Need to change it?</p>
              <p className="mt-2 text-[0.7rem] leading-relaxed text-navy/50">
                Message us with your order number and we&apos;ll help.
              </p>
              <Link href="/account" className="mt-3 inline-flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-navy underline decoration-gold underline-offset-2">
                Track an order <ArrowUpRight className="size-3" />
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-navy/10 pt-6">
          <p className="text-[0.7rem] text-navy/40">Keep your order number for reference: {order.number}</p>
          <div className="flex gap-3">
            <Link href="/shop" className="btn btn-outline h-11">
              Continue shopping <ArrowRight className="size-3.5" />
            </Link>
            <Link href="/" className="btn btn-navy h-11">
              Back home <Package className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-navy/8 bg-white py-8">
        <div className="container-edge flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-navy/35">
          <span className="flex items-center gap-2"><Truck className="size-3.5 text-gold-deep" /> Delivery across Nigeria</span>
          <span className="flex items-center gap-2"><Check className="size-3.5 text-gold-deep" /> Genuine products</span>
          <span className="flex items-center gap-2"><Phone className="size-3.5 text-gold-deep" /> Real human support</span>
        </div>
      </div>
    </div>
  );
}
