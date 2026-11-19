"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Search, ShoppingBag, Store } from "lucide-react";
import { useUIStore, useWishlistStore } from "@/lib/store";
import { useCartDetails } from "./store-provider";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/shop", icon: Store },
  { label: "Search", href: "#search", icon: Search },
  { label: "Saved", href: "/wishlist", icon: Heart },
  { label: "Bag", href: "#cart", icon: ShoppingBag },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const openSearch = useUIStore((s) => s.openSearch);
  const openCart = useUIStore((s) => s.openCart);
  const { count, hydrated } = useCartDetails();
  const saved = useWishlistStore((s) => s.ids.length);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-white/97 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isAction = item.href === "#search" || item.href === "#cart";
          const active =
            !isAction && (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href));
          const badge =
            item.href === "#cart" ? (hydrated ? count : 0) : item.href === "/wishlist" ? saved : 0;

          const inner = (
            <>
              <span className="relative">
                <Icon
                  className={cn("size-[19px] transition-colors", active ? "text-gold-deep" : "text-navy/55")}
                  strokeWidth={active ? 2 : 1.6}
                />
                {badge > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex min-w-3.5 items-center justify-center rounded-full bg-gold px-1 text-[0.48rem] font-extrabold text-navy">
                    {badge}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "text-[0.55rem] font-semibold tracking-wide",
                  active ? "text-navy" : "text-navy/45",
                )}
              >
                {item.label}
              </span>
            </>
          );

          if (isAction) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.href === "#search" ? openSearch : openCart}
                className="flex h-[58px] flex-col items-center justify-center gap-1"
              >
                {inner}
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex h-[58px] flex-col items-center justify-center gap-1"
            >
              {active && <span className="absolute top-0 h-0.5 w-8 bg-gold" />}
              {inner}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
