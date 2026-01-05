"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-4xl">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="font-medium text-lg">
            Admin
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Posts
            </Link>
            <Link
              href="/admin/new"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              New Post
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:bg-destructive/10">
            Logout
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/" target="_blank">
              View Site
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
