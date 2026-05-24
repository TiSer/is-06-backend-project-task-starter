"use client";

import { SessionCard } from "@/components/session-card";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Track } from "@/lib/data";
import { sessions } from "@/lib/data";

type RecordsTabsProps = {
  tracks: Track[];
};

export function RecordsTabs({ tracks }: RecordsTabsProps) {
  if (tracks.length === 0) {
    return (
      <Card className="rounded-md border border-border bg-card py-0 ring-0">
        <CardContent className="px-4 py-8 text-body text-muted-foreground">
          No tracks recorded yet. Add a track to start logging sessions.
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue={tracks[0].id} className="w-full">
      <TabsList className="mb-6 h-auto w-full flex-wrap justify-start gap-1 bg-elevated p-1 lg:w-auto">
        {tracks.map((track) => (
          <TabsTrigger
            key={track.id}
            value={track.id}
            className="rounded-sm px-4 py-2 text-label data-active:bg-card data-active:text-primary"
          >
            {track.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {tracks.map((track) => {
        const trackSessions = sessions.filter((s) => s.trackId === track.id);

        return (
          <TabsContent key={track.id} value={track.id} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Personal Best" value={track.personalBest} />
              <StatCard
                label="Sessions"
                value={String(track.sessionCount)}
              />
              <StatCard label="Layout" value={track.layout.split("·")[0].trim()} />
            </div>
            <p className="text-body text-muted-foreground">{track.layout}</p>
            <div className="space-y-3">
              <h2 className="text-h2 font-bold text-foreground">
                Session history
              </h2>
              {trackSessions.length > 0 ? (
                trackSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    title={session.title}
                    lapCount={session.lapCount}
                    averageLap={session.averageLap}
                  />
                ))
              ) : (
                <Card className="rounded-md border border-border bg-card py-0 ring-0">
                  <CardContent className="px-4 py-6 text-body text-muted-foreground">
                    No sessions logged for this track yet.
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
