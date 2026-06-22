# 가전·디지털 Depth 3 상품 Seed 계획

작성일: 2026-06-22

## 목적

`가전·디지털 > 세탁기·건조기` 하위 depth 3 카테고리인 `일반세탁기`, `드럼세탁기`, `의류관리기`에 들어갈 상품 seed 후보를 만든다.

대상 카테고리:

```text
가전·디지털
    세탁기·건조기
        일반세탁기
        드럼세탁기
        의류관리기
```

## 참고 기준

- LG전자 공식몰은 생활가전 카테고리에서 `세탁기`, `드럼세탁기`, `통돌이`, `의류관리기`, `스타일러` 같은 분류를 사용한다.
- 오늘의집형 상품 데이터 구조에 맞춰 상품명, 가격, 정상가, 대표 이미지, 배송비 여부, 재고, 브랜드, 카테고리를 채운다.
- 실제 상품 데이터를 그대로 복제하지 않고, seed 용도에 맞는 그럴듯한 가상 상품명과 가격대로 작성한다.

참고 URL:

- `https://www.lge.co.kr/category/washing-machines`
- `https://store.ohou.se`

## 관련 Product 스키마

```prisma
model Product {
  id             Int        @id @default(autoincrement())
  image          String
  brandId        Int        @map("brand_id")
  brand          Brand      @relation(fields: [brandId], references: [id])
  name           String
  description    String?    @db.Text
  price          Int
  originalPrice  Int?       @map("original_price")
  isFreeShipping Boolean    @default(false) @map("is_free_shipping")
  isActive       Boolean    @default(true) @map("is_active")
  stock          Int        @default(0)
  badge          BadgeType?
  categoryId     Int?       @map("category_id")
  category       Category?  @relation(fields: [categoryId], references: [id])
  createdAt      DateTime   @default(now()) @map("created_at")
  updatedAt      DateTime   @updatedAt @map("updated_at")

  @@index([brandId])
  @@index([categoryId])
  @@map("product")
}
```

## 선행 조건

- `Category` seed가 실행되어 있어야 한다.
- 아래 카테고리 경로가 DB에 존재해야 한다.
  - `가전·디지털 > 세탁기·건조기 > 일반세탁기`
  - `가전·디지털 > 세탁기·건조기 > 드럼세탁기`
  - `가전·디지털 > 세탁기·건조기 > 의류관리기`
- `Brand`는 seed 실행 시 현재 DB의 `Brand.name` 기준으로 먼저 조회한다.
- 현재 DB에 없는 브랜드는 `Brand`에 새로 추가한 뒤 생성된 `id`를 `Product.brandId`로 연결한다.
- `brandLookupName`은 seed 스크립트에서만 쓰는 조회용 값이며, `Product` 테이블에는 저장하지 않는다.

추가로 필요한 브랜드:

```ts
const applianceBrandNames = [
  "LG전자",
  "삼성전자",
  "위니아",
];
```

## Seed 후보 데이터

대표 이미지는 실제 외부 상품 이미지를 직접 저장하지 않고 placeholder URL을 사용한다.

