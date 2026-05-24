import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SessionCardProps = {
  title: string;
  lapCount: number;
  averageLap: string;
  className?: string;
};

export function SessionCard({
  title,
  lapCount,
  averageLap,
  className,
}: SessionCardProps) {
  return (
    <Card
      className={cn(
        "gap-0 rounded-md border border-border bg-card py-0 ring-0",
        className
      )}
    >
      <CardContent className="flex flex-col gap-1.5 px-4 py-4">
        <span className="text-label font-semibold text-foreground">{title}</span>
        <span className="text-caption text-muted-foreground">
          {lapCount} laps · Avg {averageLap}
        </span>
      </CardContent>
    </Card>
  );
}
