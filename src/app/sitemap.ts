import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only include the home page - individual posts are excluded intentionally
  // This ensures the blog supports the main portfolio site without competing in search
  return [
    {
      url: "https://blogs.atmiya.ca",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
