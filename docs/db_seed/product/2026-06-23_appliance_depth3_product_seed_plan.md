# 가전·디지털 Depth 3 상품 Seed 계획

> 작성일: 2026-06-23

## 1. 목적

`가전·디지털 > 세탁기·건조기` 아래의 depth 3 카테고리에 실제 쇼핑몰 상품 구성을 참고한 테스트용 상품 데이터를 추가한다.

```text
가전·디지털 (#34, depth=1)
└── 세탁기·건조기 (#35, depth=2)
    ├── 일반세탁기 (#36, depth=3)
    ├── 드럼세탁기 (#37, depth=3)
    └── 의류관리기 (#38, depth=3)
```

카테고리별 5개씩 총 15개 상품을 생성한다.

## 2. 조사 기준

조사일은 2026년 6월 23일이다.

- 오늘의집 검색 결과에서 실제 브랜드, 모델명, 판매가, 정상가, 대표 이미지 URL을 확인했다.
- LG전자와 삼성전자 공식몰의 상품 분류, 용량 범위, 색상 및 주요 기능 구성을 함께 참고했다.
- `image`에는 로컬 파일이나 SVG를 사용하지 않고 브라우저에서 직접 접근 가능한 오늘의집 CDN HTTPS URL을 저장한다.
- 가격은 조사 시점의 값이며 쇼핑몰 정책에 따라 변경될 수 있다.
- `stock`, `badge`, `isActive`는 프로젝트 화면과 정렬 기능을 검증하기 위한 seed 값이다.
- 리뷰 수와 평점은 `Product`가 아니라 `Review` 데이터로 계산되므로 이번 범위에서 생성하지 않는다.

### 참고 페이지

- 오늘의집 일반세탁기 검색: `https://ohou.se/search/index?query=%ED%86%B5%EB%8F%8C%EC%9D%B4+%EC%84%B8%ED%83%81%EA%B8%B0`
- 오늘의집 드럼세탁기 검색: `https://ohou.se/search/index?query=%EB%93%9C%EB%9F%BC+%EC%84%B8%ED%83%81%EA%B8%B0`
- 오늘의집 의류관리기 검색: `https://ohou.se/search/index?query=%EC%9D%98%EB%A5%98%EA%B4%80%EB%A6%AC%EA%B8%B0`
- LG전자 세탁기 분류: `https://www.lge.co.kr/category/washing-machines`
- 삼성전자 세탁기·건조기 분류: `https://www.samsung.com/sec/washers-and-dryers/all-washers-and-dryers/`
- 삼성전자 에어드레서 분류: `https://www.samsung.com/sec/airdressers-and-shoedressers/all-airdressers-and-shoedressers/`

## 3. 현재 스키마 매핑

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

  productImages  ProductImage[]
}

model ProductImage {
  id        Int              @id @default(autoincrement())
  productId Int              @map("product_id")
  product   Product          @relation(fields: [productId], references: [id], onDelete: Cascade)
  url       String
  type      ProductImageType
  sortOrder Int              @default(0) @map("sort_order")
  alt       String?
}
```

계획서의 `brandLookupName`은 `Brand.name` 조회용이며 `Product` 테이블에는 저장하지 않는다. `categoryId`는 현재 확인된 카테고리 ID인 `36`, `37`, `38`을 사용한다.

`additionalImages`는 상품 상세 페이지에서 확인한 추가 각도 및 연출 이미지 URL이다. 대표 이미지는 `Product.image`에 유지하면서 `ProductImage.type = THUMBNAIL`로도 저장하고, 추가 이미지는 `ProductImage.type = GALLERY`로 저장한다.

## 4. Seed 후보 데이터

```ts
const IMAGE_BASE_URL = process.env.PRODUCT_IMAGE_BASE_URL ?? "/image/products";

