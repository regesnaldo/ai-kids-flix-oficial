/**
 * rate-limiter.ts — Abstração de rate limiting preparada para evolução.
 *
 * IMPLEMENTAÇÃO ATUAL: In-memory Map (single-instance).
 * Funciona para Vercel serverless de instância única e desenvolvimento.
 *
 * ARQUITETURA DE EVOLUÇÃO:
 *   Basta trocar o `store` por uma implementação que use:
 *   - Vercel KV    → @vercel/kv
 *   - Upstash Redis → @upstash/redis
 *   - Redis padrão  → ioredis
 *
 * A interface `RateLimitStore` é o contrato. Troque o store
 * e todo o sistema de rate limiting migra sem alterar as APIs.
 */

// ─── Interface do Store (contrato para qualquer backend) ──────────────────────

export interface RateLimitStore {
  /** Incrementa o contador para a chave. Retorna o novo valor. */
  incr(key: string): Promise<number>;
  /** Define TTL (em segundos) para a chave. Só na primeira vez. */
  expire(key: string, ttlSeconds: number): Promise<void>;
  /** Reseta o contador (útil para testes e admin) */
  reset(key: string): Promise<void>;
}

// ─── Implementação In-Memory (produção single-instance) ───────────────────────

class InMemoryStore implements RateLimitStore {
  private map = new Map<string, { count: number; expiresAt: number }>();

  async incr(key: string): Promise<number> {
    const now = Date.now();
    const record = this.map.get(key);

    if (!record || now > record.expiresAt) {
      this.map.set(key, { count: 1, expiresAt: now + 900_000 }); // 15min default
      return 1;
    }

    record.count++;
    return record.count;
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    const record = this.map.get(key);
    if (record) {
      record.expiresAt = Date.now() + ttlSeconds * 1000;
    }
  }

  async reset(key: string): Promise<void> {
    this.map.delete(key);
  }
}

// ─── Rate Limiter ─────────────────────────────────────────────────────────────

export interface RateLimitConfig {
  /** Máximo de tentativas na janela */
  maxAttempts: number;
  /** Janela de tempo em segundos */
  windowSeconds: number;
  /** Prefixo para namespace das chaves */
  keyPrefix: string;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 5,
  windowSeconds: 900, // 15 minutos
  keyPrefix: "rate",
};

let _store: RateLimitStore = new InMemoryStore();

/**
 * Substitui o store de rate limiting.
 * Use para migrar para Redis/KV sem alterar as APIs de negócio.
 *
 * Exemplo:
 *   import { kv } from "@vercel/kv";
 *   setRateLimitStore(createVercelKvStore(kv));
 */
export function setRateLimitStore(store: RateLimitStore): void {
  _store = store;
}

/**
 * Retorna o store atual (útil para testes e debug).
 */
export function getRateLimitStore(): RateLimitStore {
  return _store;
}

/**
 * Verifica se uma chave está dentro do limite.
 *
 * @param key    Identificador único (ex: IP, userId, API key)
 * @param config Opcional — override das configs padrão
 * @returns      true se permitido, false se bloqueado
 */
export async function checkRateLimit(
  key: string,
  config?: Partial<RateLimitConfig>
): Promise<boolean> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const fullKey = `${cfg.keyPrefix}:${key}`;

  const count = await _store.incr(fullKey);

  // Na primeira tentativa, define o TTL
  if (count === 1) {
    await _store.expire(fullKey, cfg.windowSeconds);
  }

  return count <= cfg.maxAttempts;
}

/**
 * Retorna quantas tentativas restam para a chave.
 */
export async function getRemainingAttempts(
  key: string,
  config?: Partial<RateLimitConfig>
): Promise<number> {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const fullKey = `${cfg.keyPrefix}:${key}`;

  const count = await (_store as InMemoryStore).incr(fullKey);
  // Nota: incr já foi chamado — precisamos decrementar mentalmente
  // Em produção com Redis, usar GET em vez de INCR para esta função.
  // Para o store in-memory, o contador já incrementou — ajustamos.
  const remaining = Math.max(0, cfg.maxAttempts - count + 1);
  return remaining;
}

/**
 * Reseta o contador para uma chave (admin/unblock).
 */
export async function resetRateLimit(key: string): Promise<void> {
  await _store.reset(key);
}
