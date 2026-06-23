# 가구 침대 Depth 4 상품 Seed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> 작성일: 2026-06-23

**Goal:** `일반침대`, `수납침대`, `저상형침대`에 오늘의집 상품 구성을 참고한 상품을 5개씩 생성하고, 프로젝트에 이미 존재하는 `사이즈`, `색상` 옵션값만 상품에 연결한다.

**Architecture:** 계획 문서의 상품 후보 배열을 seed 스크립트가 읽어 `Product`, `ProductImage`, `ProductOption`, `ProductOptionValue`를 한 트랜잭션에서 동기화한다. 상품은 `name`으로 생성 또는 갱신하고, 옵션 관계는 매 실행마다 해당 상품 범위만 교체하여 멱등성을 유지한다. 새로운 `OptionType`, `OptionValue` 및 Prisma migration은 만들지 않는다.

**Tech Stack:** Node.js ESM, Prisma 6, MySQL

---

## 1. 범위와 성공 조건

대상 카테고리는 다음과 같다.

```text
가구 (#1, depth=1)
└── 침대 (#2, depth=2)
    └── 침대프레임 (#3, depth=3)
        ├── 일반침대 (#4, depth=4)
        ├── 수납침대 (#5, depth=4)
        └── 저상형침대 (#6, depth=4)
```

성공 조건:

- 카테고리별 상품 5개, 총 15개가 생성 또는 갱신된다.
- 모든 상품의 `categoryId`가 각각 `4`, `5`, `6`으로 연결된다.
- 옵션은 기존 `OptionType.name = "사이즈"`와 `"색상"`만 사용한다.
- 옵션값은 아래 기존 15개 이외에 생성하지 않는다.
- 상품명에 표시된 사이즈 중 기존 값과 일치하는 값만 연결한다.
- 색상은 실제 오늘의집 옵션 조사 결과가 아니라 화면 및 관계 확인용 기존 옵션값을 배정한다.
- seed를 반복 실행해도 상품, 이미지, 상품 옵션 관계가 중복되지 않는다.
- Prisma schema와 migration은 변경하지 않는다.

기존 옵션값:

```text
사이즈
  MS(미니싱글)
  S(싱글)
  SS(슈퍼싱글)
  Q(퀸)
  K(킹)
  LK(라지킹)
  D(디럭스)
  Q&K(퀸&킹)

색상
  브라운
  베이직
  화이트
  블랙
  네이비
  버건디
  카키
```

## 2. 조사 기준

조사일은 2026년 6월 23일이다.

- 오늘의집 통합 검색 결과에서 브랜드, 상품명, 판매가, 배송비 표시를 확인했다.
- 옵션 상세 페이지는 조사하지 않았다.
- 상품 제목에 노출된 사이즈만 `사이즈` 연결 근거로 사용한다.
- 검색 결과에 정상가가 직접 표시되지 않아 `originalPrice`는 `null`로 저장한다. 할인율 역산값은 실제 정상가와 다를 수 있으므로 사용하지 않는다.
- `stock`, `badge`, `isActive`, 색상 옵션은 프로젝트 기능 검증용 seed 값이다.
- `image`는 구현 시 오늘의집 대표 이미지를 `public/image/products`에 내려받은 뒤 아래의 고정 파일명으로 저장한다.
- 가격과 판매 상태는 조사 시점 값이며 이후 변경될 수 있다.

참고 페이지:

- 침대프레임: `https://ohou.se/search/index?query=%EC%B9%A8%EB%8C%80%ED%94%84%EB%A0%88%EC%9E%84`
- 수납침대: `https://ohou.se/search/index?query=%EC%88%98%EB%82%A9%EC%B9%A8%EB%8C%80`
- 저상형침대: `https://ohou.se/search/index?query=%EC%A0%80%EC%83%81%ED%98%95%EC%B9%A8%EB%8C%80`

조사 제약:

- 프로젝트 지침에 명시된 `.claude/skills/gstack`이 저장소에 없어 `/browse`를 실행할 수 없었다.
- 대체 읽기 전용 브라우저로 위 검색 결과를 확인했다.
- 검색 결과만으로 개별 상품 상세 이미지 URL을 안정적으로 식별하지 못하므로, 이미지 다운로드는 구현 단계에서 상품명 대조 후 수행한다.

## 3. 스키마 사용 범위

현재 스키마로 요구사항을 충족하므로 변경하지 않는다.

