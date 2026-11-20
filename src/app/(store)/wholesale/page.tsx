import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Boxes,
  Check,
  ClipboardList,
  Clock,
  MessageCircle,
  Phone,
  Store,
  Tag,
  Truck,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EditorialImage } from "@/components/editorial-image";
import { WholesaleForm } from "@/components/wholesale/wholesale-form";
import { getHomeContent, getSettings } from "@/lib/db";
import { whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Wholesale & Bulk Orders",
  description:
    "Buy food, drinks and grocery essentials in bulk from JJ Ebube Enterprise. Business pricing, carton quantities and quotes for shops, restaurants, hotels and offices across Nigeria.",
  alternates: { canonical: "/wholesale" },
};

const BENEFITS = [
  {
    icon: Boxes,
    title: "Bulk purchasing",
    body: "Order cartons, cases and larger quantities across our grocery range.",
  },
  {
    icon: Tag,
    title: "Business pricing",
    body: "Receive a clear quote for the quantity and products you need.",
  },
  {
    icon: ClipboardList,
    title: "A simple enquiry",
    body: "Send your list once. We confirm availability, pricing and delivery.",
  },
];

const STEPS = [
  { title: "Share your list", body: "Tell us the products, quantities and delivery location." },
  { title: "We confirm", body: "Our team checks stock and prepares your business quote." },
  { title: "Arrange delivery", body: "Confirm your order and choose delivery or store pickup." },
];

const FAQS = [
  {
    q: "What is the minimum order for wholesale?",
    a: "It depends on the product and the pack configuration. Send us the items you need and we'll advise on the most practical quantity for your business.",
  },
  {
    q: "Do you deliver outside Lagos?",
    a: "Yes — we arrange delivery across Nigeria. Delivery costs and timing are confirmed with your quote based on your location and order size.",
  },
  {
    q: "Can I request a quote without committing to an order?",
    a: "Absolutely. A quote request carries no obligation. We'll confirm availability and pricing so you can decide.",
  },
  {
    q: "How do I pay for a wholesale order?",
    a: "Once your quote is confirmed, our team will share the available payment options, including bank transfer. Online card payments are only marked complete after server verification.",
  },
  {
    q: "Do you supply shops, restaurants and offices?",
    a: "Yes. We work with retail shops, provision stores, supermarkets, restaurants, hotels, food vendors, distributors, offices and families buying in bulk.",
  },
];

