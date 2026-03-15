"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/Auth/AuthGuard";
import { apiFetch } from "@/lib/apiClient";
import { Spinner } from "@/components/common/Spinner";

interface Subject {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  thumbnail: string | null;
  instructor: string | null;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    let cancelled = false;
    async function fetchSubjects() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
        });
        if (search) params.set("q", search);
        const res = await apiFetch(`/api/subjects?${params}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!cancelled) {
          setSubjects(data.subjects);
          setTotal(data.total);
        }
      } catch (e) {
        if (!cancelled) setSubjects([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchSubjects();
    return () => { cancelled = true; };
  }, [page, search]);

  return (
    <AuthGuard>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Courses</h1>
          <p className="mt-2 text-slate-600">
            Browse available courses and start learning.
          </p>
        </div>

        <div className="mb-6">
          <input
            type="search"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full max-w-md rounded-lg border border-slate-300 px-4 py-2.5 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : subjects.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-600">No courses found.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
                >
                  <Link href={`/subjects/${subject.id}`} className="block">
                    <div className="relative h-48 w-full overflow-hidden bg-slate-200">
                      {subject.thumbnail ? (
                        <img
                          src={subject.thumbnail}
                          alt={subject.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-400 to-primary-700 text-white text-4xl font-bold">
                          {subject.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h2 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                        {subject.title}
                      </h2>
                      {subject.instructor && (
                        <p className="mt-1 text-sm text-slate-500">
                          By {subject.instructor}
                        </p>
                      )}
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                        {subject.shortDescription || subject.description || "No description."}
                      </p>
                    </div>
                  </Link>
                  <div className="border-t border-slate-100 px-6 pb-6 pt-2">
                    <Link
                      href={`/subjects/${subject.id}`}
                      className="inline-flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors"
                    >
                      Enroll
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {total > pageSize && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50 hover:bg-slate-50"
                >
                  Previous
                </button>
                <span className="flex items-center px-4 text-sm text-slate-600">
                  Page {page} of {Math.ceil(total / pageSize)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(total / pageSize)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50 hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AuthGuard>
  );
}