const applianceProductSeedCandidates = [
  {
    image: `${IMAGE_BASE_URL}/v1-207255377678336.jpg`,
    additionalImages: [
      `${IMAGE_BASE_URL}/v1-282659047337984.png`,
      `${IMAGE_BASE_URL}/v1-282659061329984.png`,
      `${IMAGE_BASE_URL}/v1-282659113062400.png`,
    ],
    brandLookupName: "LG전자",
    categoryId: 36,
    name: "LG 통돌이세탁기 T17WX3 인공지능 세탁기 17kg",
    description: [
      "17kg 용량의 화이트 계열 일반세탁기",
      "AI 세탁 코스를 지원하는 가족용 통돌이 타입",
      "오늘의집 판매 상품을 기준으로 구성한 테스트 데이터",
    ].join("\n"),
    price: 455680,
    originalPrice: 650000,
    isFreeShipping: true,
    isActive: true,
    stock: 22,
    badge: "BEST",
  },
  {
    image: `${IMAGE_BASE_URL}/v1-303533187526784.jpg`,
    additionalImages: [
      `${IMAGE_BASE_URL}/v1-303533237751872.jpg`,
      `${IMAGE_BASE_URL}/v1-303533257129984.jpg`,
      `${IMAGE_BASE_URL}/v1-303533266165760.jpg`,
      `${IMAGE_BASE_URL}/v1-303533275267136.jpg`,
    ],
    brandLookupName: "LG전자",
    categoryId: 36,
    name: "LG 통돌이 일반세탁기 TR15WV5 15kg",
    description: [
      "15kg 용량의 실속형 일반세탁기",
      "화이트 색상과 기본 세탁 코스를 갖춘 제품",
      "중간 가격대 상품 목록과 가격 정렬 검증용 데이터",
    ].join("\n"),
    price: 435210,
    originalPrice: 600000,
    isFreeShipping: true,
    isActive: true,
    stock: 18,
    badge: null,
  },
  {
    image: `${IMAGE_BASE_URL}/170183232596159340.jpg`,
    additionalImages: [
      `${IMAGE_BASE_URL}/v1-413519417118784.jpg`,
    ],
    brandLookupName: "캐리어",
    categoryId: 36,
    name: "캐리어 원룸 맞춤 통돌이세탁기 KWMT-080ATNWO 8kg",
    description: [
      "원룸과 소형 주거 공간에 맞춘 8kg 일반세탁기",
      "소형 용량과 낮은 가격대 상품 노출 검증용 데이터",
      "방문 설치형 가전 상품을 참고해 구성",
    ].join("\n"),
    price: 281900,
    originalPrice: 359000,
    isFreeShipping: true,
    isActive: true,
    stock: 30,
    badge: "NEW",
  },
  {
    image: `${IMAGE_BASE_URL}/v1-510118367526912.jpg`,
    additionalImages: [
      `${IMAGE_BASE_URL}/v1-513045568675968.jpg`,
    ],
    brandLookupName: "삼성전자",
    categoryId: 36,
    name: "삼성 통버블 세탁기 WA16CG6441BY 16kg 라벤더그레이",
    description: [
      "16kg 용량의 라벤더그레이 일반세탁기",
      "통버블 세탁 방식과 대용량 빨래 코스를 지원",
      "브랜드 및 색상별 필터 검증용 데이터",
    ].join("\n"),
    price: 553000,
    originalPrice: 589000,
    isFreeShipping: true,
    isActive: true,
    stock: 16,
    badge: null,
  },
  {
    image: `${IMAGE_BASE_URL}/v1-207255257256064.jpg`,
    additionalImages: [
      `${IMAGE_BASE_URL}/v1-282659316183104.png`,
      `${IMAGE_BASE_URL}/v1-282659323293824.png`,
      `${IMAGE_BASE_URL}/v1-282659334344768.png`,
    ],
    brandLookupName: "LG전자",
    categoryId: 36,
    name: "LG 통돌이세탁기 T21MX9B 인공지능 세탁기 21kg",
    description: [
      "21kg 용량의 대가족용 일반세탁기",
      "대용량 이불 세탁과 AI 세탁 코스를 지원",
      "일반세탁기 카테고리의 고가 상품 검증용 데이터",
    ].join("\n"),
    price: 779260,
    originalPrice: 1100000,
    isFreeShipping: true,
    isActive: true,
    stock: 11,
    badge: "BEST",
  },
  {
    image: `${IMAGE_BASE_URL}/v1-510135230673024.jpg`,
    additionalImages: [
      `${IMAGE_BASE_URL}/v1-514021206310912.jpg`,
    ],
    brandLookupName: "삼성전자",
    categoryId: 37,
    name: "삼성 AI 드럼세탁기 WF21DG6650BW 21kg 화이트",
    description: [
      "21kg 용량의 화이트 드럼세탁기",
      "AI 맞춤세탁과 에너지소비효율 1등급 제품을 참고",
      "드럼세탁기 대표 상품 노출 검증용 데이터",
    ].join("\n"),
    price: 989000,
    originalPrice: 1349000,
    isFreeShipping: true,
    isActive: true,
    stock: 14,
    badge: "BEST",
  },
  {
    image: `${IMAGE_BASE_URL}/v1-405377732435968.jpg`,
    additionalImages: [],
    brandLookupName: "LG전자",
    categoryId: 37,
    name: "LG 트롬 세탁건조 겸용 드럼세탁기 FY9WT 9kg",
    description: [
      "소형 주거 공간에 적합한 9kg 드럼세탁기",
      "세탁과 건조를 함께 지원하는 화이트 제품",
      "소형 드럼세탁기와 복합 기능 표시 검증용 데이터",
    ].join("\n"),
    price: 659120,
    originalPrice: 950000,
    isFreeShipping: true,
    isActive: true,
    stock: 19,
    badge: "NEW",
  },
  {
    image: `${IMAGE_BASE_URL}/v1-510118826782784.jpg`,
    additionalImages: [
      `${IMAGE_BASE_URL}/v1-514116038287360.jpg`,
    ],
    brandLookupName: "삼성전자",
    categoryId: 37,
    name: "삼성 AI 드럼세탁기 WF25DG8650BW 25kg 화이트",
    description: [
      "25kg 용량의 대가족용 드럼세탁기",
      "AI 세탁 기능과 에너지소비효율 1등급 제품을 참고",
      "대용량 및 고가 상품 정렬 검증용 데이터",
    ].join("\n"),
    price: 1019000,
    originalPrice: 1499000,
    isFreeShipping: true,
    isActive: true,
    stock: 9,
    badge: "BEST",
  },
  {
    image: `${IMAGE_BASE_URL}/v1-449935333228544.jpg`,
    additionalImages: [
      `${IMAGE_BASE_URL}/v1-301403856232512.jpg`,
      `${IMAGE_BASE_URL}/v1-301403863584832.jpg`,
      `${IMAGE_BASE_URL}/v1-301403872706560.jpg`,
      `${IMAGE_BASE_URL}/v1-301403881988224.jpg`,
    ],
    brandLookupName: "LG전자",
    categoryId: 37,
    name: "LG 트롬 드럼세탁기 F12WVAR 12kg 화이트",
    description: [
      "12kg 용량의 중소형 드럼세탁기",
      "화이트 색상과 에너지소비효율 1등급 제품을 참고",
      "중간 용량 및 가격대 상품 검증용 데이터",
    ].join("\n"),
    price: 749380,
    originalPrice: 1000000,
    isFreeShipping: true,
    isActive: true,
    stock: 17,
    badge: null,
  },
  {
    image: `${IMAGE_BASE_URL}/v1-449936342269952.jpg`,
    additionalImages: [
      `${IMAGE_BASE_URL}/167636197027664642.jpg`,
      `${IMAGE_BASE_URL}/v1-301406869454912.jpg`,
      `${IMAGE_BASE_URL}/v1-301406885171264.jpg`,
      `${IMAGE_BASE_URL}/v1-301406910214144.jpg`,
    ],
    brandLookupName: "LG전자",
    categoryId: 37,
    name: "LG 트롬 오브제컬렉션 드럼세탁기 FX24ENER 24kg",
    description: [
      "24kg 용량의 오브제컬렉션 드럼세탁기",
      "프리미엄 색상과 대용량 세탁 구성을 참고",
      "프리미엄 가격대와 높은 정상가 표시 검증용 데이터",
    ].join("\n"),
    price: 1503060,
    originalPrice: 1750000,
    isFreeShipping: true,
    isActive: true,
    stock: 7,
    badge: "NEW",
  },
  {
    image: `${IMAGE_BASE_URL}/v1-510258179424256.png`,
    additionalImages: [
      `${IMAGE_BASE_URL}/v1-385293601063040.jpg`,
      `${IMAGE_BASE_URL}/v1-385293612052608.jpg`,
      `${IMAGE_BASE_URL}/v1-385293621686400.jpg`,
      `${IMAGE_BASE_URL}/v1-395160576860160.jpg`,
    ],
    brandLookupName: "삼성전자",
    categoryId: 38,
    name: "삼성 비스포크 AI 에어드레서 DF18CB8600DR",
    description: [
      "공간제습 기능을 지원하는 비스포크 AI 의류관리기",
      "가족용 의류 관리와 살균·탈취 코스를 갖춘 제품",
      "의류관리기 대표 상품 노출 검증용 데이터",
    ].join("\n"),
    price: 1249000,
    originalPrice: 1590000,
    isFreeShipping: true,
    isActive: true,
    stock: 10,
    badge: "BEST",
  },
  {
    image: `${IMAGE_BASE_URL}/167590594398081358.png`,
    additionalImages: [
      `${IMAGE_BASE_URL}/167590596301308261.jpg`,
      `${IMAGE_BASE_URL}/167590596565331915.jpg`,
      `${IMAGE_BASE_URL}/167590596827914120.jpg`,
      `${IMAGE_BASE_URL}/167590597165896341.jpg`,
    ],
    brandLookupName: "시티파이",
    categoryId: 38,
    name: "시티파이 스타일랩 미니 의류관리기",
    description: [
      "1인 가구를 위한 소형 의류관리기",
      "건조와 탈취 중심의 간단한 의류 관리 기능을 지원",
      "저가형 의류관리기 상품 노출 검증용 데이터",
    ].join("\n"),
    price: 95000,
    originalPrice: 128000,
    isFreeShipping: true,
    isActive: true,
    stock: 35,
    badge: "NEW",
  },
  {
    image: `${IMAGE_BASE_URL}/v1-451093599088768.jpg`,
    additionalImages: [
      `${IMAGE_BASE_URL}/v1-451093652791360.jpg`,
      `${IMAGE_BASE_URL}/v1-451093678362752.jpg`,
      `${IMAGE_BASE_URL}/v1-451093690363904.jpg`,
      `${IMAGE_BASE_URL}/v1-451093699829824.jpg`,
    ],
    brandLookupName: "에스틸로",
    categoryId: 38,
    name: "에스틸로 퍼스널 의류관리기 1인용",
    description: [
      "개인 의류 관리에 적합한 소형 퍼스널 제품",
      "원룸과 드레스룸에 설치 가능한 슬림형 구성을 참고",
      "중저가 독립형 의류관리기 검증용 데이터",
    ].join("\n"),
    price: 299000,
    originalPrice: 469000,
    isFreeShipping: true,
    isActive: true,
    stock: 21,
    badge: null,
  },
  {
    image: `${IMAGE_BASE_URL}/v1-459578386051072.jpg`,
    additionalImages: [
      `${IMAGE_BASE_URL}/v1-459578435928192.jpg`,
      `${IMAGE_BASE_URL}/v1-459578461249664.jpg`,
      `${IMAGE_BASE_URL}/v1-459578475487296.jpg`,
      `${IMAGE_BASE_URL}/v1-459578485530624.jpg`,
    ],
    brandLookupName: "LG전자",
    categoryId: 38,
    name: "LG 스타일러 오브제컬렉션 SC5MBR42S 5벌",
    description: [
      "5벌 용량의 오브제컬렉션 스타일러",
      "스팀 살균, 탈취, 주름 완화 코스를 지원하는 제품",
      "프리미엄 의류관리기와 브랜드 필터 검증용 데이터",
    ].join("\n"),
    price: 1369280,
    originalPrice: 1900000,
    isFreeShipping: true,
    isActive: true,
    stock: 8,
    badge: "BEST",
  },
  {
    image: `${IMAGE_BASE_URL}/v1-510256940085312.png`,
    additionalImages: [
      `${IMAGE_BASE_URL}/v1-465992848388224.jpg`,
      `${IMAGE_BASE_URL}/v1-465992858132544.jpg`,
      `${IMAGE_BASE_URL}/v1-465992866099200.jpg`,
    ],
    brandLookupName: "삼성전자",
    categoryId: 38,
    name: "삼성 비스포크 AI 에어드레서 DF24CB9900DR 대용량",
    description: [
      "많은 의류를 한 번에 관리하는 대용량 에어드레서",
      "AI 의류 관리와 공간제습 기능을 지원하는 제품",
      "의류관리기 카테고리의 최고가 상품 검증용 데이터",
    ].join("\n"),
    price: 1849000,
    originalPrice: 2090000,
    isFreeShipping: true,
    isActive: true,
    stock: 6,
    badge: "NEW",
  },
];
```

## 5. 필요한 브랜드

아래 브랜드를 `Brand.name` 기준으로 upsert한다.

```ts
const applianceBrandNames = [
  "LG전자",
  "삼성전자",
  "캐리어",
  "시티파이",
  "에스틸로",
];
```

기존 브랜드가 있으면 해당 `id`를 재사용하고, 없으면 `logo: null`, `visible: true`로 생성한다.

## 6. DB 삽입 계획

1. `Category`에서 ID `34`, `35`, `36`, `37`, `38`의 이름, depth, 부모 관계를 조회한다.
2. 아래 관계가 일치하지 않으면 상품을 삽입하지 않고 오류를 발생시킨다.
   - `#34 가전·디지털`: depth 1
   - `#35 세탁기·건조기`: depth 2, parentId 34
   - `#36 일반세탁기`: depth 3, parentId 35
   - `#37 드럼세탁기`: depth 3, parentId 35
   - `#38 의류관리기`: depth 3, parentId 35
