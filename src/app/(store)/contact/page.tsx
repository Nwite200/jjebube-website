import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, MessageCircle, Phone, Store } from "lucide-react";
import { ShopHeader } from "@/components/shop-header";
import { ContactForm } from "@/components/contact/contact-form";
import { getSettings } from "@/lib/db";
import { whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact JJ Ebube Enterprise for product enquiries, order support, delivery questions and wholesale quotes. Call or WhatsApp 0706 212 9563.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();

  const offices = [
    {
      "@type": "Store",
      name: "JJ Ebube Enterprise — Office",
      telephone: `+234${settings.phone.replace(/\D/g, "").replace(/^0/, "")}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.address,
        addressLocality: "Onitsha",
        addressRegion: "Anambra",
        addressCountry: "NG",
      },
    },
    {
      "@type": "Store",
      name: "JJ Ebube Enterprise — Ogbaru Branch",
      telephone: `+234${settings.phone.replace(/\D/g, "").replace(/^0/, "")}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.branchAddress,
        addressLocality: "Onitsha",
        addressRegion: "Anambra",
        addressCountry: "NG",
      },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": offices }) }}
      />
      <ShopHeader
        eyebrow="We're here to help"
        title="Talk to JJ Ebube"
        description="Questions about a product, your order or a bulk enquiry? Call, message us on WhatsApp, or send a note below."
        crumbs={[{ label: "Contact" }]}
        note={`Call or WhatsApp ${settings.phone}`}
      />

      <div className="container-edge py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
          <ContactForm whatsapp={settings.whatsapp} />

          <aside className="space-y-4">
            <a
              href={`tel:${settings.phone}`}
              className="group flex items-start gap-4 border border-navy/10 bg-white p-5 transition hover:border-gold/50"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-ivory">
                <Phone className="size-4 text-gold-deep" strokeWidth={1.6} />
              </span>
              <span className="flex-1">
                <span className="block text-[0.55rem] font-bold uppercase tracking-[0.14em] text-navy/35">Call us</span>
                <span className="mt-1 block text-[0.88rem] font-semibold text-navy">{settings.phone}</span>
                <span className="mt-0.5 block text-[0.65rem] text-navy/40">Speak to our team directly</span>
              </span>
              <ArrowUpRight className="size-4 text-navy/20 transition group-hover:text-gold-deep" />
            </a>

            <a
              href={whatsappUrl(
                settings.whatsapp,
                "Hello JJ Ebube Enterprise, I'd like to ask about a product.",
              )}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-4 border border-navy/10 bg-white p-5 transition hover:border-[#1FA855]/40"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#1FA855]/30 bg-[#1FA855]/5">
                <MessageCircle className="size-4 text-[#1FA855]" strokeWidth={1.6} />
              </span>
              <span className="flex-1">
                <span className="block text-[0.55rem] font-bold uppercase tracking-[0.14em] text-navy/35">WhatsApp</span>
                <span className="mt-1 block text-[0.88rem] font-semibold text-navy">Chat with us</span>
                <span className="mt-0.5 block text-[0.65rem] text-navy/40">Fastest for product & order questions</span>
              </span>
              <ArrowUpRight className="size-4 text-navy/20 transition group-hover:text-[#1FA855]" />
            </a>

            <div className="flex items-start gap-4 border border-navy/10 bg-white p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-ivory">
                <Clock className="size-4 text-gold-deep" strokeWidth={1.6} />
              </span>
              <div>
                <p className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-navy/35">Opening hours</p>
                <p className="mt-1 text-[0.82rem] font-semibold text-navy">{settings.hours}</p>
                <p className="mt-0.5 text-[0.65rem] text-navy/40">Messages outside these hours are answered next day.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-navy/10 bg-white p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-ivory">
                <MapPin className="size-4 text-gold-deep" strokeWidth={1.6} />
              </span>
              <div>
                <p className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-navy/35">Visit us</p>
                <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-gold-deep">Office</p>
                <p className="mt-0.5 text-[0.8rem] font-semibold leading-relaxed text-navy">{settings.address}</p>
                <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-gold-deep">Branch</p>
                <p className="mt-0.5 text-[0.8rem] font-semibold leading-relaxed text-navy">{settings.branchAddress}</p>
                <p className="mt-2 text-[0.65rem] text-navy/40">Delivery is also available nationwide.</p>
              </div>
            </div>

            <div className="noise bg-navy p-6 text-ivory">
              <Store className="size-5 text-gold" strokeWidth={1.5} />
              <h2 className="mt-3 font-display text-[1.4rem] leading-tight">Buying for a shop or kitchen?</h2>
              <p className="mt-2 text-[0.75rem] leading-relaxed text-ivory/50">
                Use our wholesale desk for carton quantities and business pricing.
              </p>
              <Link
                href="/wholesale"
                className="mt-3 inline-flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-gold-soft underline underline-offset-2"
              >
                Wholesale enquiries <ArrowUpRight className="size-3" />
              </Link>
            </div>

            {settings.email && (
              <p className="px-1 text-[0.68rem] text-navy/40">
                Email:{" "}
                <a href={`mailto:${settings.email}`} className="font-semibold text-navy underline decoration-gold underline-offset-2">
                  {settings.email}
                </a>
              </p>
            )}
          </aside>
        </div>

        <div className="mt-12 grid gap-4 border-t border-navy/10 pt-8 sm:grid-cols-3">
          {[
            { title: "Order support", body: "Questions about an existing order? Have your order number ready." },
            { title: "Product requests", body: "Looking for a specific pack or brand? Tell us and we'll check availability." },
            { title: "Wholesale quotes", body: "Share your product list and delivery location for business pricing." },
          ].map((item) => (
            <div key={item.title} className="border-l border-gold/40 pl-4">
              <h3 className="text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-navy">{item.title}</h3>
              <p className="mt-1.5 text-[0.75rem] leading-relaxed text-navy/45">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
