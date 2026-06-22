# 사이즈 Option Seed 계획

작성일: 2026-06-22

## 목적

`option_type` 테이블에 `사이즈` 옵션 타입을 만들고, 아래 침대/가구 사이즈 값을 `option_value`로 연결한다.

대상 옵션값:

- `MS(미니싱글)`
- `S(싱글)`
- `SS(슈퍼싱글)`
- `Q(퀸)`
- `K(킹)`
- `LK(라지킹)`
- `D(디럭스)`
- `Q&K(퀸&킹)`

## 관련 스키마

```prisma
model OptionType {
  id   Int    @id @default(autoincrement())
  name String @db.VarChar(100)

  productOptions ProductOption[]
  optionValues   OptionValue[]

  @@unique([name])
  @@index([name])
  @@map("option_type")
}

model OptionValue {
  id     Int    @id @default(autoincrement())
  value  String @db.VarChar(100)
  typeId Int    @map("type_id")

  type                OptionType           @relation(fields: [typeId], references: [id])
  productOptionValues ProductOptionValue[]

  @@unique([typeId, value])
  @@index([typeId])
  @@map("option_value")
}
```

## 삽입 기준

- `OptionType.name = "사이즈"`를 기준으로 옵션 타입을 식별한다.
- `OptionType.name`은 unique이므로 `upsert` 방식으로 생성/재사용한다.
- 각 옵션값은 `typeId + value` 기준으로 중복을 방지한다.
- `OptionValue`에는 표시 문자열을 그대로 저장한다.
- 약어와 한글 설명을 분리하지 않고 `MS(미니싱글)` 형태 그대로 저장한다.

## Seed 데이터

```ts
const sizeOptionSeed = {
  typeName: "사이즈",
  values: [
    "MS(미니싱글)",
    "S(싱글)",
    "SS(슈퍼싱글)",
    "Q(퀸)",
    "K(킹)",
    "LK(라지킹)",
    "D(디럭스)",
    "Q&K(퀸&킹)",
  ],
};
```

## 실행 계획

1. Prisma Client를 사용해 seed 스크립트를 작성한다.
2. `OptionType`에서 `name = "사이즈"`를 조회한다.
3. 없으면 `OptionType`을 생성하고, 있으면 기존 row를 재사용한다.
4. 생성/재사용한 `OptionType.id`를 기준으로 옵션값 8개를 순회한다.
5. 각 옵션값은 `typeId + value` 조건으로 기존 row를 찾는다.
6. 기존 row가 없으면 `OptionValue`를 생성한다.
7. 기존 row가 있으면 재사용하고 별도 업데이트는 하지 않는다.
8. 실행 후 생성/재사용 개수를 로그로 확인한다.

## 예시 구현

```ts
const optionType = await prisma.optionType.upsert({
  where: { name: "사이즈" },
  create: { name: "사이즈" },
  update: {},
});

for (const value of sizeOptionSeed.values) {
  const existing = await prisma.optionValue.findFirst({
    where: {
      typeId: optionType.id,
      value,
    },
  });

  if (!existing) {
    await prisma.optionValue.create({
      data: {
        typeId: optionType.id,
        value,
      },
    });
  }
}
```

## 검증 방법

seed 실행 후 아래 조건을 확인한다.

- `option_type` 테이블에 `사이즈`가 1개만 존재한다.
- `사이즈` 타입 아래 `option_value` 8개가 존재한다.
- 같은 `type_id` 아래 같은 `value`가 중복 생성되지 않는다.
- seed를 여러 번 실행해도 `option_type`, `option_value` row 수가 증가하지 않는다.

예상 옵션값:

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
```

## 주의사항

- 현재 스키마는 옵션값의 정렬 순서를 저장하지 않는다. 표시 순서가 중요해지면 `OptionValue`에 `sortOrder` 컬럼 추가를 검토한다.
- `MS`, `S` 같은 약어만 따로 검색/필터링해야 하면 약어 컬럼을 별도로 분리하는 설계가 필요하다.
- 특정 상품이 이 사이즈 중 일부만 사용한다면 `ProductOption`과 `ProductOptionValue`로 상품별 허용 옵션값을 연결해야 한다.
