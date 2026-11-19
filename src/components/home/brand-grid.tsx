import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Brand } from "@/lib/types";
import { cn } from "@/lib/utils";

export function BrandGrid({
  brands,
  counts,
  heading,
}: {
  brands: Brand[];
  counts: Record<string, number>;
  heading: string;
}) {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="container-edge">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <p className="eyebrow text-gold-deep">Stocked with confidence</p>
            </div>
            <h2 className="mt-4 max-w-[620px] font-display text-[clamp(2rem,3.6vw,3.3rem)] leading-[1.04] text-navy">
              {heading}
            </h2>
          </div>
          <Link href="/brands" className="link-underline shrink-0 text-navy">
            All brands <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 border-l border-t border-navy/10 sm:grid-cols-3 lg:grid-cols-5">
          {brands.map((brand) => {
            const count = counts[brand.slug] ?? 0;
            return (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="group relative flex min-h-[132px] flex-col justify-between border-b border-r border-navy/10 p-5 transition-colors duration-500 hover:bg-navy md:min-h-[150px] md:p-6"
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border border-gold/35 font-display text-[0.68rem] font-semibold text-gold-deep transition-all duration-500 group-hover:border-gold/60 group-hover:text-gold-soft",
                  )}
                >
                  {brand.name.slice(0, 1)}
                </span>
                <span>
                  <span className="block font-display text-[1.06rem] leading-tight text-navy transition-colors duration-500 group-hover:text-ivory">
                    {brand.name}
                  </span>
                  <span className="mt-1 flex items-center justify-between">
                    <span className="text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-navy/35 transition-colors group-hover:text-ivory/45">
                      {count > 0 ? `${count} product${count === 1 ? "" : "s"}` : brand.note ?? "Brand"}
                    </span>
                    <ArrowUpRight className="size-3 text-navy/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-gold" />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
