import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, HeartHandshake, ShieldCheck, Store, Tags, Truck } from "lucide-react";
import { EditorialImage } from "@/components/editorial-image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "JJ Ebube Enterprise is a Nigerian FMCG, food and grocery distributor serving homes, shops and businesses with quality products and honest value.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Quality, without compromise",
    body: "We stock products from brands people already know and trust — and we tell you exactly what you're buying.",
  },
  {
    icon: Tags,
    title: "Value that makes sense",
    body: "Fair, transparent prices for everyday essentials, with dedicated business pricing for bulk orders.",
  },
  {
    icon: Truck,
    title: "Dependable supply",
    body: "From a single pack to carton quantities, we help homes and businesses keep their shelves stocked.",
  },
  {
    icon: HeartHandshake,
    title: "A human experience",
    body: "Real people on the phone and on WhatsApp, ready to help you find a product or complete an order.",
  },
];

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      <section className="relative overflow-hidden bg-ivory">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_70%_40%,rgba(217,172,66,0.12),transparent_65%)]" />
        <div className="container-edge relative py-10 md:py-16">
          <Breadcrumbs items={[{ label: "About Us" }]} />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold" />
                <p className="eyebrow text-gold-deep">Our story</p>
              </div>
              <h1 className="mt-5 max-w-[600px] font-display text-[clamp(2.6rem,5vw,4.6rem)] leading-[1.0] tracking-[-0.025em] text-navy">
                A Nigerian store built on{" "}
                <span className="italic text-gold-deep">trust.</span>
              </h1>
              <p className="mt-6 max-w-[500px] text-[0.95rem] leading-relaxed text-navy/55">
                JJ Ebube Enterprise is a food, beverage and grocery business serving homes, shops and organisations
                across Nigeria. We bring together the everyday products people rely on — and make them simple to buy,
                at prices that make sense.
              </p>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-navy/45">
                {["Retail", "Wholesale", "Bulk orders", "Nationwide delivery"].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <Check className="size-3 text-gold-deep" /> {item}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/shop" className="btn btn-navy">
                  Shop our products <ArrowRight className="size-4" />
                </Link>
                <Link href="/wholesale" className="btn btn-outline">
                  Wholesale enquiries <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-3 -top-3 hidden h-full w-full border border-gold/35 sm:block" />
              <EditorialImage
                src="/editorial/store.webp"
                alt="A stocked grocery aisle with everyday essentials"
                className="relative aspect-[4/4.4] w-full"
                sizes="(max-width: 1024px) 100vw, 46vw"
                priority
              />
              <div className="absolute -bottom-4 right-4 border border-gold/30 bg-navy px-5 py-4 text-ivory shadow-lg sm:-right-4">
                <p className="font-display text-xl italic leading-none text-gold-soft">Quality Products.</p>
                <p className="mt-1.5 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-ivory/45">
                  Better Life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-navy/8 bg-white py-14 md:py-20">
        <div className="container-edge grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <p className="eyebrow text-gold-deep">What we stand for</p>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,3.2vw,2.8rem)] leading-[1.05] text-navy">
              The standards behind every shelf.
            </h2>
            <p className="mt-3 max-w-[340px] text-[0.85rem] leading-relaxed text-navy/45">
              No complicated promises. Just a clear, consistent way of doing business — for customers and for the
              businesses we supply.
            </p>
          </div>

          <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="flex gap-4 border-t border-navy/10 pt-5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-ivory">
                    <Icon className="size-4 text-gold-deep" strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3 className="font-display text-[1.2rem] leading-tight text-navy">{value.title}</h3>
                    <p className="mt-1.5 text-[0.78rem] leading-relaxed text-navy/45">{value.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-ivory py-14 md:py-20">
        <div className="container-edge">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <p className="eyebrow text-gold-deep">How we serve you</p>
          </div>
          <h2 className="mt-3 max-w-[560px] font-display text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.04] text-navy">
            One store. Three ways to shop.
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Store,
                label: "Retail",
                title: "Everyday essentials",
                body: "Buy the packs you need for your home, with simple online checkout or WhatsApp ordering.",
                href: "/shop",
                cta: "Shop retail",
              },
              {
                icon: Tags,
                label: "Wholesale",
                title: "Carton quantities",
                body: "Business pricing for shops, restaurants, offices and resellers. Send your list for a quote.",
                href: "/wholesale",
                cta: "Request a quote",
              },
              {
                icon: Truck,
                label: "Bulk & supply",
                title: "Orders that scale",
                body: "Larger volumes and recurring supply needs, discussed directly with our sales team.",
                href: "/wholesale",
                cta: "Talk to sales",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group flex flex-col border border-navy/10 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_24px_44px_-24px_rgba(7,26,58,0.25)] md:p-7"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="size-5 text-gold-deep" strokeWidth={1.5} />
                    <span className="text-[0.52rem] font-bold uppercase tracking-[0.16em] text-navy/30">
                      {card.label}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-[1.5rem] leading-tight text-navy">{card.title}</h3>
                  <p className="mt-2 flex-1 text-[0.8rem] leading-relaxed text-navy/45">{card.body}</p>
                  <span className="mt-6 flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-gold-deep">
                    {card.cta} <ArrowUpRight className="size-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="noise relative overflow-hidden bg-navy py-14 text-ivory md:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(217,172,66,0.12),transparent_65%)]" />
        </div>
        <div className="container-edge relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow text-gold-soft/70">A store you can rely on</p>
            <h2 className="mt-3 max-w-[620px] font-display text-[clamp(1.9rem,3.5vw,3rem)] leading-[1.05]">
              Quality products, better prices, and a team that picks up the phone.
            </h2>
            <p className="mt-3 max-w-lg text-[0.85rem] leading-relaxed text-ivory/50">
              Whether you&apos;re shopping for your family or stocking a business, we&apos;re here to make it
              straightforward.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Link href="/contact" className="btn btn-gold">
              Contact us <ArrowRight className="size-4" />
            </Link>
            <a href={`tel:${settings.phone}`} className="btn btn-outline-light">
              {settings.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
