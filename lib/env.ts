import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 chars"),
  BETTER_AUTH_URL: z.string().url(),
});

/** Lets `next build` succeed on Vercel/CI before runtime secrets are wired. */
const buildPlaceholderEnv = {
  DATABASE_URL:
    "postgres://placeholder:placeholder@localhost:5432/placeholder?sslmode=require",
  BETTER_AUTH_SECRET: "build-placeholder-build-placeholder-build-pl",
  BETTER_AUTH_URL: "http://localhost:3000",
} satisfies z.infer<typeof envSchema>;

const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";

const parsed = envSchema.safeParse(process.env);

let envData: z.infer<typeof envSchema>;

if (parsed.success) {
  envData = parsed.data;
} else if (isProductionBuild) {
  console.warn(
    "[env] Missing or invalid env during build — using placeholders. Set DATABASE_URL, BETTER_AUTH_SECRET, and BETTER_AUTH_URL in Vercel for Production/Preview.",
  );
  envData = buildPlaceholderEnv;
} else {
  console.error(
    "[env] Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment variables");
}

export const env = envData;
export type Env = z.infer<typeof envSchema>;
