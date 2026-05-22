---
name: reviewing-backend-changes
description: Review backend changes (Next.js route handlers, Server Actions, Drizzle schema, migrations, env vars, Zod schemas, tests) for the Day 6 workshop stack. Use when reviewing PRs or local diffs that touch `app/api/**`, `lib/**`, `drizzle/**`, `.env*`, or any server-side TypeScript.
metadata:
  author: is-06-backend-project
  version: "1.0.0"
---

# Reviewing Backend Changes

A focused review skill for the Day 6 reference stack: **Next.js 16 (App Router) + Vercel + Neon Postgres + Drizzle ORM + Better Auth + Zod + Vitest + GitHub Actions + CodeRabbit**.

## When To Apply

Trigger this skill when:

- Reviewing a PR or local diff that touches any of: `app/api/**/route.ts`, `app/**/actions.ts`, `lib/**`, `drizzle/**`, `.env*`, `.github/workflows/**`, `.cursor/mcp.json*`.
- A user asks "review my backend", "check this route", "audit this endpoint", "is this safe?", "is this production-ready?".
- Before merging any backend PR.

## The 12 Backend Mistakes To Hunt For

For each changed file, walk this checklist. Output findings in `file:line — finding` format and assign one of `✅ ok`, `⚠️ minor`, `❌ blocker`.

1. **Missing auth on a mutation** — Any `POST`/`PATCH`/`PUT`/`DELETE` route handler or Server Action that hits the DB without calling `requireSession()` / `requireRole(...)` first. **Blocker.**
2. **Trusting client-supplied owner id** — Search for `body.userId`, `data.userId`, `input.userId`, `params.userId` used as the OWNER of a created/updated row. The owner must come from `session.user.id`. **Blocker (IDOR).**
3. **No input validation** — `await req.json()` (or query-string read) whose value goes straight into a DB write without passing through a Zod schema. **Blocker.**
4. **Hardcoded secrets** — Literal-looking secrets in `.env.example`, `.cursor/mcp.json.example`, `vercel.json`, workflows, or anywhere committed. **Blocker.**
5. **`process.env.X!` outside `lib/env.ts`** — All env access must go through the Zod-validated `env` object. **Minor → blocker if it's a secret.**
6. **N+1 queries** — `.map(async ...)` over a result set running a query per item. Suggest a join / `inArray()` / Drizzle relation. **Minor → blocker if list size is unbounded.**
7. **No transactions for multi-step writes** — Two or more DB writes that must be atomic should use `db.transaction(async tx => ...)`. **Minor → blocker for money / inventory.**
8. **Leaking internals on error** — `error.stack`, raw SQL, env values returned to the client. All errors should funnel through `lib/errors.ts`. **Blocker.**
9. **Returning sensitive fields** — `password`, `passwordHash`, raw tokens, full session rows in API responses. **Blocker.**
10. **No rate limiting on auth endpoints** — Sign-in / sign-up / password-reset without rate limits = credential stuffing target. **Minor (note for follow-up).**
11. **Sequential `await` chains** — Three independent `await db.select...` calls in a row that could be `Promise.all`. **Minor.**
12. **`console.log(session)` / `console.log(user)` / `console.log(body)`** — secrets and PII in your log aggregator forever. **Blocker.**

## Migration-Specific Checks (`drizzle/*.sql`)

- `DROP COLUMN` / `DROP TABLE` without an explicit comment justifying the data loss → **blocker**.
- New `NOT NULL` column added to an existing table without a `DEFAULT` or backfill step → **blocker** (will fail on prod data).
- Foreign keys without `ON DELETE` → **minor** (ask: cascade, set null, or restrict?).
- Index dropped on a high-traffic table → **blocker** unless replaced.

## Test-Specific Checks (`tests/**`)

For any non-trivial endpoint, verify at least these three tests exist (in this file or a sibling):

1. **Happy path** — a valid request returns the expected response.
2. **Unauthorized** — a request without a session returns 401.
3. **Validation failure** — a request with an invalid body returns 400.

If fewer than two of these exist, flag `⚠️ insufficient test coverage`.

## CI-Specific Checks (`.github/workflows/*`)

- `lint`, `typecheck`, `test`, `build` all wired (parallel matrix is OK).
- No secrets passed as plain `env:` literals — use `${{ secrets.X }}`.
- Node version pinned (not `node-version: latest`).
- `actions/checkout@v4` (or current), not `v1`/`v2`.

## Output Format

After walking the diff, produce two sections:

### Summary

```
✅ N findings · ⚠️ M findings · ❌ K findings
```

### Findings

```
app/api/v1/posts/route.ts:42 — ❌ POST handler does not call requireSession() before db.insert.
lib/env.ts:9 — ⚠️ BETTER_AUTH_SECRET min length is 16, recommend 32.
drizzle/0002_add_role.sql:7 — ❌ Adds NOT NULL `role` column with no DEFAULT → existing rows will fail.
```

End with a single recommendation: **MERGE**, **REQUEST CHANGES**, or **BLOCK**.

## Related Resources

- `docs/SECURITY.md` — the human-readable security model for this repo.
- `.coderabbit.yaml` — the same checks encoded as automated pre-merge rules.
- `docs/ARCHITECTURE.md` — the layer contract (HTTP → validation → auth → DB).
