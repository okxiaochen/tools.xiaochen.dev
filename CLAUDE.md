# CLAUDE.md — xiaochen.dev/tools

Developer tools site built with Next.js 15 + React 19. Each tool runs entirely client-side (no backend); the site is deployed to **Cloudflare Pages** or **Vercel**.

---

## Tech Stack

| Layer | Library / Version |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3 + `@tailwindcss/typography` |
| UI Components | shadcn/ui + Radix UI primitives |
| Theme | next-themes (system / light / dark, toggle via class) |
| Fonts | Geist Sans + Geist Mono (via `next/font/google`) |

---

## Server vs Client Components

Deployed to Cloudflare Pages (Edge Runtime) and Vercel — both support React Server Components.

**Rules:**
- Page shells, layouts, and static wrappers → **Server Components** (no directive needed)
- Anything with `useState`, `useEffect`, event handlers, browser APIs → **`'use client'`**
- Server-side code must be **Edge-compatible**: no Node.js-only APIs (`fs`, `crypto`, `path`, etc.)
- Prefer keeping the `'use client'` boundary as low (leaf) as possible

---

## Styling

- **Only Tailwind classes** — no CSS modules, no inline `style={{}}`, no styled-components
- **Color scheme:** slate grays (`slate-100` … `slate-900`) for surfaces, `blue-500`/`blue-600` for accents
- **Always add `dark:` variants** for every color-dependent class
- **Responsive:** mobile-first; use `lg:` breakpoints for two-column layouts (`grid-cols-1 lg:grid-cols-2`)
- **Cards:** `backdrop-blur-sm` + semi-transparent background for glass-morphism effect
- **Typography:** `prose dark:prose-invert` for rendered markdown content

---

## shadcn/ui

- Install components via `npx shadcn@latest add <component>` — do **not** copy-paste component code manually
- Use shadcn components wherever they cover the use case (Button, Input, Textarea, Select, Tabs, etc.)
- Override styles with Tailwind `className` props, not by editing component source
- Do not wrap shadcn components in unnecessary extra divs

---

## Tool Structure

Two patterns depending on complexity:

**Embedded tool** (shown on homepage grid):
```
src/components/MyTool.tsx   ← 'use client', self-contained
src/app/page.tsx            ← imports and renders it
```

**Full-page tool** (needs more screen real estate):
```
src/app/my-tool/page.tsx    ← Server Component shell (metadata, layout)
src/app/my-tool/MyTool.tsx  ← 'use client', actual interactive logic
```

---

## Tool Component Conventions

- **Real-time processing:** convert/process in `onChange`, not on a submit button
- **Bidirectional state:** encode ↔ decode tools should update both directions
- **Error handling:** catch errors and show inline user-friendly messages; never `console.error` only
- **Copy button:** output sections should have a copy-to-clipboard button
- **Empty input:** validate and show a placeholder/hint, don't show error for empty state
- **No external network calls** — all processing must be client-side

---

## File & Naming Conventions

- Components: `PascalCase.tsx`
- Pages: `page.tsx` (Next.js convention)
- Utilities/helpers: `camelCase.ts` under `src/lib/`
- Prefer named exports for components used in multiple places; default export for page files

---

## What to Avoid

- Do not add `console.log` debug statements
- Do not install heavy libraries for simple tasks (e.g., don't add lodash for array utilities)
- Do not use `any` in TypeScript — use proper types or `unknown`
- Do not add animations/transitions unless they serve a clear UX purpose
