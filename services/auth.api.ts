import { api } from "@/lib/api";
import { RegisterRequestBody, RegisterResponseBody } from "@/app/types/auth/index";

export const authApiService = {
  register: async (data: Partial<RegisterRequestBody>): Promise<RegisterResponseBody> => {
    const res = await api.post<RegisterResponseBody>("/auth/register", data);
    return res.data;
  },
};
