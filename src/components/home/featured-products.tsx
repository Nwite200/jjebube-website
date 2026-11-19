import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ClientProduct } from "@/lib/catalog-view";
import { ProductCard } from "@/components/product-card";

export function FeaturedProducts({
  products,
  heading,
  subheading,
}: {
  products: ClientProduct[];
  heading: string;
  subheading: string;
}) {
  return (
    <section className="relative bg-white py-16 md:py-20 lg:py-24">
      <div className="container-edge">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <p className="eyebrow text-gold-deep">The shelf · handpicked</p>
            </div>
            <h2 className="mt-4 max-w-[620px] font-display text-[clamp(2rem,3.6vw,3.3rem)] leading-[1.04] text-navy">
              {heading}
            </h2>
            <p className="mt-3 max-w-[480px] text-[0.88rem] text-navy/50">{subheading}</p>
          </div>
          <Link href="/shop" className="link-underline shrink-0 text-navy">
            View all products <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 2} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-navy/8 pt-7 sm:flex-row">
          <p className="text-[0.7rem] font-medium text-navy/40">
            Retail and wholesale quantities available. Prices shown are per listed pack.
          </p>
          <Link href="/shop" className="btn btn-outline h-11">
            Browse the full range <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
