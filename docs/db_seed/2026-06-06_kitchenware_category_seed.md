# 주방용품 Category Seed 기록

작성일: 2026-06-06

## 목적

`category_text/주방용품_카테고리.txt` 파일에 작성한 주방용품 카테고리 트리를 `Category` 테이블에 seed 데이터로 삽입했다.

## 기준 파일

- `category_text/주방용품_카테고리.txt`
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
  "before": 69,
  "parsed": 45,
  "created": 45,
  "reused": 0,
  "updated": 0,
  "after": 114
}
```

## 삽입된 트리

```text
주방용품 (#70, depth=1, sort=0)
    그릇·식기 (#71, depth=2, sort=0)
        홈세트 (#72, depth=3, sort=0)
            1인세트 (#73, depth=4, sort=0)
            2인세트 (#74, depth=4, sort=1)
            4인~6인세트 (#75, depth=4, sort=2)
        접시·플레이트 (#76, depth=3, sort=1)
            접시세트 (#77, depth=4, sort=0)
            일반접시 (#78, depth=4, sort=1)
            앞접시·찬기 (#79, depth=4, sort=2)
        면기·파스타 (#80, depth=3, sort=2)
            면기 (#81, depth=4, sort=0)
            파스타볼 (#82, depth=4, sort=1)
    냄비·프라이팬·솥 (#83, depth=2, sort=1)
        냄비·프라이팬세트 (#84, depth=3, sort=0)
            냄비세트 (#85, depth=4, sort=0)
            프라이팬세트 (#86, depth=4, sort=1)
        냄비·뚝배기 (#87, depth=3, sort=1)
            편수냄비 (#88, depth=4, sort=0)
            양수냄비 (#89, depth=4, sort=1)
            뚝배기 (#90, depth=4, sort=2)
        프라이팬·그릴 (#91, depth=3, sort=2)
            일반프래이팬 (#92, depth=4, sort=0)
            웍·궁중팬 (#93, depth=4, sort=1)
            에그팬·간식팬 (#94, depth=4, sort=2)
    컵·잔·텀블러 (#95, depth=2, sort=2)
        머그컵 (#96, depth=3, sort=0)
        유리컵·물컵 (#97, depth=3, sort=1)
        맥주잔 (#98, depth=3, sort=2)
    수저·커트러리 (#99, depth=2, sort=3)
        수저·커트러리세트 (#100, depth=3, sort=0)
            한식수저세트 (#101, depth=4, sort=0)
            양식커트러리세트 (#102, depth=4, sort=1)
            도시락수저세트 (#103, depth=4, sort=2)
        숟가락·젓가락 (#104, depth=3, sort=1)
            숟가락 (#105, depth=4, sort=0)
            젓가락 (#106, depth=4, sort=1)
        수저받침·수저통 (#107, depth=3, sort=2)
            수저받침 (#108, depth=4, sort=0)
            수저통 (#109, depth=4, sort=1)
            수저집·보관함 (#110, depth=4, sort=2)
    식기건조대 (#111, depth=2, sort=4)
        이동식건조대 (#112, depth=3, sort=0)
        고정식·설치식건조대 (#113, depth=3, sort=1)
        드라잉매트·싱크롤 (#114, depth=3, sort=2)
```

## 주의사항

- 현재 URL은 `category_id=1`처럼 `id` 기반으로 조회한다.
- `slug`는 URL 식별자로 사용하지 않으므로 nullable 상태로 둔다.
- `일반프래이팬`은 기준 파일의 값을 그대로 삽입했다. 오타라면 별도 update로 수정한다.
