import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { unstable_noStore } from "next/cache";
import type {
  Brand,
  Category,
  HomeContent,
  Order,
  Product,
  Promotion,
  StoreSettings,
  WholesaleInquiry,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/* Serialize writes so concurrent admin actions never corrupt a JSON file. */
let writeQueue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(task, task);
  writeQueue = next.catch(() => undefined);
  return next;
}

async function writeJson<T>(file: string, value: T): Promise<T> {
  return enqueue(async () => {
    const full = path.join(DATA_DIR, file);
    const tmp = `${full}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
    await fs.rename(tmp, full);
    return value;
  });
}

export type Catalog = { categories: Category[]; brands: Brand[]; products: Product[] };

export async function getCatalog(): Promise<Catalog> {
  unstable_noStore();
  const data = await readJson<Catalog>("catalog.json", {
    categories: [],
    brands: [],
    products: [],
  });
  return data;
}

export async function getProducts() {
  const { products } = await getCatalog();
  return products;
}

export async function getProduct(slug: string) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getCategories() {
  const { categories } = await getCatalog();
  return [...categories].sort((a, b) => a.order - b.order);
}

export async function getCategory(slug: string) {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getBrands() {
  const { brands } = await getCatalog();
  return [...brands].sort((a, b) => a.order - b.order);
}

export async function getBrand(slug: string) {
  const brands = await getBrands();
  return brands.find((b) => b.slug === slug) ?? null;
}

export async function saveCatalog(catalog: Catalog) {
  return writeJson("catalog.json", catalog);
}

export async function getSettings(): Promise<StoreSettings> {
  unstable_noStore();
  return readJson<StoreSettings>("settings.json", defaultSettings);
}

export async function saveSettings(settings: StoreSettings) {
  return writeJson("settings.json", settings);
}

export async function getOrders(): Promise<Order[]> {
  unstable_noStore();
  const orders = await readJson<Order[]>("orders.json", []);
  return orders.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getOrder(idOrNumber: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === idOrNumber || o.number === idOrNumber) ?? null;
}

export async function createOrder(order: Order) {
  const orders = await readJson<Order[]>("orders.json", []);
  orders.unshift(order);
  await writeJson("orders.json", orders);
  return order;
}

export async function updateOrder(id: string, patch: Partial<Order>) {
  const orders = await readJson<Order[]>("orders.json", []);
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...patch };
  await writeJson("orders.json", orders);
  return orders[idx];
}

export async function getInquiries(): Promise<WholesaleInquiry[]> {
  unstable_noStore();
  const inquiries = await readJson<WholesaleInquiry[]>("inquiries.json", []);
  return inquiries.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function createInquiry(inquiry: WholesaleInquiry) {
  const inquiries = await readJson<WholesaleInquiry[]>("inquiries.json", []);
  inquiries.unshift(inquiry);
  await writeJson("inquiries.json", inquiries);
  return inquiry;
}

export async function updateInquiry(id: string, patch: Partial<WholesaleInquiry>) {
  const inquiries = await readJson<WholesaleInquiry[]>("inquiries.json", []);
  const idx = inquiries.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  inquiries[idx] = { ...inquiries[idx], ...patch };
  await writeJson("inquiries.json", inquiries);
  return inquiries[idx];
}

export async function getPromotions(): Promise<Promotion[]> {
  unstable_noStore();
  return readJson<Promotion[]>("promotions.json", []);
}

export async function savePromotions(promotions: Promotion[]) {
  return writeJson("promotions.json", promotions);
}

export async function getHomeContent(): Promise<HomeContent> {
  unstable_noStore();
  return readJson<HomeContent>("content.json", defaultHomeContent);
}

export async function saveHomeContent(content: HomeContent) {
  return writeJson("content.json", content);
}

const defaultSettings: StoreSettings = {
  storeName: "JJ Ebube Enterprise",
  tagline: "Quality Products. Better Life.",
  phone: "07031633358",
  phoneAlt: "09038581150",
  whatsapp: "+2347031633358",
  email: "",
  address: "248 Obodoukwu Rd, Onitsha",
  branchAddress: "No A26/2 Kingsway Line, Ogbaru Main Market, Onitsha",
  hours: "Mon – Sat, 8:00am – 6:00pm",
  announcement: "Quality You Trust • Value You Love • Delivery Across Nigeria",
  heroEyebrow: "Your everyday essentials, elevated",
  heroTitle: "Good Products. Better Prices. Everyday.",
  heroHighlight: "Better Prices.",
  heroBody:
    "From trusted household favourites to everyday essentials, shop quality products at prices that make sense.",
  aboutTitle: "A Nigerian store built on trust.",
  aboutBody:
    "JJ Ebube Enterprise supplies homes, shops and businesses with the food, drinks and household essentials they rely on every day.",
  freeShippingThreshold: 150000,
  deliveryZones: [
    { id: "lagos", name: "Lagos", fee: 2500 },
    { id: "southwest", name: "South-West (excluding Lagos)", fee: 3500 },
    { id: "southeast", name: "South-East & South-South", fee: 4500 },
    { id: "north", name: "Northern Nigeria", fee: 5000 },
    { id: "pickup", name: "Pick up from store", fee: 0 },
  ],
  bankTransfer: {
    bankName: "Bank name to be confirmed",
    accountName: "JJ Ebube Enterprise",
    accountNumber: "Account number to be confirmed",
  },
  socials: { instagram: "#", facebook: "#", x: "#", tiktok: "#" },
};

const defaultHomeContent: HomeContent = {
  categoriesHeading: "Shop Your Essentials",
  categoriesSubheading: "Everything you need. All in one place.",
  featuredHeading: "Favourites Worth Stocking Up On",
  featuredSubheading: "Quality products for your home, business and everyday needs.",
  brandsHeading: "Brands You Know. Quality You Trust.",
  wholesaleHeading: "Stock Your Business With Confidence.",
  wholesaleBody:
    "From everyday essentials to bulk quantities, JJ Ebube Enterprise helps you get the products your business needs.",
  promoEyebrow: "Current offers",
  promoTitle: "More Value. More Savings. More for You.",
  promoBody: "Discover great deals on the products you use every day.",
  promoButton: "Explore Current Deals",
  promoHref: "/deals",
};

export { defaultHomeContent, defaultSettings };

export type Subscriber = { email: string; createdAt: string };

export async function addSubscriber(email: string) {
  const normalized = email.trim().toLowerCase();
  const existing = await readJson<Subscriber[]>("subscribers.json", []);
  if (existing.some((s) => s.email === normalized)) return { added: false };
  existing.unshift({ email: normalized, createdAt: new Date().toISOString() });
  await writeJson("subscribers.json", existing);
  return { added: true };
}

export async function getSubscribers() {
  unstable_noStore();
  return readJson<Subscriber[]>("subscribers.json", []);
}

export type ContactMessage = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
};

export async function getMessages() {
  unstable_noStore();
  return readJson<ContactMessage[]>("messages.json", []);
}

export async function createMessage(message: ContactMessage) {
  const messages = await readJson<ContactMessage[]>("messages.json", []);
  messages.unshift(message);
  await writeJson("messages.json", messages);
  return message;
}

export async function markMessageRead(id: string) {
  const messages = await readJson<ContactMessage[]>("messages.json", []);
  const idx = messages.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  messages[idx] = { ...messages[idx], read: true };
  await writeJson("messages.json", messages);
  return messages[idx];
}
