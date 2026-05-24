import { cn } from "@/lib/utils";

type NavBrandProps = {
  className?: string;
  compact?: boolean;
};

export function NavBrand({ className, compact }: NavBrandProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute inset-x-0 top-0 h-1 bg-primary"
        aria-hidden="true"
      />
      <div
        className={cn(
          "border-b border-border bg-gradient-to-br from-elevated/80 to-card px-6",
          compact ? "py-5" : "py-8"
        )}
      >
        <p className="text-badge font-bold tracking-[0.22em] text-primary uppercase">
          Kawasaki
        </p>
        <p
          className={cn(
            "font-display font-bold tracking-wide text-foreground uppercase",
            compact ? "text-lg" : "text-xl"
          )}
        >
          Ninja
        </p>
        <p className="mt-1.5 text-caption font-medium tracking-widest text-muted-foreground uppercase">
          Track Racing
        </p>
      </div>
    </div>
  );
}
