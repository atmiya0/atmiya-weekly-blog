export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full py-8 border-t border-foreground/10 mt-auto">
            <div className="max-w-2xl mx-auto px-4">
                <p className="text-sm text-foreground/50 text-center">
                    © {currentYear} Atmiya Jadvani. One week at a time.
                </p>
            </div>
        </footer>
    );
}
