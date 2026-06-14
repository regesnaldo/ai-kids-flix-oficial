import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import "server-only";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Pool type incompatibility between mysql2 and drizzle-orm
let _pool: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- ReturnType<typeof drizzle> has $client type mismatch
let _db: any;

function getPool(): mysql.Pool {
  if (_pool) return _pool as mysql.Pool;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "[MENTE.AI] DATABASE_URL não definida. Adicione-a ao .env.local."
    );
  }

  const parsed = new URL(url);

  _pool = mysql.createPool({
    host: parsed.hostname,
    port: parseInt(parsed.port || "4000"),
    user: parsed.username,
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace("/", ""),
    ssl: { rejectUnauthorized: true },
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });

  return _pool as mysql.Pool;
}

function getDbInstance(): ReturnType<typeof drizzle> {
  if (_db) return _db as ReturnType<typeof drizzle>;
  _db = drizzle(getPool(), { schema, mode: "default" });
  return _db as ReturnType<typeof drizzle>;
}

export { getDbInstance as getDb };

export const db: ReturnType<typeof drizzle> = new Proxy(
  {} as ReturnType<typeof drizzle>,
  {
    get(_target, prop) {
      const instance = getDbInstance();
      const value = (instance as unknown as Record<string | symbol, unknown>)[prop];
      if (typeof value === "function") {
        return (value as (...args: unknown[]) => unknown).bind(instance);
      }
      return value;
    },
  }
);

export const pool: mysql.Pool = new Proxy({} as mysql.Pool, {
  get(_target, prop) {
    const p = getPool();
    const value = (p as unknown as Record<string | symbol, unknown>)[prop];
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(p);
    }
    return value;
  },
});
