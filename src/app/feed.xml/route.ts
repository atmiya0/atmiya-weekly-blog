import { getAllWeeks } from "@/lib/weeks";

export const dynamic = "force-static";

export async function GET() {
  const weeks = getAllWeeks();
  const siteUrl = "https://blogs.atmiya.ca";

  const rssItems = weeks
    .map((week) => {
      return `
    <item>
      <title><![CDATA[Week ${week.week}: ${week.title}]]></title>
      <link>${siteUrl}/week/${week.slug}</link>
      <guid isPermaLink="true">${siteUrl}/week/${week.slug}</guid>
      <description><![CDATA[${week.summary}]]></description>
      <pubDate>${new Date(week.date).toUTCString()}</pubDate>
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Weekly | Atmiya Jadvani</title>
    <link>${siteUrl}</link>
    <description>A weekly journal documenting thoughts, progress, and learnings. One week at a time.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
