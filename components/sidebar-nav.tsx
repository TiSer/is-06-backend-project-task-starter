"use client";

import { usePathname } from "next/navigation";
import { NavBrand } from "@/components/nav-brand";
import { NavLinkItem } from "@/components/nav-link-item";
import { mainNavItems } from "@/lib/nav-config";
import { isActiveNavPath } from "@/lib/navigation";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card lg:flex lg:min-h-screen">
      <NavBrand />
      <nav
        aria-label="Main navigation"
        className="flex flex-1 flex-col gap-1.5 p-4"
      >
        <p className="mb-2 px-1 text-[0.65rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
          Menu
        </p>
        {mainNavItems.map((item, index) => (
          <NavLinkItem
            key={item.href}
            item={item}
            index={index}
            isActive={isActiveNavPath(pathname, item.href)}
          />
        ))}
      </nav>
      <div className="border-t border-border px-6 py-4">
        <p className="text-[0.65rem] font-medium tracking-widest text-muted-foreground uppercase">
          Track day ready
        </p>
        <p className="mt-1 text-caption text-primary">Season 2026</p>
      </div>
    </aside>
  );
}
