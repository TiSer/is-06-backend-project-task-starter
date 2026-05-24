import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RacingBadge } from "@/components/racing-badge";
import { galleryImageQuality } from "@/lib/data";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  badge?: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  imageSrc?: string;
  imageAlt?: string;
  imageLabel?: string;
  className?: string;
};

export function HeroSection({
  badge = "Track Weapon",
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt,
  imageLabel = "Ninja — Track Day",
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:gap-12 lg:py-12",
        className
      )}
    >
      <div className="flex flex-1 flex-col gap-5">
        <RacingBadge>{badge}</RacingBadge>
        <h1 className="text-display-mobile font-extrabold text-foreground lg:text-display">
          {title}
        </h1>
        <p className="max-w-xl text-body-lg text-muted-foreground">{subtitle}</p>
        <div className="flex flex-wrap gap-3">
          <Button
            nativeButton={false}
            render={<Link href={primaryCta.href} />}
            size="lg"
          >
            {primaryCta.label}
          </Button>
          {secondaryCta && (
            <Button
              nativeButton={false}
              render={<Link href={secondaryCta.href} />}
              variant="secondary"
              size="lg"
            >
              {secondaryCta.label}
            </Button>
          )}
        </div>
      </div>
      <div className="relative aspect-[335/180] w-full overflow-hidden rounded-lg border border-border bg-elevated lg:aspect-[520/360] lg:max-w-xl lg:flex-1">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? imageLabel}
            fill
            quality={galleryImageQuality}
            sizes="(max-width: 1024px) 100vw, 640px"
            className="object-cover"
            priority
          />
        ) : (
          <span className="p-4 text-label font-medium text-muted-foreground">
            {imageLabel}
          </span>
        )}
        <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
        {!imageSrc && <span className="sr-only">{imageLabel}</span>}
      </div>
    </section>
  );
}
