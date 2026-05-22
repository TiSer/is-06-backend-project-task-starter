import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "is-06-backend-project — AI Backend Workflow 2026",
  description:
    "Day 6 reference backend on Next.js 16 / Vercel / Neon / Drizzle / Better Auth / Zod / Vitest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100 font-sans">
        {children}
      </body>
    </html>
  );
}
