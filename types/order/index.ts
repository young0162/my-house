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

export interface OrderDetailItem {
  id: number;
  productName: string;
  brandName: string;
  optionLabel: string | null;
  price: number;
  quantity: number;
  imageUrl: string;
  deliveryMethod: string;
  isFreeShipping: boolean;
}

export interface OrderDetail {
  id: string;
  orderedAt: string;
  status: string;
  deliveryInfo: string;
  ordererName: string;
  ordererEmail: string;
  ordererPhone: string;
  recipientName: string;
  recipientPhone: string;
  zipCode: string | null;
  address: string;
  detailAddress: string | null;
  deliveryRequest: string | null;
  paymentMethod: string;
  totalProductPrice: number;
  shippingFee: number;
  couponDiscount: number;
  pointDiscount: number;
  finalPrice: number;
  items: OrderDetailItem[];
}
