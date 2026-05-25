import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SessionCardProps = {
  title: string;
  lapCount: number;
  averageLap: string;
  bestLap: string;
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
};

export function SessionCard({
  title,
  lapCount,
  averageLap,
  bestLap,
  className,
  onEdit,
  onDelete,
  showActions = false,
}: SessionCardProps) {
  return (
    <Card
      className={cn(
        "gap-0 rounded-md border border-border bg-card py-0 ring-0",
        className,
      )}
    >
      <CardContent className="flex items-start justify-between gap-3 px-4 py-4">
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="text-label font-semibold text-foreground">{title}</span>
          <span className="text-caption text-muted-foreground">
            {lapCount} laps · Best {bestLap} · Avg {averageLap}
          </span>
        </div>
        {showActions && (onEdit || onDelete) && (
          <div className="flex shrink-0 gap-1">
            {onEdit && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onEdit}
                aria-label="Edit session"
              >
                <Pencil className="size-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onDelete}
                aria-label="Delete session"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
