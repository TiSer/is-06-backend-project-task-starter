import { TrackSessionsSection } from "@/components/track-sessions/track-sessions-section";
import { HeroSection } from "@/components/hero-section";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { TrackCard } from "@/components/track-card";
import { heroStats, tracks } from "@/lib/data";

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

      <TrackSessionsSection />
    </PageShell>
  );
}
