import type { Metadata } from "next";
import { Geist_Mono, Inter, Rajdhani } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import "./globals.css";

/** UI / body — wide, readable (nav labels, tables, paragraphs). */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

/** Display / headings — motorsport broadcast titles (OFL). */
const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ninja Track Racing",
  description:
    "Track-day companion for the Kawasaki Ninja — lap times, sessions, records, gallery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark h-full antialiased",
        inter.variable,
        rajdhani.variable,
        geistMono.variable
      )}
    >
      <body className="flex min-h-screen flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
