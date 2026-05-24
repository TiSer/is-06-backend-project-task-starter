import { BottomNav } from "@/components/bottom-nav";
import { MobileNav } from "@/components/mobile-nav";
import { SidebarNav } from "@/components/sidebar-nav";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <SidebarNav />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col bg-background">
        <MobileNav />
        <main
          className={cn(
            "flex flex-1 flex-col px-page-mobile pb-24 pt-6 lg:px-page-desktop lg:pb-8 lg:pt-8",
            className
          )}
        >
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