```prisma
model Product {
  id             Int        @id @default(autoincrement())
  image          String
  brandId        Int        @map("brand_id")
  name           String
  description    String?    @db.Text
  price          Int
  originalPrice  Int?       @map("original_price")
  isFreeShipping Boolean    @default(false) @map("is_free_shipping")
  isActive       Boolean    @default(true) @map("is_active")
  stock          Int        @default(0)
  badge          BadgeType?
  categoryId     Int?       @map("category_id")

  productOptions ProductOption[]
  productImages  ProductImage[]
}

model ProductOption {
  id           Int @id @default(autoincrement())
  optionTypeId Int @map("option_type_id")
  productId    Int @map("product_id")

  productOptionValues ProductOptionValue[]

  @@unique([productId, optionTypeId])
}

model ProductOptionValue {
  id              Int @id @default(autoincrement())
  productOptionId Int @map("product_option_id")
  optionValueId   Int @map("option_value_id")

  @@unique([productOptionId, optionValueId])
}
```

현재 구조는 선택 가능한 옵션값만 표현한다. 옵션 조합별 가격, 재고, SKU는 이번 범위에 포함하지 않는다.

## 4. 상품 후보 데이터

`optionValues`의 키는 기존 `OptionType.name`, 배열 값은 기존 `OptionValue.value`와 정확히 일치해야 한다.