export default async function WholesalePage() {
  const [settings, content] = await Promise.all([getSettings(), getHomeContent()]);

  return (
    <>
      <section className="noise relative overflow-hidden bg-navy text-ivory">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-[10%] top-[-20%] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(217,172,66,0.14),transparent_65%)]" />
          <svg className="absolute bottom-[-20%] left-[-5%] h-[420px] w-[420px] opacity-20" viewBox="0 0 300 300" fill="none">
            <circle cx="150" cy="150" r="148" stroke="#D9AC42" strokeWidth="0.6" />
            <circle cx="150" cy="150" r="110" stroke="#D9AC42" strokeWidth="0.4" strokeDasharray="3 8" />
          </svg>
        </div>

        <div className="container-edge relative py-10 md:py-14 lg:py-16">
          <Breadcrumbs items={[{ label: "Wholesale" }]} tone="dark" />

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
            <div className="animate-float-in">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold" />
                <p className="eyebrow text-gold-soft/85">Wholesale &amp; business orders</p>
              </div>
              <h1 className="mt-5 max-w-[560px] font-display text-[clamp(2.5rem,4.8vw,4.4rem)] leading-[1.02] tracking-[-0.02em]">
                {content.wholesaleHeading}
              </h1>
              <p className="mt-5 max-w-[460px] text-[0.92rem] leading-relaxed text-ivory/55">
                {content.wholesaleBody} Tell us what your shelves need — we&apos;ll confirm stock, quantities and
                pricing.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#bulk-quote" className="btn btn-gold group">
                  Request a bulk quote
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <a
                  href={whatsappUrl(
                    settings.whatsapp,
                    "Hello JJ Ebube Enterprise, I'd like to speak with your sales team about a bulk order.",
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-light"
                >
                  <MessageCircle className="size-4" /> Chat with our sales team
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {["Retail shops", "Restaurants", "Supermarkets", "Offices", "Distributors"].map((a) => (
                  <span key={a} className="flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-ivory/40">
                    <Check className="size-3 text-gold" /> {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-3 -top-3 hidden h-full w-full border border-gold/30 lg:block" />
              <EditorialImage
                src="/editorial/wholesale.webp"
                alt="Wholesale grocery stock ready for business orders"
                className="relative aspect-[4/3.3] w-full"
                sizes="(max-width: 1024px) 100vw, 48vw"
                priority
              />
              <div className="absolute bottom-4 left-4 border border-gold/25 bg-navy/85 px-4 py-3 backdrop-blur-md sm:bottom-6 sm:left-6">
                <p className="text-[0.5rem] font-bold uppercase tracking-[0.18em] text-gold-soft">For business</p>
                <p className="mt-1 font-display text-[1.05rem] leading-snug">
                  Cartons, cases and case-by-case quotes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-navy/8 bg-white">
        <div className="container-edge grid divide-navy/8 py-2 sm:grid-cols-3 sm:divide-x">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="flex items-start gap-3.5 py-6 sm:px-6 sm:first:pl-0 sm:last:pr-0">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-ivory">
                  <Icon className="size-4 text-gold-deep" strokeWidth={1.6} />
                </span>
                <div>
                  <h2 className="text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-navy">{b.title}</h2>
                  <p className="mt-1 text-[0.72rem] leading-snug text-navy/45">{b.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="bulk-quote" className="bg-ivory py-14 md:py-20">
        <div className="container-edge">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-gold" />
                  <p className="eyebrow text-gold-deep">Wholesale desk</p>
                </div>
                <h2 className="mt-3 max-w-[520px] font-display text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.04] text-navy">
                  Send your list. We&apos;ll handle the rest.
                </h2>
              </div>
              <WholesaleForm whatsapp={settings.whatsapp} />
            </div>

            <aside className="space-y-4">
              <div className="noise bg-navy p-6 text-ivory">
                <p className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-gold-soft">Talk to sales</p>
                <h2 className="mt-2 font-display text-[1.6rem] leading-tight">A real person, ready to help.</h2>
                <p className="mt-2 text-[0.78rem] leading-relaxed text-ivory/50">
                  Send your product list on WhatsApp or call us directly. We&apos;ll confirm availability and prepare
                  a quote.
                </p>
                <div className="mt-5 space-y-2.5">
                  <a
                    href={whatsappUrl(settings.whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-11 items-center justify-center gap-2 bg-[#1FA855] text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#188f47]"
                  >
                    <MessageCircle className="size-4" /> WhatsApp our team
                  </a>
                  <a
                    href={`tel:${settings.phone}`}
                    className="flex h-11 items-center justify-center gap-2 border border-ivory/20 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ivory transition hover:border-gold"
                  >
                    <Phone className="size-4 text-gold" /> {settings.phone}
                  </a>
                  {settings.phoneAlt && (
                    <a
                      href={`tel:${settings.phoneAlt}`}
                      className="flex h-11 items-center justify-center gap-2 border border-ivory/20 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ivory transition hover:border-gold"
                    >
                      <Phone className="size-4 text-gold" /> {settings.phoneAlt}
                    </a>
                  )}
                </div>
                <p className="mt-4 flex items-center gap-2 text-[0.62rem] text-ivory/40">
                  <Clock className="size-3.5 text-gold/80" /> {settings.hours}
                </p>
              </div>

              <div className="border border-navy/10 bg-white p-6">
                <h2 className="font-display text-lg text-navy">How it works</h2>
                <ol className="mt-4 space-y-4">
                  {STEPS.map((step, i) => (
                    <li key={step.title} className="flex gap-3.5">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-gold/40 font-display text-[0.65rem] italic text-gold-deep">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-[0.78rem] font-semibold text-navy">{step.title}</p>
                        <p className="mt-0.5 text-[0.7rem] leading-relaxed text-navy/45">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border border-gold/30 bg-[#fbf7ec] p-6">
                <p className="text-[0.55rem] font-bold uppercase tracking-[0.16em] text-gold-deep">Delivery & pickup</p>
                <p className="mt-2 text-[0.76rem] leading-relaxed text-navy/55">
                  Nationwide delivery can be arranged. Prefer to collect? Choose store pickup when we confirm your
                  order.
                </p>
                <div className="mt-3 flex items-center gap-2 text-[0.65rem] font-semibold text-navy/50">
                  <Truck className="size-3.5 text-gold-deep" /> Delivery quoted per order
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[0.65rem] font-semibold text-navy/50">
                  <Store className="size-3.5 text-gold-deep" /> Store pickup available
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-t border-navy/8 bg-white py-14 md:py-20">
        <div className="container-edge grid gap-10 lg:grid-cols-[0.7fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow text-gold-deep">Good to know</p>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.04] text-navy">
              Wholesale questions, answered.
            </h2>
            <p className="mt-3 max-w-[320px] text-[0.82rem] leading-relaxed text-navy/45">
              Still unsure about something? Send us a message — we&apos;re happy to talk through your order.
            </p>
            <Link href="/contact" className="link-underline mt-5 text-navy">
              Contact the team <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div>
            {FAQS.map((faq) => (
              <details key={faq.q} className="group border-t border-navy/10 py-4 last:border-b">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[0.85rem] font-semibold text-navy">
                  {faq.q}
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-navy/15 text-navy/40 transition group-open:rotate-45 group-open:border-gold group-open:text-gold-deep">
                    <span className="text-sm leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-2 max-w-[560px] text-[0.78rem] leading-relaxed text-navy/50">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
