---
name: db-seed-products
description: docs/db_seed/product/ 의 seed 계획 파일을 읽어서 DB에 상품 데이터를 삽입하는 스킬입니다. seed 스크립트가 없으면 기존 패턴을 따라 생성하고 실행합니다. "DB에 상품 넣어줘", "seed 실행해줘", "상품 데이터 DB에 적용", "seed 파일 실행", "스프링 매트리스 seed 돌려줘" 등의 요청에 반드시 이 스킬을 사용하세요.
---

`docs/db_seed/product/` 의 seed 계획 파일을 기반으로 DB에 상품을 삽입합니다.

## 프로젝트 seed 구조 이해

이 프로젝트의 seed 흐름은 다음과 같습니다.

```
docs/db_seed/product/{날짜}_{도메인}_{카테고리}_product_seed_plan.md
    ↓ (const {변수명}ProductSeedCandidates = [...] 배열 포함)
scripts/seed-{도메인}-{카테고리}-products.mjs
    ↓ (파싱 → 검증 → upsert)
scripts/lib/seed-product-images.mjs   ← validate{Category}Categories 함수
scripts/lib/seed-runner.mjs           ← runSeed(prisma) 래퍼
```

핵심 패턴:
- 마크다운 파일 안의 JS 배열을 `vm.runInContext`로 파싱
- `Brand`를 `name` 기준으로 upsert
- `Product`를 `name` 기준으로 create/update
- `ProductImage`를 매 실행마다 교체 (deleteMany → createMany)
- 모든 DB 작업은 하나의 `prisma.$transaction` 안에서 실행
- 옵션(`optionValues`)이 있으면 `seed-product-options.mjs`도 함께 사용

## Step 1: seed 계획 파일 확인

`docs/db_seed/product/` 에서 대상 파일을 읽습니다.

파일에서 아래 정보를 파악합니다:
1. **JS 배열 변수명** — `const {변수명}ProductSeedCandidates = [`
2. **카테고리 ID 목록** — 각 후보의 `categoryId` 값들 (중복 제거)
3. **카테고리 계층** — 파일의 "범위" 섹션에 적힌 `#{id} 이름 depth={n}` 정보
4. **옵션 여부** — 후보 객체에 `optionValues` 필드가 있는지 확인
5. **예상 상품 수** — 카테고리별 5개, 총 `카테고리수 × 5`개

## Step 2: 기존 seed 스크립트 확인

`scripts/` 디렉토리를 확인하여 해당 계획 파일에 대응하는 `seed-*.mjs`가 이미 있는지 확인합니다.

**이미 있으면** → Step 4로 바로 이동합니다.

**없으면** → Step 3에서 생성합니다.

## Step 3: seed 스크립트 생성

### 3-1. scripts/lib/seed-product-images.mjs에 validate 함수 추가

파일 맨 아래에 새 카테고리 검증 함수를 추가합니다.

```js
const EXPECTED_{DOMAIN}_{CATEGORY}_CATEGORIES = [
  { id: {최상위id}, name: "{최상위명}", depth: 1, parentId: null },
  { id: {id}, name: "{이름}", depth: 2, parentId: {부모id} },
  // ... 계획 파일의 카테고리 계층 그대로
];

export const validate{Domain}{Category}Categories = (categories) => {
  for (const expected of EXPECTED_{DOMAIN}_{CATEGORY}_CATEGORIES) {
    const category = categories.find(({ id }) => id === expected.id);
    if (
      !category ||
      category.name !== expected.name ||
      category.depth !== expected.depth ||
      category.parentId !== expected.parentId
    ) {
      throw new Error(`Category mismatch: ${expected.id}`);
    }
  }
};
```

### 3-2. scripts/seed-{도메인}-{카테고리}-products.mjs 생성

기존 `seed-appliance-depth3-products.mjs`를 기준으로 아래를 수정해서 생성합니다.