```js
const IMAGE_BASE_URL = process.env.PRODUCT_IMAGE_BASE_URL ?? "/image/products";

const furnitureBedProductSeedCandidates = [
  // 일반침대 (#4)
  {
    image: `${IMAGE_BASE_URL}/bed-normal-daily-dresden.webp`,
    additionalImages: [],
    brandLookupName: "데일리리빙",
    categoryId: 4,
    name: "드레스덴 조야패브릭 호텔식 침대프레임 SS/Q/K/LK/CK",
    description: "조야 패브릭 소재의 호텔식 헤드형 침대 프레임",
    price: 199000,
    originalPrice: null,
    isFreeShipping: false,
    isActive: true,
    stock: 24,
    badge: "BEST",
    optionValues: {
      사이즈: ["SS(슈퍼싱글)", "Q(퀸)", "K(킹)", "LK(라지킹)"],
      색상: ["베이직", "화이트"],
    },
  },
  {
    image: `${IMAGE_BASE_URL}/bed-normal-crown-edit.webp`,
    additionalImages: [],
    brandLookupName: "크라운퍼니쳐",
    categoryId: 4,
    name: "에디트 헤드리스 평상형 침대프레임 SS/Q/K",
    description: "헤드가 없는 평상형 구조의 침대 프레임",
    price: 99000,
    originalPrice: null,
    isFreeShipping: false,
    isActive: true,
    stock: 31,
    badge: null,
    optionValues: {
      사이즈: ["SS(슈퍼싱글)", "Q(퀸)", "K(킹)"],
      색상: ["브라운", "화이트"],
    },
  },
  {
    image: `${IMAGE_BASE_URL}/bed-normal-furnico-rea.webp`,
    additionalImages: [],
    brandLookupName: "퍼니코",
    categoryId: 4,
    name: "레아 E0등급 사계절 고무나무 원목침대 프레임 SS/Q/K",
    description: "고무나무 원목을 사용한 사계절용 침대 프레임",
    price: 199000,
    originalPrice: null,
    isFreeShipping: false,
    isActive: true,
    stock: 18,
    badge: "BEST",
    optionValues: {
      사이즈: ["SS(슈퍼싱글)", "Q(퀸)", "K(킹)"],
      색상: ["브라운"],
    },
  },
  {
    image: `${IMAGE_BASE_URL}/bed-normal-bonie-fluffy.webp`,
    additionalImages: [],
    brandLookupName: "보니애가구",
    categoryId: 4,
    name: "플러피 조야 패브릭 침대 프레임 SS/Q 무헤드·헤드형",
    description: "무헤드형과 헤드형 구성을 갖춘 조야 패브릭 침대 프레임",
    price: 89000,
    originalPrice: null,
    isFreeShipping: false,
    isActive: true,
    stock: 27,
    badge: "NEW",
    optionValues: {
      사이즈: ["SS(슈퍼싱글)", "Q(퀸)"],
      색상: ["베이직", "네이비"],
    },
  },
  {
    image: `${IMAGE_BASE_URL}/bed-normal-monday-cloud.webp`,
    additionalImages: [],
    brandLookupName: "먼데이하우스",
    categoryId: 4,
    name: "클라우드 아쿠아텍스·부클레 패브릭 호텔식 침대프레임 SS/Q/K/LK/CK",
    description: "아쿠아텍스와 부클레 패브릭을 적용한 호텔식 침대 프레임",
    price: 199000,
    originalPrice: null,
    isFreeShipping: false,
    isActive: true,
    stock: 15,
    badge: null,
    optionValues: {
      사이즈: ["SS(슈퍼싱글)", "Q(퀸)", "K(킹)", "LK(라지킹)"],
      색상: ["베이직", "블랙"],
    },
  },

  // 수납침대 (#5)
  {
    image: `${IMAGE_BASE_URL}/bed-storage-crown-noah06.webp`,
    additionalImages: [],
    brandLookupName: "크라운퍼니쳐",
    categoryId: 5,
    name: "노아 06 빅서랍 수납침대 프레임 SS/Q",
    description: "하부 빅서랍을 갖춘 수납형 침대 프레임",
    price: 109000,
    originalPrice: null,
    isFreeShipping: false,
    isActive: true,
    stock: 29,
    badge: "BEST",
    optionValues: {
      사이즈: ["SS(슈퍼싱글)", "Q(퀸)"],
      색상: ["브라운", "화이트"],
    },
  },
  {
    image: `${IMAGE_BASE_URL}/bed-storage-layer-basic.webp`,
    additionalImages: [],
    brandLookupName: "오늘의집 layer",
    categoryId: 5,
    name: "basic 바른 수납 침대프레임 무헤드·LED헤드 SS/Q",
    description: "무헤드형과 LED 헤드형을 선택할 수 있는 수납 침대 프레임",
    price: 259000,
    originalPrice: null,
    isFreeShipping: true,
    isActive: true,
    stock: 20,
    badge: "BEST",
    optionValues: {
      사이즈: ["SS(슈퍼싱글)", "Q(퀸)"],
      색상: ["베이직", "화이트"],
    },
  },
  {
    image: `${IMAGE_BASE_URL}/bed-storage-crown-noel.webp`,
    additionalImages: [],
    brandLookupName: "크라운퍼니쳐",
    categoryId: 5,
    name: "노엘 반자동 리프트업 통수납 침대프레임 SS/Q",
    description: "반자동 리프트업 방식으로 하부 전체를 사용하는 통수납 침대 프레임",
    price: 149000,
    originalPrice: null,
    isFreeShipping: false,
    isActive: true,
    stock: 13,
    badge: "NEW",
    optionValues: {
      사이즈: ["SS(슈퍼싱글)", "Q(퀸)"],
      색상: ["브라운", "화이트"],
    },
  },
  {
    image: `${IMAGE_BASE_URL}/bed-storage-chaeum-goodnight.webp`,
    additionalImages: [],
    brandLookupName: "채움가구",
    categoryId: 5,
    name: "굿나잇 슬라이딩 벙커 수납 침대 SS/Q",
    description: "슬라이딩 방식의 벙커 수납공간을 갖춘 침대 프레임",
    price: 189000,
    originalPrice: null,
    isFreeShipping: false,
    isActive: true,
    stock: 17,
    badge: null,
    optionValues: {
      사이즈: ["SS(슈퍼싱글)", "Q(퀸)"],
      색상: ["브라운", "화이트"],
    },
  },
  {
    image: `${IMAGE_BASE_URL}/bed-storage-samik-leon.webp`,
    additionalImages: [],
    brandLookupName: "삼익가구",
    categoryId: 5,
    name: "레온 프리미엄 빅수납 호텔 침대 프레임 SS/Q/K/LK",
    description: "호텔식 헤드와 대용량 하부 수납공간을 갖춘 침대 프레임",
    price: 289000,
    originalPrice: null,
    isFreeShipping: false,
    isActive: true,
    stock: 11,
    badge: "BEST",
    optionValues: {
      사이즈: ["SS(슈퍼싱글)", "Q(퀸)", "K(킹)", "LK(라지킹)"],
      색상: ["베이직", "화이트"],
    },
  },

  // 저상형침대 (#6)
  {
    image: `${IMAGE_BASE_URL}/bed-low-vaspor-lowsleep.webp`,
    additionalImages: [],
    brandLookupName: "바스포르",
    categoryId: 6,
    name: "E0등급 로우슬립 저상형 침대 프레임 S/SS/Q/K/LK",
    description: "높이가 낮고 규격 선택 폭이 넓은 E0등급 저상형 침대 프레임",
    price: 89900,
    originalPrice: null,
    isFreeShipping: false,
    isActive: true,
    stock: 35,
    badge: "BEST",
    optionValues: {
      사이즈: ["S(싱글)", "SS(슈퍼싱글)", "Q(퀸)", "K(킹)", "LK(라지킹)"],
      색상: ["브라운", "화이트"],
    },
  },
  {
    image: `${IMAGE_BASE_URL}/bed-low-dias-slim.webp`,
    additionalImages: [],
    brandLookupName: "디아스침대",
    categoryId: 6,
    name: "초슬림 저상형 침대 프레임 3colors SS/Q/K",
    description: "매트리스 높이를 낮게 유지하는 초슬림 저상형 침대 프레임",
    price: 77800,
    originalPrice: null,
    isFreeShipping: false,
    isActive: true,
    stock: 26,
    badge: null,
    optionValues: {
      사이즈: ["SS(슈퍼싱글)", "Q(퀸)", "K(킹)"],
      색상: ["브라운", "베이직", "화이트"],
    },
  },
  {
    image: `${IMAGE_BASE_URL}/bed-low-hudo-nareun.webp`,
    additionalImages: [],
    brandLookupName: "휴도",
    categoryId: 6,
    name: "나른한선유 E0등급 저상형 무헤드 원목형 깔판 침대프레임 MS/S/SS/Q/K",
    description: "헤드 없이 사용할 수 있는 원목형 저상 깔판 침대 프레임",
    price: 39900,
    originalPrice: null,
    isFreeShipping: false,
    isActive: true,
    stock: 42,
    badge: "BEST",
    optionValues: {
      사이즈: ["MS(미니싱글)", "S(싱글)", "SS(슈퍼싱글)", "Q(퀸)", "K(킹)"],
      색상: ["브라운", "화이트"],
    },
  },
  {
    image: `${IMAGE_BASE_URL}/bed-low-hudo-maeum.webp`,
    additionalImages: [],
    brandLookupName: "휴도",
    categoryId: 6,
    name: "마음의 선유 저상형 코모도 패브릭 호텔 침대 프레임 S/SS/Q/K",
    description: "코모도 패브릭 헤드를 적용한 호텔식 저상형 침대 프레임",
    price: 89000,
    originalPrice: null,
    isFreeShipping: false,
    isActive: true,
    stock: 19,
    badge: "NEW",
    optionValues: {
      사이즈: ["S(싱글)", "SS(슈퍼싱글)", "Q(퀸)", "K(킹)"],
      색상: ["베이직", "네이비"],
    },
  },
  {
    image: `${IMAGE_BASE_URL}/bed-low-nuor-lundbig.webp`,
    additionalImages: [],
    brandLookupName: "누어",
    categoryId: 6,
    name: "룬드빅 로우 LED 저상형 호텔침대 프레임 SS/Q/K/LK",
    description: "로우 타입 프레임과 LED 헤드를 결합한 호텔식 저상형 침대",
    price: 249000,
    originalPrice: null,
    isFreeShipping: false,
    isActive: true,
    stock: 12,
    badge: null,
    optionValues: {
      사이즈: ["SS(슈퍼싱글)", "Q(퀸)", "K(킹)", "LK(라지킹)"],
      색상: ["화이트", "블랙"],
    },
  },
];
```

