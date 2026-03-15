"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { AIAssistant } from "@/components/AI/AIAssistant";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"}/api/auth/logout`,
        { method: "POST", credentials: "include" }
      );
    } catch (e) {
      console.error(e);
    }
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/25">
                K
              </div>
              <span className="font-semibold text-xl text-white">LearnHub</span>
            </Link>
            <AIAssistant variant="header" />
          </div>

          <nav className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/subjects"
                  className="text-slate-300 hover:text-white font-medium transition-colors"
                >
                  Courses
                </Link>
                <Link
                  href="/profile"
                  className="text-slate-300 hover:text-white font-medium transition-colors"
                >
                  Profile
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                  <span className="text-sm text-slate-400">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-slate-300 hover:text-white font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-600 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
