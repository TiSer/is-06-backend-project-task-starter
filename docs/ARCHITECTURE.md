# Architecture — Ninja Track Racing API

> Implementation contract for route handlers. Must stay aligned with [`prd.md`](./prd.md). No handler code until both documents match.

---

## Layers

```
HTTP request
    ↓
Route handler  (app/api/v1/track_sessions/...)
    ↓ 1. requireSession / requireRole          ← lib/rbac.ts
    ↓ 2. Zod safeParse(body / query)           ← lib/validation/track_sessions.ts
    ↓ 3. db.select / insert / update / delete  ← lib/db
    ↓ 4. NextResponse.json(...)  OR  typed error from lib/errors.ts
HTTP response
```

Rules:

- No skipped or reordered steps.
- No direct `process.env` access in handlers (`lib/env.ts` only).

---

## Module map

| Concern | Path |
| ------- | ---- |
| Drizzle schema | `lib/db/schema.ts` → `trackSession` (`track_session` table) |
| DB client | `lib/db/index.ts` |
| Zod | `lib/validation/track_sessions.ts` |
| Collection routes | `app/api/v1/track_sessions/route.ts` (`GET`, `POST`) |
| Item routes | `app/api/v1/track_sessions/[id]/route.ts` (`GET`, `PATCH`, `DELETE`) |
| Auth catch-all | `app/api/auth/[...all]/route.ts` (fixed) |
| Health | `app/api/health/route.ts` (fixed) |
| API tests | `tests/api/track_sessions.test.ts` |
| Migrations | `drizzle/<timestamp>_*.sql` (generated) |

---

## Data model

### Domain table — `track_session`

| Column | Drizzle type | Nullable | Notes |
| ------ | ------------ | -------- | ----- |
| `id` | `text` PK | no | `nanoid()` on insert |
| `author_id` | `text` FK → `user.id` | no | `onDelete: 'cascade'`; maps to `authorId` in JSON |
| `track_id` | `text` | no | slug, 1–64 chars; maps to `trackId` |
| `title` | `text` | no | 1–200 chars |
| `lap_count` | `integer` | no | ≥ 0; maps to `lapCount` |
| `average_lap` | `text` | no | display string; maps to `averageLap` |
| `session_date` | `date` | no | calendar day; JSON `sessionDate` as `YYYY-MM-DD` |
| `published` | `boolean` | no | default `false` |
| `created_at` | `timestamp` | no | default `now()` |
| `updated_at` | `timestamp` | no | set on PATCH |

Indexes (recommended):

- `track_session_author_id_idx` on `author_id`
- `track_session_published_idx` on `published`

`bestLap` is not persisted. Derivation belongs to a future `lap_time` resource or client logic.

### Better Auth tables (fixed)

`user`, `session`, `account`, `verification` — managed by Better Auth's Drizzle adapter. Do not rename. The auth table `session` is unrelated to the domain `track_session` entity.

`user.role` (`text`, default `'user'`) drives admin checks.

---

## Authentication

| Item | Detail |
| ---- | ------ |
| Provider | Better Auth — `lib/auth.ts` |
| Transport | Email + password; session cookies (`HttpOnly`, `SameSite=Lax`, `Secure` in production) |
| Session read | `auth.api.getSession({ headers: req.headers })` |
| `requireSession(req)` | Returns session or throws `401` `Response` |
| `requireRole(req, 'admin')` | Returns session or throws `401` / `403` |
| `isOwner(session, ownerId)` | Boolean; used before PATCH |

---

## Authorization

### Mutations

| Route | Rule |
| ----- | ---- |
| `POST /api/v1/track_sessions` | `requireSession()` before insert |
| `PATCH /api/v1/track_sessions/:id` | `requireSession()`; load row; `isOwner(session, row.authorId)` or `403` |
| `DELETE /api/v1/track_sessions/:id` | `requireRole(req, 'admin')` before delete |

### Reads

| Route | Rule |
| ----- | ---- |
| `GET /api/v1/track_sessions` | See list filters below |
| `GET /api/v1/track_sessions/:id` | Row returned only if `published === true` OR caller is owner OR caller is admin |

### List filters (`GET /api/v1/track_sessions`)

Query parsed by `listTrackSessionsQuerySchema`.

| Caller | `publishedOnly` | SQL filter |
| ------ | ----------------- | ---------- |
| Anonymous | (ignored) | `published = true` |
| Authenticated | absent / `false` | `author_id = session.user.id` |
| Authenticated | `true` | `published = true` |

Pagination: `limit` (default 20, max 100), `offset` (default 0). Response: `{ items, limit, offset }`.