`CK`, `EK`, 헤드 형태, 높이 선택 등 기존 DB에 없는 값은 연결하지 않는다. 새 옵션값도 만들지 않는다.

## 5. 파일 구조

- Create: `scripts/lib/seed-product-options.mjs`
  - 기존 옵션 타입과 값 조회
  - 상품별 `ProductOption`, `ProductOptionValue` 교체
  - 없는 옵션 타입이나 값 발견 시 즉시 실패
- Create: `scripts/seed-furniture-bed-depth4-products.mjs`
  - 본 문서의 후보 배열 파싱
  - 카테고리 계층 검증
  - 브랜드, 상품, 이미지, 옵션 관계 seed
- Modify: `scripts/lib/seed-product-images.mjs`
  - 가전 전용 카테고리 검증 함수와 별도로 침대 카테고리 검증 함수 추가
- Modify: `scripts/download-product-images.sh`
  - 침대 상품 대표 이미지 15개 다운로드 URL 추가
- Create: `public/image/products/bed-*.webp`
  - 상품별 대표 이미지 15개
- Modify: `package.json`
  - `seed:furniture-bed-products` 실행 스크립트 추가

## 6. 구현 작업

### Task 1: 침대 카테고리 계층 검증

**Files:**

- Modify: `scripts/lib/seed-product-images.mjs`

