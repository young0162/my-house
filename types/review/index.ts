export interface CreateReviewRequest {
  orderItemId: number;
  rating: number;
  content: string;
  imageUrl?: string;
}

export interface CreateReviewResponse {
  id: number;
}

export type MyReviewSortType = "newest" | "best";

export interface MyReviewItem {
  id: number;
  productName: string;
  optionLabel: string | null;
  rating: number;
  createdAt: string;
  content: string;
  image: string | null;
}

export interface MyReviewListResponse {
  reviews: MyReviewItem[];
  total: number;
}
