import type {
  TrackSession as TrackSessionRow,
  TrackSessionLap,
} from "@/lib/db/schema";
import {
  lapsToJson,
  statsFromLapRows,
} from "@/lib/track_sessions/laps-db";

export type SessionLapJson = {
  lapNumber: number;
  time: string;
};

export type TrackSessionJson = {
  id: string;
  authorId: string;
  trackId: string;
  title: string;
  sessionDate: string;
  published: boolean;
  laps: SessionLapJson[];
  lapCount: number;
  averageLap: string;
  bestLap: string;
  createdAt: string;
  updatedAt: string;
};

export function formatSessionDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return value.slice(0, 10);
}

export function serializeTrackSession(
  row: TrackSessionRow,
  lapRows: TrackSessionLap[],
): TrackSessionJson {
  const stats = statsFromLapRows(lapRows);

  return {
    id: row.id,
    authorId: row.authorId,
    trackId: row.trackId,
    title: row.title,
    sessionDate: formatSessionDate(row.sessionDate),
    published: row.published,
    laps: lapsToJson(lapRows),
    lapCount: stats.lapCount,
    averageLap: stats.averageLap,
    bestLap: stats.bestLap,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
