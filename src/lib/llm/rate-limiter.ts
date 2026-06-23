/**
 * ─── LLM LAYER — RATE LIMITER ──────────────────────────────────────────
 *
 * Token-bucket-like gate sobre a infra existente (src/lib/rate-limiter.ts),
 * que é fixed-window counter in-memory com store trocável (KV/Upstash).
 *
 * Limites (env-overridable):
 *   - Por usuário: LLM_RATE_LIMIT_PER_USER (default 10 req / 60s)
 *   - Global:      LLM_RATE_LIMIT_GLOBAL    (default 100 req / 60s)
 *
 * Lança LLMRateLimitError quando excedido. Não usa getRemainingAttempts
 * (bug de cast em lib/rate-limiter.ts:130).
 */

import { checkRateLimit, resetRateLimit } from "@/lib/rate-limiter";
import { LLMRateLimitError } from "./types";

const KEY_PREFIX = "llm";
const WINDOW_SECONDS = Number(process.env.LLM_RATE_LIMIT_WINDOW_SECONDS ?? 60);
const PER_USER = Number(process.env.LLM_RATE_LIMIT_PER_USER ?? 10);
const GLOBAL = Number(process.env.LLM_RATE_LIMIT_GLOBAL ?? 100);

/** Normaliza userId para chave de rate-limit. */
function userKey(userId: string | number | undefined): string {
  if (userId === undefined || userId === null || userId === "") return "anonymous";
  return `user:${userId}`;
}

/**
 * Verifica os limites por usuário e global. Lança LLMRateLimitError se excedido.
 * Deve ser chamado ANTES de despachar para o adapter.
 */
export async function llmRateLimit(
  userId: string | number | undefined,
  _route?: string,
): Promise<void> {
  const ukey = userKey(userId);

  const userAllowed = await checkRateLimit(ukey, {
    maxAttempts: PER_USER,
    windowSeconds: WINDOW_SECONDS,
    keyPrefix: KEY_PREFIX,
  });
  if (!userAllowed) {
    throw new LLMRateLimitError("user", ukey);
  }

  const globalAllowed = await checkRateLimit("global", {
    maxAttempts: GLOBAL,
    windowSeconds: WINDOW_SECONDS,
    keyPrefix: KEY_PREFIX,
  });
  if (!globalAllowed) {
    throw new LLMRateLimitError("global", ukey);
  }
}

/** Reseta os contadores para um usuário (uso em testes/admin). */
export async function resetLlmRateLimit(userId: string | number | undefined): Promise<void> {
  const ukey = userKey(userId);
  await resetRateLimit(`${KEY_PREFIX}:${ukey}`);
  await resetRateLimit(`${KEY_PREFIX}:global`);
}
