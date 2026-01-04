import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { WeekPost, WeekFrontmatter } from "@/types/week";
import { parseISO, getDay, differenceInDays, getISOWeek, endOfISOWeek, format, startOfISOWeek } from "date-fns";
import * as github from "./github";

const contentDirectory = path.join(process.cwd(), "content/weeks");

/**
 * Validates that a blog post has correct week dates:
 */
function validateWeekDates(
    fileName: string,
    startDate: string,
    endDate: string
): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
        const start = parseISO(startDate);
        const end = parseISO(endDate);

        const startDay = getDay(start);
        if (startDay !== 1) {
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            errors.push(`startDate (${startDate}) is a ${dayNames[startDay]}, should be Monday`);
        }

        const endDay = getDay(end);
        if (endDay !== 0) {
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            errors.push(`endDate (${endDate}) is a ${dayNames[endDay]}, should be Sunday`);
        }

        const duration = differenceInDays(end, start);
        if (duration !== 6) {
            errors.push(`Duration is ${duration} days, should be 6 days (Monday to Sunday)`);
        }

    } catch {
        errors.push(`Invalid date format in ${fileName}`);
    }

    return { isValid: errors.length === 0, errors };
}

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

export async function getAllWeeks(): Promise<WeekPost[]> {
    // In production, fetch from GitHub API to allow revalidation without redeploy
    if (process.env.NODE_ENV === "production" && process.env.GITHUB_TOKEN) {
        try {
            const posts = await github.listPosts();
            const fullPosts = await Promise.all(
                posts.map(async (p) => {
                    const postData = await github.getPost(p.slug);
                    if (!postData) return null;
                    return normalizePostData(
                        postData.content,
                        p.slug,
                        p.date, // Using date from metadata as fallback
                        p.date,
                        postData.metadata.path.endsWith(".txt")
                    );
                })
            );
            return (fullPosts.filter(Boolean) as WeekPost[]).sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
        } catch (error) {
            console.error("Failed to fetch posts from GitHub, falling back to FS:", error);
        }
    }

    // Local filesystem approach (Development or fallback)
    if (!fs.existsSync(contentDirectory)) {
        return [];
    }

    const allWeeks: WeekPost[] = [];

    const processFile = (filePath: string, displayName: string) => {
        const fileContents = fs.readFileSync(filePath, "utf8");
        const fileStats = fs.statSync(filePath);
        const isTxt = filePath.endsWith(".txt");
        const fileName = path.basename(filePath).replace(/\.(txt|mdx)$/, "");

        // Extract slug from filename (e.g., 2025-01-01-my-post -> my-post)
        const slugMatch = fileName.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
        const slug = slugMatch ? slugMatch[1] : fileName;

        const post = normalizePostData(
            fileContents,
            slug,
            fileStats.birthtime.toISOString(),
            fileStats.mtime.toISOString(),
            isTxt
        );

        allWeeks.push(post);
    };

    const entries = fs.readdirSync(contentDirectory, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory() && /^\d{4}$/.test(entry.name)) {
            const yearPath = path.join(contentDirectory, entry.name);
            const yearFiles = fs.readdirSync(yearPath);
            for (const fileName of yearFiles) {
                if ((fileName.endsWith(".mdx") || fileName.endsWith(".txt")) && !fileName.startsWith("_")) {
                    processFile(path.join(yearPath, fileName), `${entry.name}/${fileName}`);
                }
            }
        } else if (entry.isFile() && (entry.name.endsWith(".mdx") || entry.name.endsWith(".txt")) && !entry.name.startsWith("_")) {
            processFile(path.join(contentDirectory, entry.name), entry.name);
        }
    }

    return allWeeks.sort((a, b) => {
        const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateCompare !== 0) return dateCompare;
        return b.slug.localeCompare(a.slug);
    });
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

