import type { TrackSession as TrackSessionRow } from "@/lib/db/schema";

export type TrackSessionJson = {
  id: string;
  authorId: string;
  trackId: string;
  title: string;
  lapCount: number;
  averageLap: string;
  sessionDate: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export function formatSessionDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return value.slice(0, 10);
}

export function serializeTrackSession(row: TrackSessionRow): TrackSessionJson {
  return {
    id: row.id,
    authorId: row.authorId,
    trackId: row.trackId,
    title: row.title,
    lapCount: row.lapCount,
    averageLap: row.averageLap,
    sessionDate: formatSessionDate(row.sessionDate),
    published: row.published,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
