import Image from "next/image";
import { galleryImageQuality } from "@/lib/data";
import { cn } from "@/lib/utils";

type PhotoCardProps = {
  title: string;
  track: string;
  date: string;
  src: string;
  className?: string;
};

export function PhotoCard({ title, track, date, src, className }: PhotoCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/40",
        className
      )}
    >
      <div className="relative aspect-[3/4] w-full min-h-[280px] overflow-hidden bg-elevated sm:min-h-[320px]">
        <Image
          src={src}
          alt={title}
          fill
          quality={galleryImageQuality}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-x-0 top-0 h-0.5 bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
        <span className="absolute bottom-3 left-3 rounded-sm bg-background/80 px-2 py-1 text-badge font-bold tracking-wide text-primary uppercase backdrop-blur-sm">
          {track}
        </span>
      </div>
      <div className="flex flex-col gap-1 p-3">
        <h3 className="text-label font-semibold text-foreground">{title}</h3>
        <p className="text-caption text-muted-foreground">{date}</p>
      </div>
    </article>
  );
}
