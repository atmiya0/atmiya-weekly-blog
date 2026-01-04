"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Dynamic import to avoid SSR issues with Tiptap
const TiptapEditor = dynamic(
  () => import("@/components/Editor/tiptap-editor").then((mod) => mod.TiptapEditor),
  {
    ssr: false,
    loading: () => (
      <div className="border border-border rounded-lg p-4 h-[350px] bg-card animate-pulse" />
    ),
  }
);

interface EditPostFormProps {
  slug: string;
  initialTitle: string;
  initialDate: string;
  initialContent: string;
  sha: string;
}

export function EditPostForm({
  slug,
  initialTitle,
  initialDate,
  initialContent,
  sha,
}: EditPostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Metadata
  const [title, setTitle] = useState(initialTitle);
  const [startDate, setStartDate] = useState(
    initialDate.includes(",") ? initialDate.split(",")[0].trim() : initialDate
  );
  const [endDate, setEndDate] = useState(
    initialDate.includes(",") ? initialDate.split(",")[1].trim() : initialDate
  );

  // Content (HTML from editor, initialized with plain text converted to paragraphs)
  const initialHtml = initialContent
    .split("\n\n")
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
  const [content, setContent] = useState(initialHtml);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Build the .txt file format
      const fileContent = `${title}
${startDate}${endDate ? `,${endDate}` : ""}


${content}`;

      const response = await fetch(`/api/posts/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _method: "PUT",
          content: fileContent,
          sha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to update post");
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

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _method: "DELETE",
          sha
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to delete post");
        setIsDeleting(false);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("An error occurred. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Metadata Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            required
          />
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
      </div>

      {/* Editor */}
      <div className="space-y-2">
        <TiptapEditor
          content={initialHtml}
          onChange={setContent}
          placeholder="Start writing your post..."
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="destructive">
              Delete Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Post</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &ldquo;{title}&rdquo;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/dashboard")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !title}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
