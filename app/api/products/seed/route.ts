import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRODUCT_SEED_DATA } from "./data";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "Seed API is disabled in production." }, { status: 403 });
  }

  await prisma.product.deleteMany({
    where: {
      image: {
        startsWith: "https://picsum.photos/seed/seed-product-",
      },
    },
  });

  const brandNames = [...new Set(PRODUCT_SEED_DATA.map((product) => product.brandName))];
  const brands = await prisma.$transaction(
    brandNames.map((name) =>
      prisma.brand.upsert({
        where: { name },
        update: { visible: true },
        create: { name },
      }),
    ),
  );
  const brandIdByName = new Map(brands.map((brand) => [brand.name, brand.id]));

  const result = await prisma.product.createMany({
    data: PRODUCT_SEED_DATA.map(({ brandName, ...product }) => ({
      ...product,
      brandId: brandIdByName.get(brandName)!,
    })),
  });

  return NextResponse.json({
    insertedCount: result.count,
  });
}
