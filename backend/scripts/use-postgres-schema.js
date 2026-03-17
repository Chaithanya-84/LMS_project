#!/usr/bin/env node
import { copyFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const prismaDir = join(__dirname, "..", "prisma");
const schemaPath = join(prismaDir, "schema.prisma");
const postgresPath = join(prismaDir, "schema.postgres.prisma");

const dbUrl = process.env.DATABASE_URL || "";
if (dbUrl.includes("postgresql") && existsSync(postgresPath)) {
  copyFileSync(postgresPath, schemaPath);
  console.log("Using PostgreSQL schema for deployment.");
}
