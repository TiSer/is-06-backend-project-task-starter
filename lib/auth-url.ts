import { env } from "./env";

/** Local dev often runs on 3001 when 3000 is taken. */
const devLocalhostOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

function httpsOrigin(host: string | undefined): string | undefined {
  if (!host) return undefined;
  const trimmed = host.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return trimmed ? `https://${trimmed}` : undefined;
}

/**
 * Canonical app URL for Better Auth (cookies, callbacks).
 * On Vercel, prefer injected hostnames over a stale BETTER_AUTH_URL (e.g. localhost).
 */
export function getBetterAuthBaseUrl(): string {
  if (process.env.VERCEL === "1") {
    const production = httpsOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL);
    if (production && process.env.VERCEL_ENV === "production") {
      return production;
    }

    const deployment = httpsOrigin(process.env.VERCEL_URL);
    if (deployment) return deployment;
  }

  return env.BETTER_AUTH_URL;
}

/** Origins allowed for sign-in / sign-up (must include the URL in the browser address bar). */
export function getBetterAuthTrustedOrigins(): string[] {
  const origins = new Set<string>([
    env.BETTER_AUTH_URL,
    getBetterAuthBaseUrl(),
  ]);

  for (const host of [
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
  ]) {
    const origin = httpsOrigin(host);
    if (origin) origins.add(origin);
  }

  if (process.env.NODE_ENV === "development") {
    for (const origin of devLocalhostOrigins) origins.add(origin);
  }

  if (process.env.VERCEL === "1") {
    origins.add("https://*.vercel.app");
  }

  return [...origins];
}
