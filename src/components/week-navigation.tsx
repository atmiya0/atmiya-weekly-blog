import Link from "next/link";
import { WeekPost } from "@/types/week";

interface WeekNavigationProps {
    previous?: WeekPost;
    next?: WeekPost;
}

export function WeekNavigation({ previous, next }: WeekNavigationProps) {
    return (
        <nav className="flex items-center justify-between pt-8 mt-12 border-t border-[#E7E7E7]">
            <div className="flex-1">
                {previous && (
                    <Link
                        href={`/week/${previous.slug}`}
                        className="group inline-flex flex-col items-start text-left"
                    >
                        <span className="text-[14px] leading-[1.5714285714285714em] font-normal text-[#1C1917] opacity-60 mb-1">← Previous</span>
                        <span className="text-[14px] leading-[1.5714285714285714em] font-normal text-[#1C1917] group-hover:opacity-70 transition-opacity">
                            Week {previous.week}
                        </span>
                    </Link>
                )}
            </div>
            <div className="flex-shrink-0 px-4">
                <Link
                    href="/"
                    className="text-[14px] leading-[1.5714285714285714em] font-normal text-[#1C1917] opacity-60 hover:opacity-100 transition-opacity"
                >
                    All weeks
                </Link>
            </div>
            <div className="flex-1 text-right">
                {next && (
                    <Link
                        href={`/week/${next.slug}`}
                        className="group inline-flex flex-col items-end text-right"
                    >
                        <span className="text-[14px] leading-[1.5714285714285714em] font-normal text-[#1C1917] opacity-60 mb-1">Next →</span>
                        <span className="text-[14px] leading-[1.5714285714285714em] font-normal text-[#1C1917] group-hover:opacity-70 transition-opacity">
                            Week {next.week}
                        </span>
                    </Link>
                )}
            </div>
        </nav>
    );
}
