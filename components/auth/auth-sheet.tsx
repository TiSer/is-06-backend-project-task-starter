"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";

type AuthSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function AuthSheet({ open, onOpenChange, onSuccess }: AuthSheetProps) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      if (mode === "sign-in") {
        const result = await authClient.signIn.email({ email, password });
        if (result.error) {
          setError(result.error.message ?? "Sign in failed");
          return;
        }
      } else {
        const result = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || (email.split("@")[0] ?? "Rider"),
        });
        if (result.error) {
          setError(result.error.message ?? "Sign up failed");
          return;
        }
      }

      onOpenChange(false);
      onSuccess?.();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {mode === "sign-in" ? "Sign in" : "Create account"}
          </SheetTitle>
          <SheetDescription>
            Use email and password to manage track sessions.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 px-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={mode === "sign-in" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("sign-in")}
            >
              Sign in
            </Button>
            <Button
              type="button"
              variant={mode === "sign-up" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("sign-up")}
            >
              Sign up
            </Button>
          </div>

          {mode === "sign-up" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="auth-name">Name</Label>
              <Input
                id="auth-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={
                mode === "sign-in" ? "current-password" : "new-password"
              }
            />
          </div>

          {error && (
            <p className="text-caption text-destructive" role="alert">
              {error}
            </p>
          )}

          <SheetFooter className="px-0">
            <Button type="submit" disabled={pending} className="w-full">
              {pending
                ? "Please wait…"
                : mode === "sign-in"
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
