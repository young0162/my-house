# My House

오늘의집을 모델로 한 풀스택 인테리어 쇼핑몰 클론 프로젝트입니다. 상품 탐색부터 장바구니, 결제, 주문 관리, 리뷰 작성까지 실제 이커머스 플로우를 구현합니다.

## 목차

- [기술 스택](#기술-스택)
- [주요 기능](#주요-기능)
- [아키텍처](#아키텍처)
- [DB 시드 데이터](#db-시드-데이터)
- [사용 가능한 스크립트](#사용-가능한-스크립트)

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Auth** | NextAuth v5 (beta) — 이메일/소셜 로그인 |
| **Database** | MySQL (Prisma ORM) |
| **ORM** | Prisma 6 |
| **상태 관리** | Zustand 5 |
| **스타일링** | SCSS Modules + SCSS 전역 변수 |
| **HTTP 클라이언트** | Axios |
| **주소 검색** | react-daum-postcode |

---

## 주요 기능

- **홈 / 상품 탐색** — 카테고리 트리 탐색, 상품 목록 및 상세 페이지
- **장바구니** — 옵션별 담기, 수량 조절, 헤더 뱃지 실시간 반영 (Zustand)
- **결제 플로우** — 체크아웃 → 주문자 정보 입력 → 배송지 선택/등록 → 결제 완료
- **주문 내역** — 주문 목록, 주문 상세, 배송 상태 표시
- **마이페이지** — 프로필, 나의 쇼핑, 리뷰 관리 (리뷰 남기기 / 내가 남긴 리뷰)
- **리뷰 시스템** — 주문 아이템별 리뷰 작성 (작성 완료 시 "리뷰쓰기" 버튼 자동 숨김)
- **주소 관리** — 배송지 등록/수정/삭제, 기본 배송지 설정

---

## 아키텍처

### 디렉터리 구조

```
my-house/
├── app/
│   ├── api/                    # Route Handlers
│   │   ├── auth/               # NextAuth 엔드포인트
│   │   ├── cart/               # 장바구니 CRUD
│   │   ├── checkouts/          # 체크아웃 생성/조회
│   │   ├── me/                 # 내 정보 / 주소
│   │   ├── orders/             # 주문 생성/조회
│   │   ├── products/           # 상품 목록/상세
│   │   └── reviews/            # 리뷰 작성/조회
│   ├── cart/                   # 장바구니 페이지
│   ├── checkout/               # 결제 페이지
│   ├── login/ signup/          # 인증 페이지
│   ├── my/                     # 마이페이지
│   │   ├── shopping/           # 주문 내역
│   │   ├── review/             # 리뷰 관리
│   │   └── profile/            # 프로필
│   ├── order/                  # 주문 상세 / 주문 완료
│   └── product/                # 상품 상세 페이지
├── components/
│   ├── Common/                 # 공통 컴포넌트 (Header, Footer, Text, Icon 등)
│   ├── Cart/                   # 장바구니 컴포넌트
│   ├── Checkout/               # 결제 플로우 컴포넌트
│   ├── Home/                   # 홈/카테고리 컴포넌트
│   ├── MyPage/                 # 마이페이지 컴포넌트
│   ├── Order/                  # 주문 컴포넌트
│   ├── Product/                # 상품 컴포넌트
│   └── Review/                 # 리뷰 컴포넌트
├── services/
│   ├── {domain}.api.ts         # 클라이언트 → API (axios)
│   └── {domain}.db.ts          # 서버 → DB (Prisma)
├── types/                      # 도메인별 TypeScript 타입
├── constants/                  # 도메인별 상수
├── store/
│   └── cartStore.ts            # Zustand 장바구니 상태
├── styles/
│   └── color_variables.scss    # 전역 색상 변수
├── lib/
│   ├── prisma.ts               # Prisma 클라이언트 싱글톤
│   ├── api.ts                  # Axios 인스턴스 (baseURL: /api)
│   └── auth/                   # NextAuth 설정 및 어댑터
├── prisma/
│   ├── schema.prisma           # DB 스키마
│   └── migrations/             # 마이그레이션 히스토리
└── scripts/                    # DB 시드 스크립트
```

### API/DB 레이어 분리 원칙

클라이언트/서버 코드를 엄격하게 분리합니다:

```
클라이언트 컴포넌트
  → services/{domain}.api.ts   (axios)
  → app/api/* Route Handler    (인증 + 파라미터 파싱)
  → services/{domain}.db.ts    (Prisma 쿼리 + ViewModel)
  → MySQL

서버 컴포넌트 / Server Action
  → services/{domain}.db.ts
  → MySQL
```

| 파일 | 역할 |
|------|------|
| `*.api.ts` | axios 호출만. Prisma/DB import 금지 |
| `*.db.ts` | Prisma 쿼리, ViewModel 조립, 비즈니스 로직 |
| Route Handler | 인증(`auth()`), 파라미터 파싱, 응답 포맷만 |


### 인증

- **이메일 로그인** — bcryptjs 해시 기반 자격증명 인증
- **소셜 로그인** — Kakao, Naver, Google, Apple (NextAuth OAuth)
- **세션** — JWT 기반, `UserRole` (USER / ADMIN) 포함

---


## DB 시드 데이터

스크립트는 `scripts/` 디렉터리에 있으며, **아래 순서대로** 실행해야 외래 키 오류가 없습니다.

```bash
# 1단계: 브랜드
node scripts/seed-brand.mjs

# 2단계: 카테고리 트리 (depth 1~3)
node scripts/seed-category.mjs

# 3단계: 상품 옵션 타입/값
node scripts/seed-size-option.mjs
node scripts/seed-color-option.mjs

# 4단계: 상품 데이터
node scripts/seed-furniture-bed-depth4-products.mjs
node scripts/seed-furniture-spring-mattress-products.mjs
node scripts/seed-appliance-depth3-products.mjs

# 5단계: 상품 이미지 로컬 저장 (선택)
bash scripts/download-product-images.sh
```

---

## 사용 가능한 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (localhost:3000) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run tunnel` | SSH 터널 열기 (원격 DB 접근) |
| `npm run tunnel-check` | 터널 연결 확인 |
| `npx prisma migrate dev` | DB 마이그레이션 실행 |
| `npx prisma migrate reset` | DB 초기화 후 재마이그레이션 (데이터 삭제) |
| `npx prisma studio` | Prisma Studio GUI 열기 |
| `npx prisma generate` | Prisma 클라이언트 재생성 |

---