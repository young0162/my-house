# 가전·디지털 Category Seed 기록

작성일: 2026-06-06

## 목적

`category_text/가전·디지털_카테고리.txt` 파일에 작성한 가전·디지털 카테고리 트리를 `Category` 테이블에 seed 데이터로 삽입했다.

## 기준 파일

- `category_text/가전·디지털_카테고리.txt`
- 들여쓰기 4칸을 기준으로 depth를 구분한다.
- 빈 줄은 seed 대상에서 제외한다.

## 파싱 규칙

```ts
indentLevel = leadingSpaces / 4
depth = indentLevel + 1
parent = 이전 줄들 중 indentLevel - 1인 가장 가까운 카테고리
sortOrder = 같은 parent 아래에서 등장한 순서, 0부터 시작
```

## 삽입 방식

Prisma Client와 MariaDB adapter를 사용해 DB에 직접 삽입했다.

- 같은 `parentId` 아래 같은 `name`이 이미 있으면 기존 row를 재사용한다.
- 기존 row의 `depth` 또는 `sortOrder`가 파일과 다르면 갱신한다.
- 신규 row는 `slug = null`, `isActive = true` 기본값으로 생성한다.
- 전체 작업은 Prisma transaction 안에서 실행한다.

## 실행 결과

```json
{
  "before": 33,
  "parsed": 36,
  "created": 36,
  "reused": 0,
  "updated": 0,
  "after": 69
}
```

## 삽입된 트리

```text
가전·디지털 (#34, depth=1, sort=0)
    세탁기·건조기 (#35, depth=2, sort=0)
        일반세탁기 (#36, depth=3, sort=0)
        드럼세탁기 (#37, depth=3, sort=1)
        의류관리기 (#38, depth=3, sort=2)
    청소기 (#39, depth=2, sort=1)
        유·무선청소기 (#40, depth=3, sort=0)
        로봇청소기 (#41, depth=3, sort=1)
        스팀청소기 (#42, depth=3, sort=2)
    주방가전 (#43, depth=2, sort=2)
        토스터·와플메이커 (#44, depth=3, sort=0)
            오븐·스팀토스터 (#45, depth=4, sort=0)
            일반토스터 (#46, depth=4, sort=1)
            와플메이커 (#47, depth=4, sort=2)
        커피메이커·머신 (#48, depth=3, sort=1)
            커피머신 (#49, depth=4, sort=0)
            커피메이커·머신 (#50, depth=4, sort=1)
            그라인더 (#51, depth=4, sort=2)
        간식메이커 (#52, depth=3, sort=2)
            요거트메이커 (#53, depth=4, sort=0)
            아이스크림메이커 (#54, depth=4, sort=1)
            빙수기·제빙기 (#55, depth=4, sort=2)
    계절가전 (#56, depth=2, sort=3)
        가습기 (#57, depth=3, sort=0)
            미니·USB가습기 (#58, depth=4, sort=0)
            초음파가습기 (#59, depth=4, sort=1)
            복합식가습기 (#60, depth=4, sort=2)
        공기청정기 (#61, depth=3, sort=1)
        선풍기 (#62, depth=3, sort=2)
            스탠드형 (#63, depth=4, sort=0)
            탁상형 (#64, depth=4, sort=1)
            휴대·차량용 (#65, depth=4, sort=2)
    음향가전 (#66, depth=2, sort=4)
        이어폰 (#67, depth=3, sort=0)
        헤드셋 (#68, depth=3, sort=1)
        스피커 (#69, depth=3, sort=2)
```

## 주의사항

- 현재 URL은 `category_id=1`처럼 `id` 기반으로 조회한다.
- `slug`는 URL 식별자로 사용하지 않으므로 nullable 상태로 둔다.
- `커피메이커·머신`은 부모와 자식에 같은 이름이 있지만 `parentId`가 달라 별도 카테고리로 삽입됐다.
