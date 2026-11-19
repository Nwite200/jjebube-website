import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductDetail } from "@/components/product/product-detail";
import { ProductCard } from "@/components/product-card";
import { getBrands, getCategories, getProduct, getProducts, getSettings } from "@/lib/db";
import { toClientProducts } from "@/lib/catalog-view";
import { formatNaira } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  const brands = await getBrands();
  const brand = brands.find((b) => b.slug === product.brandSlug);
  return {
    title: `${product.name} — ${product.packSize}`,
    description: `${product.description} Buy ${product.name} ${product.packSize} from JJ Ebube Enterprise${brand ? `, official stockist of ${brand.name}` : ""}.`,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} — ${product.packSize}`,
      description: product.description,
      images: [{ url: product.image, width: 800, height: 800, alt: product.name }],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const [product, products, brands, categories, settings] = await Promise.all([
    getProduct(slug),
    getProducts(),
    getBrands(),
    getCategories(),
    getSettings(),
  ]);

  if (!product) notFound();

  const brand = brands.find((b) => b.slug === product.brandSlug);
  const category = categories.find((c) => c.slug === product.categorySlug);
  const clientProduct = toClientProducts([product], brands)[0];

  const related = toClientProducts(products, brands)
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, 4);

  const fill = toClientProducts(products, brands)
    .filter((p) => p.id !== product.id && p.featured)
    .slice(0, 4 - related.length);
  const suggestions = [...related, ...fill].slice(0, 4);

  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [`${site}${product.image}`],
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: brand?.name ?? product.brandSlug },
    category: category?.name,
    ...(product.price !== null
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "NGN",
            price: product.price,
            availability:
              product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${site}/product/${product.slug}`,
            seller: { "@type": "Organization", name: "JJ Ebube Enterprise" },
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="border-b border-navy/8 bg-ivory">
        <div className="container-edge py-5">
          <Breadcrumbs
            items={[
              { label: "Shop", href: "/shop" },
              ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <div className="container-edge py-8 md:py-12">
        <ProductDetail product={clientProduct} whatsapp={settings.whatsapp} />
      </div>

      <section className="border-t border-navy/8 bg-white py-14 md:py-20">
        <div className="container-edge">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold" />
                <p className="eyebrow text-gold-deep">From the same aisle</p>
              </div>
              <h2 className="mt-3 font-display text-[clamp(1.8rem,3vw,2.6rem)] text-navy">
                You may also need
              </h2>
            </div>
            <Link href={`/category/${product.categorySlug}`} className="link-underline text-navy">
              Shop {category?.name ?? "this category"} <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-5 border border-navy/10 bg-ivory px-6 py-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-gold-deep">Business orders</p>
              <p className="mt-1.5 font-display text-xl text-navy">
                Need {product.name.toLowerCase()} in cartons?
              </p>
              <p className="mt-1 text-[0.78rem] text-navy/45">
                Current price {product.price !== null ? formatNaira(product.price) : "on request"} · Ask for business
                pricing and availability.
              </p>
            </div>
            <Link href="/wholesale" className="btn btn-navy h-11 shrink-0">
              Request a bulk quote <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
