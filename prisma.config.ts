import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Migrate/db push necesitan la conexión directa (no el pooler) a Postgres.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
