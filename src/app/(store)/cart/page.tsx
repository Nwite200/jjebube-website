import type { Metadata } from "next";
import { ShopHeader } from "@/components/shop-header";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review your JJ Ebube Enterprise order before checkout.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <>
      <ShopHeader
        eyebrow="Almost yours"
        title="Your Bag"
        description="Review your selections, adjust quantities, then continue to a secure checkout."
        crumbs={[{ label: "Bag" }]}
        note="Prices in Nigerian naira"
      />
      <CartView />
    </>
  );
}
