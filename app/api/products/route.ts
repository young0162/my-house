import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SortOption } from "@/app/types/product";

const getSortOrder = (sortBy: SortOption) => {
  switch (sortBy) {
    case "newest":
      return { createdAt: "desc" as const };
    case "price_asc":
      return { price: "asc" as const };
    case "price_desc":
      return { price: "desc" as const };
    case "review":
      return { reviewCount: "desc" as const };
    case "recommended":
    default:
      return { id: "asc" as const };
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sortBy = (searchParams.get("sortBy") ?? "recommended") as SortOption;

  const products = await prisma.product.findMany({
    orderBy: getSortOrder(sortBy),
  });

  console.log("products===============", products);

  return NextResponse.json(products);
}
