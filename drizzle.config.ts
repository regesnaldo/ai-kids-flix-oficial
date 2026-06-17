import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: [
    "./src/lib/db/schema.ts",
    "./src/lib/db/schema-extensions.ts",
    "./src/lib/db/schema-narrative.ts",
  ],
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
