import localFont from "next/font/local";

// =====================================
// BRUNSWICK GROTESQUE FONT
// =====================================
// Primary typeface for the weekly blog
// Clean, confident, and readable

export const brunswickGrotesque = localFont({
  src: "../../public/font/BrunswickGrotesque-Regular.otf",
  variable: "--font-brunswick",
  display: "swap",
  preload: true,
  weight: "400",
  style: "normal",
});

// =====================================
// TEXT STYLE TOKENS
// =====================================
// Centralized text style definitions
// Use these class names throughout the app

export const textStyles = {
  // Base body text - default readable style
  body: "font-brunswick text-base leading-relaxed",
} as const;

// CSS variable name for use in Tailwind config or raw CSS
export const fontVariables = {
  brunswick: "--font-brunswick",
} as const;
