import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Removed "output: export" to enable API routes for admin panel
  // The app will now be server-rendered on Vercel
  images: {
    // Keep unoptimized for simpler image handling
    unoptimized: true,
  },
};

export default nextConfig;
