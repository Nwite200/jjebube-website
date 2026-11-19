import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "jje_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret() {
  return (
    process.env.AUTH_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "jj-ebube-development-secret-change-me"
  );
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "jjebube-admin";
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function checkPassword(candidate: string) {
  const expected = adminPassword();
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function createAdminSession() {
  const expires = Date.now() + MAX_AGE * 1000;
  const payload = `admin.${expires}`;
  const token = `${payload}.${sign(payload)}`;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroyAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdmin() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expires, signature] = parts;
  if (role !== "admin") return false;
  if (!expires || Number(expires) < Date.now()) return false;
  const expected = sign(`${role}.${expires}`);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export function isDefaultAdminPassword() {
  return !process.env.ADMIN_PASSWORD;
}
