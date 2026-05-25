"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthSheet } from "@/components/auth/auth-sheet";
import { authClient } from "@/lib/auth-client";

type AuthUserBarProps = {
  onSessionChange?: () => void;
  className?: string;
  /** Compact row for the site header (top right). */
  layout?: "header" | "stacked";
};

export function AuthUserBar({
  onSessionChange,
  className,
  layout = "header",
}: AuthUserBarProps) {
  const { data: session, isPending } = authClient.useSession();
  const [authOpen, setAuthOpen] = useState(false);

  async function handleSignOut() {
    await authClient.signOut();
    onSessionChange?.();
  }

  const isHeader = layout === "header";

  if (isPending) {
    return (
      <p
        className={
          className ??
          (isHeader
            ? "text-caption text-muted-foreground"
            : "text-caption text-muted-foreground")
        }
      >
        …
      </p>
    );
  }

  if (!session) {
    return (
      <>
        <Button
          type="button"
          variant={isHeader ? "secondary" : "outline"}
          size="sm"
          className={className}
          onClick={() => setAuthOpen(true)}
        >
          Sign in
        </Button>
        <AuthSheet
          open={authOpen}
          onOpenChange={setAuthOpen}
          onSuccess={onSessionChange}
        />
      </>
    );
  }

  const label =
    session.user.name ?? session.user.email ?? "Signed in";

  if (isHeader) {
    return (
      <div
        className={cn(
          "flex max-w-[min(100%,280px)] items-center gap-2 sm:max-w-none",
          className,
        )}
      >
        <p
          className="hidden truncate text-caption text-muted-foreground sm:block"
          title={label}
        >
          {label}
        </p>
        <Button type="button" variant="ghost" size="sm" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className={className ?? "flex flex-col gap-2"}>
      <p className="truncate text-caption text-foreground" title={label}>
        {label}
      </p>
      <Button type="button" variant="ghost" size="sm" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  );
}
