# CLAUDE.md — xiaochen.dev/tools

See [AI.md](AI.md) for full coding conventions.

---

## Claude Code–Specific Notes

- When adding a new tool, update `src/app/page.tsx` to include it in the homepage grid
- Run `next dev --turbopack` for local development
- shadcn components are installed via `npx shadcn@latest add <component>` — check `src/components/ui/` before creating custom UI primitives
