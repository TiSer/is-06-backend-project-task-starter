import Link from "next/link";
import { DashboardLapTable } from "@/components/dashboard-lap-table";
import { HeroSection } from "@/components/hero-section";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { SessionCard } from "@/components/session-card";
import { StatCard } from "@/components/stat-card";
import { TrackCard } from "@/components/track-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { heroStats, lapTimes, sessions, tracks } from "@/lib/data";

export default function DashboardPage() {
  const featuredTracks = tracks.slice(0, 3);

  return (
    <PageShell>
      <HeroSection
        badge="Season overview"
        title="Kawasaki Ninja"
        subtitle="Dominate the circuit. Log every lap. Push limits at DniproKart and beyond."
        primaryCta={{ label: "View Records", href: "/records" }}
        secondaryCta={{ label: "Gallery", href: "/gallery" }}
        imageSrc="/gallery/track-day-04.jpg"
        imageAlt="Ninja mid corner on track"
        className="pb-4"
      />

      <section aria-label="Quick stats" className="flex gap-3">
        <StatCard label="Best Lap" value={heroStats.bestLap} />
        <StatCard label="Sessions" value={heroStats.sessions} />
        <StatCard label="Tracks" value={heroStats.tracks} />
      </section>

      <section className="mt-10">
        <SectionHeader
          title="Recent Tracks"
          actionLabel="See all"
          actionHref="/records"
        />
        <div className="mt-4 space-y-3">
          {featuredTracks.map((track) => (
            <TrackCard
              key={track.id}
              name={track.name}
              personalBest={track.personalBest}
              sessionCount={track.sessionCount}
              href="/records"
            />
          ))}
        </div>
      </section>

      <section className="mt-12 border-t border-border pt-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-h1 font-bold text-foreground">Lap times</h2>
            <p className="mt-2 text-body text-muted-foreground">
              Session history and personal bests across your track days.
            </p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/records" />}
            variant="secondary"
          >
            + New Session
          </Button>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-8">
          <section className="min-w-0 flex-1">
            <SectionHeader title="Recent laps" className="mb-4 border-0 pb-0" />
            <div className="hidden lg:block">
              <DashboardLapTable rows={lapTimes} />
            </div>
            <div className="space-y-3 lg:hidden">
              {lapTimes.map((row) => (
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
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  title={session.title}
                  lapCount={session.lapCount}
                  averageLap={session.averageLap}
                />
              ))}
            </div>
          </aside>
        </div>

        <p className="mt-6 text-caption text-muted-foreground lg:hidden">
          Session tooltips are available on desktop lap table.
        </p>
      </section>
    </PageShell>
  );
}
