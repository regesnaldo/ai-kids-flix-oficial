import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _db: any = null;

function getDb() {
  if (!_db) {
    const connection = mysql.createPool(process.env.DATABASE_URL!);
    _db = drizzle(connection);
  }
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return getDb()[prop];
  },
});
