import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getPost, savePost, deletePost } from "@/lib/github";

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
        const post = await getPost(slug);

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("Failed to get post:", error);
        return NextResponse.json(
            { error: "Failed to fetch post" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/posts/[slug] - Update a post
 */
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;
        const { content, sha } = await request.json();

        if (!content || typeof content !== "string") {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        if (!sha || typeof sha !== "string") {
            return NextResponse.json(
                { error: "SHA is required for updates" },
                { status: 400 }
            );
        }

        const result = await savePost(slug, content, sha);

        return NextResponse.json({
            success: true,
            slug,
            sha: result.content.sha,
        });
    } catch (error) {
        console.error("Failed to update post:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to update post" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/posts/[slug] - Delete a post
 */
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { slug } = await params;
        const { sha } = await request.json();

        if (!sha || typeof sha !== "string") {
            return NextResponse.json(
                { error: "SHA is required for deletion" },
                { status: 400 }
            );
        }

        await deletePost(slug, sha);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete post:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to delete post" },
            { status: 500 }
        );
    }
}
