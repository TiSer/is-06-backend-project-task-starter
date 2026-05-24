"use client";

import { usePathname } from "next/navigation";
import { NavLinkItem } from "@/components/nav-link-item";
import { mainNavItems } from "@/lib/nav-config";
import { isActiveNavPath } from "@/lib/navigation";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        aria-hidden="true"
      />
      <div className="flex items-center justify-around">
        {mainNavItems.map((item, index) => (
          <NavLinkItem
            key={item.href}
            item={item}
            index={index}
            variant="bottom"
            isActive={isActiveNavPath(pathname, item.href)}
          />
        ))}
      </div>
    </nav>
  );
}