```js
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import vm from "node:vm";
import { BadgeType } from "../app/generated/prisma/index.js";
import { replaceProductImages, validate{Domain}Categories } from "./lib/seed-product-images.mjs";
import { runSeed } from "./lib/seed-runner.mjs";

const PRODUCT_SEED_DOC = "docs/db_seed/product/{파일명}.md";
const ALL_CATEGORY_IDS = [{계층의 모든 id}];
const PRODUCT_CATEGORY_IDS = [{실제 상품이 들어가는 leaf id들}];

const parseProductCandidates = (filePath) => {
  const content = readFileSync(filePath, "utf8");
  // 변수명을 계획 파일의 실제 변수명으로 교체
  const match = content.match(/const {변수명}ProductSeedCandidates = \[([\s\S]*?)\];/);
  if (!match) throw new Error(`{변수명}ProductSeedCandidates block not found in ${filePath}`);

  const IMAGE_BASE_URL = process.env.PRODUCT_IMAGE_BASE_URL ?? "/image/products";
  const sandbox = { IMAGE_BASE_URL };
  vm.createContext(sandbox);
  vm.runInContext(
    `const {변수명}ProductSeedCandidates = [${match[1]}]; this.{변수명}ProductSeedCandidates = {변수명}ProductSeedCandidates;`,
    sandbox,
  );

  return sandbox.{변수명}ProductSeedCandidates.map((candidate) => ({
    ...candidate,
    image: basename(candidate.image),
    additionalImages: (candidate.additionalImages ?? []).map((url) => basename(url)),
  }));
};

const toBadgeType = (badge) => {
  if (badge === null || badge === undefined) return null;
  if (badge === "BEST") return BadgeType.BEST;
  if (badge === "NEW") return BadgeType.NEW;
  throw new Error(`Unsupported badge value: ${badge}`);
};

runSeed(async (prisma) => {
  const candidates = parseProductCandidates(PRODUCT_SEED_DOC);
  const categories = await prisma.category.findMany({
    where: { id: { in: ALL_CATEGORY_IDS } },
    select: { id: true, name: true, depth: true, parentId: true },
  });
  validate{Domain}Categories(categories);

  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const expectedDepth = {leaf depth 숫자}; // 상품이 속하는 depth

  const results = await prisma.$transaction(async (tx) => {
    const seeded = [];
    const brandCache = new Map();

    for (const candidate of candidates) {
      let brand = brandCache.get(candidate.brandLookupName);
      if (!brand) {
        brand = await tx.brand.upsert({
          where: { name: candidate.brandLookupName },
          create: { name: candidate.brandLookupName, logo: null, visible: true },
          update: { visible: true },
        });
        brandCache.set(candidate.brandLookupName, brand);
      }

      const category = categoryById.get(candidate.categoryId);
      if (!category || category.depth !== expectedDepth) {
        throw new Error(`Unsupported product category: ${candidate.categoryId}`);
      }

      const existing = await tx.product.findFirst({ where: { name: candidate.name } });
      const data = {
        image: candidate.image,
        brandId: brand.id,
        name: candidate.name,
        description: candidate.description,
        price: candidate.price,
        originalPrice: candidate.originalPrice ?? null,
        isFreeShipping: candidate.isFreeShipping,
        isActive: candidate.isActive,
        stock: candidate.stock,
        badge: toBadgeType(candidate.badge),
        categoryId: candidate.categoryId,
      };

      const product = existing === null
        ? await tx.product.create({ data })
        : await tx.product.update({ where: { id: existing.id }, data });

      const imageCount = await replaceProductImages(tx, product.id, candidate);

      seeded.push({
        id: product.id,
        name: product.name,
        categoryId: category.id,
        imageCount,
        action: existing === null ? "created" : "updated",
      });
    }

    return seeded;
  }, { timeout: 30_000 });

  console.log(JSON.stringify({
    parsed: candidates.length,
    created: results.filter((r) => r.action === "created").length,
    updated: results.filter((r) => r.action === "updated").length,
    results,
  }, null, 2));
});
```

**옵션(`optionValues`)이 있으면** seed-furniture-bed-depth4-products.mjs의 `replaceProductOptions` / `resolveExistingOptionValues` 사용 패턴을 추가합니다.

## Step 4: seed 스크립트 실행

```bash
node scripts/seed-{도메인}-{카테고리}-products.mjs
```

## Step 5: 결과 검증

실행 결과 JSON을 확인합니다.

- `parsed` = 계획 파일의 전체 상품 수
- `created` + `updated` = `parsed` 와 일치하는지 확인
- 에러가 없는지 확인

에러가 나는 경우:
- `Category mismatch` → DB의 category ID나 이름이 계획과 다름. `scripts/seed-category.mjs`가 먼저 실행됐는지 확인
- `block not found` → 계획 파일의 JS 배열 변수명이 파싱 정규식과 다름. 파일을 열어 정확한 변수명 확인
- `PRODUCT_IMAGE_BASE_URL` 관련 → 환경변수 없어도 기본값(`/image/products`)으로 동작하므로 무시해도 됨

## 주의사항

- seed 실행 전 DB 연결이 되어 있는지 확인 (`.env`의 `DATABASE_URL`)
- 같은 seed를 두 번 실행해도 상품이 중복 생성되지 않음 — `name` 기준으로 create/update
- `ProductImage`는 매 실행마다 교체되므로 이미지 URL이 바뀌었을 때도 안전하게 재실행 가능
- 이미지 파일이 `public/image/products/`에 없어도 seed는 실패하지 않음 (DB에는 파일명만 저장됨)
