import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { env } from "./env";

/** Local dev often runs on 3001 when 3000 is taken — must match browser origin. */
const devLocalhostOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

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
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins:
    process.env.NODE_ENV === "development"
      ? [...new Set([env.BETTER_AUTH_URL, ...devLocalhostOrigins])]
      : [env.BETTER_AUTH_URL],
});

export type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;
