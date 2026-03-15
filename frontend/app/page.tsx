"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            Welcome to LMS
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Your learning journey starts here. Browse courses and track your progress.
          </p>
          <Link
            href="/subjects"
            className="mt-8 inline-flex items-center rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary-700 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-50 via-white to-slate-50" />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            Learn at your own pace
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-600">
            A professional learning management system with video-based courses,
            progress tracking, and structured learning paths.
          </p>
          <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/auth/register"
            className="rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary-700 transition-colors"
          >
            Get started
          </Link>
          <Link
            href="/auth/login"
            className="rounded-xl border-2 border-slate-300 px-8 py-4 text-lg font-semibold text-slate-700 hover:border-primary-500 hover:text-primary-600 transition-colors"
          >
            Sign in
          </Link>
          </div>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-3">
        <FeatureCard
          title="Video-based learning"
          description="Watch YouTube videos embedded in a structured curriculum. Resume from where you left off."
        />
        <FeatureCard
          title="Progress tracking"
          description="Track completion percentage and unlock videos sequentially. Your progress syncs across devices."
        />
        <FeatureCard
          title="Clean & minimal"
          description="Focus on learning with a distraction-free, professional interface designed for clarity."
        />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-600">{description}</p>
    </div>
  );
}
