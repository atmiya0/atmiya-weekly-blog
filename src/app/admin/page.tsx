import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  // If already authenticated, redirect to dashboard
  const authenticated = await isAuthenticated();
  if (authenticated) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-title mb-2">Admin Access</h1>
          <p className="text-muted-foreground text-sm">Enter your password to continue</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
