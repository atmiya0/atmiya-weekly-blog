import { redirect, notFound } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getPost } from "@/lib/github";
import { AdminHeader } from "../../components/admin-header";
import { EditPostForm } from "@/app/admin/edit/[slug]/edit-post-form";

export const metadata = {
  title: "Edit Post | Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface EditPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/admin");
  }

  const { slug } = await params;
  const post = await getPost(slug, { noCache: true });

  if (!post) {
    notFound();
  }

  // Parse the .txt format
  const lines = post.content.split("\n");
  const title = lines[0] || "";
  const date = lines[1]?.trim() || "";
  const summary = lines[2]?.trim() || "";
  // Content starts from line 5 (index 4)
  const bodyContent = lines.slice(4).join("\n").trim();

  return (
    <>
      <AdminHeader />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-title">Editing: {title}</h1>
        </div>
        <EditPostForm
          slug={slug}
          initialTitle={title}
          initialDate={date}
          initialContent={bodyContent}
          sha={post.metadata.sha}
        />
      </main>
    </>
  );
}
