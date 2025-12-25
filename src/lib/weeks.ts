import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { WeekPost, WeekFrontmatter } from "@/types/week";

const contentDirectory = path.join(process.cwd(), "content/weeks");

export function getAllWeeks(): WeekPost[] {
    if (!fs.existsSync(contentDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(contentDirectory);
    const allWeeks = fileNames
        .filter((fileName) => fileName.endsWith(".mdx") && !fileName.startsWith("_"))
        .map((fileName) => {
            const fullPath = path.join(contentDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const { data, content } = matter(fileContents);
            const frontmatter = data as WeekFrontmatter;
            const stats = readingTime(content);

            return {
                slug: frontmatter.slug,
                title: frontmatter.title,
                week: frontmatter.week,
                startDate: frontmatter.startDate,
                endDate: frontmatter.endDate,
                summary: frontmatter.summary,
                content,
                readingTime: stats.text,
            };
        });

    // Sort by startDate in descending order (most recent first)
    return allWeeks.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

export function getWeekBySlug(slug: string): WeekPost | undefined {
    const allWeeks = getAllWeeks();
    return allWeeks.find((week) => week.slug === slug);
}

export function getAdjacentPosts(currentSlug: string): {
    previous: WeekPost | undefined;
    next: WeekPost | undefined;
} {
    const allWeeks = getAllWeeks();
    // Sort by startDate ascending (oldest first), then by slug for same-date posts
    const sortedPosts = [...allWeeks].sort((a, b) => {
        const dateCompare = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        if (dateCompare !== 0) return dateCompare;
        return a.slug.localeCompare(b.slug);
    });

    const currentIndex = sortedPosts.findIndex((post) => post.slug === currentSlug);

    return {
        previous: currentIndex > 0 ? sortedPosts[currentIndex - 1] : undefined,
        next: currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : undefined,
    };
}

export function getAllSlugs(): string[] {
    const allWeeks = getAllWeeks();
    return allWeeks.map((week) => week.slug);
}
