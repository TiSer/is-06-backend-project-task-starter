# Product Requirements — Ninja Track Racing (Day 6 backend)

> **Single source of truth for the API.** Backend contract first; Day 5 UI alignment second. Do not implement route handlers until this file and [`ARCHITECTURE.md`](./ARCHITECTURE.md) match.

---

## Domain (naming)

| Layer | Name | Notes |
| ----- | ---- | ----- |
| REST collection | `track_sessions` | All routes under `/api/v1/track_sessions` |
| Route files | `app/api/v1/track_sessions/` | `route.ts` + `[id]/route.ts` |
| Zod module | `lib/validation/track_sessions.ts` | `createTrackSessionSchema`, etc. |
| DB table | `track_session` | Singular SQL table; Drizzle export `trackSession` |
| Auth `session` table | `session` | **Better Auth only** — not our domain entity |

**Not stored on the row:** `bestLap` — derived dynamically (from per-lap data when that exists, or client/UI logic until then). Homework v1 stores `lapCount` + `averageLap` only.

---

## Scope (backend)

REST API for **track-day sessions**: one row per circuit visit (track, title, lap stats, date). Authenticated principals create and update rows where `authorId` matches the session user. Admins hard-delete any row. Anonymous clients list/read rows with `published === true` only, subject to list rules in [`ARCHITECTURE.md`](./ARCHITECTURE.md).

**Entity + owner + admin:**

| Concept | Implementation |
| ------- | -------------- |
| **Entity** | `track_session` row |
| **Owner** | `authorId` = `session.user.id` on create; never from request body |
| **Admin** | `user.role === 'admin'` for `DELETE` any row |

---

## For whom

- **Rider (`user`)** — logs personal track days; creates/updates own `track_session` rows; lists published sessions from everyone.
- **Admin** — same as user, plus `DELETE` on any `track_session` (moderation / hard delete).

---

## Constraints (non-negotiable)

- **Auth inside every mutation** — `requireSession()` or `requireRole('admin')` before any `db.insert` / `update` / `delete`.
- **Zod on every input** — body and query via `safeParse`; `badRequest()` on failure.
- **Owner from session** — `authorId = session.user.id`; never `body.authorId` / `body.userId`.
- **Pagination on list** — `limit` default `20`, max `100`; `offset` default `0`.
- **Typed errors** — `lib/errors.ts` only in route handlers.

---

## Endpoints

### Already wired (do not break)

| Method | Path | Auth | Returns |
| ------ | ---- | ---- | ------- |
| GET | `/api/health` | public | `{ status, db, latencyMs }` |
| POST | `/api/auth/sign-up/email` | public | session cookie + user |
| POST | `/api/auth/sign-in/email` | public | session cookie + user |
| POST | `/api/auth/sign-out` | session | `200` |

### Domain — `track_sessions` (to implement)

| Method | Path | Auth | Body / query | Returns |
| ------ | ---- | ---- | ------------ | ------- |
| GET | `/api/v1/track_sessions` | optional | Query: `limit`, `offset`, `publishedOnly?` | `{ items: TrackSession[], limit, offset }` |
| POST | `/api/v1/track_sessions` | **session** | `CreateTrackSession` | `TrackSession` **201** |
| GET | `/api/v1/track_sessions/:id` | optional | — | `TrackSession` |
| PATCH | `/api/v1/track_sessions/:id` | **session + owner** | `UpdateTrackSession` | `TrackSession` |
| DELETE | `/api/v1/track_sessions/:id` | **session + admin** | — | **204** |

**List behavior (v1):** defined in [`ARCHITECTURE.md`](./ARCHITECTURE.md) → List filters.

**Summary:**

- Anonymous: `published === true` only.
- Authenticated, no `publishedOnly`: all rows where `authorId = session.user.id`.
- Authenticated, `publishedOnly=true`: `published === true` (any author).

---

## Data model — `track_session`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | `text` PK | `nanoid()`, server-generated |
| `authorId` | `text` FK → `user.id` | `onDelete: cascade` |
| `trackId` | `text` | slug, e.g. `dniprokart`; 1–64 chars |
| `title` | `text` | display title, 1–200 chars |
| `lapCount` | `integer` | ≥ 0 |
| `averageLap` | `text` | display format, e.g. `1:06.4`; 1–16 chars |
| `sessionDate` | `date` or `text` | calendar day of track day (ISO `YYYY-MM-DD` in JSON) |
| `published` | `boolean` | default `false` |
| `createdAt` | `timestamp` | server default `now()` |
| `updatedAt` | `timestamp` | bumped on PATCH |

