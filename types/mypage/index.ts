import { SUB_TABS, ORDER_STEPS, PERIOD_OPTIONS, ORDER_STATUS_OPTIONS, PROFILE_ACTIVITY_TABS } from "@/constants/mypage";

export type SubTab = (typeof SUB_TABS)[number];
export type OrderStep = (typeof ORDER_STEPS)[number];
export type PeriodOption = (typeof PERIOD_OPTIONS)[number];
export type OrderStatusOption = (typeof ORDER_STATUS_OPTIONS)[number];
export type ProfileActivityTab = (typeof PROFILE_ACTIVITY_TABS)[number];

export interface ProfileSummary {
  userId: string;
  nickname: string;
  profileImageUrl?: string;
  followerCount: number;
  followingCount: number;
  scrapbookCount: number;
  likeCount: number;
  couponCount: number;
}

export interface LikedContent {
  id: string;
  title: string;
  type: string;
  thumbnailUrl: string;
  href?: string;
}

export interface OrderProduct {
  name: string;
  option: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStep;
  deliveryInfo: string;
  product: OrderProduct;
}
