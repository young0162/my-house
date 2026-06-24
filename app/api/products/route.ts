import { NextRequest, NextResponse } from "next/server";
import { productDbService } from "@/services/product.db";
import { SortOption } from "@/app/types/product/index";

const VALID_SORT_OPTIONS = new Set<SortOption>([
  "recommended", "sales", "price_asc", "price_desc", "review", "user_photo", "newest",
]);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sortByParam = searchParams.get("sortBy");
  const sortBy: SortOption =
    sortByParam && VALID_SORT_OPTIONS.has(sortByParam as SortOption)
      ? (sortByParam as SortOption)
      : "recommended";

  const categoryIdParam = searchParams.get("categoryId");
  const categoryId = categoryIdParam ? Number(categoryIdParam) : null;

  const products = await productDbService.getProducts({ sortBy, categoryId });
  return NextResponse.json(products);
}
