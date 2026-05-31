---
name: nextjs-scss-modules
description: Use when writing, reviewing, or refactoring Next.js component styles that use SCSS Modules, .module.scss files, Sass variables, mixins, responsive component styling, or scoped Sass styles.
---

# Next.js SCSS Modules

Use this skill for component-scoped styling in Next.js projects that use SCSS Modules.

## Rules

- Prefer `ComponentName.module.scss` or colocated `index.module.scss` following the existing project pattern.
- Do not introduce Tailwind CSS, CSS-in-JS, CSS Modules with `.module.css`, or global utility systems unless explicitly requested.
- Keep component styles scoped to the module file.
- Avoid global selectors except in global stylesheet files. If `:global(...)` is necessary, keep it narrow and explain why.
- Prefer semantic class names over visual names.
- Keep nesting shallow, ideally 2 levels or less.
- Prefer modern Sass `@use` and `@forward` over deprecated `@import` when adding shared Sass files.
- Use variables, mixins, and shared tokens from existing style files before adding new values.
- Do not create new design tokens unless the same value is reused or clearly belongs to the shared design system.
- Check duplicated spacing, color, breakpoint, shadow, and z-index values.
- Include responsive styles when layout, text wrapping, or fixed dimensions are affected.
- Avoid `!important` unless there is a clear integration reason.
- Use the existing project convention for conditional class names, such as `clsx`, `classnames`, or template literals.
- When refactoring JSX, update SCSS class names in the same change.
- When deleting classes, verify they are not used elsewhere.
- Include interaction states where relevant: hover, active, disabled, selected, and `:focus-visible`.
- Match visual states with semantic state attributes when present, such as `[aria-selected="true"]`, `[aria-expanded="true"]`, and `[disabled]`.

## Review Checklist

1. Are class names understandable and component-oriented?
2. Is the SCSS scoped to the component?
3. Is nesting shallow enough to maintain?
4. Are responsive breakpoints consistent with the project?
5. Are repeated values replaced with existing variables or tokens?
6. Are unnecessary new design tokens avoided?
7. Are unused classes removed?
8. Are conditional class names handled using the existing project convention?
9. Are interaction and accessibility states covered?
10. Is the layout safe at mobile widths?
