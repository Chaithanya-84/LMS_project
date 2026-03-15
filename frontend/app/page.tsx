"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { AIAssistant } from "@/components/AI/AIAssistant";

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">
            Skills for your present and your future
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Your learning journey starts here. Browse courses and track your progress.
          </p>
          <Link
            href="/subjects"
            className="mt-8 inline-flex items-center rounded-xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-emerald-600 transition-colors"
          >
            Browse Courses
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">500K+</p>
            <p className="mt-1 text-sm text-slate-500">Students</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">4.7</p>
            <p className="mt-1 text-sm text-slate-500">Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">1,200+</p>
            <p className="mt-1 text-sm text-slate-500">Courses</p>
          </div>
        </div>

        <div className="mt-16 max-w-2xl mx-auto">
          <AIAssistant defaultOpen={true} variant="card" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Skills for your present and your future
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          A professional learning management system with video-based courses,
          progress tracking, and structured learning paths.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">500K+</p>
            <p className="mt-1 text-sm text-slate-500">Students</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">4.7</p>
            <p className="mt-1 text-sm text-slate-500">Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">1,200+</p>
            <p className="mt-1 text-sm text-slate-500">Courses</p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/subjects"
            className="rounded-xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-emerald-600 transition-colors"
          >
            Browse Courses
          </Link>
          <Link
            href="/auth/register"
            className="rounded-xl border-2 border-slate-600 px-8 py-4 text-lg font-semibold text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
          >
            Get started
          </Link>
          <Link
            href="/auth/login"
            className="rounded-xl border-2 border-slate-600 px-8 py-4 text-lg font-semibold text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

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
    <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-8 shadow-sm">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-slate-400">{description}</p>
    </div>
  );
}
