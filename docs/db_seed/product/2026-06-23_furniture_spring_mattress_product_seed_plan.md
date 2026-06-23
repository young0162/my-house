# 스프링매트리스 상품 Seed 계획

> 작성일: 2026-06-23

## 1. 범위

대상 카테고리:

```text
가구 (#1, depth=1)
└── 매트리스·토퍼 (#8, depth=2)
    └── 매트리스 (#9, depth=3)
        └── 스프링매트리스 (#10, depth=4)
```

오늘의집에서 스프링 매트리스 상품 5개를 조사한다.

## 2. 조사 기준

조사일은 2026년 6월 23일이다.

- 오늘의집 검색 결과에서 브랜드, 상품명, 판매가, 정상가, 무료배송 여부와 대표 이미지 URL을 확인했다.
- 개별 상품 상세 페이지에서 갤러리 이미지 URL을 최대 4개씩 확인했다.
- `image`, `additionalImages`는 오늘의집 CDN 원본을 내려받은 로컬 파일 경로로 저장한다.
- 가격과 배송 조건은 조사 시점의 값이며 이후 변경될 수 있다.
- `stock`, `badge`, `isActive`는 프로젝트 화면과 정렬 기능 검증을 위한 seed 값이다.
- 상품 옵션은 이번 조사 및 계획 범위에 포함하지 않는다.

참고 페이지:

- 스프링 매트리스 검색: `https://ohou.se/search/index?query=%EC%8A%A4%ED%94%84%EB%A7%81%20%EB%A7%A4%ED%8A%B8%EB%A6%AC%EC%8A%A4`
- 먼데이하우스 상품: `https://ohou.se/productions/425266/selling`
- 오늘의집 layer 상품: `https://ohou.se/productions/1089824/selling`
- 웰퍼니쳐 상품: `https://ohou.se/productions/858905/selling`
- 지누스 상품: `https://ohou.se/productions/2737888/selling`
- 삼익가구 상품: `https://ohou.se/productions/853690/selling`

## 3. 상품 후보 데이터

