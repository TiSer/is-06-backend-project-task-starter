import assert from "node:assert/strict";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { unauthorized } from "@/lib/errors";

const {
  mockRequireSession,
  mockGetSession,
  mockRequireRole,
  mockInsertReturning,
  mockLapInsertReturning,
  mockInsertValues,
  mockInsert,
  mockSelectLimit,
  mockSelect,
  mockUpdateReturning,
  mockUpdate,
  mockDelete,
  mockFetchLapsBySessionIds,
} = vi.hoisted(() => {
  const mockInsertReturning = vi.fn();
  const mockLapInsertReturning = vi.fn();
  const mockInsertValues = vi.fn(() => ({ returning: mockInsertReturning }));
  const mockInsert = vi.fn(() => ({ values: mockInsertValues }));

  const mockSelectLimit = vi.fn();
  const mockSelectWhere = vi.fn(() => ({ limit: mockSelectLimit }));
  const mockSelectFrom = vi.fn(() => ({ where: mockSelectWhere }));
  const mockSelect = vi.fn(() => ({ from: mockSelectFrom }));

  const mockUpdateReturning = vi.fn();
  const mockUpdateWhere = vi.fn(() => ({ returning: mockUpdateReturning }));
  const mockUpdateSet = vi.fn(() => ({ where: mockUpdateWhere }));
  const mockUpdate = vi.fn(() => ({ set: mockUpdateSet }));

  const mockDeleteWhere = vi.fn().mockResolvedValue(undefined);
  const mockDelete = vi.fn(() => ({ where: mockDeleteWhere }));

  const mockFetchLapsBySessionIds = vi.fn();

  return {
    mockRequireSession: vi.fn(),
    mockGetSession: vi.fn(),
    mockRequireRole: vi.fn(),
    mockInsertReturning,
    mockLapInsertReturning,
    mockInsertValues,
    mockInsert,
    mockSelectLimit,
    mockSelect,
    mockUpdateReturning,
    mockUpdate,
    mockDelete,
    mockFetchLapsBySessionIds,
  };
});

vi.mock("@/lib/rbac", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/rbac")>();
  return {
    ...actual,
    requireSession: (...args: Parameters<typeof actual.requireSession>) =>
      mockRequireSession(...args),
    getSession: (...args: Parameters<typeof actual.getSession>) =>
      mockGetSession(...args),
    requireRole: (...args: Parameters<typeof actual.requireRole>) =>
      mockRequireRole(...args),
  };
});

vi.mock("@/lib/db", () => ({
  db: {
    insert: mockInsert,
    select: mockSelect,
    update: mockUpdate,
    delete: mockDelete,
  },
}));

vi.mock("nanoid", () => ({
  nanoid: () => "ts_sample01",
}));

vi.mock("@/lib/track_sessions/laps-db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/track_sessions/laps-db")>();
  return {
    ...actual,
    fetchLapsBySessionIds: (...args: Parameters<typeof actual.fetchLapsBySessionIds>) =>
      mockFetchLapsBySessionIds(...args),
    replaceLapsForSession: vi.fn(),
  };
});

import { POST as postTrackSessions } from "@/app/api/v1/track_sessions/route";
import { PATCH as patchTrackSessionById } from "@/app/api/v1/track_sessions/[id]/route";

const ownerSession = {
  user: {
    id: "user-owner",
    email: "owner@example.com",
    name: "Owner",
    role: "user",
  },
  session: { id: "auth-session-1", userId: "user-owner" },
};

const otherSession = {
  user: {
    id: "user-other",
    email: "other@example.com",
    name: "Other",
    role: "user",
  },
  session: { id: "auth-session-2", userId: "user-other" },
};

const sampleRow = {
  id: "ts_sample01",
  authorId: "user-owner",
  trackId: "dniprokart",
  title: "DniproKart — May 18",
  sessionDate: "2026-05-18",
  published: false,
  createdAt: new Date("2026-05-18T10:00:00.000Z"),
  updatedAt: new Date("2026-05-18T10:00:00.000Z"),
};

