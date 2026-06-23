---
name: ohouse-product-research
description: 카테고리를 알려주면 오늘의집(ohou.se) 사이트에서 해당 카테고리별로 5개씩 상품 데이터를 조사해서 docs/db_seed/product/ 에 seed 계획 파일로 저장하고, 상품 이미지를 public/image/products/ 에 다운로드하는 스킬입니다. "오늘의집 상품 조사", "오늘의집에서 소파 찾아줘", "카테고리 상품 데이터 수집", "seed 데이터 만들어줘", "상품 이미지 다운로드" 등의 요청에 반드시 이 스킬을 사용하세요.
---

사용자가 카테고리(들)를 알려주면 오늘의집에서 상품을 조사하고 seed 계획 파일을 생성한 뒤 이미지를 다운로드합니다.

## 사전 준비

작업 전에 아래를 확인합니다.

1. `prisma/schema.prisma`에서 `Product`, `ProductImage`, `Category`, `Brand` 모델 구조 확인
2. `docs/db_seed/product/` 의 기존 파일들을 1~2개 열어 파일 형식 파악
3. `scripts/download-product-images.sh` 구조 파악 (이미지 다운로드 방식)
4. 사용자가 지정한 카테고리의 DB 카테고리 ID와 depth를 확인 (기존 seed 파일 또는 `scripts/seed-category.mjs` 참고)

## Step 1: 오늘의집 상품 조사

각 카테고리마다 `/browse` 스킬을 사용해 오늘의집에서 상품을 검색합니다.

### 검색 URL 패턴

```
https://ohou.se/search/index?query={검색어}
```

카테고리 이름을 한글로 URL 인코딩해서 사용합니다. 예:
- 소파 → `https://ohou.se/search/index?query=%EC%86%8C%ED%8C%8C`
- 식탁 → `https://ohou.se/search/index?query=%EC%8B%9D%ED%83%81`

상품 상세 페이지 URL 패턴:
```
https://ohou.se/productions/{상품ID}/selling
```

### 수집할 데이터 (상품 1개당)

검색 결과 목록과 개별 상품 상세 페이지를 함께 조회하여 아래 데이터를 수집합니다.

| 필드 | 설명 | 비고 |
|------|------|------|
| `name` | 상품명 (전체 제목) | 필수 |
| `brandLookupName` | 브랜드명 | 필수 |
| `price` | 판매가 (원 단위 정수) | 필수 |
| `originalPrice` | 정상가 (할인 전 가격) | 없으면 `null` |
| `isFreeShipping` | 무료배송 여부 | `true`/`false` |
| `description` | 상품 간단 설명 1~2줄 | 상품명 기반으로 작성 가능 |
| `image` URL | 대표 썸네일 이미지 URL | CDN URL |
| `additionalImages` URLs | 추가 갤러리 이미지 URL 배열 | 최대 4개, 없으면 `[]` |
| `stock` | seed용 재고 수 | 카테고리별 분산 배정 (10~100) |
| `badge` | `"BEST"`, `"NEW"`, `null` | 각 카테고리에 1~2개만 배정 |
| `isActive` | `true` (기본) | 2~3개만 `true`, 나머지 `false` 배정 가능 |

### 오늘의집 CDN URL 패턴

수집한 이미지 URL이 아래 도메인 중 하나인지 확인합니다.
- `https://image.ohousecdn.com/...`
- `https://prs.ohousecdn.com/...`
- `https://prs.ohou.se/...`
- `https://prs.ohouse.com/...`

## Step 2: 파일명 생성

seed 계획 파일명 규칙:
```
{YYYY-MM-DD}_{도메인영문}_{카테고리영문}_product_seed_plan.md
```

예시:
- `2026-06-23_furniture_sofa_product_seed_plan.md`
- `2026-06-23_appliance_refrigerator_product_seed_plan.md`

이미지 파일명: URL의 basename을 그대로 사용합니다. 단, bed 계열처럼 의미있는 이름이 필요하면 `{category-slug}-{brand}-{model}.webp` 패턴도 사용합니다.

## Step 3: seed 계획 파일 작성

`docs/db_seed/product/{파일명}.md`에 아래 형식으로 저장합니다.

````markdown
# {카테고리명} 상품 Seed 계획

> 작성일: {YYYY-MM-DD}

## 1. 범위

대상 카테고리:

```text
{부모카테고리} (#{id}, depth={n})
└── {카테고리명} (#{id}, depth={n})
```

## 2. 조사 기준

조사일은 {YYYY년 MM월 DD일}이다.

