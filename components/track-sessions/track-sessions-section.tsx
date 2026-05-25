"use client";

import { useCallback, useEffect, useState } from "react";
import { DashboardLapTable } from "@/components/dashboard-lap-table";
import { AuthSheet } from "@/components/auth/auth-sheet";
import { SessionFormSheet } from "@/components/track-sessions/session-form-sheet";
import { SectionHeader } from "@/components/section-header";
import { SessionCard } from "@/components/session-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  createTrackSession,
  deleteTrackSession,
  listTrackSessions,
  updateTrackSession,
} from "@/lib/api/track_sessions-client";
import { authClient } from "@/lib/auth-client";
import {
  formatDisplayDate,
  trackNameFromId,
  trackSessionToLapRow,
} from "@/lib/track_sessions/display";
import { compareLapTimes } from "@/lib/track_sessions/lap-times";
import type { TrackSessionJson } from "@/lib/track_sessions/serialize";
import { apiErrorMessage } from "@/lib/api/error-message";
import type { CreateTrackSessionInput } from "@/lib/validation/track_sessions";

export function TrackSessionsSection() {
  const { data: authSession, isPending: authPending } = authClient.useSession();
  const [items, setItems] = useState<TrackSessionJson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<TrackSessionJson | null>(null);

  const isAdmin =
    (authSession?.user as { role?: string } | undefined)?.role === "admin";

  const loadSessions = useCallback(async () => {
    if (!authSession) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await listTrackSessions({ limit: 100 });
      const sorted = [...data.items].sort(
        (a, b) =>
          new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime(),
      );
      setItems(sorted);
    } catch (err) {
      setError(apiErrorMessage(err));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [authSession]);

  useEffect(() => {
    if (authPending) return;
    queueMicrotask(() => {
      void loadSessions();
    });
  }, [authPending, loadSessions]);

  function openCreate() {
    if (!authSession) {
      setAuthOpen(true);
      return;
    }
    setFormMode("create");
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(session: TrackSessionJson) {
    setFormMode("edit");
    setEditing(session);
    setFormOpen(true);
  }

  async function handleFormSubmit(values: CreateTrackSessionInput) {
    if (formMode === "create") {
      await createTrackSession(values);
    } else if (editing) {
      await updateTrackSession(editing.id, values);
    } else {
      throw new Error("Nothing to save");
    }

    setFormOpen(false);
    setEditing(null);

    try {
      await loadSessions();
    } catch (err) {
      setError(
        `Session saved, but the list could not refresh: ${apiErrorMessage(err)}`,
      );
    }
  }

  async function handleDelete(session: TrackSessionJson) {
    if (
      !window.confirm(
        `Delete "${session.title}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await deleteTrackSession(session.id);
      await loadSessions();
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  const lapRows = items.map((s, i) => trackSessionToLapRow(s, items.length - 1 - i));

  const bestLap =
    items.length > 0
      ? items.reduce(
          (best, s) =>
            compareLapTimes(s.bestLap, best) < 0 ? s.bestLap : best,
          items[0].bestLap,
        )
      : "—";

  return (
    <section className="mt-12 border-t border-border pt-10">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-h1 font-bold text-foreground">Lap times</h2>
          <p className="mt-2 text-body text-muted-foreground">
            Session history and personal bests across your track days.
          </p>
          {authSession && (
            <p className="mt-1 text-caption text-primary">
              {items.length} session{items.length === 1 ? "" : "s"} · Best lap{" "}
              {bestLap}
            </p>
          )}
        </div>
        <Button type="button" variant="secondary" onClick={openCreate}>
          + New Session
        </Button>
      </div>

      {!authSession && !authPending && (
        <Card className="mb-6 gap-0 border-dashed border-border bg-card/50 py-0 ring-0">
          <CardContent className="flex flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-body text-muted-foreground">
              Sign in to create, edit, and sync track sessions with the API.
            </p>
            <Button type="button" onClick={() => setAuthOpen(true)}>
              Sign in
            </Button>
          </CardContent>
        </Card>
      )}

      {error && (
        <p className="mb-4 text-caption text-destructive" role="alert">
          {error}
        </p>
      )}

      {authSession && loading && (
        <p className="text-caption text-muted-foreground">Loading sessions…</p>
      )}

      {authSession && !loading && items.length === 0 && (
        <p className="text-body text-muted-foreground">
          No sessions yet. Tap &quot;+ New Session&quot; to log your first track day.
        </p>
      )}

      {authSession && !loading && items.length > 0 && (
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-8">
          <section className="min-w-0 flex-1">
            <SectionHeader title="Recent laps" className="mb-4 border-0 pb-0" />
            <div className="hidden lg:block">
              <DashboardLapTable rows={lapRows} />
            </div>
            <div className="space-y-3 lg:hidden">
              {lapRows.map((row) => (
                <Card
                  key={row.id}
                  className="gap-0 rounded-md border border-border bg-card py-0 ring-0"
                >
                  <CardContent className="flex items-center justify-between gap-3 px-4 py-4">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="text-label font-semibold text-foreground">
                        {row.session} · {row.track}
                      </span>
                      <span className="text-caption text-muted-foreground">
                        {row.date}
                      </span>
                    </div>
                    <span className="text-label font-bold text-primary">
                      {row.bestLap}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <aside className="w-full shrink-0 lg:w-[400px]">
            <SectionHeader
              title="Track sessions"
              className="mb-4 border-0 pb-0"
            />
            <div className="space-y-3">
              {items.map((session) => (
                <SessionCard
                  key={session.id}
                  title={session.title}
                  lapCount={session.lapCount}
                  averageLap={session.averageLap}
                  bestLap={session.bestLap}
                  showActions
                  onEdit={() => openEdit(session)}
                  onDelete={isAdmin ? () => void handleDelete(session) : undefined}
                />
              ))}
            </div>
            <p className="mt-3 text-caption text-muted-foreground">
              {formatDisplayDate(items[0]?.sessionDate ?? "")} — latest ·{" "}
              {trackNameFromId(items[0]?.trackId ?? "")}
              {!isAdmin && " · Delete requires admin role"}
            </p>
          </aside>
        </div>
      )}

      <AuthSheet
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => void loadSessions()}
      />

      <SessionFormSheet
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        initial={editing}
        onSubmit={handleFormSubmit}
      />
    </section>
  );
}
