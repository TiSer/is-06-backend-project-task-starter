import { describe, expect, it } from "vitest";
import {
  compareLapTimes,
  computeLapStats,
  formatLapTimeMs,
  parseLapTimeMs,
} from "@/lib/track_sessions/lap-times";

describe("lap-times", () => {
  it("parses and formats M:SS.t", () => {
    const ms = parseLapTimeMs("1:04.2");
    expect(ms).toBe(64_200);
    expect(formatLapTimeMs(64_200)).toBe("1:04.2");
  });

  it("computes average and best from laps", () => {
    const stats = computeLapStats(["1:06.0", "1:04.2", "1:05.0"]);
    expect(stats.lapCount).toBe(3);
    expect(stats.bestLap).toBe("1:04.2");
    expect(stats.averageLap).toMatch(/^1:0[45]/);
  });

  it("compareLapTimes orders fastest first", () => {
    expect(compareLapTimes("1:04.2", "1:06.0")).toBeLessThan(0);
  });
});
