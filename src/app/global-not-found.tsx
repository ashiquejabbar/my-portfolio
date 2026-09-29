import Link from "next/link";
import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

// 404 for any URL outside the five language pages. It renders without the [lang] layout,
// so it brings its own font and theme, and stays in English (the default language).
const body = Instrument_Sans({ variable: "--font-instrument", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Page not found — Ashique PJ",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" data-theme="dark" className={`${body.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full grid place-items-center px-4 text-center">
        <main>
          <p className="text-sm font-medium text-primary">404</p>
          <h1 className="mt-2 text-3xl font-semibold">Page not found</h1>
          <p className="mt-3 text-muted-foreground">This page doesn’t exist.</p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center h-11 px-5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/85 transition-colors"
          >
            Go to the homepage
          </Link>
        </main>
      </body>
    </html>
  );
}
