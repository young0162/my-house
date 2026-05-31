export interface ProductDetailOption {
  label: string;
  values: string[];
}

export interface ProductDetailSavings {
  points: number;
  welcomeRate: number;
  cardInfo: string;
}

export interface ProductDetailShipping {
  price: number;
  type: string;
  notes: string[];
}

export interface ProductDetailBreadcrumb {
  label: string;
  href: string;
}

export interface ProductDetail {
  id: number;
  images: string[];
  brand: string;
  name: string;
  onlyBadge?: boolean;
  pickBadge?: boolean;
  discountRate: number;
  originalPrice: number;
  price: number;
  rating: number;
  reviewCount: number;
  inquiryCount: number;
  likeCount: number;
  couponBanner?: string;
  savings: ProductDetailSavings;
  shipping: ProductDetailShipping;
  estimatedDelivery: string;
  options: ProductDetailOption[];
  breadcrumb: ProductDetailBreadcrumb[];
}
