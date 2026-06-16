import { BadgeType, Prisma } from "@/app/generated/prisma";

export type ProductSeedItem = Omit<Prisma.ProductCreateManyInput, "brandId"> & {
  brandName: string;
};

export const PRODUCT_SEED_DATA: ProductSeedItem[] = [
  {
    image: "https://picsum.photos/seed/seed-product-1/400/400",
    brandName: "까사미아",
    name: "모던 패브릭 2인 소파 그레이",
    price: 189000,
    originalPrice: 270000,
    discountRate: 30,
    rating: 4.8,
    reviewCount: 1243,
    isFreeShipping: true,
    badge: BadgeType.BEST,
  },
  {
    image: "https://picsum.photos/seed/seed-product-2/400/400",
    brandName: "데일리홈",
    name: "북유럽 원목 커피 테이블",
    price: 129000,
    originalPrice: 152000,
    discountRate: 15,
    rating: 4.6,
    reviewCount: 874,
    isFreeShipping: true,
    badge: BadgeType.NEW,
  },
  {
    image: "https://picsum.photos/seed/seed-product-3/400/400",
    brandName: "한샘",
    name: "슬림 수납 책상 의자 세트",
    price: 215000,
    originalPrice: 287000,
    discountRate: 25,
    rating: 4.7,
    reviewCount: 532,
    isFreeShipping: false,
  },
  {
    image: "https://picsum.photos/seed/seed-product-4/400/400",
    brandName: "무인양품",
    name: "스탠드 조명 테이블 침실 간접조명",
    price: 68000,
    originalPrice: 85000,
    discountRate: 20,
    rating: 4.5,
    reviewCount: 391,
    isFreeShipping: true,
  },
  {
    image: "https://picsum.photos/seed/seed-product-5/400/400",
    brandName: "오늘의집",
    name: "라탄 수납 바구니 세트",
    price: 32000,
    originalPrice: 35000,
    discountRate: 10,
    rating: 4.9,
    reviewCount: 2018,
    isFreeShipping: true,
    badge: BadgeType.BEST,
  },
];
