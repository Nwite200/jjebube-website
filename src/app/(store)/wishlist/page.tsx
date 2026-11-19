import type { Metadata } from "next";
import { ShopHeader } from "@/components/shop-header";
import { WishlistView } from "@/components/wishlist/wishlist-view";

export const metadata: Metadata = {
  title: "Your Wishlist",
  description: "Products you've saved at JJ Ebube Enterprise.",
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return (
    <>
      <ShopHeader
        eyebrow="Saved for later"
        title="Your Wishlist"
        description="A quiet place to keep the products you're thinking about. Saved on this device."
        crumbs={[{ label: "Wishlist" }]}
      />
      <WishlistView />
    </>
  );
}
