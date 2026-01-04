import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getPost, savePost, deletePost } from "@/lib/github";
import { revalidatePath } from "next/cache";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/posts/[slug] - Get a single post
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const post = await getPost(slug, { noCache: true });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to get post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

/**
 * POST /api/posts/[slug] - Update or delete a post (method tunneling)
 * Use _method field to specify "PUT" or "DELETE"
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();
    const { _method, content, sha } = body;

    // Handle UPDATE
    if (_method === "PUT") {
      if (!content || typeof content !== "string") {
        return NextResponse.json({ error: "Content is required" }, { status: 400 });
      }

      if (!sha || typeof sha !== "string") {
        return NextResponse.json({ error: "SHA is required for updates" }, { status: 400 });
      }

      const result = await savePost(slug, content, sha);

      // Revalidate paths to update the site instantly in production
      revalidatePath("/");
      revalidatePath(`/week/${slug}`);
      revalidatePath("/feed.xml");

      return NextResponse.json({
        success: true,
        slug,
        sha: result.content.sha,
      });
    }

    // Handle DELETE
    if (_method === "DELETE") {
      if (!sha || typeof sha !== "string") {
        return NextResponse.json({ error: "SHA is required for deletion" }, { status: 400 });
      }

      await deletePost(slug, sha);

      // Revalidate paths to update the site instantly in production
      revalidatePath("/");
      revalidatePath(`/week/${slug}`);
      revalidatePath("/feed.xml");

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid _method. Use PUT or DELETE" }, { status: 400 });
  } catch (error) {
    console.error("Failed to process request:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process request" },
      { status: 500 }
    );
  }
}
