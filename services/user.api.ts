import { api } from "@/lib/api";

export interface MeResponse {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
  };
}

export const userApiService = {
  getMe: async (): Promise<MeResponse> => {
    const res = await api.get<MeResponse>("/me");
    return res.data;
  },
};
