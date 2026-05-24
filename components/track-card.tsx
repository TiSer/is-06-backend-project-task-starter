import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TrackCardProps = {
  name: string;
  personalBest: string;
  sessionCount: number;
  href?: string;
  className?: string;
};

export function TrackCard({
  name,
  personalBest,
  sessionCount,
  href,
  className,
}: TrackCardProps) {
  const content = (
    <Card
      className={cn(
        "gap-0 rounded-md border border-border bg-card py-0 ring-0 transition-colors hover:bg-muted/50",
        href && "cursor-pointer",
        className
      )}
    >
      <CardContent className="flex items-center justify-between gap-3 px-3.5 py-3.5">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-label font-bold text-foreground">{name}</span>
          <span className="text-caption text-muted-foreground">
            PB {personalBest} · {sessionCount}{" "}
            {sessionCount === 1 ? "session" : "sessions"}
          </span>
        </div>
        <ChevronRight
          className="size-5 shrink-0 text-primary"
          aria-hidden="true"
        />
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {content}
      </Link>
    );
  }

  return content;
}
