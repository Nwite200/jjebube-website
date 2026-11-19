"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { useStoreData } from "@/components/store-provider";
import { useWishlistStore } from "@/lib/store";
import { ProductCard } from "@/components/product-card";
import { useEffect, useState } from "react";

export function WishlistView() {
  const { products } = useStoreData();
  const ids = useWishlistStore((s) => s.ids);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="container-edge grid grid-cols-2 gap-4 py-12 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[3/4]" />
        ))}
      </div>
    );
  }

  const saved = products.filter((p) => ids.includes(p.id));

  if (saved.length === 0) {
    return (
      <div className="container-edge flex flex-col items-center justify-center py-20 text-center md:py-28">
        <span className="flex size-20 items-center justify-center rounded-full border border-gold/30 bg-white">
          <Heart className="size-7 text-gold-deep" strokeWidth={1.4} />
        </span>
        <h2 className="mt-7 font-display text-[2rem] text-navy">Nothing saved yet.</h2>
        <p className="mt-3 max-w-sm text-[0.9rem] leading-relaxed text-navy/50">
          Tap the heart on any product to keep it here while you shop. Your saved list stays on this device.
        </p>
        <Link href="/shop" className="btn btn-gold mt-7">
          Browse products <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-edge py-10 md:py-14">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/10 pb-4">
        <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-navy">
          {saved.length} saved item{saved.length === 1 ? "" : "s"}
        </p>
        <Link href="/shop" className="text-[0.66rem] font-semibold text-navy/45 underline underline-offset-2 hover:text-navy">
          Continue shopping
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {saved.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
