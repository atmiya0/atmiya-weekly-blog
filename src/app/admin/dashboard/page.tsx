import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { listPosts } from "@/lib/github";
import { AdminHeader } from "../components/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export const metadata = {
    title: "Dashboard | Admin",
    robots: {
        index: false,
        follow: false,
    },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect("/admin");
    }

    let posts: Awaited<ReturnType<typeof listPosts>> = [];
    let error: string | null = null;

    try {
        posts = await listPosts();
    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to load posts";
    }

    // Group posts by year
    const postsByYear = posts.reduce(
        (acc, post) => {
            const year = post.date.split("-")[0];
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(post);
            return acc;
        },
        {} as Record<string, typeof posts>
    );

    // Sort years descending (most recent first)
    const years = Object.keys(postsByYear).sort(
        (a, b) => parseInt(b) - parseInt(a)
    );

    return (
        <>
            <AdminHeader />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-title">Posts</h1>
                    <div className="flex items-center gap-4">
                        <p className="text-muted-foreground text-sm">
                            {posts.length} post{posts.length !== 1 ? "s" : ""}
                        </p>
                        <Link href="/admin/new">
                            <Button>New Post</Button>
                        </Link>
                    </div>
                </div>

                {error && (
                    <Card className="border-destructive mb-6">
                        <CardContent className="pt-6">
                            <p className="text-destructive">{error}</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Make sure GITHUB_TOKEN and GITHUB_REPO are set in your
                                environment variables.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {!error && posts.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground mb-4">No posts yet</p>
                            <Link href="/admin/new">
                                <Button>Create your first post</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {posts.length > 0 && (
                    <div className="space-y-8">
                        {years.map((year) => (
                            <div key={year}>
                                <h2 className="text-lg font-medium mb-3">{year}</h2>
                                <div className="border border-border rounded-lg overflow-hidden">
                                    <Table className="table-fixed">
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead className="w-[140px]">Date</TableHead>
                                                <TableHead>Title</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {postsByYear[year].map((post) => {
                                                const displayDate = post.date.includes(",")
                                                    ? post.date.split(",")[0].trim()
                                                    : post.date;

                                                return (
                                                    <TableRow
                                                        key={post.slug}
                                                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                                                    >
                                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                                            <Link
                                                                href={`/admin/edit/${post.slug}`}
                                                                className="block py-1"
                                                            >
                                                                {displayDate}
                                                            </Link>
                                                        </TableCell>
                                                        <TableCell className="font-medium truncate">
                                                            <Link
                                                                href={`/admin/edit/${post.slug}`}
                                                                className="block py-1 hover:text-brand transition-colors"
                                                            >
                                                                {post.title}
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
