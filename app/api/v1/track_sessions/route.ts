import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { trackSession } from "@/lib/db/schema";
import {
  badRequest,
  isResponse,
  serverError,
} from "@/lib/errors";
import { getSession, requireSession } from "@/lib/rbac";
import {
  createTrackSessionWithLaps,
  fetchLapsBySessionIds,
} from "@/lib/track_sessions/laps-db";
import { serializeTrackSession } from "@/lib/track_sessions/serialize";
import {
  createTrackSessionSchema,
  listTrackSessionsQuerySchema,
} from "@/lib/validation/track_sessions";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const parsed = listTrackSessionsQuerySchema.safeParse({
      limit: url.searchParams.get("limit") ?? undefined,
      offset: url.searchParams.get("offset") ?? undefined,
      publishedOnly: url.searchParams.get("publishedOnly") ?? undefined,
    });

    if (!parsed.success) {
      return badRequest({ errors: parsed.error.flatten().fieldErrors });
    }

    const { limit, offset, publishedOnly } = parsed.data;
    const authSession = await getSession(req);

    const where = !authSession
      ? eq(trackSession.published, true)
      : publishedOnly === true
        ? eq(trackSession.published, true)
        : eq(trackSession.authorId, authSession.user.id);

    const rows = await db
      .select()
      .from(trackSession)
      .where(where)
      .orderBy(desc(trackSession.sessionDate), desc(trackSession.createdAt))
      .limit(limit)
      .offset(offset);

    const lapsBySession = await fetchLapsBySessionIds(rows.map((r) => r.id));

    return Response.json({
      items: rows.map((row) =>
        serializeTrackSession(row, lapsBySession.get(row.id) ?? []),
      ),
      limit,
      offset,
    });
  } catch (error) {
    if (isResponse(error)) return error;
    console.error("[v1/track_sessions] GET failed", error);
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const authSession = await requireSession(req);

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return badRequest({ errors: { _errors: ["Invalid JSON body"] } });
    }

    const parsed = createTrackSessionSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest({ errors: parsed.error.flatten().fieldErrors });
    }

    const data = parsed.data;
    const { session, laps } = await createTrackSessionWithLaps({
      authorId: authSession.user.id,
      trackId: data.trackId,
      title: data.title,
      sessionDate: data.sessionDate,
      published: data.published,
      laps: data.laps,
    });

    return Response.json(serializeTrackSession(session, laps), { status: 201 });
  } catch (error) {
    if (isResponse(error)) return error;
    console.error("[v1/track_sessions] POST failed", error);
    return serverError();
  }
}
