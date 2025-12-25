import type { Metadata } from "next";
import Script from "next/script";
import { brunswickGrotesque } from "@/styles/typography";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://blogs.atmiya.ca"),
  title: {
    default: "Weekly | Atmiya Jadvani",
    template: "%s | Weekly",
  },
  description:
    "A weekly journal documenting thoughts, progress, and learnings. One week at a time.",
  authors: [{ name: "Atmiya Jadvani", url: "https://atmiya.ca" }],
  creator: "Atmiya Jadvani",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blogs.atmiya.ca",
    siteName: "Weekly",
    title: "Weekly | Atmiya Jadvani",
    description:
      "A weekly journal documenting thoughts, progress, and learnings. One week at a time.",
  },
  twitter: {
    card: "summary",
    title: "Weekly | Atmiya Jadvani",
    description:
      "A weekly journal documenting thoughts, progress, and learnings. One week at a time.",
  },
  alternates: {
    canonical: "https://blogs.atmiya.ca",
    types: {
      "application/rss+xml": "https://blogs.atmiya.ca/feed.xml",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body
        className={`${brunswickGrotesque.variable} font-brunswick antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