```ts
const applianceProductSeedCandidates = [
  {
    image: "https://picsum.photos/seed/appliance-topload-lg-21kg/600/600",
    brandLookupName: "LG전자",
    categoryPath: ["가전·디지털", "세탁기·건조기", "일반세탁기"],
    name: "통돌이 AI 일반세탁기 21kg 화이트",
    description: [
      "대용량 가족 세탁에 맞춘 일반세탁기 seed 상품",
      "통돌이 타입, 21kg급, 화이트 계열",
      "일반세탁기 카테고리 목록/상세 화면 확인용 데이터",
    ].join("\n"),
    price: 689000,
    originalPrice: 829000,
    isFreeShipping: true,
    isActive: true,
    stock: 18,
    badge: "BEST",
  },
  {
    image: "https://picsum.photos/seed/appliance-topload-samsung-19kg/600/600",
    brandLookupName: "삼성전자",
    categoryPath: ["가전·디지털", "세탁기·건조기", "일반세탁기"],
    name: "전자동 워블 일반세탁기 19kg 그레이",
    description: [
      "원룸부터 3인 가구까지 사용할 수 있는 일반세탁기 seed 상품",
      "전자동 타입, 19kg급, 그레이 계열",
      "가격 비교와 브랜드 필터 확인용 데이터",
    ].join("\n"),
    price: 579000,
    originalPrice: 699000,
    isFreeShipping: true,
    isActive: true,
    stock: 24,
    badge: null,
  },
  {
    image: "https://picsum.photos/seed/appliance-topload-winia-17kg/600/600",
    brandLookupName: "위니아",
    categoryPath: ["가전·디지털", "세탁기·건조기", "일반세탁기"],
    name: "클린웨이브 일반세탁기 17kg 실버",
    description: [
      "합리적인 가격대의 일반세탁기 seed 상품",
      "17kg급, 실버 계열",
      "저가/중가 상품 노출 테스트용 데이터",
    ].join("\n"),
    price: 429000,
    originalPrice: 499000,
    isFreeShipping: false,
    isActive: true,
    stock: 15,
    badge: "NEW",
  },
  {
    image: "https://picsum.photos/seed/appliance-drum-lg-24kg/600/600",
    brandLookupName: "LG전자",
    categoryPath: ["가전·디지털", "세탁기·건조기", "드럼세탁기"],
    name: "트롬 오브제 드럼세탁기 24kg 네이처베이지",
    description: [
      "대용량 드럼세탁기 seed 상품",
      "24kg급, 오브제 스타일 색상",
      "고가 상품과 할인율 계산 테스트용 데이터",
    ].join("\n"),
    price: 1199000,
    originalPrice: 1490000,
    isFreeShipping: true,
    isActive: true,
    stock: 12,
    badge: "BEST",
  },
  {
    image: "https://picsum.photos/seed/appliance-drum-samsung-24kg/600/600",
    brandLookupName: "삼성전자",
    categoryPath: ["가전·디지털", "세탁기·건조기", "드럼세탁기"],
    name: "비스포크 그랑데 드럼세탁기 24kg 새틴그레이",
    description: [
      "비스포크 계열을 참고한 드럼세탁기 seed 상품",
      "24kg급, 그레이 계열",
      "브랜드별 드럼세탁기 목록 비교용 데이터",
    ].join("\n"),
    price: 1099000,
    originalPrice: 1390000,
    isFreeShipping: true,
    isActive: true,
    stock: 10,
    badge: null,
  },
  {
    image: "https://picsum.photos/seed/appliance-drum-lg-compact/600/600",
    brandLookupName: "LG전자",
    categoryPath: ["가전·디지털", "세탁기·건조기", "드럼세탁기"],
    name: "컴팩트 드럼세탁기 15kg 릴리화이트",
    description: [
      "공간 절약형 드럼세탁기 seed 상품",
      "15kg급, 화이트 계열",
      "소형/중형 세탁기 상품 구성 테스트용 데이터",
    ].join("\n"),
    price: 849000,
    originalPrice: 999000,
    isFreeShipping: true,
    isActive: true,
    stock: 20,
    badge: "NEW",
  },
  {
    image: "https://picsum.photos/seed/appliance-care-lg-styler/600/600",
    brandLookupName: "LG전자",
    categoryPath: ["가전·디지털", "세탁기·건조기", "의류관리기"],
    name: "스타일러 오브제 의류관리기 5벌형 미스트베이지",
    description: [
      "의류관리기 대표 상품 seed 데이터",
      "5벌형, 베이지 계열",
      "의류관리기 카테고리 목록 확인용 데이터",
    ].join("\n"),
    price: 1349000,
    originalPrice: 1690000,
    isFreeShipping: true,
    isActive: true,
    stock: 8,
    badge: "BEST",
  },
  {
    image: "https://picsum.photos/seed/appliance-care-samsung-airdresser/600/600",
    brandLookupName: "삼성전자",
    categoryPath: ["가전·디지털", "세탁기·건조기", "의류관리기"],
    name: "비스포크 에어드레서 의류관리기 5벌형 코타화이트",
    description: [
      "에어드레서 계열을 참고한 의류관리기 seed 상품",
      "5벌형, 화이트 계열",
      "브랜드 필터와 고가 상품 UI 확인용 데이터",
    ].join("\n"),
    price: 1249000,
    originalPrice: 1590000,
    isFreeShipping: true,
    isActive: true,
    stock: 9,
    badge: null,
  },
  {
    image: "https://picsum.photos/seed/appliance-care-compact-3items/600/600",
    brandLookupName: "위니아",
    categoryPath: ["가전·디지털", "세탁기·건조기", "의류관리기"],
    name: "스팀케어 미니 의류관리기 3벌형 화이트",
    description: [
      "소형 의류관리기 seed 상품",
      "3벌형, 화이트 계열",
      "의류관리기 저가 상품 테스트용 데이터",
    ].join("\n"),
    price: 699000,
    originalPrice: 799000,
    isFreeShipping: false,
    isActive: true,
    stock: 14,
    badge: "NEW",
  },
];
```

