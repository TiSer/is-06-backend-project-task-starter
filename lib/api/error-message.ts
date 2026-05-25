import { TrackSessionsApiError } from "@/lib/api/track_sessions-client";

function collectFieldMessages(errors: Record<string, unknown>): string[] {
  const messages: string[] = [];

  for (const value of Object.values(errors)) {
    if (typeof value === "string") {
      messages.push(value);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") messages.push(item);
        else if (item && typeof item === "object") {
          messages.push(...collectFieldMessages(item as Record<string, unknown>));
        }
      }
    } else if (value && typeof value === "object") {
      messages.push(...collectFieldMessages(value as Record<string, unknown>));
    }
  }

  return messages;
}

export function apiErrorMessage(err: unknown): string {
  if (err instanceof TrackSessionsApiError) {
    const detail = err.body?.detail;
    if (
      detail &&
      typeof detail === "object" &&
      "errors" in detail &&
      detail.errors &&
      typeof detail.errors === "object"
    ) {
      const messages = collectFieldMessages(
        detail.errors as Record<string, unknown>,
      );
      if (messages.length > 0) return messages.join(" · ");
    }

    if (err.status === 401) {
      return "Session expired or missing. Sign in again, then retry.";
    }
    if (err.status === 500) {
      return "Server error — check the terminal running npm run dev for details. If the DB schema changed, run: npm run db:migrate";
    }
    if (err.status === 400 && err.message === "BadRequest") {
      return "Invalid session data. Check lap times (e.g. 1:04.2) and date.";
    }

    return err.message;
  }

  if (err instanceof Error) {
    if (err.message.includes("JSON")) {
      return "Unexpected server response. Check the dev server terminal for errors.";
    }
    return err.message;
  }

  return "Request failed";
}
