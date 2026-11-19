"use server";

import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  getBrands,
  getCatalog,
  getCategories,
  getHomeContent,
  getOrders,
  getPromotions,
  getSettings,
  markMessageRead,
  saveCatalog,
  saveHomeContent,
  savePromotions,
  saveSettings,
  updateInquiry,
  updateOrder,
} from "@/lib/db";
import { checkPassword, createAdminSession, destroyAdminSession, requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

function str(fd: FormData, key: string, fallback = "") {
  const value = fd.get(key);
  return typeof value === "string" ? value.trim() : fallback;
}

function num(fd: FormData, key: string, fallback: number | null = null) {
  const raw = str(fd, key);
  if (!raw) return fallback;
  const n = Number(raw.replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

function bool(fd: FormData, key: string) {
  return fd.get(key) === "on" || fd.get(key) === "true";
}

async function uploadImage(fd: FormData, key: string): Promise<string | null> {
  const file = fd.get(key);
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > 4 * 1024 * 1024) throw new Error("Image must be smaller than 4MB");
  if (!file.type.startsWith("image/")) throw new Error("Please upload an image file");
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const allowed = ["jpg", "jpeg", "png", "webp", "avif", "gif"];
  if (!allowed.includes(ext)) throw new Error("Unsupported image format");
  const filename = `${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${filename}`;
}

function refreshStorefront() {
  revalidatePath("/", "layout");
}

/* ---------------------------------- auth ---------------------------------- */

export async function loginAction(formData: FormData) {
  const password = str(formData, "password");
  if (!checkPassword(password)) {
    redirect("/admin/login?error=invalid");
  }
  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}

/* -------------------------------- products -------------------------------- */

const productSchema = z.object({
  name: z.string().min(2).max(160),
  brandSlug: z.string().min(1),
  categorySlug: z.string().min(1),
  packSize: z.string().min(1).max(60),
  unit: z.string().min(1).max(30),
  sku: z.string().max(60),
  price: z.number().nonnegative().nullable(),
  compareAtPrice: z.number().nonnegative().nullable(),
  wholesalePrice: z.number().nonnegative().nullable(),
  stock: z.number().int().min(0).max(100000),
  description: z.string().max(2000),
});

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const parsed = productSchema.safeParse({
    name: str(formData, "name"),
    brandSlug: str(formData, "brandSlug"),
    categorySlug: str(formData, "categorySlug"),
    packSize: str(formData, "packSize"),
    unit: str(formData, "unit"),
    sku: str(formData, "sku"),
    price: num(formData, "price"),
    compareAtPrice: num(formData, "compareAtPrice"),
    wholesalePrice: num(formData, "wholesalePrice"),
    stock: num(formData, "stock", 0) ?? 0,
    description: str(formData, "description"),
  });
  if (!parsed.success) {
    redirect(`/admin/products/${id || "new"}?error=validation`);
  }

  const catalog = await getCatalog();
  const existing = catalog.products.find((p) => p.id === id);
  const details = str(formData, "details")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const tags = str(formData, "tags")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  let uploaded: string | null = null;
  try {
    uploaded = await uploadImage(formData, "imageFile");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    redirect(`/admin/products/${id || "new"}?error=${encodeURIComponent(message)}`);
  }

  const image = uploaded || str(formData, "imageUrl") || existing?.image || "";
  const galleryRaw = str(formData, "gallery")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const gallery = galleryRaw.length ? galleryRaw : existing?.gallery ?? [];

  const desiredSlug = slugify(str(formData, "slug") || parsed.data.name);
  let slug = desiredSlug;
  let i = 2;
  while (catalog.products.some((p) => p.slug === slug && p.id !== id)) {
    slug = `${desiredSlug}-${i++}`;
  }

  const record = {
    id: existing?.id ?? randomUUID(),
    slug,
    name: parsed.data.name,
    brandSlug: parsed.data.brandSlug,
    categorySlug: parsed.data.categorySlug,
    packSize: parsed.data.packSize,
    unit: parsed.data.unit,
    sku: parsed.data.sku || `JJE-${slug.slice(0, 8).toUpperCase()}`,
    price: parsed.data.price,
    compareAtPrice: parsed.data.compareAtPrice,
    wholesalePrice: parsed.data.wholesalePrice,
    stock: parsed.data.stock,
    image,
    gallery,
    description: parsed.data.description,
    details,
    featured: bool(formData, "featured"),
    isNew: bool(formData, "isNew"),
    tags: tags.length ? tags : existing?.tags ?? [],
    variants: existing?.variants ?? [],
    createdAt: existing?.createdAt ?? new Date().toISOString().slice(0, 10),
  };

  if (existing) {
    catalog.products = catalog.products.map((p) => (p.id === existing.id ? record : p));
  } else {
    catalog.products.unshift(record);
  }
  await saveCatalog(catalog);
  refreshStorefront();
  redirect("/admin/products?saved=1");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const catalog = await getCatalog();
  catalog.products = catalog.products.filter((p) => p.id !== id);
  await saveCatalog(catalog);
  refreshStorefront();
  redirect("/admin/products?deleted=1");
}

export async function toggleFeaturedAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const catalog = await getCatalog();
  catalog.products = catalog.products.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p));
  await saveCatalog(catalog);
  refreshStorefront();
  redirect("/admin/marketing?saved=1");
}

