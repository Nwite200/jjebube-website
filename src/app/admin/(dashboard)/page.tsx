import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
  Boxes,
  ClipboardList,
  Mail,
  Package,
  Plus,
  ShoppingCart,
  TriangleAlert,
  Users,
} from "lucide-react";
import { AdminCard, AdminPageHeader, Stat, StatusBadge } from "@/components/admin/ui";
import { getInquiries, getMessages, getOrders, getProducts } from "@/lib/db";
import { formatNaira } from "@/lib/utils";
import { Money } from "@/components/money";
import { isDefaultAdminPassword } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const [orders, products, inquiries, messages] = await Promise.all([
    getOrders(),
    getProducts(),
    getInquiries(),
    getMessages(),
  ]);

  const revenue = orders.filter((o) => o.paymentStatus === "paid").reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => ["pending", "confirmed", "processing"].includes(o.status));
  const completed = orders.filter((o) => o.status === "delivered");
  const customers = new Set(orders.map((o) => o.customer.phone)).size;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 8).sort((a, b) => a.stock - b.stock);
  const newInquiries = inquiries.filter((i) => i.status === "new");
  const unread = messages.filter((m) => !m.read);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Overview"
        title="Good to see you."
        description="A live snapshot of the store — orders, stock and conversations that need your attention."
        action={
          <Link href="/admin/products/new" className="btn btn-navy h-10 text-[0.62rem]">
            <Plus className="size-3.5" /> Add product
          </Link>
        }
      />

      {isDefaultAdminPassword() && (
        <div className="mt-6 flex items-start gap-3 border border-amber-200 bg-amber-50 px-4 py-3 text-[0.75rem] leading-relaxed text-amber-800">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <span>
            You&apos;re using the development admin password. Set <code className="font-mono">ADMIN_PASSWORD</code> and{" "}
            <code className="font-mono">AUTH_SECRET</code> before publishing this site.
          </span>
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Paid revenue"
          value={<Money value={revenue} className="font-display" />}
          note={`${orders.filter((o) => o.paymentStatus === "paid").length} verified payments`}
          icon={<Banknote className="size-4" />}
          accent
        />
        <Stat label="Orders" value={String(orders.length)} note={`${pending.length} awaiting progress`} icon={<ShoppingCart className="size-4" />} />
        <Stat label="Customers" value={String(customers)} note="Unique phone numbers" icon={<Users className="size-4" />} />
        <Stat label="Active products" value={String(products.length)} note={`${lowStock.length} low on stock`} icon={<Package className="size-4" />} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <AdminCard
          title="Recent orders"
          action={
            <Link href="/admin/orders" className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-gold-deep">
              View all
            </Link>
          }
        >
          {orders.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <ShoppingCart className="mx-auto size-7 text-navy/15" />
              <p className="mt-3 font-display text-lg text-navy">No orders yet.</p>
              <p className="mt-1 text-[0.72rem] text-navy/40">Orders placed on the storefront will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-b border-navy/8 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-navy/35">
                    <th className="px-5 py-2.5">Order</th>
                    <th className="px-3 py-2.5">Customer</th>
                    <th className="px-3 py-2.5">Total</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-5 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/6">
                  {orders.slice(0, 6).map((order) => (
                    <tr key={order.id} className="text-[0.72rem] transition hover:bg-ivory/60">
                      <td className="px-5 py-3">
                        <span className="block font-mono text-[0.65rem] font-semibold text-navy">{order.number}</span>
                        <span className="text-[0.58rem] text-navy/35">
                          {new Date(order.createdAt).toLocaleDateString("en-NG")}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-navy/65">{order.customer.fullName}</td>
                      <td className="px-3 py-3 font-semibold text-navy">{formatNaira(order.total)}</td>
                      <td className="px-3 py-3">
                        <StatusBadge value={order.status} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link href={`/admin/orders/${order.id}`} className="inline-flex text-navy/40 hover:text-gold-deep">
                          <ArrowUpRight className="size-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>

        <div className="space-y-5">
          <AdminCard title="Needs attention">
            <div className="divide-y divide-navy/6">
              <Link href="/admin/orders" className="flex items-center justify-between px-5 py-3.5 transition hover:bg-ivory/60">
                <span className="flex items-center gap-2.5 text-[0.75rem] text-navy/65">
                  <ClipboardList className="size-4 text-gold-deep" /> Orders in progress
                </span>
                <span className="text-[0.75rem] font-bold text-navy">{pending.length}</span>
              </Link>
              <Link href="/admin/inquiries" className="flex items-center justify-between px-5 py-3.5 transition hover:bg-ivory/60">
                <span className="flex items-center gap-2.5 text-[0.75rem] text-navy/65">
                  <Boxes className="size-4 text-gold-deep" /> New wholesale enquiries
                </span>
                <span className="text-[0.75rem] font-bold text-navy">{newInquiries.length}</span>
              </Link>
              <Link href="/admin/messages" className="flex items-center justify-between px-5 py-3.5 transition hover:bg-ivory/60">
                <span className="flex items-center gap-2.5 text-[0.75rem] text-navy/65">
                  <Mail className="size-4 text-gold-deep" /> Unread messages
                </span>
                <span className="text-[0.75rem] font-bold text-navy">{unread.length}</span>
              </Link>
              <Link href="/admin/products" className="flex items-center justify-between px-5 py-3.5 transition hover:bg-ivory/60">
                <span className="flex items-center gap-2.5 text-[0.75rem] text-navy/65">
                  <TriangleAlert className="size-4 text-amber-600" /> Low stock items
                </span>
                <span className="text-[0.75rem] font-bold text-navy">{lowStock.length}</span>
              </Link>
            </div>
          </AdminCard>

          <AdminCard title="Low stock" action={<Link href="/admin/products" className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-gold-deep">Manage</Link>}>
            {lowStock.length === 0 ? (
              <p className="px-5 py-6 text-[0.72rem] text-navy/40">Everything is comfortably stocked.</p>
            ) : (
              <ul className="divide-y divide-navy/6">
                {lowStock.slice(0, 4).map((p) => (
                  <li key={p.id} className="flex items-center justify-between px-5 py-3">
                    <span className="min-w-0 pr-3">
                      <span className="block truncate text-[0.72rem] font-medium text-navy">{p.name}</span>
                      <span className="text-[0.58rem] text-navy/35">{p.packSize}</span>
                    </span>
                    <span className="shrink-0 text-[0.65rem] font-bold text-amber-700">{p.stock} left</span>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <AdminCard title="Latest wholesale enquiries" action={<Link href="/admin/inquiries" className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-gold-deep">Open desk</Link>}>
          {inquiries.length === 0 ? (
            <p className="px-5 py-6 text-[0.72rem] text-navy/40">No enquiries yet. The form is live on the wholesale page.</p>
          ) : (
            <ul className="divide-y divide-navy/6">
              {inquiries.slice(0, 4).map((i) => (
                <li key={i.id} className="flex items-start justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[0.72rem] font-semibold text-navy">
                      {i.businessName || i.fullName}
                    </p>
                    <p className="mt-0.5 truncate text-[0.62rem] text-navy/40">
                      {i.products.replace(/\n/g, " · ")}
                    </p>
                  </div>
                  <StatusBadge value={i.status} />
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard title="Recently completed">
          <div className="grid grid-cols-2 divide-x divide-navy/6">
            <div className="px-5 py-5">
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-navy/35">Delivered</p>
              <p className="mt-2 font-display text-2xl text-navy">{completed.length}</p>
              <p className="mt-1 text-[0.62rem] text-navy/35">Orders fulfilled</p>
            </div>
            <div className="px-5 py-5">
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-navy/35">Unpaid</p>
              <p className="mt-2 font-display text-2xl text-navy">
                {orders.filter((o) => o.paymentStatus === "unpaid").length}
              </p>
              <p className="mt-1 text-[0.62rem] text-navy/35">Awaiting payment</p>
            </div>
          </div>
          <div className="border-t border-navy/8 px-5 py-3">
            <p className="text-[0.62rem] leading-relaxed text-navy/35">
              Only confirm a payment after verifying it in your bank account or Paystack dashboard.
            </p>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
