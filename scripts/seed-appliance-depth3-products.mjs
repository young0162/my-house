import "dotenv/config";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { BadgeType, PrismaClient } from "../app/generated/prisma/index.js";

const PRODUCT_SEED_DOC = "docs/db_seed/product/2026-06-22_appliance_depth3_product_seed_plan.md";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

const parseProductCandidates = (filePath) => {
  const content = readFileSync(filePath, "utf8");
  const match = content.match(
    /const applianceProductSeedCandidates = \[([\s\S]*?)\];/,
  );

  if (!match) {
    throw new Error(`applianceProductSeedCandidates block not found in ${filePath}`);
  }

  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(
    `const applianceProductSeedCandidates = [${match[1]}]; this.applianceProductSeedCandidates = applianceProductSeedCandidates;`,
    sandbox,
  );

  return sandbox.applianceProductSeedCandidates;
};

const findCategoryByPath = async (tx, categoryPath) => {
  let parentId = null;
  let category = null;

  for (const name of categoryPath) {
    category = await tx.category.findFirst({
      where: {
        name,
        parentId,
      },
    });

    if (!category) {
      throw new Error(`Category path not found: ${categoryPath.join(" > ")}`);
    }

    parentId = category.id;
  }

  return category;
};

const toBadgeType = (badge) => {
  if (badge === null || badge === undefined) return null;
  if (badge === "BEST") return BadgeType.BEST;
  if (badge === "NEW") return BadgeType.NEW;
  throw new Error(`Unsupported badge value: ${badge}`);
};

try {
  const candidates = parseProductCandidates(PRODUCT_SEED_DOC);
  const before = {
    brands: await prisma.brand.count(),
    products: await prisma.product.count(),
  };

  const results = await prisma.$transaction(async (tx) => {
    const seeded = [];
    const brandCache = new Map();
    const categoryCache = new Map();

    for (const candidate of candidates) {
      let brand = brandCache.get(candidate.brandLookupName);

      if (!brand) {
        brand = await tx.brand.upsert({
          where: { name: candidate.brandLookupName },
          create: {
            name: candidate.brandLookupName,
            logo: null,
            visible: true,
          },
          update: {
            visible: true,
          },
        });
        brandCache.set(candidate.brandLookupName, brand);
      }

      const categoryKey = candidate.categoryPath.join(" > ");
      let category = categoryCache.get(categoryKey);

      if (!category) {
        category = await findCategoryByPath(tx, candidate.categoryPath);
        categoryCache.set(categoryKey, category);
      }

      const existing = await tx.product.findFirst({
        where: { name: candidate.name },
      });

      const data = {
        image: candidate.image,
        brandId: brand.id,
        name: candidate.name,
        description: candidate.description,
        price: candidate.price,
        originalPrice: candidate.originalPrice,
        isFreeShipping: candidate.isFreeShipping,
        isActive: candidate.isActive,
        stock: candidate.stock,
        badge: toBadgeType(candidate.badge),
        categoryId: category.id,
      };

      const product =
        existing === null
          ? await tx.product.create({ data })
          : await tx.product.update({
              where: { id: existing.id },
              data,
            });

      seeded.push({
        id: product.id,
        name: product.name,
        brand: brand.name,
        categoryPath: categoryKey,
        action: existing === null ? "created" : "updated",
      });
    }

    return seeded;
  });

  const after = {
    brands: await prisma.brand.count(),
    products: await prisma.product.count(),
  };

  console.log(
    JSON.stringify(
      {
        before,
        after,
        parsed: candidates.length,
        created: results.filter((result) => result.action === "created").length,
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
