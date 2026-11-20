import Link from "next/link";
import { Clock, LockKeyhole, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";
import { InstallAppButton } from "./pwa/install-app-button";
import { getCategories, getSettings } from "@/lib/db";
import { whatsappUrl } from "@/lib/utils";

export async function SiteFooter() {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);

  const topCategories = categories.filter((c) => c.slug !== "bulk-wholesale").slice(0, 5);

  return (
    <footer className="noise relative overflow-hidden bg-navy text-ivory">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="container-edge relative pb-16 pt-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1.4fr] lg:gap-10">
          <div>
            <Logo inverted />
            <p className="mt-6 max-w-xs font-display text-2xl leading-snug text-ivory/90">
              Quality Products.
              <br />
              <span className="italic text-gold-soft">Better Life.</span>
            </p>
            <p className="mt-4 max-w-xs text-[0.8rem] leading-relaxed text-ivory/50">
              Your trusted store for quality food, drinks and household essentials — for homes,
              shops and businesses across Nigeria.
            </p>
            <div className="mt-7 space-y-3">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-3 text-[0.8rem] text-ivory/70 transition hover:text-gold-soft"
              >
                <Phone className="size-4 text-gold" strokeWidth={1.7} />
                {settings.phone}
              </a>
              {settings.phoneAlt && (
                <a
                  href={`tel:${settings.phoneAlt}`}
                  className="flex items-center gap-3 text-[0.8rem] text-ivory/70 transition hover:text-gold-soft"
                >
                  <Phone className="size-4 text-gold" strokeWidth={1.7} />
                  {settings.phoneAlt}
                </a>
              )}
              <a
                href={whatsappUrl(settings.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-[0.8rem] text-ivory/70 transition hover:text-gold-soft"
              >
                <MessageCircle className="size-4 text-gold" strokeWidth={1.7} />
                Chat on WhatsApp
              </a>
              <p className="flex items-center gap-3 text-[0.8rem] text-ivory/50">
                <Clock className="size-4 text-gold/80" strokeWidth={1.7} />
                {settings.hours}
              </p>
              {settings.address && (
                <p className="flex items-start gap-3 text-[0.75rem] leading-relaxed text-ivory/50">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-gold/80" strokeWidth={1.7} />
                  <span>
                    <span className="block text-[0.55rem] font-bold uppercase tracking-[0.12em] text-ivory/35">Office</span>
                    {settings.address}
                    {settings.branchAddress && (
                      <>
                        <span className="mt-2 block text-[0.55rem] font-bold uppercase tracking-[0.12em] text-ivory/35">Branch</span>
                        {settings.branchAddress}
                      </>
                    )}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-gold-soft">Shop</h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/shop" className="text-[0.8rem] text-ivory/65 transition hover:text-ivory">
                  All Products
                </Link>
              </li>
              {topCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="text-[0.8rem] text-ivory/65 transition hover:text-ivory"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/deals" className="text-[0.8rem] text-ivory/65 transition hover:text-ivory">
                  Deals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-gold-soft">
              Company
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/about" className="text-[0.8rem] text-ivory/65 transition hover:text-ivory">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/wholesale" className="text-[0.8rem] text-ivory/65 transition hover:text-ivory">
                  Wholesale
                </Link>
              </li>
              <li>
                <Link href="/brands" className="text-[0.8rem] text-ivory/65 transition hover:text-ivory">
                  Our Brands
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[0.8rem] text-ivory/65 transition hover:text-ivory">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-[0.8rem] text-ivory/65 transition hover:text-ivory">
                  Track an Order
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="flex items-center gap-1.5 text-[0.8rem] text-gold-soft/80 transition hover:text-gold-soft">
                  <ShieldCheck className="size-3.5" /> Admin Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-gold-soft">
              Join the list
            </h3>
            <p className="mt-4 text-[0.8rem] leading-relaxed text-ivory/55">
              New arrivals, everyday deals and wholesale updates — straight to your inbox.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
            <p className="mt-4 text-[0.62rem] leading-relaxed text-ivory/35">
              We only send useful updates. Unsubscribe anytime.
            </p>

            <div className="mt-7">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-ivory/35">
                We accept
              </p>
              <p className="mt-2 text-[0.7rem] text-ivory/55">
                Card · Bank transfer · Pay on delivery
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-6 border-t border-ivory/10 pt-7 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.65rem] text-ivory/35">
            <span>© {new Date().getFullYear()} JJ Ebube Enterprise. All rights reserved.</span>
            <span className="hidden h-3 w-px bg-ivory/15 md:block" />
            <span>Retail · Wholesale · Bulk Orders</span>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 border border-gold/40 bg-gold/10 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-gold-soft transition hover:border-gold hover:bg-gold/15"
            >
              <LockKeyhole className="size-3" /> Admin Login
            </Link>
            <a
              href="https://pos.jjebubeenterprise.com.ng/"
              target="_blank"
              rel="noreferrer"
              aria-label="Staff login to the JJ Ebube point of sale"
              className="inline-flex items-center gap-1.5 border border-ivory/15 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-ivory/55 transition hover:border-gold/60 hover:text-gold-soft"
            >
              <LockKeyhole className="size-3" /> Staff POS
            </a>
            <InstallAppButton />
          </div>
          <p className="font-display text-sm italic text-gold-soft/80">
            Your Trusted Store for Quality Products.
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute -bottom-24 right-0 h-40 w-[70%] opacity-20">
        <svg viewBox="0 0 900 160" className="h-full w-full" fill="none" aria-hidden="true">
          <path
            d="M0 130 C180 40, 360 170, 560 80 C700 20, 820 40, 900 80"
            stroke="#D9AC42"
            strokeWidth="0.8"
          />
          <path
            d="M0 145 C190 55, 370 185, 570 95 C710 35, 830 55, 900 95"
            stroke="#D9AC42"
            strokeWidth="0.5"
            opacity="0.6"
          />
        </svg>
      </div>
    </footer>
  );
}
