export type ReviewSortType = "best" | "newest";

export interface ReviewRatingDistribution {
  score: number;
  count: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalCount: number;
  distribution: ReviewRatingDistribution[];
}

export interface ReviewItem {
  id: number;
  username: string;
  avatarUrl?: string;
  rating: number;
  date: string;
  purchaseType: string;
  selectedOption?: string;
  images?: string[];
  content: string;
  helpfulCount: number;
}
