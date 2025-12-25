import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getWeekBySlug, getAdjacentWeeks } from "@/lib/weeks";
import { formatDateRange } from "@/lib/dates";
import { MDXContent } from "@/components/mdx-content";
import { WeekNavigation } from "@/components/week-navigation";
import { Countdown } from "@/components/countdown";

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

    const { previous, next } = getAdjacentWeeks(week.week);

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#1C1917]">
            {/* Top Left Header */}
            <header className="absolute top-[53px] left-[64px] flex items-center gap-4">
                <Link href="/" className="w-12 h-12 rounded-full border border-[rgba(214,211,209,0.5)] overflow-hidden flex-shrink-0">
                    <Image
                        src="/favicon-45c526.png"
                        alt="Atmiya Jadvani"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                    />
                </Link>
                <div className="flex flex-col">
                    <Link href="/" className="text-[14px] leading-[1.5714285714285714em] font-normal hover:opacity-70 transition-opacity">
                        Atmiya Jadvani
                    </Link>
                    <p className="text-[14px] leading-[1.5714285714285714em] font-normal">
                        Design × Product × Engineering
                    </p>
                    <Countdown />
                </div>
            </header>

            <article className="w-[650px] mx-auto pt-[62px] pb-24">
                <header className="mb-[72px]">
                    <div className="flex flex-col gap-[13px]">
                        <p className="text-[14px] leading-[1.5714285714285714em] font-normal">
                            Week {week.week} = {formatDateRange(week.startDate, week.endDate)}
                        </p>
                        <div className="w-full h-[1px] bg-[#E7E7E7]"></div>
                        <h1 className="text-[14px] leading-[1.5714285714285714em] font-normal">{week.title}</h1>
                    </div>
                </header>

                <div className="prose prose-sm max-w-none">
                    <MDXContent source={week.content} />
                </div>

                <WeekNavigation previous={previous} next={next} />
            </article>
        </div>
    );
}
