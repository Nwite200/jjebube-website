import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { createOrder, getProducts, getSettings, updateOrder } from "@/lib/db";
import { makeOrderNumber } from "@/lib/utils";
import { initializePaystack, paystackConfigured } from "@/lib/paystack";
import type { Order, OrderItem } from "@/lib/types";

const itemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

const schema = z.object({
  items: z.array(itemSchema).min(1).max(50),
  zoneId: z.string().min(1),
  paymentMethod: z.enum(["paystack", "bank-transfer", "pay-on-delivery", "whatsapp"]),
  customer: z.object({
    fullName: z.string().trim().min(2).max(120),
    phone: z
      .string()
      .trim()
      .min(7)
      .max(24)
      .regex(/^[0-9+\s()-]+$/, "Enter a valid phone number"),
    email: z.string().trim().email().max(160),
    address: z.string().trim().min(6).max(300),
    state: z.string().trim().min(2).max(80),
    city: z.string().trim().min(2).max(80),
    notes: z.string().trim().max(1000).optional().default(""),
  }),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check your details and try again.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  const zone = settings.deliveryZones.find((z) => z.id === data.zoneId);
  if (!zone) {
    return NextResponse.json({ ok: false, error: "Choose a valid delivery option." }, { status: 400 });
  }

  const items: OrderItem[] = [];
  let subtotal = 0;

  for (const line of data.items) {
    const product = products.find((p) => p.id === line.productId);
    if (!product || product.price === null) {
      return NextResponse.json(
        { ok: false, error: "One of the items is no longer available online. Please review your bag." },
        { status: 409 },
      );
    }
    if (product.stock <= 0) {
      return NextResponse.json(
        { ok: false, error: `${product.name} is currently out of stock.` },
        { status: 409 },
      );
    }
    const quantity = Math.min(line.quantity, product.stock);
    items.push({
      productId: product.id,
      name: product.name,
      brand: product.brandSlug,
      packSize: product.packSize,
      image: product.image,
      unitPrice: product.price,
      quantity,
    });
    subtotal += product.price * quantity;
  }

  const deliveryFee =
    zone.fee === 0 || subtotal >= settings.freeShippingThreshold ? 0 : zone.fee;
  const total = subtotal + deliveryFee;

  if (data.paymentMethod === "paystack" && !paystackConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Card payments are not enabled yet. Please choose another payment method." },
      { status: 400 },
    );
  }

  const id = randomUUID();
  const number = makeOrderNumber();

  const order: Order = {
    id,
    number,
    createdAt: new Date().toISOString(),
    status: "pending",
    paymentStatus: "unpaid",
    paymentMethod: data.paymentMethod,
    customer: { ...data.customer, notes: data.customer.notes ?? "" },
    zoneId: zone.id,
    items,
    subtotal,
    deliveryFee,
    total,
  };

  await createOrder(order);

  if (data.paymentMethod === "paystack") {
    try {
      const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
      const reference = `${number}-${Date.now().toString(36).toUpperCase()}`;
      const init = await initializePaystack({
        email: data.customer.email,
        amountKobo: total * 100,
        reference,
        callbackUrl: `${site}/api/paystack/callback`,
        metadata: { orderId: id, orderNumber: number },
      });
      await updateOrder(id, { paymentReference: reference });
      return NextResponse.json({
        ok: true,
        orderId: id,
        orderNumber: number,
        authorizationUrl: init.authorization_url,
      });
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Your order was saved, but we couldn't start the card payment. Please try again or order on WhatsApp.",
          orderNumber: number,
        },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ ok: true, orderId: id, orderNumber: number });
}
