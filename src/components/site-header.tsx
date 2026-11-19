"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Heart,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { Logo } from "./logo";
import { AnimatedBrandLogo } from "./brand/animated-brand-logo";
import { SearchDialog } from "./search-dialog";
import { useStoreData, useCartDetails } from "./store-provider";
import { useUIStore, useWishlistStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Deals", href: "/deals" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader({ categories }: { categories: { slug: string; name: string }[] }) {
  const pathname = usePathname();
  const { config } = useStoreData();
  const { count } = useCartDetails();
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const openCart = useUIStore((s) => s.openCart);
  const openSearch = useUIStore((s) => s.openSearch);
  const menuOpen = useUIStore((s) => s.menuOpen);
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);
  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const previousCount = useRef(0);
  const countInitialized = useRef(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!countInitialized.current) {
      countInitialized.current = true;
      previousCount.current = count;
      return;
    }
    if (count > previousCount.current) {
      setCartBump(true);
      const t = window.setTimeout(() => setCartBump(false), 620);
      previousCount.current = count;
      return () => window.clearTimeout(t);
    }
    previousCount.current = count;
  }, [count, mounted]);

  useEffect(() => {
    setMenuOpen(false);
    setCatOpen(false);
  }, [pathname, setMenuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      }
      if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openSearch]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-navy/8 bg-white/95 backdrop-blur-md transition-shadow duration-300",
          scrolled && "shadow-[0_10px_30px_-18px_rgba(7,26,58,0.35)]",
        )}
      >
        <div className="container-edge">
          <div className="flex h-[74px] items-center gap-4 md:h-[88px] md:gap-6">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="-ml-2 flex size-10 items-center justify-center text-navy lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>

            <AnimatedBrandLogo />

            <div className="mx-auto hidden max-w-[560px] flex-1 justify-center px-4 lg:flex">
              <button
                type="button"
                onClick={openSearch}
                className="group flex h-11 w-full items-center gap-3 border border-navy/12 bg-ivory/70 px-4 text-left transition-colors duration-300 hover:border-gold/70 hover:bg-white"
              >
                <Search className="size-4 shrink-0 text-navy/45 transition-colors group-hover:text-gold-deep" strokeWidth={1.9} />
                <span className="flex-1 truncate text-[0.8rem] font-medium text-navy/45">
                  Search for products, brands and more…
                </span>
                <kbd className="hidden items-center rounded-sm border border-navy/12 bg-white px-1.5 py-0.5 font-sans text-[0.58rem] font-semibold tracking-wide text-navy/40 xl:flex">
                  ⌘K
                </kbd>
              </button>
            </div>

            <div className="ml-auto flex items-center gap-0.5 md:gap-1.5">
              <Link
                href="/account"
                className="hidden items-center gap-2.5 px-3 py-2 text-navy transition-colors hover:text-gold-deep sm:flex"
                aria-label="Your account"
              >
                <User className="size-[19px]" strokeWidth={1.6} />
                <span className="hidden flex-col leading-tight xl:flex">
                  <span className="text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-navy/45">Account</span>
                  <span className="text-[0.76rem] font-semibold">Sign in</span>
                </span>
              </Link>

              <Link
                href="/wishlist"
                className="relative flex size-10 items-center justify-center text-navy transition-colors hover:text-gold-deep md:size-11"
                aria-label="Wishlist"
              >
                <Heart className="size-[19px]" strokeWidth={1.6} />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute right-0.5 top-1 flex size-4 items-center justify-center rounded-full bg-navy text-[0.52rem] font-bold text-ivory">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={openCart}
                className="group relative flex items-center gap-2.5 px-2 py-2 text-navy transition-colors hover:text-gold-deep md:px-3"
                aria-label={`Open cart${mounted && count > 0 ? `, ${count} items` : ""}`}
              >
                <span className={cn("relative", cartBump && "cart-bump")}>
                  <ShoppingBag className="size-[20px]" strokeWidth={1.6} />
                  {mounted && count > 0 && (
                    <span
                      key={count}
                      className="animate-pop absolute -right-2 -top-2 flex min-w-4 items-center justify-center rounded-full bg-gold px-1 py-0.5 text-[0.52rem] font-extrabold leading-none text-navy ring-2 ring-white"
                    >
                      {count}
                    </span>
                  )}
                </span>
                <span className="hidden flex-col leading-tight xl:flex">
                  <span className="text-[0.55rem] font-semibold uppercase tracking-[0.12em] text-navy/45">Your bag</span>
                  <span className="text-[0.76rem] font-semibold">
                    {mounted && count > 0 ? `${count} item${count === 1 ? "" : "s"}` : "Empty"}
                  </span>
                </span>
              </button>
            </div>
          </div>

          <div className="pb-2.5 lg:hidden">
            <button
              type="button"
              onClick={openSearch}
              className="flex h-10 w-full items-center gap-2.5 border border-navy/10 bg-ivory/70 px-3.5 text-left"
            >
              <Search className="size-4 text-navy/40" />
              <span className="text-[0.76rem] font-medium text-navy/45">Search products, brands…</span>
            </button>
          </div>

          <nav className="hidden items-center justify-between border-t border-navy/8 lg:flex">
            <div className="flex items-center">
              <div
                className="relative"
                onMouseEnter={() => setCatOpen(true)}
                onMouseLeave={() => setCatOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setCatOpen((v) => !v)}
                  aria-expanded={catOpen}
                  className="flex h-[52px] items-center gap-2.5 bg-navy px-5 text-[0.64rem] font-bold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-blue"
                >
                  <Menu className="size-4" strokeWidth={2} />
                  All Categories
                  <ChevronDown className={cn("size-3.5 transition-transform", catOpen && "rotate-180")} />
                </button>

                {catOpen && (
                  <div className="animate-float-in absolute left-0 top-full z-50 w-[560px] border border-navy/8 bg-white p-6 shadow-[0_30px_60px_-20px_rgba(7,26,58,0.35)]">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                      {categories.map((cat, i) => (
                        <Link
                          key={cat.slug}
                          href={`/category/${cat.slug}`}
                          onClick={() => setCatOpen(false)}
                          className="group flex items-center justify-between border-b border-navy/6 py-2.5"
                        >
                          <span className="flex items-baseline gap-2.5">
                            <span className="font-display text-[0.6rem] italic text-gold-deep">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-[0.82rem] font-medium text-navy transition-colors group-hover:text-gold-deep">
                              {cat.name}
                            </span>
                          </span>
                          <ArrowUpRight className="size-3 text-navy/20 transition-all group-hover:-translate-y-0.5 group-hover:text-gold-deep" />
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/wholesale"
                      onClick={() => setCatOpen(false)}
                      className="mt-5 flex items-center justify-between bg-navy px-4 py-3.5 text-ivory"
                    >
                      <span>
                        <span className="block text-[0.55rem] font-bold uppercase tracking-[0.18em] text-gold-soft">
                          Buying for a business?
                        </span>
                        <span className="mt-0.5 block font-display text-base">Wholesale &amp; bulk orders</span>
                      </span>
                      <ArrowRight className="size-4 text-gold" />
                    </Link>
                  </div>
                )}
              </div>

              <div className="ml-4 flex items-center xl:ml-6">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex h-[52px] items-center px-3 text-[0.72rem] font-semibold tracking-[0.03em] text-navy/75 transition-colors hover:text-navy xl:px-4",
                      item.label === "About Us" && "hidden xl:flex",
                      active(item.href) && "text-navy",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute bottom-0 left-3 right-3 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 xl:left-4 xl:right-4",
                        active(item.href) && "scale-x-100",
                      )}
                    />
                  </Link>
                ))}
              </div>
            </div>

            <a
              href={`tel:${config.phone}`}
              className="hidden h-[52px] items-center gap-2.5 text-[0.72rem] font-semibold text-navy/75 transition-colors hover:text-gold-deep xl:flex"
            >
              <Phone className="size-4 text-gold-deep" strokeWidth={1.7} />
              {config.phone}
            </a>
          </nav>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[85] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy/55 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          />
          <div className="animate-float-in absolute inset-y-0 left-0 flex w-[90%] max-w-[400px] flex-col overflow-y-auto bg-ivory shadow-2xl">
            <div className="flex items-center justify-between border-b border-navy/10 px-5 py-5">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex size-9 items-center justify-center rounded-full text-navy/60 hover:bg-navy/5"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="px-5 py-6">
              <p className="eyebrow text-navy/35">Menu</p>
              <nav className="mt-4 flex flex-col">
                {NAV.filter((n) => n.label !== "Categories").map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center justify-between border-b border-navy/8 py-3.5"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-display text-[0.65rem] italic text-gold-deep">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-[1.45rem] text-navy">{item.label}</span>
                    </span>
                    <ArrowUpRight className="size-4 text-navy/25" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="px-5 pb-6">
              <p className="eyebrow text-navy/35">Shop by category</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="border border-navy/12 bg-white px-3 py-1.5 text-[0.7rem] font-semibold text-navy"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-auto border-t border-navy/10 bg-white px-5 py-5">
              <a href={`tel:${config.phone}`} className="flex items-center gap-3 py-2 text-sm font-semibold text-navy">
                <Phone className="size-4 text-gold-deep" /> {config.phone}
              </a>
              <a
                href={`https://wa.me/${config.whatsapp.replace(/\D/g, "").replace(/^0/, "234")}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center justify-center gap-2 bg-navy px-4 py-3.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ivory"
              >
                <MessageCircle className="size-4 text-gold" /> Chat with us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      <SearchDialog />
    </>
  );
}
