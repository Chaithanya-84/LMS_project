"use client";

import Link from "next/link";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/demo" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/25">
              K
            </div>
            <span className="font-semibold text-xl text-white">LearnHub</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/demo" className="text-slate-300 hover:text-white font-medium transition-colors">
              Home
            </Link>
            <Link href="/demo/course/machine-learning-beginners" className="text-slate-300 hover:text-white font-medium transition-colors">
              Courses
            </Link>
            <Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">
              ← Back to LMS
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
