import { api } from "@/lib/api";
import { CreateCheckoutRequest, CreateCheckoutResponse, CheckoutResponse } from "@/types/checkout";

export const checkoutApiService = {
  create: async (data: CreateCheckoutRequest): Promise<CreateCheckoutResponse> => {
    const res = await api.post<CreateCheckoutResponse>("/checkouts", data);
    return res.data;
  },

  getDetail: async (id: string): Promise<CheckoutResponse> => {
    const res = await api.get<CheckoutResponse>(`/checkouts/${id}`);
    return res.data;
  },
};
