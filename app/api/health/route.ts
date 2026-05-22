import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

export async function GET() {
  const startedAt = Date.now();
  try {
    await db.execute(sql`select 1`);
    return Response.json({
      status: "ok",
      db: "ok",
      latencyMs: Date.now() - startedAt,
    });
  } catch (error) {
    console.error("[health] db check failed", error);
    return Response.json(
      {
        status: "degraded",
        db: "down",
        latencyMs: Date.now() - startedAt,
      },
      { status: 503 },
    );
  }
}
