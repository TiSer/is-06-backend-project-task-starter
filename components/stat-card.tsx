import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  className?: string;
};

export function StatCard({ label, value, className }: StatCardProps) {
  return (
    <Card
      className={cn(
        "flex-1 gap-2 rounded-md border border-border bg-elevated py-3 ring-0",
        className
      )}
    >
      <CardContent className="flex flex-col gap-1 px-3 py-0">
        <span className="text-stat font-bold text-primary">{value}</span>
        <span className="text-caption font-medium text-muted-foreground">
          {label}
        </span>
      </CardContent>
    </Card>
  );
}
