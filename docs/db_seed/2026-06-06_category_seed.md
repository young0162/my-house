# Category Seed 기록

작성일: 2026-06-06

## 목적

`category_text/가구_카테고리.txt` 파일에 작성한 가구 카테고리 트리를 `Category` 테이블에 초기 데이터로 삽입했다.

## 기준 파일

- `category_text/가구_카테고리.txt`
- 들여쓰기 4칸을 기준으로 depth를 구분한다.
- 빈 줄은 seed 대상에서 제외한다.

## 파싱 규칙

```ts
indentLevel = leadingSpaces / 4
depth = indentLevel + 1
parent = 이전 줄들 중 indentLevel - 1인 가장 가까운 카테고리
sortOrder = 같은 parent 아래에서 등장한 순서, 0부터 시작
```

예시:

```text
가구                    depth=1, parentId=null
    침대                depth=2, parent=가구
        침대프레임       depth=3, parent=침대
            일반침대     depth=4, parent=침대프레임
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
  "parsed": 33,
  "created": 33,
  "reused": 0,
  "updated": 0,
  "total": 33
}
```

## 삽입된 트리

```text
가구 (#1, depth=1, sort=0)
    침대 (#2, depth=2, sort=0)
        침대프레임 (#3, depth=3, sort=0)
            일반침대 (#4, depth=4, sort=0)
            수납침대 (#5, depth=4, sort=1)
            저상형침대 (#6, depth=4, sort=2)
        침대부속가구 (#7, depth=3, sort=1)
    매트리스·토퍼 (#8, depth=2, sort=1)
        매트리스 (#9, depth=3, sort=0)
            스프링매트리스 (#10, depth=4, sort=0)
            라텍스매트리스 (#11, depth=4, sort=1)
            폼매트리스 (#12, depth=4, sort=2)
        토퍼 (#13, depth=3, sort=1)
    테이블·식탁·책상 (#14, depth=2, sort=2)
        식탁 (#15, depth=3, sort=0)
            식탁·입식테이블 (#16, depth=4, sort=0)
            홈바·아일랜드식탁 (#17, depth=4, sort=1)
            식탁+의자 (#18, depth=4, sort=2)
        책상 (#19, depth=3, sort=1)
            일반책상 (#20, depth=4, sort=0)
            좌식책상 (#21, depth=4, sort=1)
            모션·스탠딩책상 (#22, depth=4, sort=2)
    소파 (#23, depth=2, sort=3)
        일반소파 (#24, depth=3, sort=0)
        리클라이너 (#25, depth=3, sort=1)
        소파베드 (#26, depth=3, sort=2)
    선반 (#27, depth=2, sort=4)
        벽선반 (#28, depth=3, sort=0)
            무지주선반 (#29, depth=4, sort=0)
            지주선반 (#30, depth=4, sort=1)
            찬넬선반 (#31, depth=4, sort=2)
        스탠드선반 (#32, depth=3, sort=1)
        앵글·조립식선반 (#33, depth=3, sort=2)
```

## 관련 스키마

- `Category.parentId`는 self relation이다.
- 부모 카테고리가 삭제되면 자식의 `parentId`는 `NULL`로 변경된다.
- `Product.categoryId`는 nullable FK로 `Category.id`를 참조한다.

관련 migration:

- `prisma/migrations/20260606082350_category_db_init/migration.sql`

## 주의사항

- 현재 URL은 `category_id=1`처럼 `id` 기반으로 조회한다.
- `slug`는 URL 식별자로 사용하지 않으므로 nullable 상태로 둔다.
- 운영/공유 DB에서는 `migrate dev` 대신 `migrate deploy`를 사용한다.
- 향후 seed를 반복 실행해야 하면 일회성 명령 대신 `prisma/seed` 또는 `scripts/seed-category` 형태의 정식 스크립트로 분리한다.
