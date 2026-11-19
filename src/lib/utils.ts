import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNaira(value: number | null | undefined) {
  if (value === null || value === undefined) return "Price on request";
  return `₦${new Intl.NumberFormat("en-NG", { maximumFractionDigits: 0 }).format(value)}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function titleCase(input: string) {
  return input.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function stockLabel(stock: number) {
  if (stock <= 0) return { label: "Out of stock", tone: "out" as const };
  if (stock <= 8) return { label: `Only ${stock} left`, tone: "low" as const };
  return { label: "In stock", tone: "in" as const };
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function makeOrderNumber() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `JJE-${stamp}-${rand}`;
}

export function whatsappUrl(phone: string, message?: string) {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "234");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function safeParseInt(value: unknown, fallback = 0) {
  const n = typeof value === "number" ? value : parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}
