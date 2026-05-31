import { ReviewItem, ReviewSortType, ReviewSummary } from "@/app/types/review";

export const REVIEW_SORT_OPTIONS: { value: ReviewSortType; label: string }[] = [
  { value: "best", label: "베스트순" },
  { value: "newest", label: "최신순" },
];

export const MOCK_REVIEW_SUMMARY: ReviewSummary = {
  averageRating: 4.8,
  totalCount: 14124,
  distribution: [
    { score: 5, count: 12816 },
    { score: 4, count: 912 },
    { score: 3, count: 238 },
    { score: 2, count: 60 },
    { score: 1, count: 98 },
  ],
};

export const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: 1,
    username: "tprince1",
    rating: 5,
    date: "2026.05.14",
    purchaseType: "오늘의집 구매",
    selectedOption: "SS 일반헤드형 프레임(높이920)",
    images: ["https://picsum.photos/seed/review1/120/120"],
    content:
      "프레임 설치가 벨크로로 되어있어 이동 및 설치가 아주 쉽습니다. 색상이 예쁘고 감촉도 부드러워 방 분위기를 환하게 만들어 줍니다.\n딸아이가 아주 맘에 들어해요",
    helpfulCount: 3,
  },
  {
    id: 2,
    username: "home_lover",
    rating: 5,
    date: "2026.04.28",
    purchaseType: "오늘의집 구매",
    selectedOption: "Q 일반헤드형 프레임(높이920)",
    images: [
      "https://picsum.photos/seed/review2a/120/120",
      "https://picsum.photos/seed/review2b/120/120",
    ],
    content:
      "배송도 빠르고 조립이 정말 간편했어요. 패브릭 소재라 따뜻한 느낌이 나고 청소도 쉽게 됩니다. 색상이 사진이랑 똑같아서 만족스러워요.",
    helpfulCount: 12,
  },
  {
    id: 3,
    username: "simple_interior",
    rating: 4,
    date: "2026.04.10",
    purchaseType: "오늘의집 구매",
    selectedOption: "K 일반헤드형 프레임(높이920)",
    content:
      "전반적으로 만족스럽습니다. 다만 조립 설명서가 좀 더 자세했으면 좋겠어요. 완성 후 모양은 정말 예쁩니다.",
    helpfulCount: 7,
  },
  {
    id: 4,
    username: "cozy_room99",
    rating: 5,
    date: "2026.03.22",
    purchaseType: "오늘의집 구매",
    selectedOption: "SS 일반헤드형 프레임(높이920)",
    images: ["https://picsum.photos/seed/review4/120/120"],
    content: "품질 대비 가격이 너무 좋아요. 침실이 호텔처럼 변했습니다. 강추합니다!",
    helpfulCount: 21,
  },
];