- [ ] **Step 1: 침대 카테고리 계층 정의**

`validateFurnitureBedCategories`가 아래 계층만 허용하도록 정의한다.

```js
[
  { id: 1, name: "가구", depth: 1, parentId: null },
  { id: 2, name: "침대", depth: 2, parentId: 1 },
  { id: 3, name: "침대프레임", depth: 3, parentId: 2 },
  { id: 4, name: "일반침대", depth: 4, parentId: 3 },
  { id: 5, name: "수납침대", depth: 4, parentId: 3 },
  { id: 6, name: "저상형침대", depth: 4, parentId: 3 },
]
```

- [ ] **Step 2: 카테고리 검증 함수 구현**

`validateApplianceCategories`는 변경하지 않고 동일 파일에 `validateFurnitureBedCategories`를 추가한다. ID, 이름, depth, parentId 중 하나라도 다르면 `Category mismatch: <id>`를 throw한다.

### Task 2: 기존 옵션만 연결하는 공통 로직

**Files:**

- Create: `scripts/lib/seed-product-options.mjs`

- [ ] **Step 1: 옵션 조회 규칙 구현**

다음 규칙으로 기존 옵션을 조회한다.

```text
1. "사이즈", "색상" 타입과 요청된 값의 ID를 반환한다.
2. 요청 값이 DB에 없으면 생성하지 않고 "Missing option value" 오류를 낸다.
3. 기존 상품 옵션 관계를 삭제한 뒤 후보 데이터와 같은 관계만 생성한다.
4. 옵션 타입 또는 값이 없으면 상품 데이터를 변경하기 전에 실패한다.
```

- [ ] **Step 2: 상품 옵션 교체 함수 구현**

공개 함수는 아래 두 개로 제한한다.

```js
export const resolveExistingOptionValues = async (tx, optionValues) => {};
export const replaceProductOptions = async (tx, productId, resolvedOptions) => {};
```

`resolveExistingOptionValues`는 `OptionType`이나 `OptionValue`를 생성하지 않는다. 요청한 타입 또는 값이 하나라도 없으면 전체 seed가 롤백되도록 오류를 낸다.

`replaceProductOptions`는 해당 상품의 기존 `ProductOptionValue`를 먼저 삭제하고 `ProductOption`을 삭제한 뒤, 타입별 `ProductOption` 1개와 값별 `ProductOptionValue`를 생성한다.

### Task 3: 상품 대표 이미지 준비

**Files:**

- Modify: `scripts/download-product-images.sh`
- Create: `public/image/products/bed-*.webp`

- [ ] **Step 1: 상품명 대조**

참고 페이지에서 후보 상품 15개의 브랜드와 전체 상품명이 일치하는 카드만 선택한다. 비슷한 이름의 다른 상품 이미지를 사용하지 않는다.

- [ ] **Step 2: 다운로드 목록 추가**

`scripts/download-product-images.sh`에 상품별 오늘의집 CDN 대표 이미지 URL과 본 문서의 고정 파일명을 함께 추가한다. 기존 가전 이미지 목록은 변경하지 않는다.

- [ ] **Step 3: 이미지 다운로드**

Run:

```bash
bash scripts/download-product-images.sh
```

Expected: 침대 이미지 15개를 포함한 전체 목록에서 실패 0개.

- [ ] **Step 4: 파일 검증**

Run:

```bash
find public/image/products -type f -name 'bed-*.webp' | sort
```

Expected: 본 문서에 정의한 15개 파일명이 모두 출력된다.

각 파일은 `file public/image/products/<filename>`으로 실제 WebP 이미지인지 확인한다. 원본이 JPEG/PNG이면 확장자만 바꾸지 말고 WebP로 변환한다.

### Task 4: 침대 상품 seed 스크립트

**Files:**

- Create: `scripts/seed-furniture-bed-depth4-products.mjs`
- Modify: `package.json`

- [ ] **Step 1: 문서 파서 구현**

문서의 `furnitureBedProductSeedCandidates` 배열을 읽고 15개인지, 카테고리별 5개인지 검증하는 파서 함수를 작성한다. `optionValues`도 손실 없이 반환해야 한다.