3. 필요한 브랜드를 `Brand.name` 기준으로 upsert한다.
4. 각 후보의 `brandLookupName`을 실제 `brandId`로 변환한다.
5. `Product`에는 아래 필드를 저장한다.
   - `image`
   - `brandId`
   - `categoryId`
   - `name`
   - `description`
   - `price`
   - `originalPrice`
   - `isFreeShipping`
   - `isActive`
   - `stock`
   - `badge`
6. `brandLookupName`은 seed 스크립트에서 제거하고 DB에 저장하지 않는다.
7. 현재 `Product.name`에 unique 제약이 없으므로 `name`으로 기존 상품을 조회한다.
8. 같은 이름이 없으면 `create`, 있으면 해당 row의 상품 필드를 `update`한다.
9. 상품 저장 후 해당 `productId`의 기존 `ProductImage`를 삭제한다.
10. 대표 이미지를 `THUMBNAIL`, `sortOrder: 0`, `alt: "{상품명} 대표 이미지"`로 생성한다.
11. `additionalImages`를 배열 순서대로 `GALLERY`, `sortOrder: 1...n`, `alt: "{상품명} 상품 이미지 {순번}"`으로 생성한다.
12. 상품과 상품 이미지 저장은 하나의 Prisma transaction에서 실행한다.

