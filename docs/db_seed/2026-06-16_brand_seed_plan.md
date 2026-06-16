# Brand Seed 계획

작성일: 2026-06-16

## 목적

`brand` 테이블에 초기 브랜드 데이터를 삽입한다.

대상 브랜드:

- 상도가구
- 까사미아
- 먼데이하우스
- 바스포르
- 크라운퍼니쳐

## 관련 스키마

```prisma
model Brand {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  logo     String?
  visible  Boolean   @default(true)
  products Product[]

  @@index([visible])
  @@map("brand")
}
```

## 삽입 기준

- `name`은 브랜드 식별값으로 사용한다.
- `Brand.name`에 `@unique`가 있으므로 같은 브랜드가 중복 생성되지 않도록 `upsert` 방식으로 처리한다.
- 초기 seed에서는 `logo = null`, `visible = true`를 사용한다.
- 이미 존재하는 브랜드는 삭제하지 않는다.
- 이미 존재하는 브랜드의 `visible`은 `true`로 갱신한다.
- 이미 존재하는 브랜드의 `logo`는 별도 이미지 정책이 정해지기 전까지 변경하지 않는다.

## 실행 계획

1. Prisma Client를 사용해 seed 스크립트를 작성한다.
2. 브랜드 이름 배열을 정의한다.
3. 각 브랜드에 대해 `name` 기준으로 `upsert`를 실행한다.
4. 신규 브랜드는 `name`, `logo: null`, `visible: true`로 생성한다.
5. 기존 브랜드는 `visible: true`만 갱신한다.
6. 실행 후 삽입/재사용 결과를 로그로 확인한다.

## 예시 구현

```ts
const brandNames = [
  "상도가구",
  "까사미아",
  "먼데이하우스",
  "바스포르",
  "크라운퍼니쳐",
];

for (const name of brandNames) {
  await prisma.brand.upsert({
    where: { name },
    create: {
      name,
      logo: null,
      visible: true,
    },
    update: {
      visible: true,
    },
  });
}
```

## 검증 방법

seed 실행 후 아래 조건을 확인한다.

- `brand` 테이블에 대상 브랜드 5개가 존재한다.
- 대상 브랜드의 `visible` 값이 `true`다.
- 같은 `name`을 가진 브랜드가 중복 생성되지 않는다.

예상 조회 결과:

```text
상도가구
까사미아
먼데이하우스
바스포르
크라운퍼니쳐
```

## 주의사항

- 운영/공유 DB에서는 `migrate dev`를 사용하지 않는다.
- `Brand.name`은 unique 컬럼이므로 seed는 반드시 `createMany` 단독 실행보다 `upsert` 방식이 안전하다.
- 브랜드 로고 경로가 확정되면 별도 seed 또는 update 작업으로 `logo`를 채운다.
