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
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const [signOutPending, setSignOutPending] = useState(false);

  async function handleSignOut() {
    setSignOutError(null);
    setSignOutPending(true);
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setSignOutError(result.error.message ?? "Sign out failed");
        return;
      }
      onSessionChange?.();
    } catch {
      setSignOutError("Sign out failed. Try again.");
    } finally {
      setSignOutPending(false);
    }
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

  const signOutButton = (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => void handleSignOut()}
      disabled={signOutPending}
    >
      {signOutPending ? "Signing out…" : "Sign out"}
    </Button>
  );

  if (isHeader) {
    return (
      <div
        className={cn(
          "flex max-w-[min(100%,280px)] flex-col items-end gap-1 sm:max-w-none",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <p
            className="hidden truncate text-caption text-muted-foreground sm:block"
            title={label}
          >
            {label}
          </p>
          {signOutButton}
        </div>
        {signOutError && (
          <p className="text-caption text-destructive" role="alert">
            {signOutError}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={className ?? "flex flex-col gap-2"}>
      <p className="truncate text-caption text-foreground" title={label}>
        {label}
      </p>
      {signOutButton}
      {signOutError && (
        <p className="text-caption text-destructive" role="alert">
          {signOutError}
        </p>
      )}
    </div>
  );
}
