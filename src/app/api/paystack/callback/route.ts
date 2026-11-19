import { NextResponse } from "next/server";
import { getOrders, updateOrder } from "@/lib/db";
import { verifyPaystack } from "@/lib/paystack";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference") || url.searchParams.get("trxref");
  const site = process.env.NEXT_PUBLIC_SITE_URL || url.origin;

  if (!reference) {
    return NextResponse.redirect(`${site}/account?payment=missing`);
  }

  const orders = await getOrders();
  const order = orders.find((o) => o.paymentReference === reference);

  if (!order) {
    return NextResponse.redirect(`${site}/account?payment=unknown`);
  }

  try {
    const result = await verifyPaystack(reference);
    const expectedKobo = order.total * 100;
    const valid =
      result.status === "success" &&
      result.amount >= expectedKobo &&
      result.currency === "NGN";

    if (!valid) {
      return NextResponse.redirect(
        `${site}/checkout/success/${order.number}?payment=failed`,
      );
    }

    if (order.paymentStatus !== "paid") {
      await updateOrder(order.id, {
        paymentStatus: "paid",
        status: "confirmed",
      });
    }

    return NextResponse.redirect(`${site}/checkout/success/${order.number}`);
  } catch {
    return NextResponse.redirect(
      `${site}/checkout/success/${order.number}?payment=failed`,
    );
  }
}
