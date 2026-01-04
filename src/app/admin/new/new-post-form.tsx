"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Dynamic import to avoid SSR issues with Tiptap
const TiptapEditor = dynamic(
    () =>
        import("@/components/Editor/tiptap-editor").then((mod) => mod.TiptapEditor),
    {
        ssr: false,
        loading: () => (
            <div className="border border-border rounded-lg p-4 min-h-[400px] bg-card animate-pulse" />
        ),
    }
);

export function NewPostForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Metadata
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Content (HTML from editor)
    const [content, setContent] = useState("");

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const slug = generateSlug(title);

            if (!slug) {
                setError("Please enter a valid title");
                setIsLoading(false);
                return;
            }

            // Build the .txt file format
            const fileContent = `${title}
${startDate}${endDate ? `,${endDate}` : ""}


${content}`;

            const response = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug,
                    content: fileContent,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to create post");
                return;
            }

            router.push("/admin/dashboard");
            router.refresh();
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Metadata Card */}
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Post title"
                            required
                        />
                        {title && (
                            <p className="text-xs text-muted-foreground">
                                Slug: {generateSlug(title) || "..."}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date (Monday)</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date (Sunday)</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>


                </CardContent>
            </Card>

            <Separator />

            {/* Editor */}
            <div className="space-y-2">
                <Label>Content</Label>
                <TiptapEditor
                    content=""
                    onChange={setContent}
                    placeholder="Start writing your post..."
                />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {/* Actions */}
            <div className="flex items-center gap-4">
                <Button type="submit" disabled={isLoading || !title}>
                    {isLoading ? "Creating..." : "Create Post"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/dashboard")}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
