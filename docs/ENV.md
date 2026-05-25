# Environment Variables

All env vars are validated at module load by `lib/env.ts` (Zod). If anything is missing or malformed, the process exits with a clear error **before** any request is served.

| Var                   | Required | Source                       | Notes                                        |
| --------------------- | -------- | ---------------------------- | -------------------------------------------- |
| `DATABASE_URL`        | yes      | Vercel Marketplace (Neon)    | Pooled connection string                     |
| `DATABASE_URL_UNPOOLED` | optional | Vercel Marketplace (Neon) | Used by `drizzle-kit` for migrations         |
| `BETTER_AUTH_SECRET`  | yes      | `openssl rand -base64 32`    | Min 32 chars; rotates → invalidates sessions |
| `BETTER_AUTH_URL`     | yes      | manual                       | `http://localhost:3000` in dev; deployed URL in preview/prod |

## Local setup

```bash
# 1. Pull env vars from Vercel (after `vercel link` + Neon install)
vercel env pull .env.local

# 2. Add the auth secret + URL
echo "BETTER_AUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
echo "BETTER_AUTH_URL=http://localhost:3000"        >> .env.local
```

`.env.local` is git-ignored. The committed template is `.env.example`.

## Vercel setup

1. Install **Neon** from Vercel Marketplace → connect to project → `DATABASE_URL` auto-populated on **all** environments.
2. Add **`BETTER_AUTH_SECRET`** and **`BETTER_AUTH_URL`** in Vercel → **Settings** → **Environment Variables** (enable **Production** and **Preview**, and **Build** if offered):
   - `BETTER_AUTH_SECRET` — `openssl rand -base64 32`
   - `BETTER_AUTH_URL` — exact site URL, e.g. `https://is-06-backend-project-task-starter.vercel.app` (no trailing slash). Update Preview if you test auth on preview URLs.
3. **Redeploy** (`vercel --prod` or push to `main`).

Without these, `next build` may fail or auth/API will break at runtime even if the build passes with placeholders.

## CI

GitHub Actions uses **placeholder** env values just to make `lib/env.ts` parse during `lint` / `typecheck` / `test` / `build`. No real DB is reached. Migrations against the **production** DB are run by a separate workflow (out of scope for the reference repo — add when you go to prod).

## Auth troubleshooting

### `Invalid origin` on sign-up / sign-in

Better Auth checks the browser **Origin** against `trustedOrigins`.

**Local:** open the app at the same URL as `BETTER_AUTH_URL` in `.env.local` (default `http://localhost:3000`), or update that variable. Restart `npm run dev`.

**Vercel:** `lib/auth-url.ts` trusts `https://*.vercel.app` and Vercel hostnames (`VERCEL_URL`, etc.). Set `BETTER_AUTH_URL` to your main production URL (not `http://localhost:3000`). Redeploy after changing env vars.

If it still fails, use the **exact** URL from the address bar as `BETTER_AUTH_URL`.

### Manual row in Neon `user` table

Email/password login needs a matching row in **`account`** with a **hashed** password (created by sign-up, not a plain SQL insert). Prefer **Sign up** in the UI, or delete the manual `user` row and register again.

## Rotation

- **`BETTER_AUTH_SECRET`** rotation invalidates all sessions. Plan accordingly.
- **`DATABASE_URL`** rotation: change in Vercel → redeploy. Neon will not invalidate active connections immediately.
