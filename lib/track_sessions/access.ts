import type { AuthSession } from "@/lib/auth";
import type { TrackSession as TrackSessionRow } from "@/lib/db/schema";

export function isAdmin(session: NonNullable<AuthSession>): boolean {
  return (session.user as { role?: string }).role === "admin";
}

export function canReadTrackSession(
  row: TrackSessionRow,
  session: AuthSession,
): boolean {
  if (row.published) return true;
  if (!session) return false;
  if (session.user.id === row.authorId) return true;
  return isAdmin(session);
}
