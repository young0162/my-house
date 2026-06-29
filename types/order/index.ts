export interface CreateOrderRequest {
  checkoutId: string;
  ordererName: string;
  ordererEmail: string;
  ordererPhone: string;
  recipientName: string;
  recipientPhone: string;
  zipCode?: string;
  address: string;
  detailAddress?: string;
  deliveryRequest?: string;
  paymentMethod: string;
}

export interface CreateOrderResponse {
  orderId: string;
}

export type ShoppingOrderStep =
  | "입금대기"
  | "결제완료"
  | "배송준비"
  | "배송중"
  | "배송완료"
  | "구매확정";

export interface ShoppingOrderProduct {
  name: string;
  option: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface ShoppingOrder {
  id: string;
  date: string;
  status: string;
  deliveryInfo: string;
  products: ShoppingOrderProduct[];
}

export interface ShoppingOrdersResponse {
  orders: ShoppingOrder[];
  summary: Record<ShoppingOrderStep, number>;
}
