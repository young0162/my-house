import { api } from "@/lib/api";
import { CartSectionType } from "@/types/cart";

export interface AddCartItemRequest {
  productId: number;
  optionValueIds: number[];
}

export interface UpdateCartCountRequest {
  count: number;
}

export interface UpdateCartOptionsRequest {
  optionValueIds: number[];
}

export const cartApiService = {
  getCart: async (): Promise<{ sections: CartSectionType[] }> => {
    const res = await api.get<{ sections: CartSectionType[] }>("/cart");
    return res.data;
  },

  getCount: async (): Promise<{ count: number }> => {
    const res = await api.get<{ count: number }>("/cart/count");
    return res.data;
  },

  addItem: async (data: AddCartItemRequest): Promise<{ success: true }> => {
    const res = await api.post<{ success: true }>("/cart", data);
    return res.data;
  },

  updateCount: async (id: number, data: UpdateCartCountRequest): Promise<{ success: true }> => {
    const res = await api.patch<{ success: true }>(`/cart/${id}`, data);
    return res.data;
  },

  updateOptions: async (id: number, data: UpdateCartOptionsRequest): Promise<{ success: true }> => {
    const res = await api.patch<{ success: true }>(`/cart/${id}`, data);
    return res.data;
  },

  removeItem: async (id: number): Promise<{ success: true }> => {
    const res = await api.delete<{ success: true }>(`/cart/${id}`);
    return res.data;
  },
};
