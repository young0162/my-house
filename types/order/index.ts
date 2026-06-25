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
