import { NextResponse } from "next/server";
import crypto from "crypto";
import { getOrders, updateOrder } from "@/lib/db";

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ ok: false }, { status: 400 });

  const raw = await request.text();
  const signature = request.headers.get("x-paystack-signature") || "";
  const expected = crypto.createHmac("sha512", secret).update(raw).digest("hex");

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let event: {
    event?: string;
    data?: { reference?: string; amount?: number; currency?: string; status?: string };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (event.event === "charge.success" && event.data?.reference) {
    const orders = await getOrders();
    const order = orders.find((o) => o.paymentReference === event.data?.reference);
    if (
      order &&
      order.paymentStatus !== "paid" &&
      event.data.status === "success" &&
      event.data.currency === "NGN" &&
      (event.data.amount ?? 0) >= order.total * 100
    ) {
      await updateOrder(order.id, { paymentStatus: "paid", status: "confirmed" });
    }
  }

  return NextResponse.json({ ok: true });
}
