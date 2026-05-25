import type { LapTimeRow } from "@/components/lap-time-table";
import { tracks } from "@/lib/data";
import type { TrackSessionJson } from "@/lib/track_sessions/serialize";

export function trackNameFromId(trackId: string): string {
  return tracks.find((t) => t.id === trackId)?.name ?? trackId;
}

export function formatDisplayDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function trackSessionToLapRow(
  session: TrackSessionJson,
  index: number,
): LapTimeRow {
  return {
    id: session.id,
    session: `#${index + 1}`,
    track: trackNameFromId(session.trackId),
    bestLap: session.bestLap,
    date: formatDisplayDate(session.sessionDate),
  };
}

export function buildTitle(trackId: string, sessionDate: string): string {
  return `${trackNameFromId(trackId)} — ${formatDisplayDate(sessionDate)}`;
}
