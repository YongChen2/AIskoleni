/**
 * Jednoduchý denní limit podle klíče (IP) v paměti instance – ochrana kontaktního formuláře proti spamu.
 * Na Vercelu (Fluid Compute) se instance sdílí mezi požadavky, limit tedy není přesný, ale stačí.
 */

const memory = new Map<string, { count: number; day: string }>();

export type RateLimitResult = { ok: boolean; remaining: number; limit: number };

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function rateLimit(key: string, limit: number): Promise<RateLimitResult> {
  const day = today();
  const entry = memory.get(key);
  const count = entry && entry.day === day ? entry.count + 1 : 1;
  memory.set(key, { count, day });
  if (memory.size > 5000) memory.clear();
  return { ok: count <= limit, remaining: Math.max(0, limit - count), limit };
}

export function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "anon").trim();
}
