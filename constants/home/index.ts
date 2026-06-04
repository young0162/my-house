import type { HomeMainFeatureItem, HomeNavItem, HomePromoItem, HomeQuickMenuItem } from "@/types/home";

export const HOME_NAV_ITEMS: HomeNavItem[] = [
  { label: "홈", href: "/" },
  { label: "추천", href: "#" },
  { label: "집들이", href: "#" },
  { label: "집사진", href: "#" },
  { label: "인기", href: "#" },
  { label: "쇼핑수다", href: "#" },
  { label: "집꾸미기", href: "#" },
  { label: "이사정보", href: "#" },
  { label: "오집소식", href: "#" },
  { label: "취미/일상", href: "#" },
  { label: "3D인테리어", href: "#" },
];

export const HOME_MAIN_FEATURE: HomeMainFeatureItem = {
  title: "7평에 퀸침대+소파까지? 맥시멀리스트 패션MD의 원룸 공간 활용",
  author: "뉴동집_",
  imageUrl: "https://picsum.photos/seed/home-main-room/914/548",
  authorImageUrl: "https://picsum.photos/seed/home-author/40/40",
  href: "#",
};

export const HOME_PROMO_ITEMS: HomePromoItem[] = [
  {
    id: "promo-1",
    badge: "챌린지",
    eyebrow: "#욕실수납아이디어",
    title: "복잡한 욕실\n수납법 따라해요",
    author: "@hwany_home",
    imageUrl: "https://picsum.photos/seed/home-promo-bath/290/548",
    href: "#",
  },
  {
    id: "promo-2",
    badge: "집들이",
    eyebrow: "#작은집꾸미기",
    title: "좁은 공간도\n넓어 보이는 법",
    author: "@cozy_room",
    imageUrl: "https://picsum.photos/seed/home-promo-room/290/548",
    href: "#",
  },
  {
    id: "promo-3",
    badge: "노하우",
    eyebrow: "#주방정리",
    title: "자주 쓰는 주방\n깔끔하게 정리해요",
    author: "@simple_home",
    imageUrl: "https://picsum.photos/seed/home-promo-kitchen/290/548",
    href: "#",
  },
];

export const HOME_QUICK_MENU_ITEMS: HomeQuickMenuItem[] = [
  { label: "쇼핑하기", href: "/store", icon: "shopping", color: "#b85cff" },
  { label: "오늘의딜", href: "/store", icon: "deal", color: "#ff4c52" },
  { label: "집들이", href: "#", icon: "house", color: "#06a6ff" },
  { label: "행운출첵", href: "#", icon: "clover", color: "#20c997" },
  { label: "패키지할인", href: "#", icon: "coupon", color: "#ff7595" },
  { label: "챌린지참여", href: "#", icon: "camera", color: "#555" },
  { label: "오마트", href: "#", icon: "market", color: "#ff823c" },
  { label: "원하는날도착", href: "#", icon: "delivery", color: "#087ac1" },
  { label: "이사·청소", href: "#", icon: "cleaning", color: "#00a1ff" },
  { label: "인터넷신청", href: "#", icon: "internet", color: "#ff4b55" },
];
