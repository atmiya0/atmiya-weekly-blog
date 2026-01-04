import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getWeekBySlug, getAdjacentPosts } from "@/lib/weeks";
import { formatDateRange, formatDate } from "@/lib/dates";
import { MDXContent } from "@/components/mdx-content";
import { WeekNavigation } from "@/components/week-navigation";
import { KeyboardNavigation } from "@/components/keyboard-navigation";
import { BlogLayout } from "@/components/blog-layout";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = await getAllSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const week = await getWeekBySlug(slug);

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
    const week = await getWeekBySlug(slug);

    if (!week) {
        notFound();
    }

    const { previous, next } = await getAdjacentPosts(week.slug);

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
                        <div className="pill mb-[16px]">
                            <p className="text-[14px] leading-[1.5714285714285714em] font-normal">
                                Week {week.week} = {formatDateRange(week.startDate, week.endDate)}
                            </p>
                        </div>
                        <h1 className="text-title">{week.title}</h1>
                        <div className="divider"></div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] leading-[1.5em] font-normal opacity-50">
                            <div className="flex gap-1.5">
                                <span>Created:</span>
                                <span>{formatDate(week.createdAt)}</span>
                            </div>
                            <div className="flex gap-1.5">
                                <span>Updated:</span>
                                <span>{formatDate(week.updatedAt)}</span>
                            </div>
                            <div className="flex gap-1.5">
                                <span>Reading time:</span>
                                <span>{week.readingTime}</span>
                            </div>
                        </div>
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

