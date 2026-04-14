export interface BannerItem {
  id: number;
  subtitle: string;
  title: string;
  titleBadge?: string;
  description: string;
  imageUrl: string;
  bgColor: string;
  href: string;
}

export interface BannerSliderProps {
  items: BannerItem[];
  autoPlayInterval?: number;
}
