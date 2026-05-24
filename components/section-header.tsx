import Link from "next/link";
import { cn } from "@/lib/utils";

type SectionHeaderBase = {
  title: string;
  className?: string;
};

type SectionHeaderWithLink = SectionHeaderBase & {
  actionLabel: string;
  actionHref: string;
  onActionClick?: never;
};

type SectionHeaderWithButton = SectionHeaderBase & {
  actionLabel: string;
  onActionClick: () => void;
  actionHref?: never;
};

type SectionHeaderWithoutAction = SectionHeaderBase & {
  actionLabel?: never;
  actionHref?: never;
  onActionClick?: never;
};

export type SectionHeaderProps =
  | SectionHeaderWithLink
  | SectionHeaderWithButton
  | SectionHeaderWithoutAction;

const actionClassName =
  "text-label font-semibold text-primary transition-colors hover:text-(--primary-hover) focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export function SectionHeader({
  title,
  actionLabel,
  actionHref,
  onActionClick,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn("flex items-center justify-between gap-4", className)}
    >
      <h2 className="text-h2 font-bold text-foreground">{title}</h2>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className={actionClassName}>
          {actionLabel}
        </Link>
      ) : actionLabel && onActionClick ? (
        <button
          type="button"
          onClick={onActionClick}
          className={actionClassName}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
