 import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

function normalizeDatabaseUrl(rawUrl: string): string {
  try {
    new URL(rawUrl);
    return rawUrl;
  } catch {}

  const sslIndex = rawUrl.indexOf("ssl=");
  if (sslIndex === -1) {
    return rawUrl;
  }

  const prefix = rawUrl.slice(0, sslIndex + 4);
  const rest = rawUrl.slice(sslIndex + 4);
  const ampIndex = rest.indexOf("&");
  const sslValue = ampIndex === -1 ? rest : rest.slice(0, ampIndex);
  const suffix = ampIndex === -1 ? "" : rest.slice(ampIndex);

  if (!/[{}"]/u.test(sslValue)) {
    return rawUrl;
  }

  const candidate = `${prefix}${encodeURIComponent(sslValue)}${suffix}`;
  try {
    new URL(candidate);
    return candidate;
  } catch {
    return rawUrl;
  }
}

const poolOptions: mysql.PoolOptions = {
  waitForConnections: true,
  connectionLimit: 10,
};

if (process.env.DATABASE_URL) {
  poolOptions.uri = normalizeDatabaseUrl(process.env.DATABASE_URL);
}

const pool = mysql.createPool(poolOptions);

export const db = drizzle(pool, { schema, mode: "default" });
