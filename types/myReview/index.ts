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

export interface ReviewPhoto {
  file: File;
  previewUrl: string;
}

export interface ReviewDraft {
  productId: string;
  rating: number;
  photo: ReviewPhoto | null;
  content: string;
  policyAgreed: boolean;
}

export interface ReviewDraftErrors {
  rating?: string;
  content?: string;
  policyAgreed?: string;
}

export interface ReviewWriteModalProps {
  product: ReviewableProduct;
  onClose: () => void;
  onSubmit: (draft: ReviewDraft) => void;
}
