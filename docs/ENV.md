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
2. Add `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` manually in Vercel Dashboard → Settings → Environment Variables.
   - `BETTER_AUTH_URL` for Preview = `${{VERCEL_URL}}` won't work directly; set it per-environment to the deployed URL once you know it (or to your custom domain in production).
3. Redeploy.

## CI

GitHub Actions uses **placeholder** env values just to make `lib/env.ts` parse during `lint` / `typecheck` / `test` / `build`. No real DB is reached. Migrations against the **production** DB are run by a separate workflow (out of scope for the reference repo — add when you go to prod).

## Rotation

- **`BETTER_AUTH_SECRET`** rotation invalidates all sessions. Plan accordingly.
- **`DATABASE_URL`** rotation: change in Vercel → redeploy. Neon will not invalidate active connections immediately.
