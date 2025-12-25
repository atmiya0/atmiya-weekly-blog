import Image from "next/image";
import Link from "next/link";
import { WeekPost } from "@/types/week";

interface WeekNavigationProps {
    previous?: WeekPost;
    next?: WeekPost;
}

export function WeekNavigation({ previous, next }: WeekNavigationProps) {
    if (!previous && !next) {
        return null;
    }

    return (
        <nav className="flex items-center justify-between pt-8 mt-12 border-t border-[var(--divider)]">
            <div className="flex-1">
                {previous && (
                    <Link
                        href={`/week/${previous.slug}`}
                        className="group inline-flex items-center gap-2 text-left"
                    >
                        <Image
                            src="/left-arrow.svg"
                            alt="Previous"
                            width={18}
                            height={18}
                            className="opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                        <span className="text-[14px] leading-[1.5714285714285714em] font-normal text-[#0A0A0A] group-hover:text-[var(--brand)] transition-colors">
                            {previous.title}
                        </span>
                    </Link>
                )}
            </div>
            <div className="flex-1 text-right">
                {next && (
                    <Link
                        href={`/week/${next.slug}`}
                        className="group inline-flex items-center gap-2 flex-row-reverse text-right"
                    >
                        <Image
                            src="/right-arrow.svg"
                            alt="Next"
                            width={18}
                            height={18}
                            className="opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                        <span className="text-[14px] leading-[1.5714285714285714em] font-normal text-[#0A0A0A] group-hover:text-[var(--brand)] transition-colors">
                            {next.title}
                        </span>
                    </Link>
                )}
            </div>
        </nav>
    );
}


