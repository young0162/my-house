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

export const PAYMENT_METHODS = [
  { id: "ohouse-pay", label: "계좌 간편결제", badge: "추천", rightText: "최대2% 적립" },
  { id: "card", label: "카드" },
  { id: "bank-transfer", label: "무통장입금" },
  { id: "easy-pay", label: "간편결제", selected: true },
  { id: "mobile", label: "핸드폰" },
] as const;

export const EASY_PAY_OPTIONS = [
  { id: "kakao", label: "카카오페이", benefit: "1,000원 즉시할인", brandClassName: "kakao" },
  { id: "toss", label: "토스페이", benefit: "1,200원 즉시할인", brandClassName: "toss" },
  { id: "naver", label: "네이버페이", benefit: "최대 5,000P 적립", brandClassName: "naver", selected: true },
  { id: "payco", label: "페이코", benefit: "최대 2만원할인", brandClassName: "payco" },
] as const;
