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
        .filter((fileName) => fileName.endsWith(".mdx"))
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

    // Sort by week number in descending order (most recent first)
    return allWeeks.sort((a, b) => b.week - a.week);
}

export function getWeekBySlug(slug: string): WeekPost | undefined {
    const allWeeks = getAllWeeks();
    return allWeeks.find((week) => week.slug === slug);
}

export function getAdjacentWeeks(currentWeek: number): {
    previous: WeekPost | undefined;
    next: WeekPost | undefined;
} {
    const allWeeks = getAllWeeks();
    const sortedByWeek = [...allWeeks].sort((a, b) => a.week - b.week);

    const currentIndex = sortedByWeek.findIndex((week) => week.week === currentWeek);

    return {
        previous: currentIndex > 0 ? sortedByWeek[currentIndex - 1] : undefined,
        next: currentIndex < sortedByWeek.length - 1 ? sortedByWeek[currentIndex + 1] : undefined,
    };
}

export function getAllSlugs(): string[] {
    const allWeeks = getAllWeeks();
    return allWeeks.map((week) => week.slug);
}
