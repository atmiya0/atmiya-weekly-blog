export interface WeekPost {
    slug: string;
    title: string;
    week: number;
    date: string;
    startDate: string;
    endDate: string;
    summary: string;
    content: string;
    readingTime: string;
    createdAt: string;
    updatedAt: string;
}

export interface WeekFrontmatter {
    title: string;
    week: number;
    date?: string;
    startDate: string;
    endDate: string;
    summary: string;
    slug: string;
    createdAt?: string;
    updatedAt?: string;
}