## 7. 이미지 URL 처리

이미지 경로는 환경 변수 `PRODUCT_IMAGE_BASE_URL`로 제어한다.

```
# 로컬 개발 (기본값, .env 설정 불필요)
PRODUCT_IMAGE_BASE_URL=/image/products

# 서버/스테이징 (S3, CDN 등)
PRODUCT_IMAGE_BASE_URL=https://cdn.example.com/products
```

- 환경 변수 미설정 시 `/image/products`를 기본값으로 사용한다.
- 로컬 이미지는 `public/image/products/`에 저장하며 `scripts/download-product-images.sh`로 다운로드한다.
- `additionalImages`에는 대표 이미지를 제외한 상품 갤러리 이미지를 최대 4개까지 기록한다.
- 상세 페이지에 별도 갤러리 이미지가 없으면 빈 배열을 기록한다.
- `Product.image`는 기존 목록 API 호환성을 위해 유지한다.
- 대표 이미지는 `ProductImage`에도 `THUMBNAIL`로 저장한다.
- 추가 이미지는 `ProductImage`에 `GALLERY`로 저장한다.
- seed 재실행 시 해당 상품의 기존 이미지 rows를 삭제한 뒤 현재 문서 기준으로 다시 생성한다.

## 8. 구현 대상

계획 실행 시 아래 파일만 변경한다.

