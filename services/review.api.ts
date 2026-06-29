import { api } from "@/lib/api";
import type { CreateReviewRequest, CreateReviewResponse, MyReviewSortType, MyReviewListResponse } from "@/types/review";

export const reviewApiService = {
  createReview: async (data: CreateReviewRequest): Promise<CreateReviewResponse> => {
    const res = await api.post<CreateReviewResponse>("/reviews", data);
    return res.data;
  },
  getMyReviews: async (sort: MyReviewSortType): Promise<MyReviewListResponse> => {
    const res = await api.get<MyReviewListResponse>("/reviews", { params: { sort } });
    return res.data;
  },
};
