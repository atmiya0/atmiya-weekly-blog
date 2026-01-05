import readingTime from "reading-time";
import matter from "gray-matter";
import { WeekPost, WeekFrontmatter } from "@/types/week";
import { parseISO, getISOWeek, endOfISOWeek, format, startOfISOWeek } from "date-fns";
import * as github from "./github";

/**
 * Normalizes post data into a consistent WeekPost format
 */
function normalizePostData(
    content: string,
    slug: string,
    createdAt: string,
    updatedAt: string,
    isTxt: boolean
): WeekPost {
    let frontmatter: WeekFrontmatter;
    let postContent: string;

    if (isTxt) {
        const lines = content.split("\n").map(l => l.trim());
        const title = lines[0] || "Untitled Post";
        const dateStr = lines[1] || "";
        const summary = lines[2] || "";

        // Content starts from line 5 (index 4)
        postContent = lines.slice(4).join("\n").trim();

        // Parse dates
        const dates = dateStr.split(",").map(d => d.trim());
        const startDate = dates[0] || new Date().toISOString().split("T")[0];
        const endDate = dates[1] || format(endOfISOWeek(parseISO(startDate)), "yyyy-MM-dd");

        // Validate dates
        const parsedStart = parseISO(startDate);
        const parsedEnd = parseISO(endDate);

        if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
            console.error(`Invalid date format in content for slug: ${slug}`);
            throw new Error(`Invalid date format: startDate=${startDate}, endDate=${endDate}`);
        }

        const postDate = parsedStart;
        const monday = startOfISOWeek(postDate);
        const sunday = endOfISOWeek(monday);

        frontmatter = {
            title,
            summary: summary || postContent.substring(0, 150) + "...",
            slug,
            date: format(postDate, "yyyy-MM-dd"),
            startDate: format(monday, "yyyy-MM-dd"),
            endDate: format(sunday, "yyyy-MM-dd"),
            week: getISOWeek(monday)
        };
    } else {
        const { data, content: mdxContent } = matter(content);
        frontmatter = data as WeekFrontmatter;
        postContent = mdxContent;

        if (!frontmatter.date && frontmatter.startDate) {
            frontmatter.date = frontmatter.startDate;
        }
    }

    const stats = readingTime(postContent);

    return {
        slug: frontmatter.slug || slug,
        title: frontmatter.title,
        week: frontmatter.week || getISOWeek(parseISO(frontmatter.startDate)),
        date: frontmatter.date || frontmatter.startDate,
        startDate: frontmatter.startDate,
        endDate: frontmatter.endDate,
        summary: frontmatter.summary,
        content: postContent,
        readingTime: stats.text,
        createdAt: frontmatter.createdAt || createdAt,
        updatedAt: frontmatter.updatedAt || updatedAt,
    };
}

/**
 * Get all blog posts from GitHub
 */
export async function getAllWeeks(): Promise<WeekPost[]> {
    if (!process.env.GITHUB_TOKEN) {
        console.error("GITHUB_TOKEN is required to fetch posts");
        return [];
    }

    const posts = await github.listPosts();
    const fullPosts = await Promise.all(
        posts.map(async (p) => {
            const postData = await github.getPost(p.slug);
            if (!postData) return null;
            return normalizePostData(
                postData.content,
                p.slug,
                p.date,
                p.date,
                postData.metadata.path.endsWith(".txt")
            );
        })
    );

    return (fullPosts.filter(Boolean) as WeekPost[]).sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
}

export async function getWeekBySlug(slug: string): Promise<WeekPost | undefined> {
    const allWeeks = await getAllWeeks();
    return allWeeks.find((week) => week.slug === slug);
}

export async function getAdjacentPosts(currentSlug: string): Promise<{
    previous: WeekPost | undefined;
    next: WeekPost | undefined;
}> {
    const allWeeks = await getAllWeeks();
    const sortedPosts = [...allWeeks].sort((a, b) => {
        const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateCompare !== 0) return dateCompare;
        return a.slug.localeCompare(b.slug);
    });

    const currentIndex = sortedPosts.findIndex((post) => post.slug === currentSlug);

    return {
        previous: currentIndex > 0 ? sortedPosts[currentIndex - 1] : undefined,
        next: currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : undefined,
    };
}

export async function getAllSlugs(): Promise<string[]> {
    const allWeeks = await getAllWeeks();
    return allWeeks.map((week) => week.slug);
}

