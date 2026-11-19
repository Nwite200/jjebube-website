import { NextResponse } from "next/server";
import { clientKey, limitRequest } from "@/lib/rate-limit";
import { z } from "zod";
import { createMessage } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(24),
  email: z.string().trim().email().max(160),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(5).max(2000),
});

export async function POST(request: Request) {
  if (!limitRequest(clientKey(request, "contact")).ok) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please complete all fields with valid details." }, { status: 400 });
  }
  const message = {
    id: `MSG-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    ...parsed.data,
    read: false,
  };
  await createMessage(message);
  return NextResponse.json({ ok: true, id: message.id });
}