- 수정: `scripts/seed-appliance-depth3-products.mjs`
  - 새 계획서 경로 사용
  - 카테고리 ID와 계층 검증
  - 브랜드 upsert
  - `name` 기준 create/update
  - 대표 이미지와 추가 이미지를 `ProductImage`에 저장
  - 재실행 시 기존 상품 이미지 삭제 후 재생성
  - 외부 이미지 URL 사전 검증
- 생성: `scripts/lib/seed-product-images.mjs`
  - 대표 이미지와 추가 이미지를 `ProductImage.createMany` 데이터로 변환
  - 카테고리 ID와 계층 검증
- 생성: `scripts/lib/seed-product-images.test.mjs`
  - 이미지 타입, 순서, 대체 텍스트, 카테고리 계층 검증
- 유지: `prisma/schema.prisma`
  - 현재 스키마 변경 없음

## 9. 검증 기준

seed 실행 후 아래 조건을 모두 확인한다.

- 후보 데이터 15개가 파싱된다.
- 일반세탁기 `categoryId = 36` 상품이 5개 존재한다.
- 드럼세탁기 `categoryId = 37` 상품이 5개 존재한다.
- 의류관리기 `categoryId = 38` 상품이 5개 존재한다.
- 생성된 모든 상품의 `brandId`와 `categoryId`가 `null`이 아니다.
- 각 상품에 `THUMBNAIL` 이미지가 정확히 1개 존재한다.
- `THUMBNAIL.sortOrder`는 0이다.
- `GALLERY.sortOrder`는 1부터 연속적으로 증가한다.
- 상품별 `ProductImage` 개수는 `1 + additionalImages.length`다.
- `price`는 0보다 크다.
- `originalPrice`는 `price` 이상이다.
- `badge`는 `BEST`, `NEW`, `null` 중 하나다.
- 같은 seed를 두 번 실행해도 상품 row가 중복 생성되지 않는다.
- 같은 seed를 두 번 실행해도 상품 이미지 row가 중복 생성되지 않는다.
- 두 번째 실행 결과는 신규 생성 0개, 기존 상품 갱신 15개다.
