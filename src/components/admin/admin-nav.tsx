"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Package,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/actions";

export const ADMIN_LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/inquiries", label: "Wholesale", icon: ClipboardList },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/catalog", label: "Catalogue", icon: Boxes },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-ivory/10 px-6 py-6">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full border border-gold/40 font-display text-sm font-semibold text-gold">
            JJ
          </span>
          <span>
            <span className="block text-[0.72rem] font-bold uppercase tracking-[0.18em] text-ivory">JJ Ebube</span>
            <span className="mt-0.5 block text-[0.5rem] font-bold uppercase tracking-[0.24em] text-gold-soft/70">
              Admin desk
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-5">
        {ADMIN_LINKS.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 border-l-2 px-3 py-2.5 text-[0.76rem] font-medium transition",
                active
                  ? "border-gold bg-ivory/8 text-ivory"
                  : "border-transparent text-ivory/50 hover:bg-ivory/5 hover:text-ivory",
              )}
            >
              <Icon className={cn("size-4", active ? "text-gold" : "text-ivory/35 group-hover:text-gold/70")} strokeWidth={1.7} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ivory/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-[0.72rem] text-ivory/45 transition hover:text-gold-soft"
        >
          <BarChart3 className="size-4" /> View storefront
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2.5 text-[0.72rem] text-ivory/45 transition hover:text-red-300"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </form>
      </div>
    </div>
  );
}


export function AdminMobileBar() {
  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between bg-navy px-4 py-3 text-ivory">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-full border border-gold/40 font-display text-[0.6rem] text-gold">JJ</span>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em]">Admin</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="text-[0.58rem] uppercase tracking-[0.1em] text-ivory/50">View store</Link>
          <form action={logoutAction}>
            <button type="submit" className="text-[0.58rem] uppercase tracking-[0.1em] text-ivory/50">Sign out</button>
          </form>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto bg-navy px-3 pb-2">
        {ADMIN_LINKS.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap px-3 py-1.5 text-[0.62rem] text-ivory/60">
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