- [ ] **Step 2: seed 구현**

기존 `scripts/seed-appliance-depth3-products.mjs` 패턴을 유지하며 다음 순서로 구현한다.

```text
1. 계획 문서에서 후보 15개 파싱
2. 카테고리 1~6 조회 및 계층 검증
3. "사이즈", "색상"과 모든 요청 옵션값 선행 조회
4. 하나라도 없으면 상품을 쓰기 전에 실패
5. 트랜잭션 시작
6. Brand.name 기준 upsert
7. Product.name 기준 create/update
8. 대표 이미지를 ProductImage THUMBNAIL로 교체
9. ProductOption과 ProductOptionValue를 후보 데이터 기준으로 교체
10. 생성/갱신/옵션 연결 결과 JSON 출력
```

상품 데이터 매핑:

```js
const data = {
  image: basename(candidate.image),
  brandId: brand.id,
  name: candidate.name,
  description: candidate.description,
  price: candidate.price,
  originalPrice: candidate.originalPrice,
  isFreeShipping: candidate.isFreeShipping,
  isActive: candidate.isActive,
  stock: candidate.stock,
  badge: toBadgeType(candidate.badge),
  categoryId: candidate.categoryId,
};
```

- [ ] **Step 3: package script 추가**

```json
{
  "scripts": {
    "seed:furniture-bed-products": "node scripts/seed-furniture-bed-depth4-products.mjs"
  }
}
```

기존 scripts 항목은 유지한다.

### Task 5: DB seed 및 관계 검증

**Files:**

- Verify: `prisma/schema.prisma`
- Verify: MySQL `product`, `product_image`, `product_option`, `product_option_value`

- [ ] **Step 1: 선행 옵션 seed 실행**

Run:

```bash
node scripts/seed-size-option.mjs
node scripts/seed-color-option.mjs
```

Expected: `사이즈` 8개, `색상` 7개가 생성 또는 재사용된다.

- [ ] **Step 2: 상품 seed 실행**

Run:

```bash
npm run seed:furniture-bed-products
```

Expected:

```text
parsed: 15
categoryId 4: 5 products
categoryId 5: 5 products
categoryId 6: 5 products
missing option types: 0
missing option values: 0
```

- [ ] **Step 3: 반복 실행**

Run:

```bash
npm run seed:furniture-bed-products
```

Expected: 상품은 모두 `updated`, 상품 총수와 옵션 관계 총수가 첫 실행 후 값과 동일하다.

- [ ] **Step 4: DB 관계 확인**

Prisma 조회로 다음을 검증한다.

```js
const products = await prisma.product.findMany({
  where: { categoryId: { in: [4, 5, 6] } },
  include: {
    productOptions: {
      include: {
        optionType: true,
        productOptionValues: {
          include: { optionValue: true },
        },
      },
    },
    productImages: true,
  },
});
```

Expected:

- 상품 15개
- 카테고리별 5개
- 상품별 옵션 타입은 최대 `사이즈`, `색상` 2개
- 모든 옵션값은 기존 15개 집합에 포함
- 각 상품에 `THUMBNAIL` 이미지 1개
- 동일한 `(productId, optionTypeId)` 없음
- 동일한 `(productOptionId, optionValueId)` 없음

- [ ] **Step 5: 전체 정적 검증**

Run:

```bash
npm run lint
npm run build
```

Expected: 둘 다 exit code 0.

## 7. 제외 범위

- `schema.prisma` 수정
- migration 생성
- 새로운 옵션 타입 또는 옵션값 생성
- 오늘의집 상품 옵션 상세 조사
- 옵션 조합별 가격, 재고, SKU
- 매트리스 포함 여부, 헤드 형태, LED, 높이 선택을 별도 옵션으로 모델링
- 리뷰, 쿠폰, 장바구니 seed
- 오늘의집 가격 및 이미지의 자동 주기 갱신

## 8. 자체 검토 결과

- 요구된 카테고리 3개와 상품 15개가 모두 포함되어 있다.
- 상품마다 현재 `Product`의 필수 필드를 모두 정의했다.
- 옵션 매핑은 기존 `사이즈`, `색상` 값만 사용한다.
- DB에 없는 `CK`, `EK` 등은 명시적으로 제외했다.
- 새 옵션이나 스키마 변경을 수행하는 단계가 없다.
- seed 반복 실행 시 중복을 만들지 않는 검증 단계가 있다.
