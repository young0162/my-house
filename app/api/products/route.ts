import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SortOption } from "@/app/types/product";

const PRODUCT_SORT_OPTIONS = new Set<SortOption>([
  "recommended",
  "sales",
  "price_asc",
  "price_desc",
  "review",
  "user_photo",
  "newest",
]);

const parseSortBy = (value: string | null): SortOption => {
  if (!value) return "recommended";
  return PRODUCT_SORT_OPTIONS.has(value as SortOption) ? (value as SortOption) : "recommended";
};

const getSortOrder = (sortBy: SortOption) => {
  switch (sortBy) {
    case "newest":
      return { createdAt: "desc" as const };
    case "price_asc":
      return { price: "asc" as const };
    case "price_desc":
      return { price: "desc" as const };
    case "review":
      return { reviews: { _count: "desc" as const } };
    case "sales":
    case "user_photo":
    case "recommended":
    default:
      return { id: "asc" as const };
  }
};

const imageBaseUrl = process.env.PRODUCT_IMAGE_BASE_URL ?? "";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sortBy = parseSortBy(searchParams.get("sortBy"));

  const products = await prisma.product.findMany({
    orderBy: getSortOrder(sortBy),
    select: {
      id: true,
      image: true,
      brand: {
        select: {
          name: true,
        },
      },
      name: true,
      price: true,
      originalPrice: true,
      isFreeShipping: true,
      badge: true,
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });

  const response = products.map((product) => {
    const reviewCount = product.reviews.length;
    const rating =
      reviewCount > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : undefined;
    const discountRate = product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : undefined;

    return {
      id: product.id,
      image: imageBaseUrl ? `${imageBaseUrl}/${product.image}` : product.image,
      brand: product.brand.name,
      name: product.name,
      discountRate,
      price: product.price,
      originalPrice: product.originalPrice ?? undefined,
      rating,
      reviewCount: reviewCount > 0 ? reviewCount : undefined,
      isFreeShipping: product.isFreeShipping,
      badge: product.badge ?? undefined,
    };
  });

  return NextResponse.json(response);
}
