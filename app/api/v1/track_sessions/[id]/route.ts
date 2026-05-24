import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { trackSession } from "@/lib/db/schema";
import {
  badRequest,
  forbidden,
  isResponse,
  notFound,
  serverError,
} from "@/lib/errors";
import {
  getSession,
  isOwner,
  requireRole,
  requireSession,
} from "@/lib/rbac";
import { canReadTrackSession } from "@/lib/track_sessions/access";
import { serializeTrackSession } from "@/lib/track_sessions/serialize";
import {
  trackSessionIdSchema,
  updateTrackSessionSchema,
} from "@/lib/validation/track_sessions";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function loadTrackSession(id: string) {
  const parsedId = trackSessionIdSchema.safeParse(id);
  if (!parsedId.success) {
    return { error: badRequest({ errors: parsedId.error.flatten().fieldErrors }) };
  }

  const [row] = await db
    .select()
    .from(trackSession)
    .where(eq(trackSession.id, parsedId.data))
    .limit(1);

  if (!row) {
    return { error: notFound("Track session") };
  }

  return { row };
}

export async function GET(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const loaded = await loadTrackSession(id);
    if ("error" in loaded) return loaded.error;

    const authSession = await getSession(req);
    if (!canReadTrackSession(loaded.row, authSession)) {
      return notFound("Track session");
    }

    return Response.json(serializeTrackSession(loaded.row));
  } catch (error) {
    if (isResponse(error)) return error;
    console.error("[v1/track_sessions/:id] GET failed", error);
    return serverError();
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const authSession = await requireSession(req);
    const { id } = await context.params;
    const loaded = await loadTrackSession(id);
    if ("error" in loaded) return loaded.error;

    if (!isOwner(authSession, loaded.row.authorId)) {
      return forbidden();
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return badRequest({ errors: { _errors: ["Invalid JSON body"] } });
    }

    const parsed = updateTrackSessionSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest({ errors: parsed.error.flatten().fieldErrors });
    }

    const data = parsed.data;
    const [row] = await db
      .update(trackSession)
      .set({
        ...(data.trackId !== undefined ? { trackId: data.trackId } : {}),
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.lapCount !== undefined ? { lapCount: data.lapCount } : {}),
        ...(data.averageLap !== undefined ? { averageLap: data.averageLap } : {}),
        ...(data.sessionDate !== undefined
          ? { sessionDate: data.sessionDate }
          : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
        updatedAt: new Date(),
      })
      .where(eq(trackSession.id, loaded.row.id))
      .returning();

    return Response.json(serializeTrackSession(row));
  } catch (error) {
    if (isResponse(error)) return error;
    console.error("[v1/track_sessions/:id] PATCH failed", error);
    return serverError();
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    await requireRole(req, "admin");
    const { id } = await context.params;
    const loaded = await loadTrackSession(id);
    if ("error" in loaded) return loaded.error;

    await db.delete(trackSession).where(eq(trackSession.id, loaded.row.id));

    return new Response(null, { status: 204 });
  } catch (error) {
    if (isResponse(error)) return error;
    console.error("[v1/track_sessions/:id] DELETE failed", error);
    return serverError();
  }
}
