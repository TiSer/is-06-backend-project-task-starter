import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type LapTimeRow = {
  id: string;
  session: React.ReactNode;
  track: string;
  bestLap: string;
  date: string;
};

type LapTimeTableProps = {
  rows: LapTimeRow[];
  className?: string;
};

export function LapTimeTable({ rows, className }: LapTimeTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border bg-card",
        className
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-elevated hover:bg-elevated">
            <TableHead className="px-5 py-3.5 text-caption font-semibold text-muted-foreground">
              Session
            </TableHead>
            <TableHead className="px-5 py-3.5 text-caption font-semibold text-muted-foreground">
              Track
            </TableHead>
            <TableHead className="px-5 py-3.5 text-caption font-semibold text-muted-foreground">
              Best Lap
            </TableHead>
            <TableHead className="px-5 py-3.5 text-caption font-semibold text-muted-foreground">
              Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="border-border">
              <TableCell className="px-5 py-3.5 text-body text-foreground">
                {row.session}
              </TableCell>
              <TableCell className="px-5 py-3.5 text-body text-foreground">
                {row.track}
              </TableCell>
              <TableCell className="px-5 py-3.5 text-label font-bold text-primary">
                {row.bestLap}
              </TableCell>
              <TableCell className="px-5 py-3.5 text-body text-muted-foreground">
                {row.date}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