---

## Validation

File: `lib/validation/track_sessions.ts`

| Schema | Used by |
| ------ | ------- |
| `createTrackSessionSchema` | `POST` body |
| `updateTrackSessionSchema` | `PATCH` body (partial, ≥1 field) |
| `listTrackSessionsQuerySchema` | `GET` query (`limit`, `offset`, `publishedOnly`) |
| `trackSessionIdSchema` | `GET` / `PATCH` / `DELETE` `:id` param |

Pattern:

```ts
const parsed = createTrackSessionSchema.safeParse(await req.json());
if (!parsed.success) {
  return badRequest({ errors: parsed.error.flatten().fieldErrors });
}
```

JSON field names remain camelCase (`authorId`, `trackId`, …). Drizzle columns use snake_case in SQL.

---

## Serialization

Handler maps DB row → API `TrackSession`:

- `author_id` → `authorId`
- `track_id` → `trackId`
- `lap_count` → `lapCount`
- `average_lap` → `averageLap`
- `session_date` → `sessionDate` (ISO date string)
- `created_at` / `updated_at` → ISO datetime strings

---

## Error handling

| Helper | Status | Condition |
| ------ | ------ | --------- |
| `unauthorized()` | 401 | Missing or invalid session |
| `forbidden()` | 403 | RBAC or owner mismatch |
| `notFound(resource?)` | 404 | Missing row or hidden unpublished row |
| `badRequest(detail)` | 400 | Zod or invalid input |
| `serverError()` | 500 | Unhandled exception |

Handler wrapper:

```ts
export async function POST(req: Request) {
  try {
    // auth → validate → db → respond
  } catch (e) {
    if (isResponse(e)) return e;
    console.error("[v1/track_sessions] POST failed", e);
    return serverError();
  }
}
```

`requireSession()` / `requireRole()` throw `Response`; `isResponse(e)` rethrows them.

---

## Database

| Item | Detail |
| ---- | ------ |
| Driver | `@neondatabase/serverless` (HTTP) |
| ORM | Drizzle (`drizzle-orm/neon-http`) |
| Client | Single `db` export from `lib/db/index.ts` |
| Workflow | Edit `lib/db/schema.ts` → `npm run db:generate` → commit `drizzle/*.sql` → `npm run db:migrate` |
| `db:push` | Scratch databases only; not for PR migrations |

---

## Environments

| Environment | Config |
| ----------- | ------ |
| Local | `.env.local`: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` |
| Preview | Vercel + Neon preview branch (Marketplace integration) |
| Production | Separate Neon branch and `BETTER_AUTH_SECRET` |

See `docs/ENV.md`.

---

## Testing

| Layer | Path | Scope |
| ----- | ---- | ----- |
| Unit | `tests/lib/*.test.ts` | No network; env stubbed in `tests/setup.ts` |
| API | `tests/api/track_sessions.test.ts` | Route handlers; mock `db` / auth where feasible |

Minimum cases (homework):

| Test | Expectation |
| ---- | ----------- |
| `POST` happy path | `201` with valid body + mocked session |
| `POST` unauthenticated | `401` |
| `POST` invalid body | `400` |
| `PATCH` non-owner | `403` |

Integration tests (`tests/integration/`, `INTEGRATION=1`) are optional.

---

## CI / CD

- `.github/workflows/ci.yml` — `lint`, `typecheck`, `test`, `build` in parallel.
- Build job uses stub env vars (not production secrets).
- `.coderabbit.yaml` — pre-merge backend checks.
- Vercel — preview per branch; production on `main`.

---

## Modification boundaries

**Allowed without review:**

- `app/api/v1/track_sessions/**`
- `lib/db/schema.ts` (domain table only)
- `lib/validation/track_sessions.ts`
- `tests/api/**`, `tests/lib/**`
- `docs/prd.md`, `docs/ARCHITECTURE.md`
- `drizzle/*.sql` (generated, not hand-edited after apply)

**Review required:**

- `lib/auth.ts`, `lib/rbac.ts`, `lib/env.ts`, `lib/errors.ts`

**Do not modify without explicit reason:**

- `app/api/auth/[...all]/route.ts`
- `app/api/health/route.ts`
- Better Auth table definitions in `lib/db/schema.ts`
- `.coderabbit.yaml` pre-merge checks (loosening)

---

## Frontend reference (non-normative)

UI mocks in `lib/data.ts` and pages under `app/dashboard`, `app/records` are not part of this architecture. Mapping is documented in `prd.md` → Frontend alignment.
