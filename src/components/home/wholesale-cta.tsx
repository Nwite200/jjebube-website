import Link from "next/link";
import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { EditorialImage } from "@/components/editorial-image";
import { whatsappUrl } from "@/lib/utils";

const BENEFITS = [
  { title: "Bulk purchasing", body: "Order by the carton, case or pallet — sized to your business." },
  { title: "Competitive business pricing", body: "Clear quotes for shops, kitchens, offices and resellers." },
  { title: "Convenient order enquiries", body: "Send your list once and our team will confirm availability." },
];

const AUDIENCES = [
  "Retail shops",
  "Provision stores",
  "Supermarkets",
  "Restaurants",
  "Hotels",
  "Food vendors",
  "Distributors",
  "Offices",
];

export function WholesaleCta({
  heading,
  body,
  whatsapp,
}: {
  heading: string;
  body: string;
  whatsapp: string;
}) {
  return (
    <section className="noise relative overflow-hidden bg-navy text-ivory">
      <div className="container-edge relative grid lg:grid-cols-[1.06fr_0.94fr]">
        <div className="py-16 md:py-20 lg:py-24 lg:pr-14">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <p className="eyebrow text-gold-soft/80">Wholesale &amp; business</p>
          </div>
          <h2 className="mt-5 max-w-[520px] font-display text-[clamp(2.2rem,4vw,3.7rem)] leading-[1.03]">
            {heading}
          </h2>
          <p className="mt-4 max-w-[460px] text-[0.9rem] leading-relaxed text-ivory/55">{body}</p>

          <div className="mt-8 space-y-0">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex gap-4 border-t border-ivory/10 py-4">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-gold/40">
                  <Check className="size-3 text-gold" strokeWidth={2.5} />
                </span>
                <div>
                  <h3 className="text-[0.82rem] font-semibold text-ivory">{b.title}</h3>
                  <p className="mt-0.5 text-[0.75rem] text-ivory/45">{b.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {AUDIENCES.map((a) => (
              <span
                key={a}
                className="border border-ivory/12 px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.08em] text-ivory/50"
              >
                {a}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/wholesale" className="btn btn-gold group">
              Request a bulk quote
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <a
              href={whatsappUrl(
                whatsapp,
                "Hello JJ Ebube Enterprise, I'd like to speak with your sales team about a bulk order.",
              )}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-light group"
            >
              <MessageCircle className="size-4" />
              Chat with our sales team
            </a>
          </div>
        </div>

        <div className="relative min-h-[320px] lg:min-h-full">
          <EditorialImage
            src="/editorial/wholesale.webp"
            alt="Bulk grocery stock prepared for business orders"
            className="absolute inset-0 h-full w-full lg:-mr-[calc((100vw-100%)/2)]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent lg:bg-gradient-to-r lg:from-navy lg:via-navy/25 lg:to-transparent" />

          <div className="absolute bottom-8 left-6 right-6 border border-gold/25 bg-navy/80 px-5 py-4 backdrop-blur-md sm:left-10 sm:right-auto sm:max-w-[290px]">
            <p className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-gold-soft">
              For business
            </p>
            <p className="mt-2 font-display text-[1.35rem] leading-snug text-ivory">
              Your shelves, stocked with confidence.
            </p>
            <p className="mt-2 text-[0.68rem] leading-relaxed text-ivory/45">
              Share your product list and delivery location. We&apos;ll take it from there.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
