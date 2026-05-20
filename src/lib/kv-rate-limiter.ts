/**
 * kv-rate-limiter.ts — Implementação Vercel KV do RateLimitStore.
 *
 * ATIVAÇÃO: Instale @vercel/kv e configure as env vars:
 *   KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN, KV_REST_API_READ_ONLY_TOKEN
 *
 * Depois, no arquivo de bootstrap da aplicação:
 *   import { kv } from "@vercel/kv";
 *   import { setRateLimitStore } from "@/lib/rate-limiter";
 *   import { createVercelKvStore } from "@/lib/kv-rate-limiter";
 *   setRateLimitStore(createVercelKvStore(kv));
 */

import type { RateLimitStore } from "./rate-limiter";

interface KvClient {
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<unknown>;
  del(key: string): Promise<unknown>;
}

/**
 * Cria um store de rate limiting distribuído usando Vercel KV.
 *
 * @param kv  Instância do cliente Vercel KV (`import { kv } from "@vercel/kv"`)
 * @returns   Store compatível com RateLimitStore
 */
export function createVercelKvStore(kv: KvClient): RateLimitStore {
  return {
    async incr(key: string): Promise<number> {
      return kv.incr(key);
    },

    async expire(key: string, ttlSeconds: number): Promise<void> {
      await kv.expire(key, ttlSeconds);
    },

    async reset(key: string): Promise<void> {
      await kv.del(key);
    },
  };
}

/**
 * Cria um store compatível usando Upstash Redis.
 *
 * @param redis  Instância do cliente Upstash (`import { Redis } from "@upstash/redis"`)
 * @returns       Store compatível com RateLimitStore
 */
export function createUpstashRedisStore(redis: KvClient): RateLimitStore {
  // Upstash Redis tem API compatível com Vercel KV (incr, expire, del)
  return createVercelKvStore(redis);
}
