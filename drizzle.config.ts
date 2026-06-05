import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: [
    "./src/lib/db/schema.ts",
    "./src/lib/db/schema-narrative.ts",
    "./src/lib/db/schema-extensions.ts",
  ],
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
