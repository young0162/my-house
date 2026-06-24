export interface OrdererFormValues {
  name: string;
  emailLocal: string;
  emailDomain: string;
  phoneArea: string;
  phoneNumber: string;
  deliveryRequest: string;
}

export type CheckoutSource = "PRODUCT_DETAIL" | "CART";
export type CheckoutStatus = "PENDING" | "EXPIRED" | "ORDERED";

export interface CreateCheckoutProductRequest {
  source: "PRODUCT_DETAIL";
  productId: number;
  optionValueIds: number[];
  quantity: number;
}

export interface CreateCheckoutCartRequest {
  source: "CART";
  cartIds: number[];
}

export type CreateCheckoutRequest = CreateCheckoutProductRequest | CreateCheckoutCartRequest;

export interface CreateCheckoutResponse {
  checkoutId: string;
  redirectUrl: string;
}

export interface CheckoutItemView {
  id: number;
  productId: number;
  image: string;
  brand: string;
  name: string;
  optionLabel: string;
  price: number;
  quantity: number;
  isFreeShipping: boolean;
  deliveryMethod: string;
}

export interface CheckoutSection {
  id: string;
  label: string;
  count: number;
  items: CheckoutItemView[];
}

export interface CheckoutResponse {
  id: string;
  source: CheckoutSource;
  status: CheckoutStatus;
  totalProductPrice: number;
  shippingFee: number;
  finalPrice: number;
  pointEarned: number;
  sections: CheckoutSection[];
}
