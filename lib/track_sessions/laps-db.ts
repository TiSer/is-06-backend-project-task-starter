import { asc, eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { trackSessionLap, type TrackSessionLap } from "@/lib/db/schema";
import { computeLapStats } from "@/lib/track_sessions/lap-times";

export type SessionLapInput = { time: string };

export async function fetchLapsBySessionIds(
  sessionIds: string[],
): Promise<Map<string, TrackSessionLap[]>> {
  const map = new Map<string, TrackSessionLap[]>();
  if (sessionIds.length === 0) return map;

  const rows = await db
    .select()
    .from(trackSessionLap)
    .where(inArray(trackSessionLap.sessionId, sessionIds))
    .orderBy(asc(trackSessionLap.lapNumber));

  for (const row of rows) {
    const list = map.get(row.sessionId) ?? [];
    list.push(row);
    map.set(row.sessionId, list);
  }

  return map;
}

export async function insertLapsForSession(
  sessionId: string,
  laps: SessionLapInput[],
): Promise<TrackSessionLap[]> {
  if (laps.length === 0) return [];

  const now = new Date();
  const values = laps.map((lap, index) => ({
    id: nanoid(),
    sessionId,
    lapNumber: index + 1,
    lapTime: lap.time.trim(),
    createdAt: now,
    updatedAt: now,
  }));

  return db.insert(trackSessionLap).values(values).returning();
}

export async function replaceLapsForSession(
  sessionId: string,
  laps: SessionLapInput[],
): Promise<TrackSessionLap[]> {
  await db.delete(trackSessionLap).where(eq(trackSessionLap.sessionId, sessionId));
  return insertLapsForSession(sessionId, laps);
}

export function lapsToJson(rows: TrackSessionLap[]) {
  return rows.map((row) => ({
    lapNumber: row.lapNumber,
    time: row.lapTime,
  }));
}

export function statsFromLapRows(rows: TrackSessionLap[]) {
  return computeLapStats(rows.map((r) => r.lapTime));
}
