export const SUB_TABS = [
  "주문배송목록",
  "상품 스크랩북",
  "패키지할인",
  "나의문의내역",
  "포인트",
  "결제수단",
  "공지사항",
  "고객센터",
] as const;

export const ORDER_STEPS = [
  "입금대기",
  "결제완료",
  "배송준비",
  "배송중",
  "배송완료",
  "구매확정",
] as const;

export const PERIOD_OPTIONS = [
  "전체(최대 5년)",
  "1개월",
  "3개월",
  "6개월",
  "1년",
] as const;

export const ORDER_STATUS_OPTIONS = [
  "주문 전체",
  "입금대기",
  "결제완료",
  "배송준비",
  "배송중",
  "배송완료",
  "구매확정",
] as const;

export const PROFILE_ACTIVITY_TABS = [
  "모두보기",
  "사진",
  "집들이",
  "노하우",
  "스크랩북",
  "좋아요",
] as const;

export const PROFILE_STATS = [
  { id: "scrapbook", label: "스크랩북" },
  { id: "likes", label: "좋아요" },
  { id: "coupons", label: "내 쿠폰" },
] as const;

export const MOCK_PROFILE = {
  userId: "user-01",
  nickname: "나의집",
  followerCount: 12,
  followingCount: 34,
  scrapbookCount: 5,
  likeCount: 28,
  couponCount: 0,
};

export const MOCK_LIKED_CONTENTS = [
  {
    id: "1",
    title: "모던 북유럽 거실 인테리어",
    type: "집들이",
    thumbnailUrl: "https://picsum.photos/256/256?random=10",
    href: "/contents/1",
  },
  {
    id: "2",
    title: "작은 방 수납 노하우 10가지",
    type: "노하우",
    thumbnailUrl: "https://picsum.photos/256/256?random=11",
  },
  {
    id: "3",
    title: "화이트 원목 침실 꾸미기",
    type: "집들이",
    thumbnailUrl: "https://picsum.photos/256/256?random=12",
    href: "/contents/3",
  },
  {
    id: "4",
    title: "조명으로 분위기 바꾸기",
    type: "사진",
    thumbnailUrl: "https://picsum.photos/256/256?random=13",
  },
  {
    id: "5",
    title: "주방 정리 꿀팁",
    type: "노하우",
    thumbnailUrl: "https://picsum.photos/256/256?random=14",
    href: "/contents/5",
  },
];
