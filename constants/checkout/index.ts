export const DELIVERY_REQUESTS: { value: string; label: string; disabled?: boolean }[] = [
  { value: "", label: "배송사 요청사항을 선택해주세요", disabled: true },
  { value: "door", label: "문앞에 놓아주세요" },
  { value: "security", label: "경비실에 맡겨주세요" },
  { value: "locker", label: "택배함에 넣어주세요" },
  { value: "call", label: "부재시 연락 주세요" },
  { value: "direct", label: "직접 받겠습니다" },
];

export const EMAIL_DOMAINS = [
  "naver.com",
  "gmail.com",
  "daum.net",
  "kakao.com",
  "nate.com",
  "직접입력",
] as const;

export const PHONE_AREA_CODES = ["010", "011", "016", "017", "018", "019"] as const;
