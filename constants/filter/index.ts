export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

export const CATEGORY_FILTERS: FilterGroup[] = [
  {
    id: "size",
    label: "침구 사이즈",
    options: [
      { value: "ms", label: "멀티싱글(MS)" },
      { value: "s", label: "싱글(S)" },
      { value: "ss", label: "슈퍼싱글(SS)" },
      { value: "d", label: "더블(D)" },
      { value: "q", label: "퀸(Q)" },
      { value: "k", label: "킹(K)" },
      { value: "lk", label: "라지킹(LK)" },
      { value: "ck", label: "칼킹(CK)" },
    ],
  },
  {
    id: "head",
    label: "헤드 유무",
    options: [
      { value: "with", label: "헤드있음" },
      { value: "without", label: "헤드없음" },
    ],
  },
  {
    id: "frame",
    label: "프레임 형태",
    options: [
      { value: "normal", label: "일반형" },
      { value: "flat", label: "평상형" },
      { value: "storage", label: "수납형" },
      { value: "fold", label: "접이식" },
    ],
  },
  {
    id: "material",
    label: "주요 소재",
    options: [
      { value: "wood", label: "원목" },
      { value: "mdf", label: "MDF" },
      { value: "fabric", label: "패브릭" },
      { value: "leather", label: "가죽" },
      { value: "metal", label: "메탈" },
    ],
  },
  {
    id: "color",
    label: "색상",
    options: [
      { value: "white", label: "화이트" },
      { value: "gray", label: "그레이" },
      { value: "brown", label: "브라운" },
      { value: "black", label: "블랙" },
      { value: "wood", label: "우드" },
    ],
  },
  {
    id: "grade",
    label: "자재 등급",
    options: [
      { value: "e0", label: "E0" },
      { value: "se0", label: "SE0" },
      { value: "f4", label: "F4" },
    ],
  },
  {
    id: "special",
    label: "특가",
    options: [{ value: "special", label: "특가 상품만" }],
  },
  {
    id: "brand",
    label: "브랜드",
    options: [
      { value: "casamia", label: "까사미아" },
      { value: "simmons", label: "시몬스" },
      { value: "hanssem", label: "한샘" },
      { value: "onwood", label: "온어우드" },
      { value: "beforet", label: "비포레" },
    ],
  },
];
