export interface CategoryItem {
  id: string;
  label: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: "001", label: "가구" },
  { id: "002", label: "패브릭/침구" },
  { id: "003", label: "조명" },
  { id: "004", label: "수납/정리" },
  { id: "005", label: "주방/식기" },
  { id: "006", label: "욕실/청소" },
  { id: "007", label: "데코/식물" },
  { id: "008", label: "가전/디지털" },
  { id: "009", label: "소품/액세서리" },
  { id: "010", label: "아웃도어" },
];

export const DEFAULT_CATEGORY_ID = CATEGORIES[0].id;

/* ── SNB 트리 ── */
export interface SnbLeaf {
  id: string;
  label: string;
}

export interface SnbSub {
  id: string;
  label: string;
  children?: SnbLeaf[];
}

export interface SnbGroup {
  id: string;
  label: string;
  noChevron?: boolean;
  children?: SnbSub[];
}

export const SNB_TREE: Record<string, SnbGroup[]> = {
  "001": [
    { id: "g-only", label: "오늘의집 Only", noChevron: true },
    {
      id: "g-bed",
      label: "침대",
      children: [
        {
          id: "s-bed-frame",
          label: "침대프레임",
          children: [
            { id: "l-normal", label: "일반침대" },
            { id: "l-storage", label: "수납침대" },
            { id: "l-low", label: "저상형침대" },
            { id: "l-family", label: "패밀리침대" },
            { id: "l-bunk", label: "이층·벙커침대" },
            { id: "l-foundation", label: "하단매트리스·파운데이션" },
            { id: "l-motion", label: "모션베드" },
            { id: "l-stone", label: "돌침대·흙침대" },
            { id: "l-fold", label: "접이식침대" },
          ],
        },
        { id: "s-bed-mattress", label: "침대+매트리스" },
        { id: "s-bed-acc", label: "침대부속가구" },
      ],
    },
    { id: "g-mattress", label: "매트리스·토퍼", children: [] },
    { id: "g-table", label: "테이블·식탁·책상", children: [] },
    { id: "g-sofa", label: "소파", children: [] },
    { id: "g-drawer", label: "서랍·수납장", children: [] },
    { id: "g-tv", label: "거실장·TV장", children: [] },
  ],
  "002": [
    { id: "g-bedding", label: "이불·베개", children: [] },
    { id: "g-pillow", label: "베개·쿠션", children: [] },
    { id: "g-curtain", label: "커튼·블라인드", children: [] },
    { id: "g-rug", label: "러그·카펫", children: [] },
  ],
  "003": [
    { id: "g-ceiling", label: "천장 조명", children: [] },
    { id: "g-stand", label: "스탠드 조명", children: [] },
    { id: "g-wall", label: "벽 조명", children: [] },
    { id: "g-led", label: "LED·무드등", children: [] },
  ],
  "004": [
    { id: "g-shelf", label: "선반·행거", children: [] },
    { id: "g-box", label: "수납함·박스", children: [] },
    { id: "g-basket", label: "바구니·트레이", children: [] },
  ],
  "005": [
    { id: "g-cookware", label: "냄비·프라이팬", children: [] },
    { id: "g-dish", label: "그릇·식기", children: [] },
    { id: "g-kitchen-acc", label: "주방소품", children: [] },
  ],
  "006": [
    { id: "g-bath", label: "욕실소품", children: [] },
    { id: "g-clean", label: "청소용품", children: [] },
  ],
  "007": [
    { id: "g-deco", label: "인테리어 소품", children: [] },
    { id: "g-plant", label: "식물·화분", children: [] },
    { id: "g-poster", label: "액자·포스터", children: [] },
  ],
  "008": [
    { id: "g-appliance", label: "생활가전", children: [] },
    { id: "g-digital", label: "디지털기기", children: [] },
  ],
  "009": [
    { id: "g-acc", label: "인테리어 액세서리", children: [] },
    { id: "g-mirror", label: "거울", children: [] },
  ],
  "010": [
    { id: "g-outdoor-furniture", label: "아웃도어 가구", children: [] },
    { id: "g-camping", label: "캠핑용품", children: [] },
  ],
};
