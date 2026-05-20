import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

/**
 * db/index.ts — Conexão TiDB Cloud via Drizzle ORM.
 *
 * POOL LAZY SINGLETON: A conexão só é criada na primeira query,
 * nunca no module load. Essencial para ambientes serverless (Vercel)
 * onde cada cold start criaria um pool desnecessário.
 */

function normalizeDatabaseUrl(rawUrl: string): string {
  let rawIsValid = true;
  try {
    new URL(rawUrl);
  } catch {
    rawIsValid = false;
  }

  if (rawIsValid) return rawUrl;

  const sslIndex = rawUrl.indexOf("ssl=");
  if (sslIndex === -1) return rawUrl;

  const prefix = rawUrl.slice(0, sslIndex + 4);
  const rest = rawUrl.slice(sslIndex + 4);
  const ampIndex = rest.indexOf("&");
  const sslValue = ampIndex === -1 ? rest : rest.slice(0, ampIndex);
  const suffix = ampIndex === -1 ? "" : rest.slice(ampIndex);

  if (!/[{}"]/u.test(sslValue)) return rawUrl;

  const candidate = `${prefix}${encodeURIComponent(sslValue)}${suffix}`;
  try {
    new URL(candidate);
    return candidate;
  } catch {
    return rawUrl;
  }
}

// ─── Lazy Singleton ───────────────────────────────────────────────────────────
// Armazenamento interno tipado como any para evitar conflitos de tipo
// entre mysql2/promise Pool e o tipo esperado pelo Drizzle.
// O contrato público (db, pool) é estritamente tipado.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _pool: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _db: any;

function getPool(): mysql.Pool {
  if (_pool) return _pool as mysql.Pool;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "[MENTE.AI] DATABASE_URL não definida. Adicione-a ao .env.local."
    );
  }

  _pool = mysql.createPool(normalizeDatabaseUrl(url));
  return _pool as mysql.Pool;
}

function getDbInstance(): ReturnType<typeof drizzle> {
  if (_db) return _db as ReturnType<typeof drizzle>;
  _db = drizzle(getPool(), { schema, mode: "default" });
  return _db as ReturnType<typeof drizzle>;
}

/**
 * Acesso explícito à instância Drizzle (para uso programático).
 * Prefira usar `db` (proxy) para acesso direto em queries.
 */
export { getDbInstance as getDb };

// ─── Exportações com inicialização lazy ───────────────────────────────────────

/**
 * Instância Drizzle — use normalmente:
 *   import { db } from "@/lib/db";
 *   const users = await db.select().from(usersTable);
 *
 * O pool MySQL só é criado na PRIMEIRA query, não no import.
 */
export const db: ReturnType<typeof drizzle> = new Proxy(
  {} as ReturnType<typeof drizzle>,
  {
    get(_target, prop) {
      const instance = getDbInstance();
      const value = (instance as unknown as Record<string | symbol, unknown>)[prop];
      if (typeof value === "function") {
        return (value as Function).bind(instance);
      }
      return value;
    },
  }
);

/**
 * Pool MySQL cru — use apenas se precisar de acesso direto.
 *   import { pool } from "@/lib/db";
 *   const conn = await pool.getConnection();
 */
export const pool: mysql.Pool = new Proxy({} as mysql.Pool, {
  get(_target, prop) {
    const p = getPool();
    const value = (p as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === "function") {
      return (value as Function).bind(p);
    }
    return value;
  },
});
