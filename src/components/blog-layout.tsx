import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/countdown";

interface BlogLayoutProps {
    children: React.ReactNode;
}

export function BlogLayout({ children }: BlogLayoutProps) {
    return (
        <div className="min-h-screen text-[#0A0A0A]">
            {/* Two Column Layout Container */}
            <div className="flex flex-col lg:flex-row lg:h-screen">
                {/* Left Column - Fixed on desktop, normal flow on mobile */}
                <aside className="bg-[#FAFAFA] lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-[400px] xl:w-[450px] flex-shrink-0 p-6 pt-12 lg:p-12 lg:pt-[53px] lg:pl-[64px]">
                    <header className="flex items-center gap-4">
                        <Link href="/" className="w-12 h-12 rounded-full border border-[rgba(214,211,209,0.5)] overflow-hidden flex-shrink-0">
                            <Image
                                src="/atmiya.png"
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
                </aside>

                {/* Right Column - Scrollable with white background */}
                <main className="flex-1 lg:ml-[400px] xl:ml-[450px] overflow-y-auto bg-white min-h-screen">
                    <div className="max-w-[700px] px-6 py-12 lg:px-12 lg:py-[62px] lg:pb-24">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