- 오늘의집 검색 결과에서 브랜드, 상품명, 판매가, 대표 이미지 URL을 확인했다.
- `image`는 오늘의집 CDN HTTPS URL을 저장한다.
- 가격은 조사 시점의 값이며 이후 변경될 수 있다.

참고 페이지:
- {카테고리명}: `{검색 URL}`

## 3. 상품 후보 데이터

```js
const IMAGE_BASE_URL = process.env.PRODUCT_IMAGE_BASE_URL ?? "/image/products";

const {camelCaseCategory}ProductSeedCandidates = [
  // {카테고리명} (categoryId: {id})
  {
    image: `${IMAGE_BASE_URL}/{파일명.확장자}`,
    additionalImages: [
      `${IMAGE_BASE_URL}/{파일명.확장자}`,
    ],
    brandLookupName: "{브랜드명}",
    categoryId: {id},
    name: "{상품명}",
    description: "{설명}",
    price: {가격},
    originalPrice: {정상가 또는 null},
    isFreeShipping: {true/false},
    isActive: true,
    stock: {재고},
    badge: {null 또는 "BEST" 또는 "NEW"},
  },
  // ... 5개
];
```

## 4. 이미지 URL 목록

수집한 이미지 URL을 기록해둡니다 (참고용, sh 파일에 추가하지 않음).

```bash
# {카테고리명} (categoryId: {id})
# {상품명}
"{이미지URL}"
"{추가이미지URL}"
```
````

## Step 4: 이미지 다운로드

curl로 직접 다운로드합니다. `scripts/download-product-images.sh`에는 추가하지 않습니다 — sh 파일은 최초 1회용 기록이고, 이후 조사분은 curl로 직접 처리합니다.

```bash
mkdir -p public/image/products

curl -fsSL -o "public/image/products/{basename}" "{imageUrl}"
curl -fsSL -o "public/image/products/{basename}" "{additionalImageUrl}"
# ...
```

이미 파일이 존재하면 건너뜁니다.

```bash
# 파일이 없을 때만 다운로드
[ -f "public/image/products/{basename}" ] || curl -fsSL -o "public/image/products/{basename}" "{imageUrl}"
```

다운로드 후 확인합니다.

```bash
ls public/image/products/ | grep "{파일명패턴}"
```

## Step 5: 완료 보고

작업 완료 후 아래를 보고합니다.

1. 생성된 seed 파일 경로
2. 카테고리별 수집된 상품 수
3. 다운로드된 이미지 수 / 전체 이미지 수
4. 실패한 이미지가 있으면 URL 목록

## 옵션 연결 (상품에 옵션이 있는 경우)

상품에 사이즈나 색상 옵션이 있으면 seed 후보 데이터에 `optionValues` 필드를 추가합니다.  
**DB에 이미 존재하는 값만 연결할 수 있습니다.** 새로운 옵션 타입이나 값을 만들지 않습니다.

### DB에 존재하는 옵션값

```text
사이즈
  MS(미니싱글)
  S(싱글)
  SS(슈퍼싱글)
  Q(퀸)
  K(킹)
  LK(킹)
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

### optionValues 작성 방법

오늘의집 상품 상세에서 노출되는 옵션을 확인한 뒤, 위 목록과 **정확히 일치하는 값만** 연결합니다.  
상품명에 표기된 사이즈(예: `S/SS/Q/K`)를 기준으로 매핑해도 됩니다.  
색상은 실제 오늘의집 옵션 대신 seed 기능 검증용으로 적당히 배정해도 됩니다.

```js
{
  // ...다른 필드들...
  optionValues: {
    "사이즈": ["S(싱글)", "SS(슈퍼싱글)", "Q(퀸)", "K(킹)"],
    "색상": ["화이트", "베이직"],
  },
}
```

옵션이 없는 카테고리(매트리스 등)는 `optionValues` 필드 자체를 생략합니다.

## 주의사항

- `/browse` 스킬로 오늘의집 페이지를 열 때 로그인이 필요한 경우 검색 결과 목록만으로도 충분한 데이터를 수집할 수 있습니다.
- 이미지 URL이 만료되거나 접근 불가한 경우 해당 상품의 `additionalImages`를 빈 배열로 처리합니다.
- 정상가(`originalPrice`)가 검색 결과에 표시되지 않으면 `null`로 설정합니다.
- seed 파일의 JS 배열 변수명은 카테고리명을 camelCase 영문으로 표현합니다 (예: `sofaProductSeedCandidates`).
- 카테고리 DB ID를 모를 경우 `scripts/seed-category.mjs` 또는 기존 seed 파일을 참고하거나 사용자에게 확인합니다.
