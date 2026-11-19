import { BadgeCheck, BriefcaseBusiness, Tags, Truck } from "lucide-react";

const ITEMS = [
  {
    icon: BadgeCheck,
    title: "Authentic Products",
    body: "Quality products from trusted brands.",
  },
  {
    icon: Tags,
    title: "Great Value",
    body: "Competitive prices for everyday essentials.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    body: "Convenient delivery options across Nigeria.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Business & Bulk Orders",
    body: "Shopping solutions for homes, shops and businesses.",
  },
];

export function TrustStrip() {
  return (
    <section className="border-b border-navy/8 bg-white">
      <div className="container-edge grid grid-cols-2 divide-navy/8 lg:grid-cols-4 lg:divide-x">
        {ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`flex items-start gap-3.5 py-6 md:gap-4 md:py-7 lg:px-7 ${
                i % 2 === 1 ? "border-l border-navy/8 pl-4 lg:border-l-0 lg:pl-7" : ""
              } ${i > 1 ? "border-t border-navy/8 lg:border-t-0" : ""}`}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-ivory md:size-10">
                <Icon className="size-4 text-gold-deep md:size-[17px]" strokeWidth={1.6} />
              </span>
              <div>
                <h3 className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-navy md:text-[0.66rem]">
                  {item.title}
                </h3>
                <p className="mt-1 text-[0.68rem] leading-snug text-navy/45 md:text-[0.72rem]">
                  {item.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
