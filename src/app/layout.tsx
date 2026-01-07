import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { openRunde } from "@/styles/typography";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://blogs.atmiya.ca"),
  title: {
    default: "Atmiya's Blog",
    template: "%s | Atmiya's Blog",
  },
  description:
    "Personal blog by Atmiya Jadvani. Documenting my weeks — what I'm building, learning, and thinking about in design, product, and engineering.",
  keywords: [
    "Atmiya Jadvani",
    "blog",
    "design",
    "product",
    "engineering",
    "weekly journal",
    "tech blog",
    "product design",
    "frontend engineering",
  ],
  authors: [{ name: "Atmiya Jadvani", url: "https://atmiya.ca" }],
  creator: "Atmiya Jadvani",
  publisher: "Atmiya Jadvani",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blogs.atmiya.ca",
    siteName: "Atmiya's Blog",
    title: "Atmiya's Blog | Atmiya Jadvani",
    description:
      "Documenting my weeks — what I'm building, learning, and thinking about in design, product, and engineering.",
  },
  twitter: {
    card: "summary",
    site: "@atmiyajadvani",
    creator: "@atmiyajadvani",
    title: "Atmiya's Blog | Atmiya Jadvani",
    description:
      "Documenting my weeks — what I'm building, learning, and thinking about in design, product, and engineering.",
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
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      <body className={`${openRunde.variable} font-openrunde antialiased min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
