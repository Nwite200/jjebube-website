import { NextResponse } from "next/server";
import { clientKey, limitRequest } from "@/lib/rate-limit";
import { z } from "zod";
import { createInquiry } from "@/lib/db";

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  businessName: z.string().trim().max(160).optional().default(""),
  phone: z.string().trim().min(7).max(24).regex(/^[0-9+\s()-]+$/),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  products: z.string().trim().min(2).max(2000),
  quantity: z.string().trim().max(500).optional().default(""),
  location: z.string().trim().min(2).max(200),
  details: z.string().trim().max(2000).optional().default(""),
});

export async function POST(request: Request) {
  if (!limitRequest(clientKey(request, "wholesale")).ok) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the required fields and try again." },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const inquiry = {
    id: `WS-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "new" as const,
    fullName: data.fullName,
    businessName: data.businessName,
    phone: data.phone,
    email: data.email ?? "",
    products: data.products,
    quantity: data.quantity,
    location: data.location,
    details: data.details,
  };

  await createInquiry(inquiry);

  return NextResponse.json({ ok: true, inquiryId: inquiry.id });
}
