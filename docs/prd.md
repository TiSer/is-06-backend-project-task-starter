# Product Requirements — `<your-project-name>`

> **Fill this in before writing any code.** This file is the single source of truth for the AI agent. Vague intent here turns into wrong code there.

---

## What you're building

> One paragraph. What is the resource? Who creates it? Who reads it? What is the smallest useful slice you can ship in a few hours?

_Example: "A small Notes API. Authenticated users can create text notes, list their own notes, edit them, delete them. Admins can hard-delete any note. No sharing, no folders, no tags — those come later."_

TODO

---

## For whom

- TODO — primary persona (e.g. "single user keeping personal notes").
- TODO — secondary persona, if any (e.g. "admin moderating reported notes").

---

## Constraints (copy these — do not loosen)

- **Auth inside every mutation** — `requireSession()` (or `requireRole('admin')`) called before any `db.insert/update/delete`.
- **Zod on every input** — request body and query string parsed with `safeParse` before touching the DB.
- **Owner from session, never from body** — `<ownerColumn> = session.user.id`. Never `body.userId`.
- **Pagination on list endpoints** — `limit` capped at 100, default 20.
- **Typed errors** — every failure routes through `lib/errors.ts`.

---

## Endpoints

> Replace `<resource>` with your resource name (lowercase, singular, e.g. `note`, `task`, `quote`).

| Method | Path                          | Auth              | Body                | Returns                                       |
| ------ | ----------------------------- | ----------------- | ------------------- | --------------------------------------------- |
| GET    | `/api/health`                 | public            | —                   | `{ status, db, latencyMs }` (already wired)   |
| POST   | `/api/auth/sign-up/email`     | public            | `{ email, password, name? }` | session cookie + user (already wired) |
| POST   | `/api/auth/sign-in/email`     | public            | `{ email, password }` | session cookie + user (already wired)       |
| POST   | `/api/auth/sign-out`          | session           | —                   | 200 (already wired)                           |
| GET    | `/api/v1/<resource>`          | optional          | —                   | `{ items: <Resource>[], limit, offset }`      |
| POST   | `/api/v1/<resource>`          | session           | `Create<Resource>`  | `<Resource>` (201)                            |
| GET    | `/api/v1/<resource>/:id`      | optional          | —                   | `<Resource>`                                  |
| PATCH  | `/api/v1/<resource>/:id`      | session + owner   | `Update<Resource>`  | `<Resource>`                                  |
| DELETE | `/api/v1/<resource>/:id`      | session + admin   | —                   | 204                                           |

---

## Request / response shapes

```ts
// Create<Resource>Body  (lib/validation/<resource>.ts → create<Resource>Schema)
{
  // TODO — define your fields here.
  // Example:
  // title: string,     // 1..200
  // body:  string,     // 1..50_000
}

// Update<Resource>Body — Partial<Create<Resource>Body>, at least one key.

// <Resource>  (lib/db/schema.ts → <Resource>)
{
  id: string,                // nanoid
  // TODO — your fields
  authorId: string,          // FROM session — never from body
  createdAt: string,         // ISO
  updatedAt: string
}

// Error envelope (lib/errors.ts) — already defined
{ error: 'Unauthorized' | 'Forbidden' | 'NotFound' | 'BadRequest' | 'InternalServerError', detail?: unknown }
```

---

## Non-goals

> Things you are explicitly _not_ shipping. Naming them is a forcing function — it stops the agent from "helpfully" building them.

- TODO — e.g. "no sharing between users"
- TODO — e.g. "no rate limiting (handled at edge later)"
- TODO — e.g. "no file uploads"

---

## Acceptance

- `npm run lint && npm run typecheck && npm run test && npm run build` — all four green.
- All CodeRabbit pre-merge checks `✅` or explicitly justified in a PR comment.
- `/api/health` returns 200 from the Vercel preview deploy.
- At least one passing test per route handler covering: happy path, 401, 400 (and 403 for owner-only routes).
