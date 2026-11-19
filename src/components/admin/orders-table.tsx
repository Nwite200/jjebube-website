"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import type { Order } from "@/lib/types";
import { formatNaira } from "@/lib/utils";
import { StatusBadge } from "./ui";

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        if (status && o.status !== status) return false;
        if (payment && o.paymentStatus !== payment) return false;
        if (q) {
          const hay = `${o.number} ${o.customer.fullName} ${o.customer.phone} ${o.customer.email}`.toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      }),
    [orders, q, status, payment],
  );

  return (
    <div className="border border-navy/10 bg-white">
      <div className="flex flex-col gap-3 border-b border-navy/8 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-navy/30" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search order number, customer, phone"
            className="field h-9 pl-9 text-[0.78rem]"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="field h-9 w-auto text-[0.72rem]">
          <option value="">All statuses</option>
          {["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={payment} onChange={(e) => setPayment(e.target.value)} className="field h-9 w-auto text-[0.72rem]">
          <option value="">All payments</option>
          {["unpaid", "paid", "refunded"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-navy/35">
          {filtered.length} of {orders.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left">
          <thead>
            <tr className="border-b border-navy/8 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-navy/35">
              <th className="px-4 py-2.5">Order</th>
              <th className="px-3 py-2.5">Customer</th>
              <th className="px-3 py-2.5">Items</th>
              <th className="px-3 py-2.5">Total</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5">Payment</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/6">
            {filtered.map((o) => (
              <tr key={o.id} className="text-[0.72rem] transition hover:bg-ivory/50">
                <td className="px-4 py-3">
                  <span className="block font-mono text-[0.66rem] font-semibold text-navy">{o.number}</span>
                  <span className="text-[0.58rem] text-navy/35">
                    {new Date(o.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="block font-medium text-navy">{o.customer.fullName}</span>
                  <span className="text-[0.6rem] text-navy/35">{o.customer.phone}</span>
                </td>
                <td className="px-3 py-3 text-navy/55">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                <td className="px-3 py-3 font-semibold text-navy">{formatNaira(o.total)}</td>
                <td className="px-3 py-3"><StatusBadge value={o.status} /></td>
                <td className="px-3 py-3"><StatusBadge value={o.paymentStatus} /></td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/orders/${o.id}`} className="inline-flex text-navy/35 hover:text-gold-deep">
                    <ArrowUpRight className="size-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-12 text-center text-[0.75rem] text-navy/35">No orders match those filters.</p>
        )}
      </div>
    </div>
  );
}
