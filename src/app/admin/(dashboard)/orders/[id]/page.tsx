import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { AdminCard, AdminPageHeader, Flash, StatusBadge } from "@/components/admin/ui";
import { markPaidAction, saveOrderAction } from "@/app/admin/actions";
import { getOrders, getSettings } from "@/lib/db";
import { formatNaira, whatsappUrl } from "@/lib/utils";
import { ProductImage } from "@/components/product-image";
import { Money } from "@/components/money";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const PAYMENTS = ["unpaid", "paid", "refunded"];

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; paid?: string; error?: string }>;
}) {
  const [{ id }, query, orders, settings] = await Promise.all([
    params,
    searchParams,
    getOrders(),
    getSettings(),
  ]);
  const order = orders.find((o) => o.id === id);
  if (!order) notFound();
  const zone = settings.deliveryZones.find((z) => z.id === order.zoneId);

  return (
    <div>
      <Link href="/admin/orders" className="mb-4 inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-navy/40 hover:text-navy">
        <ArrowLeft className="size-3.5" /> All orders
      </Link>

      <AdminPageHeader
        eyebrow={`Order · ${new Date(order.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}`}
        title={order.number}
        description={`${order.items.reduce((s, i) => s + i.quantity, 0)} items · ${order.customer.fullName}`}
        action={
          <div className="flex items-center gap-2">
            <StatusBadge value={order.status} />
            <StatusBadge value={order.paymentStatus} />
          </div>
        }
      />

      <div className="mt-5">
        <Flash saved={query.saved || query.paid} error={query.error} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <AdminCard title="Items">
            <ul className="divide-y divide-navy/6">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3 px-5 py-4">
                  <span className="relative size-14 shrink-0 overflow-hidden border border-navy/8 bg-ivory">
                    <ProductImage src={item.image} alt={item.name} brand={item.brand} sizes="56px" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.78rem] font-semibold text-navy">{item.name}</p>
                    <p className="mt-0.5 text-[0.64rem] text-navy/40">
                      {item.packSize} · {formatNaira(item.unitPrice)} each
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.78rem] font-bold text-navy">{formatNaira(item.unitPrice * item.quantity)}</p>
                    <p className="text-[0.6rem] text-navy/35">Qty {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-navy/10 px-5 py-4 text-[0.75rem]">
              <div className="flex justify-between text-navy/55">
                <span>Subtotal</span>
                <span className="font-semibold text-navy">{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-navy/55">
                <span>Delivery {zone ? `· ${zone.name}` : ""}</span>
                <span className="font-semibold text-navy">{order.deliveryFee === 0 ? "Free" : formatNaira(order.deliveryFee)}</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-navy/8 pt-2">
                <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.12em] text-navy">Total</span>
                <Money value={order.total} className="font-display text-xl text-navy" />
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Customer & delivery">
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <div>
                <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-navy/35">Customer</p>
                <p className="mt-2 text-[0.8rem] font-semibold text-navy">{order.customer.fullName}</p>
                <a href={`tel:${order.customer.phone}`} className="mt-1 flex items-center gap-1.5 text-[0.72rem] text-navy/55 hover:text-gold-deep">
                  <Phone className="size-3.5" /> {order.customer.phone}
                </a>
                <a href={`mailto:${order.customer.email}`} className="mt-1 block text-[0.72rem] text-navy/55 hover:text-gold-deep">
                  {order.customer.email}
                </a>
              </div>
              <div>
                <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-navy/35">Delivery address</p>
                <p className="mt-2 flex items-start gap-1.5 text-[0.75rem] leading-relaxed text-navy/60">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-gold-deep" />
                  <span>
                    {order.customer.address}
                    <br />
                    {order.customer.city}, {order.customer.state}
                  </span>
                </p>
                {zone && <p className="mt-1 text-[0.62rem] text-navy/35">Region: {zone.name}</p>}
              </div>
              {order.customer.notes && (
                <div className="sm:col-span-2 border-t border-navy/8 pt-3">
                  <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-navy/35">Delivery instructions</p>
                  <p className="mt-1 text-[0.75rem] italic text-navy/55">{order.customer.notes}</p>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-navy/8 px-5 py-3">
              <a
                href={whatsappUrl(
                  order.customer.phone,
                  `Hello ${order.customer.fullName}, this is JJ Ebube Enterprise regarding your order ${order.number}.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 bg-[#1FA855] px-3 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-white"
              >
                <MessageCircle className="size-3.5" /> WhatsApp customer
              </a>
              <a
                href={`tel:${order.customer.phone}`}
                className="inline-flex h-9 items-center gap-1.5 border border-navy/15 px-3 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-navy"
              >
                <Phone className="size-3.5" /> Call
              </a>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-5">
          <AdminCard title="Fulfilment">
            <form action={saveOrderAction} className="space-y-4 p-5">
              <input type="hidden" name="id" value={order.id} />
              <label className="block">
                <span className="field-label">Order status</span>
                <select name="status" defaultValue={order.status} className="field h-10 text-[0.78rem]">
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="field-label">Payment status</span>
                <select name="paymentStatus" defaultValue={order.paymentStatus} className="field h-10 text-[0.78rem]">
                  {PAYMENTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className="btn btn-navy h-10 w-full text-[0.62rem]">
                Update order
              </button>
              <p className="text-[0.62rem] leading-relaxed text-navy/35">
                Only set payment to “paid” after confirming the funds in your bank account or Paystack dashboard.
              </p>
            </form>
          </AdminCard>

          <AdminCard title="Payment">
            <div className="p-5">
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-navy/35">Method</p>
              <p className="mt-1 text-[0.82rem] font-semibold capitalize text-navy">
                {order.paymentMethod.replace(/-/g, " ")}
              </p>
              {order.paymentReference && (
                <>
                  <p className="mt-3 text-[0.55rem] font-bold uppercase tracking-[0.12em] text-navy/35">Reference</p>
                  <p className="mt-1 break-all font-mono text-[0.68rem] text-navy/60">{order.paymentReference}</p>
                </>
              )}
              <div className="mt-4 flex items-center gap-2">
                <StatusBadge value={order.paymentStatus} />
                <span className="text-[0.62rem] text-navy/40">
                  {order.paymentStatus === "paid" ? "Verified" : "Awaiting confirmation"}
                </span>
              </div>

              {order.paymentStatus !== "paid" && (
                <form action={markPaidAction} className="mt-4">
                  <input type="hidden" name="id" value={order.id} />
                  <button type="submit" className="flex h-10 w-full items-center justify-center gap-2 border border-emerald-600/30 bg-emerald-50 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-emerald-800 transition hover:bg-emerald-100">
                    <CheckCircle2 className="size-3.5" /> Confirm payment received
                  </button>
                </form>
              )}
            </div>
          </AdminCard>

          <div className="border border-gold/30 bg-[#fbf7ec] p-5">
            <p className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-gold-deep">
              <ShieldCheck className="size-3.5" /> Payment integrity
            </p>
            <p className="mt-2 text-[0.68rem] leading-relaxed text-navy/50">
              Card payments are verified server-side with Paystack before being marked paid. Manual confirmation is a
              separate action — only use it when you have checked the funds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
