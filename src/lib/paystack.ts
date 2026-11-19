import "server-only";

const PAYSTACK_BASE = "https://api.paystack.co";

export function paystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY && process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);
}

type InitInput = {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

export async function initializePaystack(input: InitInput) {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("Paystack is not configured");
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
    cache: "no-store",
  });
  const json = (await res.json()) as {
    status: boolean;
    message: string;
    data?: { authorization_url: string; access_code: string; reference: string };
  };
  if (!res.ok || !json.status || !json.data) {
    throw new Error(json.message || "Unable to start payment");
  }
  return json.data;
}

export async function verifyPaystack(reference: string) {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("Paystack is not configured");
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  const json = (await res.json()) as {
    status: boolean;
    message: string;
    data?: {
      status: string;
      amount: number;
      currency: string;
      reference: string;
      paid_at?: string;
      customer?: { email?: string };
    };
  };
  if (!res.ok || !json.status || !json.data) {
    throw new Error(json.message || "Unable to verify payment");
  }
  return json.data;
}
