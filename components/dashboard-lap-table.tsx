"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LapTimeTable, type LapTimeRow } from "@/components/lap-time-table";

const lapDetails: Record<string, string> = {
  "lap-24": "12 laps · Dry · Pirelli SC1",
  "lap-23": "10 laps · Dry · Pirelli SC1",
  "lap-22": "14 laps · Overcast · Pirelli SC0",
  "lap-21": "8 laps · Dry · Michelin Power",
  "lap-20": "11 laps · Light rain · Pirelli WET",
};

type DashboardLapTableProps = {
  rows: LapTimeRow[];
};

export function DashboardLapTable({ rows }: DashboardLapTableProps) {
  const rowsWithTooltips: LapTimeRow[] = rows.map((row) => ({
    ...row,
    session: (
      <Tooltip key={row.id}>
        <TooltipTrigger className="cursor-help underline decoration-dotted decoration-muted-foreground underline-offset-4">
          {row.session}
        </TooltipTrigger>
        <TooltipContent side="top">
          {lapDetails[row.id] ?? "Session details"}
        </TooltipContent>
      </Tooltip>
    ),
  }));

  return <LapTimeTable rows={rowsWithTooltips} />;
}
