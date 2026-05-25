import type { TrackSessionJson } from "@/lib/track_sessions/serialize";
import type {
  CreateTrackSessionInput,
  UpdateTrackSessionInput,
} from "@/lib/validation/track_sessions";

export type TrackSessionsListResponse = {
  items: TrackSessionJson[];
  limit: number;
  offset: number;
};

export type ApiErrorBody = {
  error: string;
  detail?: unknown;
};

export class TrackSessionsApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: ApiErrorBody,
  ) {
    super(message);
    this.name = "TrackSessionsApiError";
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new TrackSessionsApiError(
      "Invalid JSON response",
      res.status,
      { error: res.statusText },
    );
  }
}

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await parseJson<ApiErrorBody>(res);
    throw new TrackSessionsApiError(
      body.error ?? res.statusText,
      res.status,
      body,
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return parseJson<T>(res);
}

export async function listTrackSessions(
  params?: { limit?: number; offset?: number },
): Promise<TrackSessionsListResponse> {
  const search = new URLSearchParams();
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const qs = search.toString();
  return request<TrackSessionsListResponse>(
    `/api/v1/track_sessions${qs ? `?${qs}` : ""}`,
  );
}

export async function createTrackSession(
  body: CreateTrackSessionInput,
): Promise<TrackSessionJson> {
  return request<TrackSessionJson>("/api/v1/track_sessions", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateTrackSession(
  id: string,
  body: UpdateTrackSessionInput,
): Promise<TrackSessionJson> {
  return request<TrackSessionJson>(`/api/v1/track_sessions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function deleteTrackSession(id: string): Promise<void> {
  await request<void>(`/api/v1/track_sessions/${id}`, {
    method: "DELETE",
  });
}
