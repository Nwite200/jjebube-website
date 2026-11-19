import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { CategoryRail } from "@/components/home/category-rail";
import { FeaturedProducts } from "@/components/home/featured-products";
import { PromoBanner } from "@/components/home/promo-banner";
import { StorySection } from "@/components/home/story-section";
import { BrandGrid } from "@/components/home/brand-grid";
import { WholesaleCta } from "@/components/home/wholesale-cta";
import { getBrands, getCategories, getHomeContent, getProducts, getSettings } from "@/lib/db";
import { toClientProducts } from "@/lib/catalog-view";

export const metadata: Metadata = {
  title: { absolute: "JJ Ebube Enterprise — Quality Products. Better Life." },
  description:
    "Shop quality milk, tea, cocoa, seasoning, noodles and everyday essentials at JJ Ebube Enterprise. Retail, wholesale and bulk orders delivered across Nigeria.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [products, categories, brands, content, settings] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
    getHomeContent(),
    getSettings(),
  ]);

  const clientProducts = toClientProducts(products, brands);
  const featured = clientProducts.filter((p) => p.featured).slice(0, 8);

  const counts: Record<string, number> = {};
  for (const p of products) counts[p.brandSlug] = (counts[p.brandSlug] ?? 0) + 1;

  const homepageBrands = [
    "promasidor",
    "multipro",
    "cadbury",
    "blume",
    "johnvent",
    "aava",
    "dogan",
    "tinki",
    "sarah",
    "valency-agro",
    "apple-pear",
    "primer-food",
    "evans",
    "oriental-food",
    "good-brand",
    "dano",
    "lipton",
    "nestle",
    "kerrygold",
    "onga",
  ]
    .map((slug) => brands.find((b) => b.slug === slug))
    .filter((b): b is (typeof brands)[number] => Boolean(b));

  const promoProducts = clientProducts.filter((p) => p.price !== null).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "JJ Ebube Enterprise",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    slogan: "Quality Products. Better Life.",
    description:
      "Nigerian FMCG, food, beverage and grocery distribution business serving homes, shops and businesses.",
    telephone: `+234${settings.phone.replace(/\D/g, "").replace(/^0/, "")}`,
    areaServed: "Nigeria",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        products={products}
        eyebrow={settings.heroEyebrow}
        title={settings.heroTitle}
        highlight={settings.heroHighlight}
        body={settings.heroBody}
      />
      <TrustStrip />
      <CategoryRail
        categories={categories}
        heading={content.categoriesHeading}
        subheading={content.categoriesSubheading}
      />
      <FeaturedProducts
        products={featured}
        heading={content.featuredHeading}
        subheading={content.featuredSubheading}
      />
      <PromoBanner
        products={promoProducts}
        eyebrow={content.promoEyebrow}
        title={content.promoTitle}
        body={content.promoBody}
        button={content.promoButton}
        href={content.promoHref}
      />
      <StorySection title={settings.aboutTitle} body={settings.aboutBody} />
      <BrandGrid brands={homepageBrands} counts={counts} heading={content.brandsHeading} />
      <WholesaleCta
        heading={content.wholesaleHeading}
        body={content.wholesaleBody}
        whatsapp={settings.whatsapp}
      />
    </>
  );
}
