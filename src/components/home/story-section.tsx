import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EditorialImage } from "@/components/editorial-image";

const PILLARS = [
  {
    title: "A range chosen with care",
    body: "Household names and everyday essentials, stocked with intention.",
  },
  {
    title: "Pricing that stays honest",
    body: "Straightforward prices for homes — and business pricing for bulk.",
  },
  {
    title: "One store, two ways to shop",
    body: "Buy a single pack online or plan your next carton order with us.",
  },
];

export function StorySection({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ivory py-16 md:py-20 lg:py-24">
      <div className="container-edge grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
        <div className="relative">
          <div className="absolute -left-3 -top-3 hidden h-full w-full border border-gold/35 sm:block" />
          <EditorialImage
            src="/editorial/store.webp"
            alt="A well-stocked grocery aisle at JJ Ebube Enterprise"
            className="relative aspect-[4/4.6] w-full"
            sizes="(max-width: 1024px) 100vw, 44vw"
          />
          <div className="absolute -bottom-5 right-4 max-w-[230px] border border-gold/30 bg-navy px-5 py-4 text-ivory shadow-[0_20px_40px_-16px_rgba(4,17,39,0.5)] sm:-right-5">
            <p className="font-display text-[1.15rem] italic leading-snug text-gold-soft">
              “Quality Products. Better Life.”
            </p>
            <p className="mt-1.5 text-[0.55rem] font-bold uppercase tracking-[0.16em] text-ivory/40">
              What we stand for
            </p>
          </div>
        </div>

        <div className="lg:pl-4">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <p className="eyebrow text-gold-deep">The JJ Ebube standard</p>
          </div>
          <h2 className="mt-5 max-w-[520px] font-display text-[clamp(2.1rem,3.8vw,3.5rem)] leading-[1.04] text-navy">
            {title}
          </h2>
          <p className="mt-4 max-w-[500px] text-[0.92rem] leading-relaxed text-navy/55">{body}</p>

          <div className="mt-9 space-y-0">
            {PILLARS.map((pillar, i) => (
              <div key={pillar.title} className="flex gap-5 border-t border-navy/10 py-5 first:border-t-0 first:pt-0">
                <span className="pt-0.5 font-display text-[0.85rem] italic text-gold-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[0.9rem] font-semibold text-navy">{pillar.title}</h3>
                  <p className="mt-1 text-[0.8rem] leading-relaxed text-navy/50">{pillar.body}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/about" className="link-underline mt-8 text-navy">
            Read our story <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
