import type { Metadata } from "next";
import { ShopHeader } from "@/components/shop-header";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import { getSettings } from "@/lib/db";
import { paystackConfigured } from "@/lib/paystack";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your JJ Ebube Enterprise order.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const settings = await getSettings();

  return (
    <>
      <ShopHeader
        eyebrow="Secure checkout"
        title="Complete Your Order"
        description="A few details and your everyday essentials are on their way. Delivery is available across Nigeria."
        crumbs={[{ label: "Bag", href: "/cart" }, { label: "Checkout" }]}
        note="Contact · Delivery · Payment"
      />
      <CheckoutClient
        zones={settings.deliveryZones}
        threshold={settings.freeShippingThreshold}
        paystackEnabled={paystackConfigured()}
        bank={settings.bankTransfer}
        whatsapp={settings.whatsapp}
      />
    </>
  );
}
