---
name: code-convention
description: 코드 컨벤션
---

# 규칙

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
