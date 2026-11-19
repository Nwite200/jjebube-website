import { NextResponse } from "next/server";
import { z } from "zod";
import { getOrder } from "@/lib/db";

const schema = z.object({
  number: z.string().trim().min(4).max(40),
  phone: z.string().trim().min(7).max(24),
});

function digits(value: string) {
  return value.replace(/\D/g, "").replace(/^234/, "0").slice(-10);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Enter your order number and phone number." }, { status: 400 });
  }

  const order = await getOrder(parsed.data.number.toUpperCase());
  if (!order || digits(order.customer.phone) !== digits(parsed.data.phone)) {
    return NextResponse.json(
      { ok: false, error: "We couldn't find an order with those details. Please check and try again." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    order: {
      number: order.number,
      createdAt: order.createdAt,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      total: order.total,
      items: order.items.map((i) => ({
        name: i.name,
        packSize: i.packSize,
        quantity: i.quantity,
        image: i.image,
      })),
      delivery: `${order.customer.city}, ${order.customer.state}`,
    },
  });
}
