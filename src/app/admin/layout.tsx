import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { AdminHeader } from "./components/admin-header";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#fafafa]">{children}</div>;
}

// Separate authenticated layout wrapper for dashboard pages
export async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/admin");
  }

  return (
    <>
      <AdminHeader />
      <main className="container mx-auto px-4 py-8 max-w-4xl">{children}</main>
    </>
  );
}
