import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { WeekPost, WeekFrontmatter } from "@/types/week";
import { parseISO, getDay, differenceInDays, getISOWeek } from "date-fns";

const contentDirectory = path.join(process.cwd(), "content/weeks");

/**
 * Validates that a blog post has correct week dates:
 * - startDate must be a Monday (day 1 in ISO)
 * - endDate must be a Sunday (day 0 in ISO, or 7)
 * - Duration must be exactly 6 days (Monday to Sunday)
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

        // Check if startDate is a Monday (getDay: 0=Sun, 1=Mon, etc.)
        const startDay = getDay(start);
        if (startDay !== 1) {
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            errors.push(`startDate (${startDate}) is a ${dayNames[startDay]}, should be Monday`);
        }

        // Check if endDate is a Sunday
        const endDay = getDay(end);
        if (endDay !== 0) {
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            errors.push(`endDate (${endDate}) is a ${dayNames[endDay]}, should be Sunday`);
        }

        // Check if duration is exactly 6 days (Mon to Sun)
        const duration = differenceInDays(end, start);
        if (duration !== 6) {
            errors.push(`Duration is ${duration} days, should be 6 days (Monday to Sunday)`);
        }

    } catch {
        errors.push(`Invalid date format in ${fileName}`);
    }

    return { isValid: errors.length === 0, errors };
}

export function getAllWeeks(): WeekPost[] {
    if (!fs.existsSync(contentDirectory)) {
        return [];
    }

    const allWeeks: WeekPost[] = [];

    // Helper function to process MDX files
    const processMdxFile = (filePath: string, displayName: string) => {
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContents);
        const frontmatter = data as WeekFrontmatter;
        const stats = readingTime(content);

        // Validate dates in development
        if (process.env.NODE_ENV === "development") {
            const validation = validateWeekDates(
                displayName,
                frontmatter.startDate,
                frontmatter.endDate
            );
            if (!validation.isValid) {
                console.warn(`\n⚠️  Date validation failed for ${displayName}:`);
                validation.errors.forEach((err) => console.warn(`   - ${err}`));
                console.warn("");
            }
        }

        allWeeks.push({
            slug: frontmatter.slug,
            title: frontmatter.title,
            week: getISOWeek(parseISO(frontmatter.startDate)),
            startDate: frontmatter.startDate,
            endDate: frontmatter.endDate,
            summary: frontmatter.summary,
            content,
            readingTime: stats.text,
        });
    };

    // Read all entries in the content directory
    const entries = fs.readdirSync(contentDirectory, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isDirectory() && /^\d{4}$/.test(entry.name)) {
            // Year folder (e.g., 2025, 2026)
            const yearPath = path.join(contentDirectory, entry.name);
            const yearFiles = fs.readdirSync(yearPath);

            for (const fileName of yearFiles) {
                if (fileName.endsWith(".mdx") && !fileName.startsWith("_")) {
                    const filePath = path.join(yearPath, fileName);
                    processMdxFile(filePath, `${entry.name}/${fileName}`);
                }
            }
        } else if (entry.isFile() && entry.name.endsWith(".mdx") && !entry.name.startsWith("_")) {
            // MDX file in root (backwards compatibility)
            const filePath = path.join(contentDirectory, entry.name);
            processMdxFile(filePath, entry.name);
        }
    }

    // Sort by startDate in ascending order for overlap validation
    const sortedWeeks = allWeeks.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    // Validate no overlapping or duplicate weeks (in development)
    if (process.env.NODE_ENV === "development" && sortedWeeks.length > 1) {
        for (let i = 1; i < sortedWeeks.length; i++) {
            const prevWeek = sortedWeeks[i - 1];
            const currWeek = sortedWeeks[i];

            const prevEnd = new Date(prevWeek.endDate).getTime();
            const currStart = new Date(currWeek.startDate).getTime();
            const oneDayMs = 24 * 60 * 60 * 1000;

            // Check if weeks overlap or have gaps (unless they're the same week with multiple posts)
            if (prevWeek.startDate !== currWeek.startDate) {
                if (currStart <= prevEnd) {
                    console.warn(`\n⚠️  Week overlap detected:`);
                    console.warn(`   - "${prevWeek.title}" ends on ${prevWeek.endDate}`);
                    console.warn(`   - "${currWeek.title}" starts on ${currWeek.startDate}`);
                    console.warn(`   - Next week should start the day after previous week ends\n`);
                } else if (currStart !== prevEnd + oneDayMs) {
                    // Optional: warn about gaps between weeks
                    const gapDays = Math.floor((currStart - prevEnd) / oneDayMs) - 1;
                    if (gapDays > 0) {
                        console.warn(`\n⚠️  Gap of ${gapDays} day(s) between weeks:`);
                        console.warn(`   - "${prevWeek.title}" ends on ${prevWeek.endDate}`);
                        console.warn(`   - "${currWeek.title}" starts on ${currWeek.startDate}\n`);
                    }
                }
            }
        }
    }

    // Return sorted by startDate descending (most recent first)
    return sortedWeeks.reverse();
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
