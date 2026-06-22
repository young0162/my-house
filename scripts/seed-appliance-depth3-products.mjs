import { readFileSync } from "node:fs";
import { basename } from "node:path";
import vm from "node:vm";
import { BadgeType } from "../app/generated/prisma/index.js";
import {
  replaceProductImages,
  validateApplianceCategories,
} from "./lib/seed-product-images.mjs";
import { runSeed } from "./lib/seed-runner.mjs";

const PRODUCT_SEED_DOC = "docs/db_seed/product/2026-06-23_appliance_depth3_product_seed_plan.md";
const APPLIANCE_CATEGORY_IDS = [34, 35, 36, 37, 38];

const parseProductCandidates = (filePath) => {
  const content = readFileSync(filePath, "utf8");
  const match = content.match(/const applianceProductSeedCandidates = \[([\s\S]*?)\];/);

  if (!match) throw new Error(`applianceProductSeedCandidates block not found in ${filePath}`);

  const IMAGE_BASE_URL = process.env.PRODUCT_IMAGE_BASE_URL ?? "/image/products";
  const sandbox = { IMAGE_BASE_URL };
  vm.createContext(sandbox);
  vm.runInContext(
    `const applianceProductSeedCandidates = [${match[1]}]; this.applianceProductSeedCandidates = applianceProductSeedCandidates;`,
    sandbox,
  );

  return sandbox.applianceProductSeedCandidates.map((candidate) => ({
    ...candidate,
    image: basename(candidate.image),
    additionalImages: candidate.additionalImages.map((url) => basename(url)),
  }));
};

const toBadgeType = (badge) => {
  if (badge === null || badge === undefined) return null;
  if (badge === "BEST") return BadgeType.BEST;
  if (badge === "NEW") return BadgeType.NEW;
  throw new Error(`Unsupported badge value: ${badge}`);
};

runSeed(async (prisma) => {
  const candidates = parseProductCandidates(PRODUCT_SEED_DOC);
  const categories = await prisma.category.findMany({
    where: { id: { in: APPLIANCE_CATEGORY_IDS } },
    select: { id: true, name: true, depth: true, parentId: true },
  });
  validateApplianceCategories(categories);

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const before = {
    brands: await prisma.brand.count(),
    products: await prisma.product.count(),
    productImages: await prisma.productImage.count(),
  };

  const results = await prisma.$transaction(async (tx) => {
    const seeded = [];
    const brandCache = new Map();

    for (const candidate of candidates) {
      let brand = brandCache.get(candidate.brandLookupName);

      if (!brand) {
        brand = await tx.brand.upsert({
          where: { name: candidate.brandLookupName },
          create: { name: candidate.brandLookupName, logo: null, visible: true },
          update: { visible: true },
        });
        brandCache.set(candidate.brandLookupName, brand);
      }

      const category = categoryById.get(candidate.categoryId);
      if (!category || category.depth !== 3) {
        throw new Error(`Unsupported product category: ${candidate.categoryId}`);
      }

      const existing = await tx.product.findFirst({ where: { name: candidate.name } });
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
        categoryId: candidate.categoryId,
      };

      const product =
        existing === null
          ? await tx.product.create({ data })
          : await tx.product.update({ where: { id: existing.id }, data });

      const imageCount = await replaceProductImages(tx, product.id, candidate);

      seeded.push({
        id: product.id,
        name: product.name,
        brand: brand.name,
        categoryId: category.id,
        categoryName: category.name,
        imageCount,
        action: existing === null ? "created" : "updated",
      });
    }

    return seeded;
  });

  const after = {
    brands: await prisma.brand.count(),
    products: await prisma.product.count(),
    productImages: await prisma.productImage.count(),
  };

  console.log(
    JSON.stringify(
      {
        before,
        after,
        parsed: candidates.length,
        created: results.filter((r) => r.action === "created").length,
        updated: results.filter((r) => r.action === "updated").length,
        results,
      },
      null,
      2,
    ),
  );
});
