import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  onMenuClick?: () => void;
  showMenu?: boolean;
  className?: string;
};

export function AppHeader({
  onMenuClick,
  showMenu = true,
  className,
}: AppHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:hidden",
        className
      )}
    >
      <span className="text-sm font-extrabold tracking-wide text-primary uppercase">
        Ninja
      </span>
      {showMenu && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="size-8 rounded-sm bg-elevated hover:bg-muted"
        >
          <Menu className="size-[18px] text-primary" />
        </Button>
      )}
    </header>
  );
}
