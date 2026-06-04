import { MY_REVIEW_TABS } from "@/constants/myReview";

export type MyReviewTab = (typeof MY_REVIEW_TABS)[number];

export interface ReviewableProduct {
  id: string;
  brand: string;
  name: string;
  option: string;
  point: number;
  imageUrl: string;
  purchaseSource: string;
}

export interface ReviewSearchState {
  query: string;
}
