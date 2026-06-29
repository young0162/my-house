export interface CreateReviewRequest {
  orderItemId: number;
  rating: number;
  content: string;
  imageUrl?: string;
}

export interface CreateReviewResponse {
  id: number;
}
