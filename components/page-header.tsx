import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-8 flex flex-col gap-2 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between",
        className
      )}
    >
      <div>
        <h1 className="text-h1 font-bold text-foreground">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-body text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
