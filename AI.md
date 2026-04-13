# AI.md — xiaochen.dev/tools

> Universal coding conventions for AI assistants.
> Tool-specific wrappers: `CLAUDE.md`, `.github/copilot-instructions.md`, `.cursorrules`, `.windsurfrules`

---

## Project Overview

Developer tools site built with Next.js 15 + React 19. Each tool runs **entirely client-side** — no backend, no server API routes. Deployed to **Cloudflare Pages** or **Vercel**.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3 + `@tailwindcss/typography` |
| UI Components | shadcn/ui + Radix UI primitives |
| Theme | next-themes — system / light / dark, toggled via `class` on `<html>` |
| Fonts | Geist Sans + Geist Mono via `next/font/google` |

---

## Server vs Client Components

Deployed targets (Cloudflare Pages Edge Runtime + Vercel) both support React Server Components.

- Page shells, layouts, static wrappers → **Server Components** (no directive)
- `useState`, `useEffect`, event handlers, browser APIs → **`'use client'`**
- Server code must be **Edge-compatible** — no Node.js-only APIs (`fs`, `crypto`, `path`, etc.)
- Push `'use client'` boundary as far down (leaf) as possible

---

## Styling

- **Tailwind only** — no CSS modules, no `style={{}}`, no styled-components
- **Color scheme:** slate grays (`slate-100`–`slate-900`) for surfaces; `blue-500`/`blue-600` for accents
- **Dark mode:** always add `dark:` variants for every color-dependent class
- **Responsive:** mobile-first; `lg:` breakpoints for two-column layouts (`grid-cols-1 lg:grid-cols-2`)
- **Cards:** `backdrop-blur-sm` + semi-transparent bg for glass-morphism effect
- **Markdown content:** `prose dark:prose-invert`

---

## shadcn/ui

- Install via `npx shadcn@latest add <component>` — never copy-paste component code manually
- Use shadcn for Button, Input, Textarea, Select, Tabs, etc. wherever they fit
- Override styles with Tailwind `className` props, not by editing component source
- Don't wrap shadcn components in unnecessary extra divs

---

## Tool Structure

**Embedded tool** (shown in homepage grid):
```
src/components/MyTool.tsx     ← 'use client', self-contained
src/app/page.tsx              ← imports and renders it
```

**Full-page tool** (needs more screen real estate):
```
src/app/my-tool/page.tsx      ← Server Component shell (exports metadata)
src/app/my-tool/MyTool.tsx    ← 'use client', actual interactive logic
```

---

## Tool Component Conventions

- **Real-time:** process in `onChange`, not behind a submit button
- **Bidirectional:** encode ↔ decode tools keep both sides in sync
- **Errors:** catch and show inline user-friendly messages; don't rely on `console.error` alone
- **Copy button:** every output section gets a copy-to-clipboard button
- **Empty input:** show a placeholder or hint — don't show an error for empty state
- **Client-only:** no external network calls; all processing happens in the browser

---

## File & Naming Conventions

- Components: `PascalCase.tsx`
- Pages: `page.tsx` (Next.js convention)
- Utilities/helpers: `camelCase.ts` under `src/lib/`
- Named exports for shared components; default export for page files

---

## What to Avoid

- No `console.log` debug statements left in committed code
- No heavy libraries for simple tasks (no lodash for array utilities, etc.)
- No `any` in TypeScript — use proper types or `unknown`
- No animations/transitions unless they serve a clear UX purpose
- No speculative abstractions — don't build helpers for hypothetical reuse
