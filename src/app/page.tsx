import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllWeeks } from "@/lib/weeks";
import { formatDateRange } from "@/lib/dates";
import { Countdown } from "@/components/countdown";

export const metadata: Metadata = {
  title: "Atmiya Jadvani",
  description:
    "Design × Product × Engineering. Welcome to my blog. I document here.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  const weeks = getAllWeeks();

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

      {/* Main Content Area */}
      <main className="pt-[62px] pb-24">
        <div className="w-[650px] mx-auto">
          {/* Welcome Section */}
          <section className="mb-[72px]">
            <div className="flex flex-col gap-[13px]">
              <p className="text-[14px] leading-[1.5714285714285714em] font-normal">
                Welcome to my blog. I document here.
              </p>
              <p className="text-[14px] leading-[1.5714285714285714em] font-normal">
                Hey, I'm Atmiya. I'm interested in building systems that balance
                simplicity and usefulness, working at the intersection of design,
                product, and engineering.
              </p>
              <p className="text-[14px] leading-[1.5714285714285714em] font-normal">
                Over the past few years, I've worked as a product designer and
                frontend engineer, designing and building digital products from
                idea to production. This multidisciplinary background shapes how
                I approach building products that are clear, scalable, and easy
                to use, with a strong focus on real users and real outcomes.
              </p>
              <p className="text-[14px] leading-[1.5714285714285714em] font-normal">
                Find me on{" "}
                <a
                  href="https://x.com/atmiyajadvani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-70"
                >
                  X(twitter)
                </a>
                ,{" "}
                <a
                  href="https://www.linkedin.com/in/atmiyajadvani/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-70"
                >
                  LinkedIn
                </a>{" "}
                or{" "}
                <a
                  href="https://github.com/atmiya0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-70"
                >
                  GitHub
                </a>
                , or feel free to send me an{" "}
                <a
                  href="mailto:atmiyajadvani09@gmail.com"
                  className="underline hover:opacity-70"
                >
                  email
                </a>
                .
              </p>
            </div>
          </section>

          {/* My life by weeks Section */}
          <section>
            <div className="flex flex-col gap-[27px]">
              <h2 className="text-[14px] leading-[1.5714285714285714em] font-normal">
                My life by weeks
              </h2>
              <div className="flex flex-col gap-[13px]">
                {weeks.length === 0 ? (
                  <p className="text-[14px] leading-[1.5714285714285714em] font-normal">
                    No weeks published yet.
                  </p>
                ) : (
                  weeks.map((week) => (
                    <div key={week.slug} className="flex flex-col gap-[13px]">
                      <p className="text-[14px] leading-[1.5714285714285714em] font-normal">
                        Week {week.week} = {formatDateRange(week.startDate, week.endDate)}
                      </p>
                      <div className="w-full h-[1px] bg-[#E7E7E7]"></div>
                      <Link
                        href={`/week/${week.slug}`}
                        className="text-[14px] leading-[1.5714285714285714em] font-normal hover:opacity-70 transition-opacity"
                      >
                        {week.title}
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
