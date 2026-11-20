export type Category = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  href?: string;
  order: number;
};

export type Brand = {
  id: string;
  slug: string;
  name: string;
  note?: string;
  accent?: string;
  hasCatalog?: boolean;
  order: number;
};

export type ProductVariant = {
  id: string;
  label: string;
  sku: string;
  price: number | null;
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brandSlug: string;
  categorySlug: string;
  packSize: string;
  unit: string;
  sku: string;
  price: number | null;
  compareAtPrice: number | null;
  wholesalePrice: number | null;
  stock: number;
  image: string;
  gallery: string[];
  description: string;
  details: string[];
  featured: boolean;
  isNew: boolean;
  tags: string[];
  variants: ProductVariant[];
  createdAt: string;
};

export type DeliveryZone = {
  id: string;
  name: string;
  fee: number;
};

export type StoreSettings = {
  storeName: string;
  tagline: string;
  phone: string;
  phoneAlt?: string;
  whatsapp: string;
  email: string;
  address: string;
  branchAddress: string;
  hours: string;
  announcement: string;
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroBody: string;
  aboutTitle: string;
  aboutBody: string;
  freeShippingThreshold: number;
  deliveryZones: DeliveryZone[];
  bankTransfer: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  socials: { instagram: string; facebook: string; x: string; tiktok: string };
};

export type OrderItem = {
  productId: string;
  name: string;
  brand: string;
  packSize: string;
  image: string;
  unitPrice: number;
  quantity: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type Order = {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: "paystack" | "bank-transfer" | "pay-on-delivery" | "whatsapp";
  paymentReference?: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    state: string;
    city: string;
    notes: string;
  };
  zoneId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
};

export type InquiryStatus = "new" | "contacted" | "quoted" | "closed";

export type WholesaleInquiry = {
  id: string;
  createdAt: string;
  status: InquiryStatus;
  fullName: string;
  businessName: string;
  phone: string;
  email: string;
  products: string;
  quantity: string;
  location: string;
  details: string;
};

export type Promotion = {
  id: string;
  title: string;
  subtitle: string;
  label: string;
  href: string;
  active: boolean;
  image?: string;
};

export type HomeContent = {
  categoriesHeading: string;
  categoriesSubheading: string;
  featuredHeading: string;
  featuredSubheading: string;
  brandsHeading: string;
  wholesaleHeading: string;
  wholesaleBody: string;
  promoEyebrow: string;
  promoTitle: string;
  promoBody: string;
  promoButton: string;
  promoHref: string;
};
