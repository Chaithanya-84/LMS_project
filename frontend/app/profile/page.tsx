"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/Auth/AuthGuard";
import { useAuthStore } from "@/store/authStore";
import { apiFetch } from "@/lib/apiClient";

interface SubjectProgress {
  subject_id: string;
  title: string;
  total_videos: number;
  completed_videos: number;
  percent_complete: number;
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [progress, setProgress] = useState<SubjectProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await apiFetch("/api/subjects?pageSize=50");
        if (!res.ok) return;
        const data = await res.json();
        const subjects = data.subjects || [];
        const results: SubjectProgress[] = [];
        for (const s of subjects) {
          const pRes = await apiFetch(`/api/progress/subjects/${s.id}`);
          if (pRes.ok) {
            const p = await pRes.json();
            results.push({
              subject_id: s.id,
              title: s.title,
              total_videos: p.total_videos,
              completed_videos: p.completed_videos,
              percent_complete: p.percent_complete,
            });
          }
        }
        setProgress(results);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, []);

  return (
    <AuthGuard>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/50 p-6">
          <h2 className="text-lg font-semibold text-white">Account</h2>
          <dl className="mt-4 space-y-2">
            <div>
              <dt className="text-sm text-slate-500">Name</dt>
              <dd className="font-medium text-slate-200">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">Email</dt>
              <dd className="font-medium text-slate-200">{user?.email}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white">Course progress</h2>
          {loading ? (
            <div className="mt-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-emerald-500" />
          ) : progress.length === 0 ? (
            <p className="mt-4 text-slate-400">No progress yet. Start a course!</p>
          ) : (
            <div className="mt-4 space-y-4">
              {progress.map((p) => (
                <div
                  key={p.subject_id}
                  className="rounded-xl border border-slate-700 bg-slate-800/50 p-4"
                >
                  <div className="flex justify-between">
                    <Link
                      href={`/subjects/${p.subject_id}`}
                      className="font-medium text-emerald-400 hover:text-emerald-300"
                    >
                      {p.title}
                    </Link>
                    <span className="text-sm text-slate-500">
                      {p.completed_videos}/{p.total_videos} videos
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${p.percent_complete}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
