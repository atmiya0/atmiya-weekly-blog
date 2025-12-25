import Link from "next/link";
import { WeekPost } from "@/types/week";
import { formatDateRange } from "@/lib/dates";

interface WeekCardProps {
    week: WeekPost;
}

export function WeekCard({ week }: WeekCardProps) {
    return (
        <article className="group py-6 border-b border-foreground/10 last:border-b-0">
            <Link href={`/week/${week.slug}`} className="block">
                <div className="flex items-baseline justify-between gap-4 mb-2">
                    <span className="text-xs font-medium text-foreground/40 uppercase tracking-wider">
                        Week {week.week}
                    </span>
                    <span className="text-xs text-foreground/40">
                        {formatDateRange(week.startDate, week.endDate)}
                    </span>
                </div>
                <h2 className="text-lg font-medium text-foreground group-hover:opacity-70 transition-opacity mb-2">
                    {week.title}
                </h2>
                <p className="text-sm text-foreground/60 leading-relaxed">
                    {week.summary}
                </p>
                <div className="mt-3">
                    <span className="text-xs text-foreground/40">{week.readingTime}</span>
                </div>
            </Link>
        </article>
    );
}
