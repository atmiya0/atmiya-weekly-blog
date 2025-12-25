import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getWeekBySlug, getAdjacentPosts } from "@/lib/weeks";
import { formatDateRange } from "@/lib/dates";
import { MDXContent } from "@/components/mdx-content";
import { WeekNavigation } from "@/components/week-navigation";
import { KeyboardNavigation } from "@/components/keyboard-navigation";
import { BlogLayout } from "@/components/blog-layout";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const week = getWeekBySlug(slug);

    if (!week) {
        return {
            title: "Not Found",
        };
    }

    return {
        title: week.title,
        description: week.summary,
        robots: {
            index: false,
            follow: true,
        },
        alternates: {
            canonical: "https://blogs.atmiya.ca",
        },
        openGraph: {
            title: week.title,
            description: week.summary,
            type: "article",
            url: `https://blogs.atmiya.ca/week/${week.slug}`,
        },
    };
}

export default async function WeekPage({ params }: PageProps) {
    const { slug } = await params;
    const week = getWeekBySlug(slug);

    if (!week) {
        notFound();
    }

    const { previous, next } = getAdjacentPosts(week.slug);

    return (
        <BlogLayout>
            <article>
                <header className="mb-[40px]">
                    <div className="flex flex-col gap-[13px]">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-body group mb-[24px]"
                        >
                            <Image
                                src="/left-arrow.svg"
                                alt="Back"
                                width={18}
                                height={18}
                                className="opacity-60 group-hover:opacity-100 transition-opacity"
                            />
                            <span className="group-hover:text-[var(--brand)] transition-colors">Back to Home</span>
                        </Link>
                        <p className="text-[14px] leading-[1.5714285714285714em] font-normal">
                            Week {week.week} = {formatDateRange(week.startDate, week.endDate)}
                        </p>
                        <h1 className="text-title">{week.title}</h1>
                        <div className="divider"></div>
                    </div>
                </header>

                <div className="prose prose-sm max-w-none">
                    <MDXContent source={week.content} />
                </div>

                <WeekNavigation previous={previous} next={next} />
            </article>
            <KeyboardNavigation previous={previous} next={next} />
        </BlogLayout>
    );
}

