/** Lap display times: M:SS.t or MM:SS.t (e.g. 1:04.2, 2:01.4). */

const LAP_TIME_PATTERN = /^(\d{1,2}):(\d{2})(?:\.(\d))?$/;

export function parseLapTimeMs(value: string): number | null {
  const trimmed = value.trim();
  const match = LAP_TIME_PATTERN.exec(trimmed);
  if (!match) return null;

  const minutes = Number.parseInt(match[1], 10);
  const seconds = Number.parseInt(match[2], 10);
  const tenths = match[3] ? Number.parseInt(match[3], 10) : 0;

  if (seconds > 59 || minutes > 99) return null;

  return minutes * 60_000 + seconds * 1_000 + tenths * 100;
}

export function formatLapTimeMs(ms: number): string {
  const totalTenths = Math.round(ms / 100);
  const minutes = Math.floor(totalTenths / 600);
  const seconds = Math.floor((totalTenths % 600) / 10);
  const tenths = totalTenths % 10;

  if (tenths > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${tenths}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}.0`;
}

export function computeLapStats(times: string[]): {
  lapCount: number;
  averageLap: string;
  bestLap: string;
} {
  const parsed = times
    .map((t) => parseLapTimeMs(t))
    .filter((ms): ms is number => ms !== null);

  if (parsed.length === 0) {
    return { lapCount: 0, averageLap: "—", bestLap: "—" };
  }

  const sum = parsed.reduce((acc, ms) => acc + ms, 0);
  const best = Math.min(...parsed);
  const avg = sum / parsed.length;

  return {
    lapCount: parsed.length,
    averageLap: formatLapTimeMs(avg),
    bestLap: formatLapTimeMs(best),
  };
}

export function compareLapTimes(a: string, b: string): number {
  const aMs = parseLapTimeMs(a);
  const bMs = parseLapTimeMs(b);
  if (aMs === null && bMs === null) return 0;
  if (aMs === null) return 1;
  if (bMs === null) return -1;
  return aMs - bMs;
}
