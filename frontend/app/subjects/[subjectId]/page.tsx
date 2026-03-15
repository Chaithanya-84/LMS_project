"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
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

  const handleStartLearning = () => {
    router.push(`/subjects/${subjectId}/learn`);
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
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
          Course not found.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link
        href="/subjects"
        className="mb-6 inline-block text-sm font-medium text-slate-600 hover:text-primary-600"
      >
        ← Back to courses
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {course.thumbnail && (
          <div className="relative h-64 w-full overflow-hidden bg-slate-200">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
          {course.instructor && (
            <p className="mt-2 text-slate-600">Instructor: {course.instructor}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="rounded-lg bg-slate-100 px-4 py-2">
              <span className="text-sm text-slate-500">Lessons</span>
              <p className="font-semibold text-slate-900">{course.totalLessons}</p>
            </div>
            <div className="rounded-lg bg-slate-100 px-4 py-2">
              <span className="text-sm text-slate-500">Duration</span>
              <p className="font-semibold text-slate-900">
                {formatDuration(course.totalDuration)}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Description</h2>
            <p className="mt-2 leading-relaxed text-slate-600">
              {course.description || "No description available."}
            </p>
          </div>

          {course.learningOutcomes && course.learningOutcomes.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">
                What you will learn
              </h2>
              <ul className="mt-4 space-y-2">
                {course.learningOutcomes.map((outcome, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-slate-600"
                  >
                    <span className="mt-1 text-primary-600">✓</span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 flex gap-4">
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="rounded-xl bg-primary-600 px-8 py-3 text-lg font-semibold text-white shadow-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {enrolling ? "Enrolling..." : "Enroll"}
            </button>
            <button
              onClick={handleStartLearning}
              className="rounded-xl border-2 border-primary-600 px-8 py-3 text-lg font-semibold text-primary-600 hover:bg-primary-50 transition-colors"
            >
              Start Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
