# Security Model — `is-06-backend-project`

> The single most important rule: **auth and validation belong inside every mutation, not in middleware or a layout.** Route handlers and Server Actions are public endpoints. There is no "private" server function in Next.js.

## Trust boundaries

| Boundary                | Trusted?                  | Mitigation                                  |
| ----------------------- | ------------------------- | ------------------------------------------- |
| Public internet → HTTP  | no                        | Zod on every input; auth inside every mutation |
| Authenticated user → session | partially            | `session.user.id` for ownership; role checks for privilege |
| Vercel build → process.env | yes (per-environment)  | `lib/env.ts` Zod parse fails closed         |
| Vercel Marketplace → Neon | yes (managed)          | Per-environment DB; preview branches per PR |
| Better Auth library     | yes (pinned version)      | Audit on upgrade                            |

## What auth covers

- **Session cookie**: `HttpOnly`, `SameSite=Lax`, `Secure` in production.
- **Password storage**: handled by Better Auth (bcrypt-family hash).
- **Email verification**: schema is ready (`verification` table); flow not enabled in reference (out of scope, easy to turn on).
- **OAuth**: not enabled in the reference; add via Better Auth providers when needed.

## What RBAC covers

| Role    | Can                                                           |
| ------- | ------------------------------------------------------------- |
| `user`  | sign up, sign in, sign out, list posts, **create their own posts**, **PATCH their own posts** |
| `admin` | everything `user` can, **plus** `DELETE` any post             |

- The role is stored in `user.role` (`text` column, `default 'user'`).
- An admin must be promoted via direct DB update (`UPDATE "user" SET role = 'admin' WHERE id = ...`) or `npm run db:seed`. There is no self-promote endpoint.

## What we explicitly do NOT do (yet)

- No rate limiting on `/api/auth/*` — add Upstash Redis from Marketplace, see Day 6 assignment Bonus 2.
- No CSRF token on Server Actions — Next.js mitigates via SameSite cookies; revisit if you accept cross-origin requests.
- No PII redaction in logs — `console.error` should never receive `session`, `user`, or `body`; this is enforced by review (CodeRabbit + the `reviewing-backend-changes` skill).
- No audit log — add an `audit_log` table + `after()`-based writer when you need it (Bonus 3).

## Incident response

### "A secret was committed to the repo"

1. **Rotate immediately**:
   - `BETTER_AUTH_SECRET` → generate a new one, update Vercel env, redeploy. All sessions invalidate.
   - `DATABASE_URL` → rotate in Neon dashboard, update Vercel env, redeploy.
   - GitHub / Vercel / personal access tokens → revoke in the respective dashboard.
2. **Remove from history**: `git filter-repo` or BFG.
3. **Force-push** to all affected branches (coordinate with team).
4. **Audit**: check logs for suspicious activity since the commit date.

### "I see writes I did not authorize"

1. Disable the suspected user (`UPDATE "user" SET email_verified = false` + delete sessions).
2. Check logs around the affected time.
3. Restore from a Neon point-in-time backup if needed.
4. Review the responsible route handler for missing `requireSession()` / `requireRole()`.

### "CodeRabbit flagged a `body.userId`"

This is an **IDOR** (Insecure Direct Object Reference). Treat as a security bug, not a style issue:

1. Patch immediately — `authorId = session.user.id`.
2. Add a regression test that proves user A cannot create/modify resources as user B.
3. Audit the rest of the codebase for the same pattern with `rg "body\.userId|data\.userId|input\.userId"`.

## Reviewers' cheat sheet

For every backend PR, walk this list:

- [ ] Every mutation calls `requireSession()` or `requireRole(...)`.
- [ ] Every input is parsed by Zod.
- [ ] No `body.userId` used as owner.
- [ ] No `process.env.X!` outside `lib/env.ts`.
- [ ] No `console.log(session)` / `console.log(user)` / `console.log(body)`.
- [ ] Errors go through `lib/errors.ts` — no stack traces in the response.
- [ ] List endpoints have pagination with a hard `max(100)`.
- [ ] At least one happy-path **and** one unauthorized test.
- [ ] CI is green.
