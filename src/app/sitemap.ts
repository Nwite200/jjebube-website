import type { MetadataRoute } from "next";
import { getBrands, getCategories, getProducts } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/categories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/brands`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/deals`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/wholesale`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  return [
    ...staticRoutes,
    ...categories
      .filter((c) => !c.href)
      .map((c) => ({
        url: `${base}/category/${c.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ...brands.map((b) => ({
      url: `${base}/brands/${b.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: p.createdAt ? new Date(p.createdAt) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
