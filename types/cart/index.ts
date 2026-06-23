export interface CartItemType {
  id: number;
  productId: number;
  image: string;
  brand: string;
  name: string;
  optionLabel: string;
  price: number;
  quantity: number;
  isFreeShipping: boolean;
  deliveryDate: string;
  deliveryMethod: string;
}

export interface CartSectionType {
  id: string;
  label: string;
  count: number;
  items: CartItemType[];
}

export interface CartApiResponse {
  sections: CartSectionType[];
}
