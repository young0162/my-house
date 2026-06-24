import { api } from "@/lib/api";
import { UserAddressView, CreateUserAddressRequest, UpdateUserAddressRequest } from "@/types/checkout";

export const addressApiService = {
  getAddresses: async (): Promise<{ addresses: UserAddressView[] }> => {
    const res = await api.get<{ addresses: UserAddressView[] }>("/me/addresses");
    return res.data;
  },

  getDefaultAddress: async (): Promise<UserAddressView | null> => {
    const res = await api.get<{ address: UserAddressView | null }>("/me/addresses/default");
    return res.data.address;
  },

  createAddress: async (data: CreateUserAddressRequest): Promise<UserAddressView> => {
    const res = await api.post<UserAddressView>("/me/addresses", data);
    return res.data;
  },

  updateAddress: async (id: number, data: UpdateUserAddressRequest): Promise<UserAddressView> => {
    const res = await api.patch<UserAddressView>(`/me/addresses/${id}`, data);
    return res.data;
  },

  deleteAddress: async (id: number): Promise<{ success: true }> => {
    const res = await api.delete<{ success: true }>(`/me/addresses/${id}`);
    return res.data;
  },
};
