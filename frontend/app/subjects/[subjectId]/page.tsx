"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";
import { Spinner } from "@/components/common/Spinner";

interface CourseDetails {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  thumbnail: string | null;
  instructor: string | null;
  learningOutcomes: string[];
  totalLessons: number;
  totalDuration: number;
  price: number;
  originalPrice: number | null;
  rating: number;
  ratingCount: number;
}

function formatPrice(cents: number): string {
  return cents >= 100 ? `$${(cents / 100).toFixed(2)}` : "Free";
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const subjectId = params.subjectId as string;
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (!subjectId) return;
    let cancelled = false;
    apiFetch(`/api/subjects/${subjectId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setCourse(data);
      })
      .catch(() => {
        if (!cancelled) setCourse(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [subjectId]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/subjects/${subjectId}`);
      return;
    }
    setEnrolling(true);
    try {
      const res = await apiFetch(`/api/subjects/${subjectId}/enroll`, {
        method: "POST",
      });
      if (res.ok) {
        router.push(`/subjects/${subjectId}/learn`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-900/50 bg-red-900/20 p-6 text-red-400">
          Course not found.
        </div>
      </div>
    );
  }

  const hasDiscount = course.originalPrice != null && course.originalPrice > course.price;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/subjects"
        className="mb-6 inline-block text-sm font-medium text-slate-400 hover:text-white"
      >
        ← Back to courses
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold text-white md:text-3xl">{course.title}</h1>
          <p className="text-slate-400">{course.shortDescription || course.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-amber-400">{course.rating.toFixed(1)}</span>
              <span className="text-amber-500">★</span>
              {course.ratingCount > 0 && (
                <span className="text-slate-500">({course.ratingCount.toLocaleString()} ratings)</span>
              )}
            </div>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{course.totalLessons} lessons</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{formatDuration(course.totalDuration)} total</span>
          </div>

          {course.instructor && (
            <p className="text-sm text-slate-400">Created by <span className="font-medium text-white">{course.instructor}</span></p>
          )}

          {course.thumbnail && (
            <div className="overflow-hidden rounded-lg border border-slate-700">
              <img src={course.thumbnail} alt={course.title} className="h-64 w-full object-cover md:h-80" />
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-white">Description</h2>
            <p className="mt-2 leading-relaxed text-slate-400">
              {course.description || "No description available."}
            </p>
          </div>

          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white">What you&apos;ll learn</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {course.learningOutcomes.map((outcome, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-400">
                    <span className="mt-0.5 text-emerald-500">✓</span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-slate-700 bg-slate-800/50 p-6 shadow-lg">
            {course.thumbnail && (
              <div className="mb-4 overflow-hidden rounded-lg">
                <img src={course.thumbnail} alt={course.title} className="aspect-video w-full object-cover" />
              </div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-400">
                {course.price > 0 ? formatPrice(course.price) : "Free"}
              </span>
              {hasDiscount && (
                <span className="text-lg text-slate-500 line-through">
                  {formatPrice(course.originalPrice!)}
                </span>
              )}
            </div>
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="mt-4 w-full rounded-lg bg-emerald-500 px-6 py-4 text-lg font-semibold text-white shadow-md hover:bg-emerald-600 disabled:opacity-50 transition-colors"
            >
              {enrolling ? "Enrolling..." : course.price > 0 ? "Buy Now" : "Enroll Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
