import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fortress Fund - AI Investment Platform",
  description: "AI-powered investment and wealth management platform",
  keywords: ["investment", "portfolio", "wealth management", "AI", "financial"],
  viewport: "width=device-width, initial-scale=1",
};

/**
 * Root layout component
 * Wraps all pages with necessary providers
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
