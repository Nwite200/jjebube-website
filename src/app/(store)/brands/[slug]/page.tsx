import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, PackageSearch } from "lucide-react";
import { notFound } from "next/navigation";
import { ShopHeader } from "@/components/shop-header";
import { ProductCard } from "@/components/product-card";
import { getBrand, getBrands, getProducts } from "@/lib/db";
import { toClientProducts } from "@/lib/catalog-view";
import { whatsappUrl } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) return { title: "Brand not found" };
  return {
    title: `${brand.name} Products`,
    description: `Shop ${brand.name} products at JJ Ebube Enterprise. Genuine packs available for homes, shops and businesses across Nigeria.`,
    alternates: { canonical: `/brands/${brand.slug}` },
  };
}

export default async function BrandPage({ params }: Params) {
  const { slug } = await params;
  const [brand, brands, products] = await Promise.all([getBrand(slug), getBrands(), getProducts()]);
  if (!brand) notFound();

  const brandProducts = toClientProducts(products, brands).filter((p) => p.brandSlug === slug);
  const related = brands.filter((b) => b.slug !== slug).slice(0, 6);

  return (
    <>
      <ShopHeader
        eyebrow="Brand"
        title={brand.name}
        description={
          brandProducts.length > 0
            ? `Genuine ${brand.name} products, available in retail packs and larger quantities for business.`
            : `${brand.name} is part of our wider distribution network. Ask our team about current availability and quantities.`
        }
        crumbs={[{ label: "Brands", href: "/brands" }, { label: brand.name }]}
        image={brandProducts[0]?.image}
        note={brand.note ? `${brand.note} · Genuine products` : "Genuine products"}
      />

      <div className="container-edge py-12 md:py-16">
        {brandProducts.length > 0 ? (
          <>
            <div className="flex items-end justify-between">
              <p className="text-[0.82rem] text-navy/45">
                <span className="font-semibold text-navy">{brandProducts.length}</span> product
                {brandProducts.length === 1 ? "" : "s"} available
              </p>
              <Link href="/shop" className="link-underline text-navy">
                All products <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {brandProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        ) : (
          <div className="border border-navy/10 bg-white px-6 py-16 text-center md:py-20">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-gold/30 bg-ivory">
              <PackageSearch className="size-6 text-gold-deep" strokeWidth={1.4} />
            </span>
            <h2 className="mt-6 font-display text-[1.9rem] text-navy">Ask us about {brand.name}</h2>
            <p className="mx-auto mt-3 max-w-md text-[0.85rem] leading-relaxed text-navy/50">
              This brand is part of our supply network but isn&apos;t listed for online checkout yet. Send us the
              product and quantity you need — we&apos;ll confirm availability, pack sizes and pricing.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={whatsappUrl(
                  "+2347062129563",
                  `Hello JJ Ebube Enterprise, I'd like to ask about ${brand.name} products and availability.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold h-11"
              >
                Ask about {brand.name} <ArrowUpRight className="size-3.5" />
              </a>
              <Link href="/brands" className="btn btn-outline h-11">
                Browse all brands
              </Link>
            </div>
          </div>
        )}

        <div className="mt-14 grid gap-6 border-t border-navy/10 pt-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="font-display text-[1.7rem] text-navy">Buying {brand.name} in bulk?</h2>
            <p className="mt-1.5 max-w-lg text-[0.82rem] text-navy/45">
              We supply shops, provision stores, restaurants and offices. Share your list for a business quote.
            </p>
          </div>
          <Link href="/wholesale" className="btn btn-navy h-11">
            Request a bulk quote <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-12">
          <p className="eyebrow text-navy/35">Explore more brands</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {related.map((b) => (
              <Link
                key={b.slug}
                href={`/brands/${b.slug}`}
                className="border border-navy/12 bg-white px-3.5 py-2 text-[0.7rem] font-semibold text-navy/70 transition hover:border-gold hover:text-navy"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
