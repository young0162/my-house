import { ProductDetail } from "@/app/types/productDetail";

export const MOCK_PRODUCT_DETAILS: ProductDetail[] = [
  {
    id: 1,
    images: [
      "https://picsum.photos/seed/detail1-1/600/600",
      "https://picsum.photos/seed/detail1-2/600/600",
      "https://picsum.photos/seed/detail1-3/600/600",
      "https://picsum.photos/seed/detail1-4/600/600",
      "https://picsum.photos/seed/detail1-5/600/600",
    ],
    brand: "데일리리빙",
    name: "[오늘의집 단독] 20%쿠폰 | 드레스덴 조아패브릭 호텔식 침대프레임 SS/Q/K/LK/CK",
    onlyBadge: true,
    pickBadge: true,
    discountRate: 50,
    originalPrice: 199000,
    price: 159200,
    rating: 4.8,
    reviewCount: 14122,
    likeCount: 124733,
    couponBanner: "쿠폰지원 받으면 더 할인돼요",
    savings: {
      points: 199,
      welcomeRate: 61,
      cardInfo: "월 31,67회 (6개월) 아이카드비",
    },
    shipping: {
      price: 45000,
      type: "설치배송입니다",
      notes: ["지역별 차등배송료", "유료도조/서산시 지역배송 불가"],
    },
    estimatedDelivery: "8/10(수) 이내 도착 예정",
    options: [
      {
        label: "사이즈",
        values: ["SS (슈퍼싱글)", "Q (퀸)", "K (킹)", "LK (라지킹)", "CK (칼킹)"],
      },
      {
        label: "추가상품 (선택)",
        values: ["매트리스 패드", "베개 커버 세트", "이불 커버 세트", "침대 패드"],
      },
    ],
    breadcrumb: [
      { label: "지구", href: "/" },
      { label: "침대", href: "/store/category?category_id=001" },
      { label: "침대프레임", href: "/store/category?category_id=001" },
      { label: "일반침대", href: "/store/category?category_id=001" },
    ],
  },
  {
    id: 2,
    images: [
      "https://picsum.photos/seed/detail2-1/600/600",
      "https://picsum.photos/seed/detail2-2/600/600",
      "https://picsum.photos/seed/detail2-3/600/600",
      "https://picsum.photos/seed/detail2-4/600/600",
    ],
    brand: "까사미아",
    name: "모던 패브릭 2인 소파 그레이 컬러 거실용 미니멀 디자인",
    discountRate: 30,
    originalPrice: 270000,
    price: 189000,
    rating: 4.8,
    reviewCount: 1243,
    likeCount: 8420,
    couponBanner: "쿠폰지원 받으면 더 할인돼요",
    savings: {
      points: 189,
      welcomeRate: 61,
      cardInfo: "월 21,00회 (6개월) 아이카드비",
    },
    shipping: {
      price: 0,
      type: "무료배송",
      notes: ["설치배송 가능"],
    },
    estimatedDelivery: "8/12(금) 이내 도착 예정",
    options: [
      { label: "색상", values: ["라이트 그레이", "다크 그레이", "베이지"] },
      { label: "사이즈", values: ["2인용", "3인용"] },
    ],
    breadcrumb: [
      { label: "지구", href: "/" },
      { label: "가구", href: "/store/category?category_id=001" },
      { label: "소파", href: "/store/category?category_id=001" },
    ],
  },
];
