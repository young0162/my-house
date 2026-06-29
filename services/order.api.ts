import { api } from "@/lib/api";
import { CreateOrderRequest, CreateOrderResponse, OrderDetail, ShoppingOrdersResponse } from "@/types/order";

export const orderApiService = {
  getShoppingOrders: async (): Promise<ShoppingOrdersResponse> => {
    const res = await api.get<ShoppingOrdersResponse>("/orders");
    return res.data;
  },

  getOrderDetail: async (id: string): Promise<OrderDetail> => {
    const res = await api.get<OrderDetail>(`/orders/${id}`);
    return res.data;
  },

  createOrder: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const res = await api.post<CreateOrderResponse>("/orders", data);
    return res.data;
  },
};
