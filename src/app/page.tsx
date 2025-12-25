import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllWeeks } from "@/lib/weeks";
import { formatDateRange, getISOWeekNumber } from "@/lib/dates";
import { BlogLayout } from "@/components/blog-layout";

export const metadata: Metadata = {
  title: "Atmiya's Blog | Atmiya Jadvani",
  description:
    "Personal blog by Atmiya Jadvani — Design × Product × Engineering. Documenting my weeks — what I'm building, learning, and thinking about.",
  openGraph: {
    title: "Atmiya's Blog | Atmiya Jadvani",
    description:
      "Documenting my weeks — what I'm building, learning, and thinking about in design, product, and engineering.",
    url: "https://blogs.atmiya.ca",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  const weeks = getAllWeeks();

  return (
    <BlogLayout>
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
              className="link-underline"
            >
              X(twitter)
            </a>
            ,{" "}
            <a
              href="https://www.linkedin.com/in/atmiyajadvani/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline"
            >
              LinkedIn
            </a>{" "}
            or{" "}
            <a
              href="https://github.com/atmiya0"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline"
            >
              GitHub
            </a>
            , or feel free to send me an{" "}
            <a
              href="mailto:atmiyajadvani09@gmail.com"
              className="link-underline"
            >
              email
            </a>
            .
          </p>
          <p className="text-[14px] leading-[1.5714285714285714em] font-normal">
            I'm open to full-time roles in Toronto — frontend engineer, design engineer, or similar.
          </p>
        </div>
      </section>

      {/* Timeline by Year Section */}
      <section>
        <div className="flex flex-col gap-[40px]">
          {weeks.length === 0 ? (
            <p className="text-[14px] leading-[1.5714285714285714em] font-normal">
              No weeks published yet.
            </p>
          ) : (
            (() => {
              // Group posts by year (using endDate so weeks spanning years go to the new year)
              const postsByYear = weeks.reduce((acc, post) => {
                const year = new Date(post.endDate).getFullYear().toString();
                if (!acc[year]) {
                  acc[year] = [];
                }
                acc[year].push(post);
                return acc;
              }, {} as Record<string, typeof weeks>);

              // Sort years descending (most recent first)
              const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

              return years.map((year) => {
                const yearPosts = postsByYear[year];

                // Group posts by week within the year
                const groupedWeeks = yearPosts.reduce((acc, post) => {
                  const key = post.startDate;
                  if (!acc[key]) {
                    acc[key] = [];
                  }
                  acc[key].push(post);
                  return acc;
                }, {} as Record<string, typeof weeks>);

                const weekGroups = Object.entries(groupedWeeks)
                  .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());

                return (
                  <div key={year} className="flex flex-col gap-[27px]">
                    {/* Year pill */}
                    <div className="pill">
                      <h2 className="text-[14px] leading-[1.5714285714285714em] font-normal">
                        {year}
                      </h2>
                    </div>

                    {/* Timeline for this year */}
                    <div className="relative">
                      {/* Continuous vertical line - only show if more than one week group */}
                      {weekGroups.length > 1 && (
                        <div
                          className="absolute left-[8.5px] top-[11px] w-[1px] bg-[var(--divider)]"
                          style={{ height: `calc(100% - 54px)` }}
                        />
                      )}
                      {weekGroups.map(([startDate, posts]) => (
                        <div key={startDate} className="relative flex">
                          {/* Timeline arrow icon */}
                          <div className="mr-[14px] flex-shrink-0">
                            <Image
                              src="/up-arrow.svg"
                              alt=""
                              width={18}
                              height={18}
                              className="mt-[2px]"
                            />
                          </div>
                          {/* Content */}
                          <div className="flex flex-col pb-[20px] flex-1">
                            {/* Week number and dates */}
                            <p className="text-[14px] leading-[1.5714285714285714em] font-normal opacity-60 mb-[8px]">
                              Week {getISOWeekNumber(posts[0].startDate)} = {formatDateRange(posts[0].startDate, posts[0].endDate)}
                            </p>
                            {/* Blog titles - all posts for this week */}
                            <div className="flex flex-col gap-[4px]">
                              {posts.map((post) => (
                                <Link
                                  key={post.slug}
                                  href={`/week/${post.slug}`}
                                  className="group"
                                >
                                  <p className="text-[14px] leading-[1.5714285714285714em] font-normal group-hover:text-[var(--brand)] transition-colors">
                                    {post.title}
                                  </p>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              });
            })()
          )}
        </div>
      </section>
    </BlogLayout>
  );
}
