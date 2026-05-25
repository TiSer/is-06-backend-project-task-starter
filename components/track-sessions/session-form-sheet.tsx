"use client";

import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { tracks } from "@/lib/data";
import { buildTitle } from "@/lib/track_sessions/display";
import { computeLapStats } from "@/lib/track_sessions/lap-times";
import type { TrackSessionJson } from "@/lib/track_sessions/serialize";
import type { CreateTrackSessionInput } from "@/lib/validation/track_sessions";

export type SessionFormValues = {
  trackId: string;
  title: string;
  sessionDate: string;
  published: boolean;
  lapTimes: string[];
};

type SessionFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  initial?: TrackSessionJson | null;
  onSubmit: (values: CreateTrackSessionInput) => Promise<void>;
};

const defaultLapTimes = ["1:00.0"];

const defaultValues: SessionFormValues = {
  trackId: tracks[0]?.id ?? "dniprokart",
  title: "",
  sessionDate: new Date().toISOString().slice(0, 10),
  published: false,
  lapTimes: [...defaultLapTimes],
};

function valuesForMode(
  mode: "create" | "edit",
  initial?: TrackSessionJson | null,
): SessionFormValues {
  if (mode === "edit" && initial) {
    const lapTimes =
      initial.laps.length > 0
        ? initial.laps
            .slice()
            .sort((a, b) => a.lapNumber - b.lapNumber)
            .map((l) => l.time)
        : [...defaultLapTimes];

    return {
      trackId: initial.trackId,
      title: initial.title,
      sessionDate: initial.sessionDate,
      published: initial.published,
      lapTimes,
    };
  }
  return { ...defaultValues, lapTimes: [...defaultLapTimes] };
}

type SessionFormBodyProps = {
  mode: "create" | "edit";
  initial?: TrackSessionJson | null;
  onSubmit: (values: CreateTrackSessionInput) => Promise<void>;
  onClose: () => void;
};

function SessionFormBody({
  mode,
  initial,
  onSubmit,
  onClose,
}: SessionFormBodyProps) {
  const [values, setValues] = useState(() => valuesForMode(mode, initial));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const lapStats = useMemo(
    () => computeLapStats(values.lapTimes.filter((t) => t.trim().length > 0)),
    [values.lapTimes],
  );

  function updateMeta<K extends keyof Omit<SessionFormValues, "lapTimes">>(
    key: K,
    value: SessionFormValues[K],
  ) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "trackId" || key === "sessionDate") {
        next.title = buildTitle(next.trackId, next.sessionDate);
      }
      return next;
    });
  }

  function updateLap(index: number, time: string) {
    setValues((prev) => {
      const lapTimes = [...prev.lapTimes];
      lapTimes[index] = time;
      return { ...prev, lapTimes };
    });
  }

  function addLap() {
    setValues((prev) => ({
      ...prev,
      lapTimes: [...prev.lapTimes, ""],
    }));
  }

  function removeLap(index: number) {
    setValues((prev) => {
      if (prev.lapTimes.length <= 1) return prev;
      return {
        ...prev,
        lapTimes: prev.lapTimes.filter((_, i) => i !== index),
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const laps = values.lapTimes
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((time) => ({ time }));

    if (laps.length === 0) {
      setError("Add at least one lap with a valid time (e.g. 1:04.2).");
      setPending(false);
      return;
    }

    try {
      await onSubmit({
        trackId: values.trackId,
        title: values.title.trim(),
        sessionDate: values.sessionDate,
        published: values.published,
        laps,
      });
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not save session";
      setError(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>
          {mode === "create" ? "New track session" : "Edit session"}
        </SheetTitle>
        <SheetDescription>
          Add each lap time. Best and average are calculated automatically.
        </SheetDescription>
      </SheetHeader>

      <form
        onSubmit={handleSubmit}
        className="flex max-h-[calc(100vh-8rem)] flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4"
      >
        {error && (
          <div
            className="rounded-sm border border-destructive/50 bg-destructive/10 px-3 py-2 text-caption text-destructive"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="session-track">Track</Label>
          <select
            id="session-track"
            value={values.trackId}
            onChange={(e) => updateMeta("trackId", e.target.value)}
            className="flex h-10 w-full rounded-sm border border-border bg-secondary px-3 text-body text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {tracks.map((track) => (
              <option key={track.id} value={track.id}>
                {track.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="session-title">Title</Label>
          <Input
            id="session-title"
            value={values.title}
            onChange={(e) => updateMeta("title", e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="session-date">Session date</Label>
          <Input
            id="session-date"
            type="date"
            value={values.sessionDate}
            onChange={(e) => updateMeta("sessionDate", e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <Label>Lap times</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addLap}
              className="gap-1"
            >
              <Plus className="size-4" />
              Add lap
            </Button>
          </div>

          <ul className="flex flex-col gap-2">
            {values.lapTimes.map((time, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-12 shrink-0 text-caption text-muted-foreground">
                  Lap {index + 1}
                </span>
                <Input
                  value={time}
                  onChange={(e) => updateLap(index, e.target.value)}
                  placeholder="1:04.2"
                  aria-label={`Lap ${index + 1} time`}
                  required={index === 0}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeLap(index)}
                  disabled={values.lapTimes.length <= 1}
                  aria-label={`Remove lap ${index + 1}`}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>

          {lapStats.lapCount > 0 && (
            <p className="rounded-sm border border-border bg-elevated/50 px-3 py-2 text-caption text-muted-foreground">
              <span className="font-medium text-primary">
                Best {lapStats.bestLap}
              </span>
              {" · "}
              Avg {lapStats.averageLap}
              {" · "}
              {lapStats.lapCount} lap{lapStats.lapCount === 1 ? "" : "s"}
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 text-caption text-muted-foreground">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(e) => updateMeta("published", e.target.checked)}
            className="size-4 rounded border-border accent-primary"
          />
          Published (visible when signed out)
        </label>

        <SheetFooter className="sticky bottom-0 bg-card px-0 pt-2">
          <Button type="submit" disabled={pending} className="w-full">
            {pending
              ? "Saving…"
              : mode === "create"
                ? "Create session"
                : "Save changes"}
          </Button>
        </SheetFooter>
      </form>
    </>
  );
}

export function SessionFormSheet({
  open,
  onOpenChange,
  mode,
  initial,
  onSubmit,
}: SessionFormSheetProps) {
  const formKey =
    mode === "edit" && initial ? `edit-${initial.id}` : "create";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        {open ? (
          <SessionFormBody
            key={formKey}
            mode={mode}
            initial={initial}
            onSubmit={onSubmit}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
