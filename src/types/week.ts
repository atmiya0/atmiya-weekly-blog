export interface WeekPost {
    slug: string;
    title: string;
    week: number;
    startDate: string;
    endDate: string;
    summary: string;
    content: string;
    readingTime: string;
}

export interface WeekFrontmatter {
    title: string;
    week: number;
    startDate: string;
    endDate: string;
    summary: string;
    slug: string;
}
