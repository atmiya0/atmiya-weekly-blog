import localFont from "next/font/local";

// =====================================
// OPEN RUNDE FONT
// =====================================
// Primary typeface for the weekly blog
// Clean, confident, and readable

export const openRunde = localFont({
  src: "../../public/font/OpenRunde-Medium.woff2",
  variable: "--font-openrunde",
  display: "swap",
  preload: true,
  weight: "500",
  style: "normal",
});

// =====================================
// TEXT STYLE TOKENS
// =====================================
// Centralized text style definitions
// Use these class names throughout the app

export const textStyles = {
  // Base body text - default readable style
  body: "font-openrunde text-base leading-relaxed",
} as const;

// CSS variable name for use in Tailwind config or raw CSS
export const fontVariables = {
  openrunde: "--font-openrunde",
} as const;
