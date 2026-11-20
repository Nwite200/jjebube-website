import type { Brand, DeliveryZone, Product } from "./types";

export type ClientProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  packSize: string;
  unit: string;
  sku: string;
  price: number | null;
  compareAtPrice: number | null;
  wholesalePrice: number | null;
  stock: number;
  image: string;
  description: string;
  details: string[];
  gallery: string[];
  featured: boolean;
  isNew: boolean;
  tags: string[];
  createdAt: string;
};

export function toClientProducts(products: Product[], brands: Brand[]): ClientProduct[] {
  const brandNames = new Map(brands.map((b) => [b.slug, b.name]));
  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: brandNames.get(p.brandSlug) ?? p.brandSlug,
    brandSlug: p.brandSlug,
    category: p.categorySlug,
    categorySlug: p.categorySlug,
    packSize: p.packSize,
    unit: p.unit,
    sku: p.sku,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    wholesalePrice: p.wholesalePrice,
    stock: p.stock,
    image: p.image,
    description: p.description,
    details: p.details ?? [],
    gallery: p.gallery ?? [],
    featured: p.featured,
    isNew: p.isNew,
    tags: p.tags ?? [],
    createdAt: p.createdAt,
  }));
}

export type ClientConfig = {
  whatsapp: string;
  phone: string;
  phoneAlt?: string;
  freeShippingThreshold: number;
  deliveryZones: DeliveryZone[];
};
