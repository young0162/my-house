export interface HomeNavItem {
  label: string;
  href: string;
}

export interface HomeMainFeatureItem {
  title: string;
  author: string;
  imageUrl: string;
  authorImageUrl: string;
  href: string;
}

export interface HomePromoItem {
  id: string;
  badge: string;
  eyebrow: string;
  title: string;
  author: string;
  imageUrl: string;
  href: string;
}

export type HomeQuickMenuIconName =
  | "shopping"
  | "deal"
  | "house"
  | "clover"
  | "coupon"
  | "camera"
  | "market"
  | "delivery"
  | "cleaning"
  | "internet";

export interface HomeQuickMenuItem {
  label: string;
  href: string;
  icon: HomeQuickMenuIconName;
  color: string;
}
