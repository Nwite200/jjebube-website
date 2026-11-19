"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = { productId: string; quantity: number };

type CartState = {
  items: CartLine[];
  hydrated: boolean;
  add: (productId: string, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,
      add: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === productId
                  ? { ...i, quantity: Math.min(99, i.quantity + quantity) }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { productId, quantity }] };
        }),
      remove: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId
                    ? { ...i, quantity: Math.min(99, quantity) }
                    : i,
                ),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "jje-cart",
      version: 1,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

// Mark hydration complete after the persisted store rehydrates, so the UI can
// avoid rendering a misleading empty-cart state during server rendering.
if (typeof window !== "undefined") {
  useCartStore.persist.onFinishHydration(() => {
    useCartStore.setState({ hydrated: true });
  });
  if (useCartStore.persist.hasHydrated()) {
    useCartStore.setState({ hydrated: true });
  }
}

type WishlistState = {
  ids: string[];
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) =>
        set((state) => ({
          ids: state.ids.includes(productId)
            ? state.ids.filter((id) => id !== productId)
            : [...state.ids, productId],
        })),
      remove: (productId) =>
        set((state) => ({ ids: state.ids.filter((id) => id !== productId) })),
      has: (productId) => get().ids.includes(productId),
    }),
    { name: "jje-wishlist", version: 1 },
  ),
);

export type Toast = {
  id: number;
  title: string;
  message?: string;
  href?: string;
  actionLabel?: string;
};

type UIState = {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  toasts: Toast[];
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  setMenuOpen: (open: boolean) => void;
  pushToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
};

let toastId = 1;

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  toasts: [],
  openCart: () => set({ cartOpen: true, menuOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  openSearch: () => set({ searchOpen: true, menuOpen: false }),
  closeSearch: () => set({ searchOpen: false }),
  setMenuOpen: (open) => set({ menuOpen: open }),
  pushToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts.slice(-2), { ...toast, id: toastId++ }],
    })),
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
