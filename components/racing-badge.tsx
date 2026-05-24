import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type RacingBadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export function RacingBadge({ children, className }: RacingBadgeProps) {
  return (
    <Badge variant="racing" className={cn(className)}>
      {children}
    </Badge>
  );
}
