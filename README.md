# is-06-backend-project-task-starter

Day 6 **homework starter** for the Agentic IDE workshop series — "Working with the Backend".

A Next.js 16 + Vercel + Neon + Drizzle + Better Auth + Zod + Vitest scaffold. Auth is wired. The database adapter is wired. The health probe works. The CI pipeline is wired. CodeRabbit is wired. **Your job is the domain.**

> Reference implementation: [koldovsky/is-06-backend-project](https://github.com/koldovsky/is-06-backend-project)
> Slides: [koldovsky/is-06-slidev-backend](https://github.com/koldovsky/is-06-slidev-backend)

---

## The assignment in one sentence

Pick one resource (notes / tasks / quotes / recipes / books / bookmarks / sessions ...), use AI as your junior backend engineer to ship a small REST API for it, and **prove correctness** with Vitest + CI + a green CodeRabbit review.

---

## What you must deliver

1. **Filled product brief** — `docs/prd.md` describes your resource (request/response shapes, auth model, acceptance criteria).
2. **Filled architecture doc** — `docs/ARCHITECTURE.md` describes your tables, routes, RBAC rules, and which Zod schemas live where.
3. **Schema + migration** — one new table in `lib/db/schema.ts`, one generated migration in `drizzle/`.
4. **Five route handlers** under `app/api/v1/<your-resource>/`:
   - `GET    /api/v1/<resource>` — list, paginated (`limit` ≤ 100), optional `publishedOnly` (or your equivalent).
   - `POST   /api/v1/<resource>` — create, **session required**, Zod-validated.
   - `GET    /api/v1/<resource>/:id` — read.
   - `PATCH  /api/v1/<resource>/:id` — update, **session + owner required**, Zod-validated.
   - `DELETE /api/v1/<resource>/:id` — delete, **session + admin required**.
5. **Tests** — at minimum: one happy-path test + one auth-failure test + one validation-failure test for your `POST` and `PATCH` routes.
6. **Green CI** — `npm run lint && npm run typecheck && npm run test && npm run build` all pass on the PR.
7. **Green CodeRabbit review** — every `⚠️` / `❌` from CodeRabbit's pre-merge checks addressed (or explained in a PR comment).
8. **Working preview deploy** — Vercel preview URL responds 200 on `/api/health`.

---

## Quick start

```bash
# 1. Clone & install
git clone https://github.com/koldovsky/is-06-backend-project-task-starter.git
cd is-06-backend-project-task-starter
npm install

# 2. Link to Vercel + provision Neon
npm install -g vercel
vercel link
# Vercel Dashboard → Storage → Marketplace → install Neon → Connect to project
vercel env pull .env.local

# 3. Add the auth secret locally
echo "BETTER_AUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
echo "BETTER_AUTH_URL=http://localhost:3000" >> .env.local

# 4. Run migrations
npm run db:generate
npm run db:migrate

# 5. Start dev
npm run dev          # → http://localhost:3000

# 6. Smoke test
curl http://localhost:3000/api/health
# → { "status": "ok", "db": "ok", "latencyMs": ... }
```

---

## What's already done for you

| Path                                            | What it gives you                                              |
| ----------------------------------------------- | -------------------------------------------------------------- |
| `app/api/health/route.ts`                       | Liveness + DB probe — keep it green                            |
| `app/api/auth/[...all]/route.ts`                | Better Auth catch-all (sign-up / sign-in / sign-out / session) |
| `lib/auth.ts`                                   | Better Auth config (email + password, Drizzle adapter)         |
| `lib/db/index.ts`                               | Neon HTTP client + Drizzle instance                            |
| `lib/db/schema.ts`                              | Better Auth tables (user / session / account / verification)   |
| `lib/env.ts`                                    | Zod-validated `process.env` — fails loudly on missing vars     |
| `lib/errors.ts`                                 | Typed `unauthorized()` / `forbidden()` / `notFound()` / `badRequest()` / `internalError()` |
| `lib/rbac.ts`                                   | `requireSession()` / `requireRole('admin')` / `isOwner()`      |
| `tests/setup.ts`                                | Stub env vars so unit tests don't need a real DB               |
| `tests/lib/errors.test.ts`                      | One example passing test — keep green                          |
| `.github/workflows/ci.yml`                      | Parallel lint / typecheck / test / build matrix                |
| `.coderabbit.yaml`                              | AI PR reviewer with the Day 6 backend rubric                   |
| `.cursor/mcp.json.example`                      | MCP template (filesystem, context7, postgres, github, vercel)  |
| `.agents/skills/reviewing-backend-changes/`     | The custom backend review skill                                |
| `.agents/skills/vercel-react-best-practices/`   | Vercel's Next.js / RSC performance rules                       |
| `docs/ENV.md`, `docs/SECURITY.md`               | Environment surface + security checklist                       |

---

## What you must NOT change without thinking

- `lib/auth.ts`, `lib/rbac.ts`, `lib/env.ts`, `lib/errors.ts` — these are the **security primitives**. If you find a bug, fix it; do not delete safety checks to make the agent's code compile.
- `tests/setup.ts` — the stub env vars are there so tests don't need a real Neon. If you need real-DB integration tests, add them in a separate `tests/integration/` folder gated by `INTEGRATION=1`.
- `.coderabbit.yaml` pre-merge checks — these are the bar. You can add more, you cannot loosen them.
- The Better Auth tables (`user` / `session` / `account` / `verification`) in `lib/db/schema.ts` — Better Auth's adapter expects these exact names. Add a column if you need to, do not rename or wrap.

---

## Recommended order of work

1. Read `AGENTS.md` end to end.
2. Fill `docs/prd.md` and `docs/ARCHITECTURE.md` **before** writing any code.
3. Add your domain table to `lib/db/schema.ts`. Run `npm run db:generate` and `npm run db:migrate`.
4. Add Zod schemas in `lib/validation/<resource>.ts`.
5. Implement `app/api/v1/<resource>/route.ts` (list + create). Then `[id]/route.ts` (read + update + delete).
6. Write tests as you go.
7. Run the full local gate: `npm run lint && npm run typecheck && npm run test && npm run build`.
8. Open the PR. Fix CodeRabbit findings. Iterate until green.

---

## Useful commands

```bash
npm run dev              # dev server (Turbopack)
npm run build            # production build
npm run lint             # eslint
npm run typecheck        # tsc --noEmit
npm run test             # vitest run
npm run test:watch       # vitest watch
npm run db:generate      # drizzle-kit generate (after editing schema)
npm run db:migrate       # drizzle-kit migrate
npm run db:push          # drizzle-kit push (scratch DBs only)
```

---

## License

MIT — same as the parent workshop materials.
