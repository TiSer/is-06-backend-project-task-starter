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

function isLocalhostUrl(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

function vercelHttpsOrigins(): string[] {
  const origins: string[] = [];
  for (const host of [
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
  ]) {
    const origin = httpsOrigin(host);
    if (origin) origins.push(origin);
  }
  return origins;
}

/**
 * Canonical app URL for Better Auth (cookies, callbacks).
 * On Vercel, never use a localhost BETTER_AUTH_URL from env.
 */
export function getBetterAuthBaseUrl(): string {
  if (process.env.VERCEL === "1") {
    const fromVercel = vercelHttpsOrigins();
    if (fromVercel.length > 0) return fromVercel[0];
  }

  if (!isLocalhostUrl(env.BETTER_AUTH_URL)) {
    return env.BETTER_AUTH_URL;
  }

  return env.BETTER_AUTH_URL;
}

/** Static patterns; use resolveBetterAuthTrustedOrigins(request) at request time on Vercel. */
export function getBetterAuthTrustedOrigins(): string[] {
  const origins = new Set<string>([getBetterAuthBaseUrl()]);

  if (!isLocalhostUrl(env.BETTER_AUTH_URL)) {
    origins.add(env.BETTER_AUTH_URL);
  }

  for (const origin of vercelHttpsOrigins()) {
    origins.add(origin);
  }

  if (process.env.NODE_ENV === "development") {
    for (const origin of devLocalhostOrigins) origins.add(origin);
  }

  if (process.env.VERCEL === "1") {
    origins.add("https://*.vercel.app");
    origins.add("*.vercel.app");
  }

  return [...origins];
}

/**
 * Evaluated per request so build-time env (localhost placeholders) cannot freeze origins.
 */
export async function resolveBetterAuthTrustedOrigins(
  request?: Request,
): Promise<string[]> {
  const origins = new Set(getBetterAuthTrustedOrigins());

  const originHeader = request?.headers.get("origin");
  if (originHeader) {
    try {
      const { hostname } = new URL(originHeader);
      if (
        hostname.endsWith(".vercel.app") ||
        hostname === "localhost" ||
        hostname === "127.0.0.1"
      ) {
        origins.add(originHeader);
      }
    } catch {
      // ignore malformed origin
    }
  }

  return [...origins];
}
