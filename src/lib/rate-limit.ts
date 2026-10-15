import { Redis } from "@upstash/redis";

/**
 * Jednoduchý denní limit podle klíče (IP).
 * S Upstash Redis (Vercel Marketplace) je limit sdílený mezi všemi instancemi.
 * Bez něj spadne na paměť instance – pro produkci nespolehlivé, ale funkční.
 */

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

const memory = new Map<string, { count: number; day: string }>();

export type RateLimitResult = { ok: boolean; remaining: number; limit: number };

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function rateLimit(key: string, limit: number): Promise<RateLimitResult> {
  const day = today();

  if (redis) {
    const k = `rl:${key}:${day}`;
    const count = await redis.incr(k);
    if (count === 1) await redis.expire(k, 60 * 60 * 26);
    return { ok: count <= limit, remaining: Math.max(0, limit - count), limit };
  }

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
