import { ProductImage } from "./product-image";
import { Breadcrumbs } from "./breadcrumbs";

export function ShopHeader({
  eyebrow,
  title,
  description,
  crumbs,
  image,
  note,
}: {
  eyebrow: string;
  title: string;
  description: string;
  crumbs: { label: string; href?: string }[];
  image?: string;
  note?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-navy/8 bg-ivory">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_80%_30%,rgba(217,172,66,0.1),transparent_65%)]" />
      <div className="container-edge relative py-8 md:py-11">
        <Breadcrumbs items={crumbs} />
        <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold" />
              <p className="eyebrow text-gold-deep">{eyebrow}</p>
            </div>
            <h1 className="mt-3 font-display text-[clamp(2.1rem,4vw,3.6rem)] leading-[1.03] text-navy">{title}</h1>
            <p className="mt-3 max-w-[560px] text-[0.88rem] leading-relaxed text-navy/50">{description}</p>
            {note && <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-navy/35">{note}</p>}
          </div>
          {image && (
            <div className="relative hidden size-[150px] shrink-0 overflow-hidden border border-navy/10 bg-white shadow-[0_18px_34px_-22px_rgba(7,26,58,0.4)] md:block">
              <div className="absolute inset-0 p-3">
                <ProductImage src={image} alt={title} brand={title} sizes="150px" />
              </div>
              <span className="absolute inset-x-3 bottom-2 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
