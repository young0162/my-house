import { api } from "@/lib/api";
import { CreateOrderRequest, CreateOrderResponse, ShoppingOrdersResponse } from "@/types/order";

export const orderApiService = {
  getShoppingOrders: async (): Promise<ShoppingOrdersResponse> => {
    const res = await api.get<ShoppingOrdersResponse>("/orders");
    return res.data;
  },

  createOrder: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const res = await api.post<CreateOrderResponse>("/orders", data);
    return res.data;
  },
};
