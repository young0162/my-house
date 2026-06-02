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

  const result = await prisma.product.createMany({
    data: PRODUCT_SEED_DATA,
  });

  return NextResponse.json({
    insertedCount: result.count,
  });
}
