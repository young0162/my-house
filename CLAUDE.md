# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

## gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

If gstack skills aren't working, run `cd .claude/skills/gstack && ./setup` to build the binary and register skills.

### Available skills

/office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review, /design-consultation,
/review, /ship, /land-and-deploy, /canary, /benchmark, /browse, /qa, /qa-only, /design-review,
/setup-browser-cookies, /setup-deploy, /retro, /investigate, /document-release, /codex, /cso,
/autoplan, /careful, /freeze, /guard, /unfreeze, /gstack-upgrade


# 기본 코드 컨벤션

- 모든 Icon 컴포넌트는 Icon을 import 해서 사용하는 방식으로 만들고 분리할것
- 모든 텍스트는 Text 컴포넌트를 이용할것
- 모든 컴포넌트는 export default function 이 아닌 arrow function 방식으로 만들것
- 모든 태그들은 기본적으로 시맨틱 태그 규칙을 따를것, 하지만 링크 태그들은 next.js에 Link를 사용할것
- 타입들은 사용하는 도메인 별로 types/ 하위에 분리할것
- 상수들은 constants 하위에 도메인 별로 정리할것
- 모든 컴포넌트는 components/ 하위에 만들것
- 컴포넌트의 경로는 하나의 도메인 에서만 사용하는것이면 {도메인명}/ 하위에 만들것
- 여러곳에서 사용하는 공통적인 컴포넌트이면 Common/ 하위에 만들것
- 컴포넌트의 폴더구조는 해당 기능의 PascalCase로 폴더를 만들고 그 폴더 내부에 index.tsx로 컴포넌트 파일을 만들것
- scss 파일은 사용하고 있는 .tsx에 파일명을 따를것 예를들어서 normal.tsx 에서는 normal.module.scss 라고 명명 지어서 사용할것
- 실행할 작업들을 순서별로 보여주고 더 추가할 코멘트나 수정사항은 없는지 한번더 물어봐줘


# DB 명명 규칙
- DB Column 명은 snake_case를 사용할것
- schema.prisma 에서는 snake_case를 변환해서 camelCase로 사용할것 