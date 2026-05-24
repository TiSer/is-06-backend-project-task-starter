"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { NavBrand } from "@/components/nav-brand";
import { NavLinkItem } from "@/components/nav-link-item";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { mainNavItems } from "@/lib/nav-config";
import { isActiveNavPath } from "@/lib/navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <AppHeader onMenuClick={() => setOpen(true)} />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-[min(100%,300px)] gap-0 border-border bg-card p-0"
        >
          <NavBrand compact />
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-1.5 p-4"
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
                onClick={() => setOpen(false)}
              />
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