const sampleLapRows = [
  {
    id: "lap_1",
    sessionId: sampleRow.id,
    lapNumber: 1,
    lapTime: "1:06.0",
    createdAt: new Date("2026-05-18T10:00:00.000Z"),
    updatedAt: new Date("2026-05-18T10:00:00.000Z"),
  },
  {
    id: "lap_2",
    sessionId: sampleRow.id,
    lapNumber: 2,
    lapTime: "1:04.2",
    createdAt: new Date("2026-05-18T10:00:00.000Z"),
    updatedAt: new Date("2026-05-18T10:00:00.000Z"),
  },
];

const validCreateBody = {
  trackId: "dniprokart",
  title: "DniproKart — May 18",
  sessionDate: "2026-05-18",
  published: false,
  laps: [{ time: "1:06.0" }, { time: "1:04.2" }],
};

function postRequest(body: unknown) {
  return new Request("http://localhost/api/v1/track_sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function patchRequest(id: string, body: unknown) {
  return new Request(`http://localhost/api/v1/track_sessions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/v1/track_sessions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInsertReturning.mockResolvedValue([sampleRow]);
    mockLapInsertReturning.mockResolvedValue(sampleLapRows);
    mockInsertValues
      .mockImplementationOnce(() => ({ returning: mockInsertReturning }))
      .mockImplementationOnce(() => ({ returning: mockLapInsertReturning }));
    mockFetchLapsBySessionIds.mockResolvedValue(
      new Map([[sampleRow.id, sampleLapRows]]),
    );
  });

  it("returns 201 for valid body with session", async () => {
    mockRequireSession.mockResolvedValue(ownerSession);

    const res = await postTrackSessions(postRequest(validCreateBody));

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBe(sampleRow.id);
    expect(body.authorId).toBe("user-owner");
    expect(body.lapCount).toBe(2);
    expect(body.bestLap).toBe("1:04.2");
    expect(body.laps).toHaveLength(2);
    expect(mockInsert).toHaveBeenCalled();
  });

  it("returns 401 when unauthenticated", async () => {
    mockRequireSession.mockImplementation(() => {
      throw unauthorized();
    });

    const res = await postTrackSessions(postRequest(validCreateBody));

    expect(res.status).toBe(401);
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid body", async () => {
    mockRequireSession.mockResolvedValue(ownerSession);

    const res = await postTrackSessions(
      postRequest({
        ...validCreateBody,
        trackId: "Not A Slug",
      }),
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("BadRequest");
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("returns 400 when laps are missing", async () => {
    mockRequireSession.mockResolvedValue(ownerSession);

    const res = await postTrackSessions(
      postRequest({
        trackId: "dniprokart",
        title: "Test",
        sessionDate: "2026-05-18",
      }),
    );

    expect(res.status).toBe(400);
    expect(mockInsert).not.toHaveBeenCalled();
  });
});

describe("PATCH /api/v1/track_sessions/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelectLimit.mockResolvedValue([sampleRow]);
    mockUpdateReturning.mockResolvedValue([
      { ...sampleRow, title: "Updated title" },
    ]);
    mockFetchLapsBySessionIds.mockResolvedValue(
      new Map([[sampleRow.id, sampleLapRows]]),
    );
  });

  it("returns 403 when session user is not the owner", async () => {
    mockRequireSession.mockResolvedValue(otherSession);

    const res = await patchTrackSessionById(
      patchRequest(sampleRow.id, { title: "Updated title" }),
      { params: Promise.resolve({ id: sampleRow.id }) },
    );
    assert(res);

    expect(res.status).toBe(403);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("returns 200 when owner patches", async () => {
    mockRequireSession.mockResolvedValue(ownerSession);

    const res = await patchTrackSessionById(
      patchRequest(sampleRow.id, { title: "Updated title" }),
      { params: Promise.resolve({ id: sampleRow.id }) },
    );
    assert(res);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.title).toBe("Updated title");
    expect(body.bestLap).toBe("1:04.2");
    expect(mockUpdate).toHaveBeenCalled();
  });
});
