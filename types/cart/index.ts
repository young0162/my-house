export interface CartOptionValueType {
  id: number;
  value: string;
}

export interface CartOptionType {
  label: string;
  values: CartOptionValueType[];
}

export interface CartItemType {
  id: number;
  productId: number;
  image: string;
  brand: string;
  name: string;
  optionLabel: string;
  selectedOptionValueIds: number[];
  options: CartOptionType[];
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
