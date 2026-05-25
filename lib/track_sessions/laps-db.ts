import { asc, eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import {
  trackSession,
  trackSessionLap,
  type TrackSession,
  type TrackSessionLap,
} from "@/lib/db/schema";
import { computeLapStats } from "@/lib/track_sessions/lap-times";

export type SessionLapInput = { time: string };

export type CreateTrackSessionWithLapsInput = {
  authorId: string;
  trackId: string;
  title: string;
  sessionDate: string;
  published: boolean;
  laps: SessionLapInput[];
};

/**
 * neon-http cannot run Drizzle interactive transactions.
 * Session + laps use compensating rollback (delete session or restore prior laps on failure).
 */
export async function createTrackSessionWithLaps(
  input: CreateTrackSessionWithLapsInput,
): Promise<{ session: TrackSession; laps: TrackSessionLap[] }> {
  const now = new Date();
  const sessionId = nanoid();

  const [session] = await db
    .insert(trackSession)
    .values({
      id: sessionId,
      authorId: input.authorId,
      trackId: input.trackId,
      title: input.title,
      sessionDate: input.sessionDate,
      published: input.published,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  try {
    const laps = await insertLapsForSession(sessionId, input.laps, now);
    return { session, laps };
  } catch (error) {
    try {
      await db.delete(trackSession).where(eq(trackSession.id, sessionId));
    } catch (rollbackError) {
      console.error(
        "[track_sessions] rollback delete session failed",
        rollbackError,
      );
    }
    throw error;
  }
}

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
  now: Date = new Date(),
): Promise<TrackSessionLap[]> {
  if (laps.length === 0) return [];

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
  const previous = await db
    .select()
    .from(trackSessionLap)
    .where(eq(trackSessionLap.sessionId, sessionId))
    .orderBy(asc(trackSessionLap.lapNumber));

  await db
    .delete(trackSessionLap)
    .where(eq(trackSessionLap.sessionId, sessionId));

  try {
    return await insertLapsForSession(sessionId, laps);
  } catch (error) {
    if (previous.length > 0) {
      try {
        await db.insert(trackSessionLap).values(
          previous.map((row) => ({
            id: row.id,
            sessionId: row.sessionId,
            lapNumber: row.lapNumber,
            lapTime: row.lapTime,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
          })),
        );
      } catch (restoreError) {
        console.error(
          "[track_sessions] restore laps after failed replace",
          restoreError,
        );
      }
    }
    throw error;
  }
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
