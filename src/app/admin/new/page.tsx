import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { AdminHeader } from "../components/admin-header";
import { NewPostForm } from "@/app/admin/new/new-post-form";

export const metadata = {
    title: "New Post | Admin",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function NewPostPage() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect("/admin");
    }

    return (
        <>
            <AdminHeader />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-title">New Post</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Create a new blog post
                    </p>
                </div>
                <NewPostForm />
            </main>
        </>
    );
}
