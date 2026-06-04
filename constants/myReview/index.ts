export const MY_REVIEW_TABS = ["리뷰 남기기", "내가 남긴 리뷰"] as const;

export const REVIEW_MIN_LENGTH = 20;
export const REVIEW_REWARD_LENGTH = 80;
export const REVIEW_MAX_LENGTH = 1000;
export const REVIEW_MAX_PHOTO_COUNT = 1;
export const REVIEW_MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10MB
export const REVIEW_ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const REVIEW_POLICY_TITLE = "오늘의집 리뷰 정책";
export const REVIEW_POLICY_NOTICE =
  "상품과 관련없는 사진이나 내용, 동일 문자 반복 등의 부적합한 내용은 삭제될 수 있습니다.";
export const REVIEW_POLICY_CONTENT = `오늘의집은 신뢰할 수 있는 리뷰 환경을 위해 다음 정책을 운영합니다.\n\n• 구매한 상품에 대한 솔직한 후기를 작성해 주세요.\n• 상품과 관련 없는 내용, 동일 문자 반복, 욕설 등은 삭제될 수 있습니다.\n• 광고성 내용이나 타인의 개인정보가 포함된 리뷰는 삭제될 수 있습니다.\n• 부적절한 리뷰 작성 시 서비스 이용이 제한될 수 있습니다.`;

export const MOCK_REVIEWABLE_PRODUCTS = [
  {
    id: "rp1",
    brand: "닥터피엘",
    name: "샤워기 1차 필터 (불순물 차단 필터)",
    option: "1차필터 1set(3개)",
    point: 600,
    imageUrl: "https://picsum.photos/84/84?random=30",
    purchaseSource: "오늘의집 구매",
  },
  {
    id: "rp2",
    brand: "에코린",
    name: "천연 주방 세제 레몬향 (리필용 대용량)",
    option: "1000ml / 레몬",
    point: 400,
    imageUrl: "https://picsum.photos/84/84?random=31",
    purchaseSource: "오늘의집 구매",
  },
];
