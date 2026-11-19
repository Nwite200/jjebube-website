import { NextResponse } from "next/server";
import { clientKey, limitRequest } from "@/lib/rate-limit";
import { z } from "zod";
import { addSubscriber } from "@/lib/db";

const schema = z.object({ email: z.string().email().max(200) });

export async function POST(request: Request) {
  if (!limitRequest(clientKey(request, "newsletter")).ok) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }
  const result = await addSubscriber(parsed.data.email);
  return NextResponse.json({
    ok: true,
    message: result.added ? "Subscribed" : "You are already on the list.",
  });
}
