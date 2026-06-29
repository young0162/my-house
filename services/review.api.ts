import { api } from "@/lib/api";
import type { CreateReviewRequest, CreateReviewResponse } from "@/types/review";

export const reviewApiService = {
  createReview: async (data: CreateReviewRequest): Promise<CreateReviewResponse> => {
    const res = await api.post<CreateReviewResponse>("/reviews", data);
    return res.data;
  },
};
