"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { ClientConfig, ClientProduct } from "@/lib/catalog-view";
import { useCartStore } from "@/lib/store";

type StoreContextValue = {
  products: ClientProduct[];
  byId: Record<string, ClientProduct>;
  config: ClientConfig;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({
  products,
  config,
  children,
}: {
  products: ClientProduct[];
  config: ClientConfig;
  children: ReactNode;
}) {
  const value = useMemo(() => {
    const byId: Record<string, ClientProduct> = {};
    for (const p of products) byId[p.id] = p;
    return { products, byId, config };
  }, [products, config]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStoreData() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStoreData must be used inside StoreProvider");
  return ctx;
}

export type ResolvedLine = {
  product: ClientProduct;
  quantity: number;
  lineTotal: number;
};

export function useCartDetails() {
  const { byId } = useStoreData();
  const items = useCartStore((s) => s.items);
  const hydrated = useCartStore((s) => s.hydrated);

  return useMemo(() => {
    const lines: ResolvedLine[] = [];
    let subtotal = 0;
    let count = 0;
    let savings = 0;
    for (const item of items) {
      const product = byId[item.productId];
      if (!product || product.price === null) continue;
      const quantity = Math.min(item.quantity, Math.max(0, product.stock));
      if (quantity <= 0) continue;
      lines.push({ product, quantity, lineTotal: product.price * quantity });
      subtotal += product.price * quantity;
      count += quantity;
      if (product.compareAtPrice && product.compareAtPrice > product.price) {
        savings += (product.compareAtPrice - product.price) * quantity;
      }
    }
    return { lines, subtotal, count, savings, hydrated };
  }, [items, byId, hydrated]);
}