---

## Request / response shapes

```ts
// lib/validation/track_sessions.ts

// CreateTrackSession (POST body) — no authorId, no bestLap
{
  trackId: string;      // 1..64, slug
  title: string;        // 1..200
  lapCount: number;     // int, >= 0
  averageLap: string;   // 1..16, e.g. "1:06.4"
  sessionDate: string;  // ISO date YYYY-MM-DD
  published?: boolean;  // default false
}

// UpdateTrackSession (PATCH body) — partial, at least one key
Partial<CreateTrackSession>

// List query (GET collection)
{
  limit?: number;       // default 20, max 100
  offset?: number;      // default 0
  publishedOnly?: boolean; // string "true" in query → coerced
}

// TrackSession (JSON response)
{
  id: string;
  authorId: string;
  trackId: string;
  title: string;
  lapCount: number;
  averageLap: string;
  sessionDate: string;  // ISO date
  published: boolean;
  createdAt: string;    // ISO datetime
  updatedAt: string;
}

// List response
{
  items: TrackSession[];
  limit: number;
  offset: number;
}

// Error envelope (lib/errors.ts)
{ error: "Unauthorized" | "Forbidden" | "NotFound" | "BadRequest" | "InternalServerError"; detail?: unknown }
```

### Example — create

```http
POST /api/v1/track_sessions
Cookie: better-auth.session=...
Content-Type: application/json

{
  "trackId": "dniprokart",
  "title": "DniproKart — May 18",
  "lapCount": 12,
  "averageLap": "1:06.4",
  "sessionDate": "2026-05-18",
  "published": false
}
```

→ `201` + `TrackSession` with `authorId` set from cookie, not body.

---

## RBAC summary

| Action | Rule |
| ------ | ---- |
| POST | `requireSession()` |
| PATCH | `requireSession()` + `isOwner(session, row.authorId)` |
| DELETE | `requireRole(req, 'admin')` |
| GET list / GET by id | public; unpublished rows hidden from anonymous clients |

---

## Non-goals (homework v1)

- No `bestLap` column — computed elsewhere when per-lap API exists.
- No `lap_time` / per-lap child table in v1.
- No gallery / photo API.
- No tracks catalog API (track metadata stays in `lib/data.ts` for now).
- No wiring dashboard UI to API in this PR (optional follow-up).
- No rate limiting, no audit log.
- No renaming Better Auth `session` table.

---

## Acceptance (backend PR)

- `docs/prd.md` and `docs/ARCHITECTURE.md` complete and consistent.
- Migration generated under `drizzle/` for `track_session`.
- Five handlers under `app/api/v1/track_sessions/`.
- ≥ 3 Vitest tests: happy POST, 401 on POST, 400 on POST; 403 on PATCH as other user.
- `npm run lint && npm run typecheck && npm run test && npm run build` — all green.
- CodeRabbit pre-merge checks addressed.
- Vercel preview: `/api/health` → 200.

---

## Frontend alignment (reference only)

Day 5 UI and mocks — **not** the API contract. Use when wiring UI later.

| Frontend | Location | Maps to backend |
| -------- | -------- | ---------------- |
| Product / Figma | [`FRONTEND-PRD.md`](./FRONTEND-PRD.md), [`DESIGN.md`](./DESIGN.md) | Visual tokens, pages |
| Mock `Session` type | `lib/data.ts` → `sessions[]` | `trackId`, `title`, `lapCount`, `averageLap`, `date` → `sessionDate` |
| Dashboard “Track sessions” | `app/dashboard/page.tsx` | `GET /api/v1/track_sessions` (auth: own rows) |
| “+ New Session” button | links to `/records` today | future: form → `POST /api/v1/track_sessions` |
| Lap table “best lap” column | `lib/data.ts` → `lapTimes[]` | **not** `track_session`; separate future `lap_time` resource or client-side derive |
| Tracks list | `lib/data.ts` → `tracks[]` | static until tracks API exists |

Example mock row (frontend `date` → API `sessionDate`):

```ts
// lib/data.ts (mock)
{ id: "s24", trackId: "dniprokart", title: "DniproKart — May 18", lapCount: 12, averageLap: "1:06.4", date: "May 18" }
```
