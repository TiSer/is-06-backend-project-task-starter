import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  getBetterAuthBaseUrl,
  resolveBetterAuthTrustedOrigins,
} from "@/lib/auth-url";
import { db } from "./db";
import { env } from "./env";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once per day
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: getBetterAuthBaseUrl(),
  trustedOrigins: resolveBetterAuthTrustedOrigins,
});

export type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;
