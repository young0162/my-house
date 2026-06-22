import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const imageBaseUrl = process.env.PRODUCT_IMAGE_BASE_URL ?? "";

const buildImageUrl = (filename: string) =>
  imageBaseUrl ? `${imageBaseUrl}/${filename}` : filename;

const buildBreadcrumb = async (categoryId: number | null) => {
  if (!categoryId) return [];

  const crumbs: { label: string; href: string }[] = [];
  let currentId: number | null = categoryId;

  while (currentId !== null) {
    const category = await prisma.category.findUnique({
      where: { id: currentId },
      select: { id: true, name: true, parentId: true },
    });

    if (!category) break;

    crumbs.unshift({
      label: category.name,
      href: `/store/category?category_id=${category.id}`,
    });

    currentId = category.parentId;
  }

  return crumbs;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      price: true,
      originalPrice: true,
      isFreeShipping: true,
      badge: true,
      categoryId: true,
      brand: {
        select: { name: true },
      },
      productImages: {
        orderBy: { sortOrder: "asc" },
        select: { url: true },
      },
      reviews: {
        select: { rating: true },
      },
      productOptions: {
        select: {
          optionType: {
            select: { name: true },
          },
          productOptionValues: {
            select: {
              optionValue: {
                select: { value: true },
              },
            },
          },
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const reviewCount = product.reviews.length;
  const rating =
    reviewCount > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

  const discountRate = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const images = product.productImages.map((img) => buildImageUrl(img.url));

  const options = product.productOptions.map((opt) => ({
    label: opt.optionType.name,
    values: opt.productOptionValues.map((pov) => pov.optionValue.value),
  }));

  const breadcrumb = await buildBreadcrumb(product.categoryId);

  return NextResponse.json({
    id: product.id,
    name: product.name,
    brand: product.brand.name,
    images,
    price: product.price,
    originalPrice: product.originalPrice ?? product.price,
    discountRate,
    rating,
    reviewCount,
    inquiryCount: 0,
    likeCount: 0,
    onlyBadge: false,
    pickBadge: false,
    savings: {
      points: Math.floor(product.price * 0.01),
      welcomeRate: 1,
      cardInfo: "현대카드 ZERO 결제 시 최대 5% 추가 할인",
    },
    shipping: {
      price: product.isFreeShipping ? 0 : 3000,
      type: product.isFreeShipping ? "무료배송" : "일반배송",
      notes: ["주문 후 3~5일 이내 출고"],
    },
    estimatedDelivery: "오늘 주문 시 모레 도착 예정",
    options,
    breadcrumb,
  });
}
