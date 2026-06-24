---
name: api-db-layer
description: |
  이 프로젝트의 API/DB 레이어 아키텍처 패턴을 강제하는 스킬. 새 API Route 추가, DB 조회 작성, 클라이언트 컴포넌트에서 API 호출 교체, 새 도메인 서비스 생성 작업에 반드시 사용할 것. "API 만들어줘", "DB에서 불러와줘", "새 엔드포인트 추가", "서비스 파일 추가", "클라이언트에서 fetch 호출" 등 API나 DB 관련 작업이 언급되면 이 스킬을 적용한다.
---

# API/DB Layer Architecture

이 프로젝트는 클라이언트/서버 코드의 엄격한 분리를 유지한다.

## 아키텍처 흐름

```
클라이언트 컴포넌트 → services/{domain}.api.ts → lib/api.ts → app/api/* (Route Handler) → services/{domain}.db.ts → lib/prisma.ts

서버 컴포넌트 / Server Action → services/{domain}.db.ts → lib/prisma.ts
```

- **Route Handler**는 인증(`auth()`), 파라미터 파싱, 요청 검증, 응답 포맷만 담당한다.
- **Prisma 쿼리, ViewModel 조립, 비즈니스 로직**은 모두 `services/{domain}.db.ts`에 있다.
- **클라이언트 API 호출**은 모두 `services/{domain}.api.ts`를 통한다.

---

## import 방향 규칙

### 허용
```
Client Component  → services/{domain}.api.ts  → lib/api.ts
Route Handler     → services/{domain}.db.ts   → lib/prisma.ts
Server Component  → services/{domain}.db.ts   → lib/prisma.ts
Server Action     → services/{domain}.db.ts   → lib/prisma.ts
```

### 절대 금지
```
Client Component  → services/{domain}.db.ts   ❌
Client Component  → lib/prisma.ts             ❌
services/*.api.ts → lib/prisma.ts             ❌
services/*.api.ts → services/*.db.ts          ❌
services/*.db.ts  → lib/api.ts                ❌
Server Component  → services/{domain}.api.ts  ❌
Server Component  → fetch('/api/*')           ❌
```

---

## 파일 위치 규칙

| 파일 | 위치 | 역할 |
|------|------|------|
| 공통 axios 인스턴스 | `lib/api.ts` | `baseURL: "/api"`, `withCredentials: true` |
| 클라이언트 API 서비스 | `services/{domain}.api.ts` | axios 호출, 타입 반환 |
| 서버 DB 서비스 | `services/{domain}.db.ts` | Prisma 쿼리, ViewModel 조립 |
| 도메인 타입 | `types/{domain}/index.ts` | 요청/응답/View 타입 |

**현재 도메인 목록:** `product`, `category`, `cart`, `checkout`, `address`, `user`, `auth`

새 도메인이 추가될 때: `services/{newDomain}.api.ts`, `services/{newDomain}.db.ts`, `types/{newDomain}/index.ts` 세 파일을 세트로 만든다.

---

## 새 도메인 추가 시 작업 순서

1. `types/{domain}/index.ts` — 요청/응답/View 타입 정의
2. `services/{domain}.db.ts` — Prisma 쿼리 + ViewModel 조립
3. `app/api/{domain}/route.ts` — Route Handler (인증 + DB service 호출만)
4. `services/{domain}.api.ts` — 클라이언트용 axios 래퍼
5. 클라이언트 컴포넌트에서 `{domain}.api.ts` 호출
6. 서버 컴포넌트/Action에서 `{domain}.db.ts` 직접 호출
7. 완료 후 import 방향 검증

---

## 파일 템플릿

### `services/{domain}.db.ts`
```ts
import { prisma } from "@/lib/prisma";
import { DomainView } from "@/types/{domain}/index";

export const {domain}DbService = {
  getXxx: async (userId: string): Promise<DomainView> => {
    // Prisma 쿼리 + ViewModel map
  },
  createXxx: async (params: CreateXxxParams): Promise<DomainView> => {
    // prisma.$transaction으로 원자적 처리
  },
};
```

**주의:**
- `lib/api.ts`, `axios`, `next/headers` import 금지
- transaction 내부에서는 nested create 대신 sequential create 사용 (MariaDB 어댑터 호환성)
- soft delete 패턴: `deletedAt: new Date()` — 실제 삭제하지 않는다

### `services/{domain}.api.ts`
```ts
import { api } from "@/lib/api";
import { DomainView, CreateDomainRequest } from "@/types/{domain}/index";

export const {domain}ApiService = {
  getXxx: async (): Promise<DomainView> => {
    const res = await api.get<DomainView>("/{domain}");
    return res.data;
  },
  createXxx: async (data: CreateDomainRequest): Promise<DomainView> => {
    const res = await api.post<DomainView>("/{domain}", data);
    return res.data;
  },
};
```

**주의:**
- `lib/prisma.ts`, `*.db.ts` import 절대 금지
- response interceptor에서 `response.data` 자동 반환 설정 없으므로 `res.data` 명시 필요

### `app/api/{domain}/route.ts`
```ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/index";
import { {domain}DbService } from "@/services/{domain}.db";

export const GET = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const data = await {domain}DbService.getXxx(session.user.id);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
```

**주의:**
- `lib/prisma.ts`, Prisma 직접 import 금지
- Route Handler 내에 `findMany`, `findUnique`, `$transaction` 등 Prisma 쿼리 코드 작성 금지

---

## 기존 클라이언트 컴포넌트의 fetch 교체 패턴

기존 코드:
```ts
const res = await fetch("/api/cart");
const data = await res.json();
```

교체 후:
```ts
import { cartApiService } from "@/services/cart.api";
const data = await cartApiService.getCart();
```

에러 처리 (axios 에러 shape):
```ts
} catch (error: unknown) {
  const status = (error as { response?: { status?: number } }).response?.status;
  if (status === 401) router.push("/login");
}
```

---

## 완료 후 검증 체크리스트

```bash
# 클라이언트 컴포넌트에서 .db.ts 또는 prisma import 없는지 확인
rg -n "from \"@/services/.*\\.db\"|from '@/lib/prisma'" app components

# *.api.ts에서 prisma import 없는지 확인
rg -n "from \"@/lib/prisma\"|from '@/lib/prisma'" services --glob "*.api.ts"

# *.db.ts에서 axios import 없는지 확인
rg -n "from \"@/lib/api\"|from 'axios'" services --glob "*.db.ts"

# Route Handler에 직접 Prisma 쿼리 없는지 확인
rg -n "prisma\.|findMany|findUnique|\$transaction" app/api

# 타입 검사
npx tsc --noEmit
```

---

## 주의사항 (프로젝트 특이사항)

- **MariaDB 어댑터**: Prisma `$transaction` 내부에서 nested create (relation data 중첩) 사용 시 에러 발생. sequential create로 분리할 것.
- **soft delete**: `UserAddress` 등 삭제 시 `deletedAt: new Date()` 사용. `prisma.delete()` 사용 금지.
- **auth adapter**: `lib/auth/prisma-adapter.ts`의 Prisma 사용은 NextAuth 인프라이므로 이 규칙 예외.
- **seed route**: `app/api/products/seed/route.ts`는 개발용이므로 직접 Prisma 사용 허용.
- **응답 shape**: 기존 프론트가 기대하는 응답 shape을 우선 유지. 포맷 통일은 별도 작업.
