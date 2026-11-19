type Bucket = { count: number; reset: number };

const buckets = new Map<string, Bucket>();

/**
 * Small in-process rate limiter for public forms. In a multi-instance
 * deployment this should be replaced with a shared store (e.g. Upstash).
 */
export function limitRequest(key: string, limit = 8, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  current.count += 1;
  if (current.count > limit) return { ok: false, remaining: 0 };
  return { ok: true, remaining: limit - current.count };
}

export function clientKey(request: Request, scope: string) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0]?.trim() || "local";
  return `${scope}:${ip}`;
}
