import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
    return (
        <header className="w-full py-6 border-b border-foreground/10">
            <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-lg font-semibold text-foreground hover:opacity-70 transition-opacity"
                >
                    Weekly
                </Link>
                <div className="flex items-center gap-4">
                    <a
                        href="https://atmiya.ca"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                    >
                        atmiya.ca
                    </a>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
