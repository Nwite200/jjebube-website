import type { Metadata } from "next";
import { ShopHeader } from "@/components/shop-header";
import { OrderLookup } from "@/components/account/order-lookup";

export const metadata: Metadata = {
  title: "Track an Order",
  description: "Look up your JJ Ebube Enterprise order using your order number and phone number.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <>
      <ShopHeader
        eyebrow="Your orders"
        title="Track an Order"
        description="Check the status of your order, review what you bought and see the next steps."
        crumbs={[{ label: "Account" }]}
        note="No account needed · Use your order number"
      />
      <div className="container-edge py-10 md:py-14">
        <OrderLookup />
      </div>
    </>
  );
}
