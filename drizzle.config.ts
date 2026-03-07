import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: "gateway01.us-east-1.prod.aws.tidbcloud.com",
    port: 4000,
    user: "Xp3F88Yn4YRQBSX.root",
    password: "SWTQOJAWC1v4H5eu",
    database: "test",
    ssl: { rejectUnauthorized: true },
  },
});
