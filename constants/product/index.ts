import { SortOption } from "@/app/types/product";
import { BannerItem } from "@/app/types/bannerSlider";

export const PRODUCT_BANNERS: BannerItem[] = [
  {
    id: 1,
    subtitle: "단독 컬렉션",
    title: "ohouse",
    titleBadge: "edition",
    description: "OLLY 컴팩트 모듈 선풍기 쿠폰 할인",
    imageUrl: "https://picsum.photos/seed/banner1/600/400",
    bgColor: "#f0eeeb",
    href: "/store/exclusive",
  },
  {
    id: 2,
    subtitle: "신규 입점",
    title: "여름 특가",
    titleBadge: "SALE",
    description: "에어컨 & 냉방 가전 최대 20% 할인",
    imageUrl: "https://picsum.photos/seed/banner2/600/400",
    bgColor: "#e8f0f8",
    href: "/store/deal",
  },
  {
    id: 3,
    subtitle: "베스트 셀러",
    title: "인테리어",
    titleBadge: "pick",
    description: "이달의 베스트 인테리어 아이템",
    imageUrl: "https://picsum.photos/seed/banner3/600/400",
    bgColor: "#f0f0e8",
    href: "/store/best",
  },
];

export type DeliveryType = "원하는날도착" | "조건부무료배송" | "배송비별도";

export interface MdPickItem {
  id: number;
  image: string;
  brand: string;
  name: string;
  discountRate?: number;
  price: number;
  rating: number;
  reviewCount: number;
  deliveryType: DeliveryType;
  isSpecial?: boolean;
  coupon?: string;
}

export const MD_PICK_ITEMS: MdPickItem[] = [
  {
    id: 1,
    image: "https://picsum.photos/seed/mdpick1/400/400",
    brand: "오늘의집 layer",
    name: "[런칭할인] studio / 코타 호텔 침대, 평상형, SS/Q,K/LK",
    price: 650000,
    rating: 5,
    reviewCount: 6,
    deliveryType: "원하는날도착",
    isSpecial: true,
    coupon: "최대 3만원 쿠폰",
  },
  {
    id: 2,
    image: "https://picsum.photos/seed/mdpick2/400/400",
    brand: "까르엔가구",
    name: "루버린 참죽나무 원목 평상형 무헤드 침대프레임 SS/Q/K",
    discountRate: 62,
    price: 369000,
    rating: 4.8,
    reviewCount: 489,
    deliveryType: "조건부무료배송",
    isSpecial: true,
    coupon: "최대 5% 쿠폰",
  },
  {
    id: 3,
    image: "https://picsum.photos/seed/mdpick3/400/400",
    brand: "성수리빙",
    name: "엘린 템바보드LED 서랍형 수납 원목침대 프레임매트리스S/...",
    discountRate: 40,
    price: 295000,
    rating: 4.7,
    reviewCount: 812,
    deliveryType: "배송비별도",
    isSpecial: true,
    coupon: "최대 5천원 쿠폰",
  },
  {
    id: 4,
    image: "https://picsum.photos/seed/mdpick4/400/400",
    brand: "비포레",
    name: "비포레가구 나우스 LED조명 호텔형 침대프레임 슈퍼싱글 퀸...",
    discountRate: 49,
    price: 386000,
    rating: 5,
    reviewCount: 2,
    deliveryType: "배송비별도",
    coupon: "최대 1만원 쿠폰",
  },
  {
    id: 5,
    image: "https://picsum.photos/seed/mdpick5/400/400",
    brand: "온어우드",
    name: "브라우니 D형 무헤드 서랍 수납 원목 침대 프레임 SS Q K LK",
    discountRate: 50,
    price: 498500,
    rating: 4.8,
    reviewCount: 114,
    deliveryType: "배송비별도",
  },
  {
    id: 6,
    image: "https://picsum.photos/seed/mdpick6/400/400",
    brand: "엔투언",
    name: "프리미엄 월넛 원목 침대프레임 퀸 킹 SS 평상형",
    discountRate: 44,
    price: 520000,
    rating: 4.7,
    reviewCount: 203,
    deliveryType: "조건부무료배송",
    isSpecial: true,
  },
  {
    id: 7,
    image: "https://picsum.photos/seed/mdpick7/400/400",
    brand: "시몬스",
    name: "헤리티지 패브릭 침대 SS Q K 3종 택1",
    discountRate: 35,
    price: 890000,
    rating: 4.9,
    reviewCount: 1023,
    deliveryType: "원하는날도착",
    coupon: "최대 5만원 쿠폰",
  },
  {
    id: 8,
    image: "https://picsum.photos/seed/mdpick8/400/400",
    brand: "에이스침대",
    name: "에이스 플래티넘 라텍스 매트리스 포함 프레임 세트",
    discountRate: 28,
    price: 1290000,
    rating: 4.6,
    reviewCount: 445,
    deliveryType: "배송비별도",
    isSpecial: true,
    coupon: "최대 10만원 쿠폰",
  },
];

export const PRODUCT_SORT_OPTIONS: { label: string; value: SortOption; info?: string }[] = [
  { label: "판매순", value: "sales" },
  { label: "추천순", value: "recommended", info: "오늘의집 추천 알고리즘 기반 정렬입니다." },
  { label: "낮은가격순", value: "price_asc" },
  { label: "높은가격순", value: "price_desc" },
  { label: "리뷰많은순", value: "review" },
  { label: "유저사진 많은순", value: "user_photo" },
  { label: "최신순", value: "newest" },
];
