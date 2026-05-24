import Image from "next/image";
import Link from "next/link";
import { RacingBadge } from "@/components/racing-badge";
import { Button } from "@/components/ui/button";
import { galleryImageQuality, galleryPhotos } from "@/lib/data";
import { cn } from "@/lib/utils";

const pillars = [
  {
    title: "Track memories",
    description:
      "Every knee-down, every pit-lane grin — photos from real track days, not stock shots.",
    href: "/gallery",
    cta: "Browse gallery",
  },
  {
    title: "Lap chronicle",
    description:
      "Sessions, personal bests, and the story behind every second shaved off your time.",
    href: "/dashboard",
    cta: "Open dashboard",
  },
  {
    title: "Every circuit",
    description:
      "From tight kart layouts to flowing GP-style tracks — one bike, many venues.",
    href: "/records",
    cta: "View records",
  },
] as const;

const bentoSpans = [
  "col-span-2 row-span-2 min-h-[280px] sm:min-h-[340px] lg:min-h-[480px]",
  "min-h-[200px] sm:min-h-[240px]",
  "min-h-[200px] sm:min-h-[240px]",
  "min-h-[200px] sm:min-h-[240px]",
  "min-h-[200px] sm:min-h-[240px]",
  "col-span-2 min-h-[200px] sm:min-h-[260px] lg:col-span-1",
] as const;

export function HomeLanding() {
  const heroPhoto =
    galleryPhotos.find((p) => p.id === "p5") ?? galleryPhotos[0];
  const gridPhotos = heroPhoto
    ? galleryPhotos.filter((p) => p.id !== heroPhoto.id)
    : [];

  return (
    <div className="flex flex-col">
      {/* Cinematic hero */}
      <section className="relative min-h-[min(92vh,720px)] overflow-hidden">
        {heroPhoto ? (
          <Image
            src={heroPhoto.src}
            alt={heroPhoto.title}
            fill
            priority
            quality={galleryImageQuality}
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-elevated" aria-hidden="true" />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/20"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent lg:via-background/25"
          aria-hidden="true"
        />

        <div className="relative flex min-h-[min(92vh,720px)] flex-col justify-end px-page-mobile pb-14 pt-28 lg:px-page-desktop lg:pb-20 lg:pt-32">
          <RacingBadge className="mb-5 w-fit">Kawasaki Ninja</RacingBadge>
          <h1 className="max-w-3xl text-display-mobile font-extrabold tracking-tight text-foreground lg:text-display">
            Where asphalt meets
            <span className="block text-primary">adrenaline.</span>
          </h1>
          <p className="mt-5 max-w-xl text-body-lg text-muted-foreground">
            A personal shrine to track days — the green machine, the rubber on
            the pavement, and the moments worth framing. No fluff. Just riding.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/gallery" />}
              size="lg"
            >
              See track photos
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/dashboard" />}
              variant="secondary"
              size="lg"
            >
              Your season
            </Button>
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 h-1 bg-primary"
          aria-hidden="true"
        />
      </section>

      {/* Manifesto */}
      <section className="border-b border-border px-page-mobile py-14 lg:px-page-desktop lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-badge font-bold tracking-[0.2em] text-primary uppercase">
            Track day culture
          </p>
          <h2 className="mt-4 text-h1 font-bold text-foreground lg:text-[2rem]">
            Built for riders who live for the next session
          </h2>
          <p className="mt-5 text-body-lg leading-relaxed text-muted-foreground">
            This isn&apos;t a generic motorsport blog. It&apos;s your pit wall —
            a place to relive DniproKart mornings, Autodrom afternoons, and the
            quiet focus before you roll onto the grid. Photos capture the
            emotion; the dashboard holds the numbers when you&apos;re ready.
          </p>
        </div>
      </section>

      {/* Photo bento */}
      {gridPhotos.length > 0 && (
      <section className="px-page-mobile py-14 lg:px-page-desktop lg:py-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-badge font-bold tracking-wide text-primary uppercase">
              On camera
            </p>
            <h2 className="mt-2 text-h2 font-bold text-foreground">
              Moments from the circuit
            </h2>
          </div>
          <Link
            href="/gallery"
            className="text-label font-semibold text-primary transition-colors hover:text-(--primary-hover) focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Full gallery →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {gridPhotos.map((photo, index) => (
            <Link
              key={photo.id}
              href="/gallery"
              className={cn(
                "group relative overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                bentoSpans[index] ?? "min-h-[200px]"
              )}
            >
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                quality={galleryImageQuality}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-label font-semibold text-foreground">
                  {photo.title}
                </p>
                <p className="text-caption text-muted-foreground">
                  {photo.track}
                </p>
              </div>
              <div className="absolute inset-x-0 top-0 h-0.5 scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </div>
      </section>
      )}

      {/* Pillars */}
      <section className="border-t border-border bg-tertiary/50 px-page-mobile py-14 lg:px-page-desktop lg:py-16">
        <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="flex flex-col gap-3 rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/30"
            >
              <div className="h-0.5 w-10 bg-primary" aria-hidden="true" />
              <h3 className="text-h2 font-bold text-foreground">
                {pillar.title}
              </h3>
              <p className="flex-1 text-body text-muted-foreground">
                {pillar.description}
              </p>
              <Link
                href={pillar.href}
                className="text-label font-semibold text-primary transition-colors hover:text-(--primary-hover) focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {pillar.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden px-page-mobile py-16 lg:px-page-desktop lg:py-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_65%)] opacity-[0.07]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-h1 font-bold text-foreground">
            Ready to relive your last track day?
          </h2>
          <p className="mt-4 text-body-lg text-muted-foreground">
            Dive into photos, lap times, and records — everything in one place
            for your Ninja season.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/dashboard" />}
              size="lg"
            >
              Go to dashboard
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/records" />}
              variant="secondary"
              size="lg"
            >
              Track records
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
