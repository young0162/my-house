import "dotenv/config";
import { readFileSync } from "node:fs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../app/generated/prisma/index.js";

const CATEGORY_FILES = [
  "category_text/가구_카테고리.txt",
  "category_text/가전·디지털_카테고리.txt",
  "category_text/주방용품_카테고리.txt",
];

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

const parseCategoryFile = (filePath) => {
  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);

  return lines
    .map((line) => {
      if (!line.trim()) return null;

      const leadingSpaces = line.match(/^ */)?.[0].length ?? 0;

      return {
        name: line.trim(),
        indentLevel: leadingSpaces / 4,
      };
    })
    .filter(Boolean);
};

const seedOneFile = async (tx, filePath) => {
  const items = parseCategoryFile(filePath);
  const stack = [];
  const siblingCounts = new Map();
  const result = {
    filePath,
    parsed: items.length,
    created: 0,
    reused: 0,
    updated: 0,
  };

  for (const item of items) {
    const parent = item.indentLevel === 0 ? null : stack[item.indentLevel - 1];
    const parentId = parent?.id ?? null;
    const depth = item.indentLevel + 1;
    const siblingKey = parentId === null ? "root" : String(parentId);
    const sortOrder = siblingCounts.get(siblingKey) ?? 0;

    siblingCounts.set(siblingKey, sortOrder + 1);

    const existing = await tx.category.findFirst({
      where: {
        name: item.name,
        parentId,
      },
    });

    if (existing === null) {
      const category = await tx.category.create({
        data: {
          name: item.name,
          slug: null,
          depth,
          sortOrder,
          isActive: true,
          parentId,
        },
      });

      result.created += 1;
      stack[item.indentLevel] = category;
    } else {
      result.reused += 1;
      if (
        existing.depth !== depth ||
        existing.sortOrder !== sortOrder ||
        existing.isActive !== true
      ) {
        const category = await tx.category.update({
          where: { id: existing.id },
          data: {
            depth,
            sortOrder,
            isActive: true,
          },
        });

        result.updated += 1;
        stack[item.indentLevel] = category;
      } else {
        stack[item.indentLevel] = existing;
      }
    }

    stack.length = item.indentLevel + 1;
  }

  return result;
};

try {
  const before = await prisma.category.count();

  const results = await prisma.$transaction(async (tx) => {
    const seeded = [];

    for (const filePath of CATEGORY_FILES) {
      seeded.push(await seedOneFile(tx, filePath));
    }

    return seeded;
  });

  const after = await prisma.category.count();

  console.log(
    JSON.stringify(
      {
        before,
        after,
        totalParsed: results.reduce((sum, result) => sum + result.parsed, 0),
        totalCreated: results.reduce((sum, result) => sum + result.created, 0),
        totalReused: results.reduce((sum, result) => sum + result.reused, 0),
        totalUpdated: results.reduce((sum, result) => sum + result.updated, 0),
        results,
      },
      null,
      2,
    ),
  );
} finally {
  await prisma.$disconnect();
}
