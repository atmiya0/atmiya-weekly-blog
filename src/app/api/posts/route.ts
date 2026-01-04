import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { listPosts, savePost, getTemplate } from "@/lib/github";
import { revalidatePath } from "next/cache";

/**
 * GET /api/posts - List all posts
 */
export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await listPosts({ noCache: true });
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Failed to list posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

/**
 * POST /api/posts - Create a new post
 */
export async function POST(request: Request) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, content, useTemplate } = await request.json();

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        {
          error: "Slug must only contain lowercase letters, numbers, and hyphens",
        },
        { status: 400 }
      );
    }

    let postContent = content;

    // If using template, get it and replace placeholders
    if (useTemplate) {
      postContent = await getTemplate();
      // Replace the title placeholder with the slug
      const formattedTitle = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const lines = postContent.split("\n");
      lines[0] = formattedTitle;
      lines[1] = new Date().toISOString().split("T")[0];
      postContent = lines.join("\n");
    }

    if (!postContent) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const result = await savePost(slug, postContent);

    // Revalidate paths to update the site instantly in production
    revalidatePath("/");
    revalidatePath(`/week/${slug}`);
    revalidatePath("/feed.xml");

    return NextResponse.json({
      success: true,
      slug,
      sha: result.content.sha,
    });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create post" },
      { status: 500 }
    );
  }
}
