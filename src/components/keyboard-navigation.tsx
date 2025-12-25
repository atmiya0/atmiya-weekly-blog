"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WeekPost } from "@/types/week";

interface KeyboardNavigationProps {
    previous?: WeekPost;
    next?: WeekPost;
}

export function KeyboardNavigation({ previous, next }: KeyboardNavigationProps) {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Don't trigger if user is typing in an input
            if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement ||
                event.target instanceof HTMLSelectElement
            ) {
                return;
            }

            // Left arrow - go to previous post
            if (event.key === "ArrowLeft" && previous) {
                router.push(`/week/${previous.slug}`);
            }

            // Right arrow - go to next post
            if (event.key === "ArrowRight" && next) {
                router.push(`/week/${next.slug}`);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [previous, next, router]);

    // This component doesn't render anything visible
    return null;
}