/* --------------------------------- orders --------------------------------- */

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;
const PAYMENT_STATUSES = ["unpaid", "paid", "refunded"] as const;

export async function saveOrderAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const status = str(formData, "status");
  const paymentStatus = str(formData, "paymentStatus");
  if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
    redirect(`/admin/orders/${id}?error=status`);
  }
  if (!PAYMENT_STATUSES.includes(paymentStatus as (typeof PAYMENT_STATUSES)[number])) {
    redirect(`/admin/orders/${id}?error=status`);
  }
  await updateOrder(id, {
    status: status as (typeof ORDER_STATUSES)[number],
    paymentStatus: paymentStatus as (typeof PAYMENT_STATUSES)[number],
  });
  revalidatePath("/admin", "layout");
  redirect(`/admin/orders/${id}?saved=1`);
}

export async function markPaidAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  await updateOrder(id, { paymentStatus: "paid" });
  revalidatePath("/admin", "layout");
  redirect(`/admin/orders/${id}?paid=1`);
}

/* -------------------------------- inquiries ------------------------------- */

export async function updateInquiryStatusAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const status = str(formData, "status");
  const allowed = ["new", "contacted", "quoted", "closed"];
  if (!allowed.includes(status)) redirect("/admin/inquiries?error=status");
  await updateInquiry(id, { status: status as "new" | "contacted" | "quoted" | "closed" });
  revalidatePath("/admin", "layout");
  redirect("/admin/inquiries?saved=1");
}

/* --------------------------------- content -------------------------------- */

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  const settings = await getSettings();

  const zones = settings.deliveryZones.map((zone) => {
    const fee = num(formData, `fee_${zone.id}`, zone.fee);
    const name = str(formData, `zone_${zone.id}`, zone.name);
    return { ...zone, name, fee: fee ?? zone.fee };
  });

  const next = {
    ...settings,
    storeName: str(formData, "storeName", settings.storeName),
    tagline: str(formData, "tagline", settings.tagline),
    phone: str(formData, "phone", settings.phone),
    whatsapp: str(formData, "whatsapp", settings.whatsapp),
    email: str(formData, "email"),
    address: str(formData, "address", settings.address),
    branchAddress: str(formData, "branchAddress", settings.branchAddress),
    hours: str(formData, "hours"),
    announcement: str(formData, "announcement"),
    aboutTitle: str(formData, "aboutTitle", settings.aboutTitle),
    aboutBody: str(formData, "aboutBody", settings.aboutBody),
    freeShippingThreshold: num(formData, "freeShippingThreshold", settings.freeShippingThreshold) ?? 0,
    deliveryZones: zones,
    bankTransfer: {
      bankName: str(formData, "bankName"),
      accountName: str(formData, "accountName"),
      accountNumber: str(formData, "accountNumber"),
    },
    socials: {
      instagram: str(formData, "instagram"),
      facebook: str(formData, "facebook"),
      x: str(formData, "x"),
      tiktok: str(formData, "tiktok"),
    },
  };
  await saveSettings(next);
  refreshStorefront();
  redirect("/admin/content?saved=settings");
}

export async function saveHeroAction(formData: FormData) {
  await requireAdmin();
  const settings = await getSettings();
  await saveSettings({
    ...settings,
    heroEyebrow: str(formData, "heroEyebrow"),
    heroTitle: str(formData, "heroTitle"),
    heroHighlight: str(formData, "heroHighlight"),
    heroBody: str(formData, "heroBody"),
  });
  refreshStorefront();
  redirect("/admin/content?saved=hero");
}

export async function saveHomeContentAction(formData: FormData) {
  await requireAdmin();
  const content = await getHomeContent();
  const next = {
    ...content,
    categoriesHeading: str(formData, "categoriesHeading", content.categoriesHeading),
    categoriesSubheading: str(formData, "categoriesSubheading", content.categoriesSubheading),
    featuredHeading: str(formData, "featuredHeading", content.featuredHeading),
    featuredSubheading: str(formData, "featuredSubheading", content.featuredSubheading),
    brandsHeading: str(formData, "brandsHeading", content.brandsHeading),
    wholesaleHeading: str(formData, "wholesaleHeading", content.wholesaleHeading),
    wholesaleBody: str(formData, "wholesaleBody", content.wholesaleBody),
    promoEyebrow: str(formData, "promoEyebrow", content.promoEyebrow),
    promoTitle: str(formData, "promoTitle", content.promoTitle),
    promoBody: str(formData, "promoBody", content.promoBody),
    promoButton: str(formData, "promoButton", content.promoButton),
    promoHref: str(formData, "promoHref", content.promoHref),
  };
  await saveHomeContent(next);
  refreshStorefront();
  redirect("/admin/content?saved=home");
}

/* -------------------------------- marketing ------------------------------- */