## DB 삽입 계획

1. `Brand.name` 기준으로 `LG전자`, `삼성전자`, `위니아`를 upsert한다.
   - 현재 DB에 이미 있으면 기존 `Brand.id`를 사용한다.
   - 현재 DB에 없으면 `Brand`를 새로 생성하고 생성된 `id`를 사용한다.
2. `Category`는 경로 기반으로 조회한다.
   - 루트 `가전·디지털`
   - 자식 `세탁기·건조기`
   - depth 3 대상 카테고리
3. 각 상품의 `brandLookupName`, `categoryPath`를 실제 `brandId`, `categoryId`로 변환한다.
4. `Product` 생성/갱신 데이터에서는 `brandLookupName`, `categoryPath`를 제거한다.
5. `Product`에는 `brandId`, `categoryId`, `image`, `name`, `description`, `price`, `originalPrice`, `isFreeShipping`, `isActive`, `stock`, `badge`만 저장한다.
6. 상품 중복 기준은 우선 `name`으로 둔다.
7. 같은 `name`의 상품이 없으면 생성한다.
8. 같은 `name`의 상품이 있으면 가격, 정상가, 이미지, 설명, 배송 여부, 활성 상태, 재고, 배지를 갱신한다.
9. `discountRate`, `rating`, `reviewCount`는 현재 `Product` 모델에 없으므로 저장하지 않는다.

## 검증 방법

seed 실행 후 아래 조건을 확인한다.

- `Brand`에 `LG전자`, `삼성전자`, `위니아`가 존재한다.
- `일반세탁기` 카테고리에 상품 3개가 연결된다.
- `드럼세탁기` 카테고리에 상품 3개가 연결된다.
- `의류관리기` 카테고리에 상품 3개가 연결된다.
- `Product.categoryId`가 모두 `null`이 아니다.
- `Product.brandId`가 모두 `null`이 아니다.
- `Product` row에 `brandLookupName` 같은 seed 전용 필드가 저장되지 않는다.
- 같은 seed를 여러 번 실행해도 상품 row가 중복 생성되지 않는다.

## 주의사항

- 현재 `Product.name`에는 unique 제약이 없다. 안전한 반복 seed를 위해 스크립트에서는 `findFirst({ where: { name } })` 후 create/update를 수행한다.
- 대표 이미지는 placeholder이므로 실제 운영 데이터로 쓰지 않는다.
- 실제 판매가, 정상가, 배송비, 재고는 seed용 가상 값이다.
- 할인율은 `originalPrice`와 `price`로 계산한다.
- 리뷰/평점은 `Review` 데이터가 생성된 뒤 계산한다.
- 가전 제품 옵션이 필요해지면 `OptionType`, `OptionValue`, `ProductOption`, `ProductOptionValue`를 별도 seed로 연결한다.
