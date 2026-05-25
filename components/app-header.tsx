"use client";

import { Menu } from "lucide-react";
import { AuthUserBar } from "@/components/auth/auth-user-bar";
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
        "sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur-md lg:px-8",
        className,
      )}
    >
      <span className="text-sm font-extrabold tracking-wide text-primary uppercase lg:hidden">
        Ninja
      </span>
      <div className="ml-auto flex items-center gap-2">
        <AuthUserBar layout="header" />
        {showMenu && onMenuClick != null && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="size-8 rounded-sm bg-elevated hover:bg-muted lg:hidden"
          >
            <Menu className="size-[18px] text-primary" />
          </Button>
        )}
      </div>
    </header>
  );
}
