import { prisma } from "@/lib/prisma";
import { ProductCardProps, SortOption } from "@/app/types/product/index";
import { ProductDetail } from "@/app/types/productDetail/index";

const imageBaseUrl = process.env.PRODUCT_IMAGE_BASE_URL ?? "";

const buildImageUrl = (filename: string) =>
  imageBaseUrl ? `${imageBaseUrl}/${filename}` : filename;

export interface ProductListDbParams {
  sortBy?: SortOption;
  categoryId?: number | null;
}

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
    default:
      return { id: "asc" as const };
  }
};

type CategoryNode = { id: number; name: string; parentId: number | null } | null;

const buildBreadcrumb = async (categoryId: number | null) => {
  if (!categoryId) return [];
  const crumbs: { label: string; href: string }[] = [];
  let currentId: number | null = categoryId;
  while (currentId !== null) {
    const category: CategoryNode = await prisma.category.findUnique({
      where: { id: currentId },
      select: { id: true, name: true, parentId: true },
    });
    if (!category) break;
    crumbs.unshift({ label: category.name, href: `/store/category?category_id=${category.id}` });
    currentId = category.parentId;
  }
  return crumbs;
};

export const productDbService = {
  getProducts: async ({ sortBy = "recommended", categoryId }: ProductListDbParams = {}): Promise<ProductCardProps[]> => {
    const categoryFilter = categoryId
      ? { categoryId: { in: await categoryDbGetDescendantIds(categoryId) } }
      : {};

    const products = await prisma.product.findMany({
      where: { isActive: true, ...categoryFilter },
      orderBy: getSortOrder(sortBy),
      select: {
        id: true,
        image: true,
        brand: { select: { name: true } },
        name: true,
        price: true,
        originalPrice: true,
        isFreeShipping: true,
        badge: true,
        reviews: { select: { rating: true } },
      },
    });

    return products.map((p) => {
      const reviewCount = p.reviews.length;
      const rating = reviewCount > 0
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : undefined;
      return {
        id: p.id,
        image: buildImageUrl(p.image),
        brand: p.brand.name,
        name: p.name,
        discountRate: p.originalPrice
          ? Math.round((1 - p.price / p.originalPrice) * 100)
          : undefined,
        price: p.price,
        originalPrice: p.originalPrice ?? undefined,
        rating,
        reviewCount: reviewCount > 0 ? reviewCount : undefined,
        isFreeShipping: p.isFreeShipping,
        badge: p.badge ?? undefined,
      };
    });
  },

  getProductDetail: async (productId: number): Promise<ProductDetail | null> => {
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
        brand: { select: { name: true } },
        productImages: { orderBy: { sortOrder: "asc" }, select: { url: true } },
        reviews: { select: { rating: true } },
        productOptions: {
          select: {
            optionType: { select: { name: true } },
            productOptionValues: {
              select: { optionValue: { select: { id: true, value: true } } },
            },
          },
        },
      },
    });

    if (!product) return null;

    const reviewCount = product.reviews.length;
    const rating = reviewCount > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;
    const breadcrumb = await buildBreadcrumb(product.categoryId);

    return {
      id: product.id,
      name: product.name,
      brand: product.brand.name,
      images: product.productImages.map((img) => buildImageUrl(img.url)),
      price: product.price,
      originalPrice: product.originalPrice ?? product.price,
      discountRate: product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0,
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
      options: product.productOptions.map((opt) => ({
        label: opt.optionType.name,
        values: opt.productOptionValues.map((pov) => ({
          id: pov.optionValue.id,
          value: pov.optionValue.value,
        })),
      })),
      breadcrumb,
    };
  },

  getValidProductOptionValueIds: async (productId: number): Promise<Set<number> | null> => {
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      select: {
        productOptions: {
          select: { productOptionValues: { select: { optionValueId: true } } },
        },
      },
    });
    if (!product) return null;
    return new Set(
      product.productOptions.flatMap((po) => po.productOptionValues.map((pov) => pov.optionValueId)),
    );
  },
};

// internal helper used by productDbService.getProducts
async function categoryDbGetDescendantIds(categoryId: number): Promise<number[]> {
  const all = await prisma.category.findMany({ select: { id: true, parentId: true } });
  const result: number[] = [categoryId];
  const queue = [categoryId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const c of all) {
      if (c.parentId === current) {
        result.push(c.id);
        queue.push(c.id);
      }
    }
  }
  return result;
}