```js
const IMAGE_BASE_URL = process.env.PRODUCT_IMAGE_BASE_URL ?? "/image/products";

const springMattressProductSeedCandidates = [
  // 스프링매트리스 (categoryId: 10)
  {
    image: `${IMAGE_BASE_URL}/v1-475571330867328.jpg`,
    additionalImages: [
      `${IMAGE_BASE_URL}/v1-475571374284864.jpg`,
      `${IMAGE_BASE_URL}/v1-475571356188672.jpg`,
      `${IMAGE_BASE_URL}/170125079967082488.jpg`,
      `${IMAGE_BASE_URL}/170125079601396133.jpg`,
    ],
    brandLookupName: "먼데이하우스",
    categoryId: 10,
    name: "[지정일배송/무료설치] 허리가 편안한 호텔식 포켓스프링 매트리스 25cm S/SS/Q/K/LK",
    description: "25cm 높이의 호텔식 포켓스프링 구조로 허리 지지력을 고려한 매트리스",
    price: 88000,
    originalPrice: 108000,
    isFreeShipping: false,
    isActive: true,
    stock: 72,
    badge: "BEST",
  },
  {
    image: `${IMAGE_BASE_URL}/v1-467702177099904.jpg`,
    additionalImages: [
      `${IMAGE_BASE_URL}/v1-462868257886208.jpg`,
      `${IMAGE_BASE_URL}/v1-467702215438400.jpg`,
      `${IMAGE_BASE_URL}/v1-462868063719552.jpg`,
      `${IMAGE_BASE_URL}/v1-462868098232384.jpg`,
    ],
    brandLookupName: "오늘의집 layer",
    categoryId: 10,
    name: "[무료내림서비스] basic 바른 숙면 매트리스 본넬/포켓스프링 S/SS/D/Q",
    description: "본넬과 포켓스프링 타입을 제공하는 오늘의집 layer 기본형 숙면 매트리스",
    price: 109900,
    originalPrice: 164900,
    isFreeShipping: true,
    isActive: true,
    stock: 54,
    badge: null,
  },
  {
    image: `${IMAGE_BASE_URL}/v1-513989743964160.jpg`,
    additionalImages: [
      `${IMAGE_BASE_URL}/v1-488172911198336.jpg`,
      `${IMAGE_BASE_URL}/v1-511643051200512.jpg`,
      `${IMAGE_BASE_URL}/v1-511639531090048.jpg`,
      `${IMAGE_BASE_URL}/v1-511639571525760.jpg`,
    ],
    brandLookupName: "웰퍼니쳐",
    categoryId: 10,
    name: "[기존매트 무료내림] 더매직 허리부담완화 포켓스프링 매트리스 S/SS/Q/K/LK",
    description: "허리 부담 완화를 고려한 포켓스프링 구조와 기존 매트리스 내림 서비스를 제공하는 제품",
    price: 259000,
    originalPrice: 400000,
    isFreeShipping: true,
    isActive: true,
    stock: 38,
    badge: "BEST",
  },
  {
    image: `${IMAGE_BASE_URL}/v1-452793387057216.jpg`,
    additionalImages: [
      `${IMAGE_BASE_URL}/v1-308753847074816.jpg`,
      `${IMAGE_BASE_URL}/v1-308753521033344.jpg`,
      `${IMAGE_BASE_URL}/v1-308753588600896.jpg`,
      `${IMAGE_BASE_URL}/v1-308753666867328.jpg`,
    ],
    brandLookupName: "지누스",
    categoryId: 10,
    name: "[오늘의집 단독] 얼티마 하이브리드 스프링 침대 매트리스 25cm S/SS/Q/K",
    description: "스프링과 폼 레이어를 결합한 25cm 높이의 하이브리드 침대 매트리스",
    price: 199000,
    originalPrice: 398000,
    isFreeShipping: true,
    isActive: true,
    stock: 26,
    badge: "NEW",
  },
  {
    image: `${IMAGE_BASE_URL}/v1-400167365611584.jpg`,
    additionalImages: [
      `${IMAGE_BASE_URL}/v1-400167489446016.jpg`,
      `${IMAGE_BASE_URL}/v1-400167436738688.jpg`,
      `${IMAGE_BASE_URL}/v1-400167452270656.jpg`,
      `${IMAGE_BASE_URL}/v1-400167478394880.jpg`,
    ],
    brandLookupName: "삼익가구",
    categoryId: 10,
    name: "[오늘의집 단독] 프라임 유로탑 독립스프링 롤팩 매트리스 S/SS/Q",
    description: "유로탑 쿠션과 독립스프링을 적용하고 롤팩 배송을 지원하는 매트리스",
    price: 149000,
    originalPrice: 218000,
    isFreeShipping: true,
    isActive: true,
    stock: 43,
    badge: null,
  },
];
```

## 4. 이미지 다운로드 목록

아래 URL을 `scripts/download-product-images.sh`의 `URLS` 배열에 추가하고 `public/image/products/`에 저장한다.

```bash
# 스프링매트리스 (categoryId: 10)
# 먼데이하우스 포켓스프링 매트리스
"https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-475571330867328.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-475571374284864.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-475571356188672.jpg"
"https://image.ohousecdn.com/i/bucketplace-v2-development/uploads/productions/images/170125079967082488.jpg"
"https://image.ohousecdn.com/i/bucketplace-v2-development/uploads/productions/images/170125079601396133.jpg"

# 오늘의집 layer 바른 숙면 매트리스
"https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-467702177099904.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-462868257886208.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-467702215438400.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-462868063719552.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-462868098232384.jpg"

# 웰퍼니쳐 더매직 포켓스프링 매트리스
"https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-513989743964160.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-488172911198336.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-511643051200512.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-511639531090048.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-511639571525760.jpg"

# 지누스 얼티마 하이브리드 스프링 매트리스
"https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-452793387057216.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-308753847074816.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-308753521033344.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-308753588600896.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-308753666867328.jpg"

# 삼익가구 프라임 유로탑 독립스프링 매트리스
"https://prs.ohousecdn.com/apne2/any/uploads/productions/v1-400167365611584.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-400167489446016.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-400167436738688.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-400167452270656.jpg"
"https://prs.ohousecdn.com/apne2/any/uploads/productions/images/v1-400167478394880.jpg"
```

## 5. 완료 조건

- `springMattressProductSeedCandidates`에 상품 5개가 존재한다.
- 모든 상품의 `categoryId`가 `10`이다.
- 대표 이미지 5개와 추가 이미지 20개, 총 25개가 다운로드된다.
- 모든 이미지가 실제 이미지 파일로 식별되고 파일 크기가 0보다 크다.
- 실패한 이미지 URL이 있으면 해당 URL을 별도로 기록한다.
