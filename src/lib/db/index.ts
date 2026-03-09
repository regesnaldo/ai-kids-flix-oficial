 import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const pool = mysql.createPool({
  host: "gateway01.us-east-1.prod.aws.tidbcloud.com",
  port: 4000,
  user: "Xp3F88Yn4YRQBSX.root",
  password: "SWTQOJAWC1v4H5eu",
  database: "test",
  ssl: { rejectUnauthorized: true },
  waitForConnections: true,
  connectionLimit: 10,
});

export const db = drizzle(pool, { schema, mode: "default" });
