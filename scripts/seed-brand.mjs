import "dotenv/config";
import { readFileSync } from "node:fs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../app/generated/prisma/index.js";

const BRAND_SEED_DOC = "docs/db_seed/brand/2026-06-16_brand_seed_plan.md";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

const parseBrandNames = (filePath) => {
  const content = readFileSync(filePath, "utf8");
  const [, targetSection = ""] = content.split("대상 브랜드:");
  const [listSection = ""] = targetSection.split("## 관련 스키마");

  return listSection
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
};

try {
  const brandNames = parseBrandNames(BRAND_SEED_DOC);
  const before = await prisma.brand.count();

  const results = await prisma.$transaction(async (tx) => {
    const seeded = [];

    for (const name of brandNames) {
      const existing = await tx.brand.findUnique({
        where: { name },
      });

      const brand = await tx.brand.upsert({
        where: { name },
        create: {
          name,
          logo: null,
          visible: true,
        },
        update: {
          visible: true,
        },
      });

      seeded.push({
        name: brand.name,
        id: brand.id,
        action: existing === null ? "created" : existing.visible ? "reused" : "updated",
      });
    }

    return seeded;
  });

  const after = await prisma.brand.count();

  console.log(
    JSON.stringify(
      {
        before,
        after,
        parsed: brandNames.length,
        created: results.filter((result) => result.action === "created").length,
        reused: results.filter((result) => result.action === "reused").length,
        updated: results.filter((result) => result.action === "updated").length,
        results,
      },
      null,
      2,
    ),
  );
} finally {
  await prisma.$disconnect();
}
