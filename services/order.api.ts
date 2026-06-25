import { api } from "@/lib/api";
import { CreateOrderRequest, CreateOrderResponse } from "@/types/order";

export const orderApiService = {
  createOrder: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const res = await api.post<CreateOrderResponse>("/orders", data);
    return res.data;
  },
};
