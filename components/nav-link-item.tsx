import Link from "next/link";
import type { NavItem } from "@/lib/nav-config";
import { cn } from "@/lib/utils";

type NavLinkItemProps = {
  item: NavItem;
  isActive: boolean;
  index: number;
  onClick?: () => void;
  variant?: "sidebar" | "bottom";
};

export function NavLinkItem({
  item,
  isActive,
  index,
  onClick,
  variant = "sidebar",
}: NavLinkItemProps) {
  const Icon = item.icon;
  const label = variant === "bottom" ? item.shortLabel : item.label;

  if (variant === "bottom") {
    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={cn(
          "relative flex min-w-[4rem] flex-col items-center gap-1.5 rounded-md px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {isActive && (
          <span
            className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]"
            aria-hidden="true"
          />
        )}
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-sm border transition-colors",
            isActive
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border/60 bg-elevated/60 text-muted-foreground"
          )}
        >
          <Icon className="size-[18px]" strokeWidth={isActive ? 2.25 : 2} />
        </span>
        <span
          className={cn(
            "text-caption",
            isActive ? "font-bold" : "font-medium"
          )}
        >
          {label}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 overflow-hidden rounded-md border px-3 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        isActive
          ? "border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent font-semibold text-primary shadow-[inset_3px_0_0_0_var(--primary)]"
          : "border-transparent text-muted-foreground hover:border-border hover:bg-elevated/80 hover:text-foreground"
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-sm border transition-colors",
          isActive
            ? "border-primary/40 bg-primary/15 text-primary"
            : "border-border/50 bg-background/40 text-muted-foreground group-hover:border-border group-hover:text-foreground"
        )}
        aria-hidden="true"
      >
        <Icon className="size-[18px]" strokeWidth={isActive ? 2.25 : 2} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-sans text-label leading-snug tracking-normal">
          {label}
        </span>
        {isActive && (
          <span className="text-[0.65rem] font-medium tracking-wider text-primary/80 uppercase">
            Active
          </span>
        )}
      </span>
      <span
        className={cn(
          "font-mono text-[0.65rem] tracking-widest",
          isActive ? "text-primary/60" : "text-muted-foreground/40"
        )}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </Link>
  );
}
