import { SUB_TABS, ORDER_STEPS, PERIOD_OPTIONS, ORDER_STATUS_OPTIONS } from "@/constants/mypage";

export type SubTab = (typeof SUB_TABS)[number];
export type OrderStep = (typeof ORDER_STEPS)[number];
export type PeriodOption = (typeof PERIOD_OPTIONS)[number];
export type OrderStatusOption = (typeof ORDER_STATUS_OPTIONS)[number];

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