export async function savePromotionAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const promotions = await getPromotions();
  const title = str(formData, "title");
  if (!title) redirect("/admin/marketing?error=title");

  if (id) {
    const next = promotions.map((p) =>
      p.id === id
        ? {
            ...p,
            title,
            subtitle: str(formData, "subtitle"),
            label: str(formData, "label") || "Shop now",
            href: str(formData, "href") || "/shop",
            active: bool(formData, "active"),
          }
        : p,
    );
    await savePromotions(next);
  } else {
    await savePromotions([
      {
        id: `promo-${Date.now().toString(36)}`,
        title,
        subtitle: str(formData, "subtitle"),
        label: str(formData, "label") || "Shop now",
        href: str(formData, "href") || "/shop",
        active: bool(formData, "active"),
      },
      ...promotions,
    ]);
  }
  refreshStorefront();
  redirect("/admin/marketing?saved=promo");
}

export async function deletePromotionAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const promotions = await getPromotions();
  await savePromotions(promotions.filter((p) => p.id !== id));
  refreshStorefront();
  redirect("/admin/marketing?saved=promo");
}

/* --------------------------------- catalog -------------------------------- */

export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();
  const catalog = await getCatalog();
  const id = str(formData, "id");
  const name = str(formData, "name");
  if (!name) redirect("/admin/catalog?error=name");
  const existing = catalog.categories.find((c) => c.id === id);

  let uploaded: string | null = null;
  try {
    uploaded = await uploadImage(formData, "imageFile");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    redirect(`/admin/catalog?error=${encodeURIComponent(message)}`);
  }

  const slugBase = slugify(str(formData, "slug") || name);
  let slug = slugBase;
  let i = 2;
  while (catalog.categories.some((c) => c.slug === slug && c.id !== id)) slug = `${slugBase}-${i++}`;

  const record = {
    id: existing?.id ?? randomUUID(),
    slug,
    name,
    tagline: str(formData, "tagline"),
    description: str(formData, "description"),
    image: uploaded || str(formData, "image") || existing?.image || "/products/dano-cool-cow-1kg.webp",
    href: str(formData, "href") || undefined,
    order: num(formData, "order", existing?.order ?? catalog.categories.length + 1) ?? 0,
  };

  catalog.categories = existing
    ? catalog.categories.map((c) => (c.id === existing.id ? record : c))
    : [...catalog.categories, record];
  await saveCatalog(catalog);
  refreshStorefront();
  redirect("/admin/catalog?saved=category");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const catalog = await getCatalog();
  const category = catalog.categories.find((c) => c.id === id);
  if (!category) redirect("/admin/catalog?error=missing");
  if (catalog.products.some((p) => p.categorySlug === category.slug)) {
    redirect("/admin/catalog?error=category-in-use");
  }
  catalog.categories = catalog.categories.filter((c) => c.id !== id);
  await saveCatalog(catalog);
  refreshStorefront();
  redirect("/admin/catalog?deleted=category");
}

export async function saveBrandAction(formData: FormData) {
  await requireAdmin();
  const catalog = await getCatalog();
  const id = str(formData, "id");
  const name = str(formData, "name");
  if (!name) redirect("/admin/catalog?error=name");
  const existing = catalog.brands.find((b) => b.id === id);
  const slugBase = slugify(str(formData, "slug") || name);
  let slug = slugBase;
  let i = 2;
  while (catalog.brands.some((b) => b.slug === slug && b.id !== id)) slug = `${slugBase}-${i++}`;

  const record = {
    id: existing?.id ?? randomUUID(),
    slug,
    name,
    note: str(formData, "note") || undefined,
    hasCatalog: catalog.products.some((p) => p.brandSlug === (existing?.slug ?? slug)),
    order: num(formData, "order", existing?.order ?? catalog.brands.length + 1) ?? 0,
  };

  catalog.brands = existing
    ? catalog.brands.map((b) => (b.id === existing.id ? { ...b, ...record } : b))
    : [...catalog.brands, record];
  await saveCatalog(catalog);
  refreshStorefront();
  redirect("/admin/catalog?saved=brand");
}

export async function deleteBrandAction(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id");
  const catalog = await getCatalog();
  const brand = catalog.brands.find((b) => b.id === id);
  if (!brand) redirect("/admin/catalog?error=missing");
  if (catalog.products.some((p) => p.brandSlug === brand.slug)) {
    redirect("/admin/catalog?error=brand-in-use");
  }
  catalog.brands = catalog.brands.filter((b) => b.id !== id);
  await saveCatalog(catalog);
  refreshStorefront();
  redirect("/admin/catalog?deleted=brand");
}

/* --------------------------------- messages ------------------------------- */

export async function markMessageReadAction(formData: FormData) {
  await requireAdmin();
  await markMessageRead(str(formData, "id"));
  revalidatePath("/admin/messages");
  redirect("/admin/messages");
}

/* ------------------------------- diagnostics ------------------------------ */

export async function adminSummary() {
  await requireAdmin();
  const [orders, inquiries] = await Promise.all([getOrders(), import("@/lib/db").then((m) => m.getInquiries())]);
  return { orderCount: orders.length, inquiryCount: inquiries.length };
}

export async function availableFilters() {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);
  return { categories, brands };
}
