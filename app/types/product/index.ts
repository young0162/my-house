export interface ProductCardProps {
  id: number;
  image: string;
  brand: string;
  name: string;
  discountRate?: number;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  isFreeShipping?: boolean;
  badge?: "BEST" | "NEW";
  isLiked?: boolean;
}

export type SortOption = "recommended" | "sales" | "price_asc" | "price_desc" | "review" | "user_photo" | "newest";
