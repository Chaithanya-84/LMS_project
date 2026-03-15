"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  price: number;
  originalPrice: number | null;
  rating: number;
  ratingCount: number;
}

function formatPrice(cents: number): string {
  return cents >= 100 ? `$${(cents / 100).toFixed(2)}` : "Free";
}

function discountPercent(price: number, original: number): number {
  if (original <= 0) return 0;
  return Math.round(((original - price) / original) * 100);
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Popular Courses</h1>
          <p className="mt-2 text-slate-400">
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
            className="w-full max-w-md rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : subjects.length === 0 ? (
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-12 text-center">
            <p className="text-slate-400">No courses found.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {subjects.map((subject) => {
                const hasDiscount = subject.originalPrice != null && subject.originalPrice > subject.price;
                const discount = hasDiscount ? discountPercent(subject.price, subject.originalPrice!) : 0;
                return (
                  <div
                    key={subject.id}
                    className="group overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
                  >
                    <Link href={`/subjects/${subject.id}`} className="block">
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-700">
                        {subject.thumbnail ? (
                          <img
                            src={subject.thumbnail}
                            alt={subject.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-4xl font-bold">
                            {subject.title.charAt(0)}
                          </div>
                        )}
                        {hasDiscount && discount > 0 && (
                          <span className="absolute top-2 left-2 rounded bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
                            {discount}% off
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <h2 className="font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                          {subject.title}
                        </h2>
                        {subject.instructor && (
                          <p className="mt-1 text-xs text-slate-500">
                            By {subject.instructor}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-1 text-sm">
                          <span className="font-semibold text-amber-400">{subject.rating.toFixed(1)}</span>
                          <span className="text-amber-500">★</span>
                          {subject.ratingCount > 0 && (
                            <span className="text-slate-500">({subject.ratingCount.toLocaleString()})</span>
                          )}
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                          {subject.shortDescription || subject.description || "No description."}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="font-bold text-white">
                            {subject.price > 0 ? formatPrice(subject.price) : "Free"}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-slate-500 line-through">
                              {formatPrice(subject.originalPrice!)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                    <div className="border-t border-slate-700 px-5 pb-5 pt-2">
                      <Link
                        href={`/subjects/${subject.id}`}
                        className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 transition-colors"
                      >
                        {subject.price > 0 ? "Buy Now" : "Enroll"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {total > pageSize && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 disabled:opacity-50 hover:bg-slate-700"
                >
                  Previous
                </button>
                <span className="flex items-center px-4 text-sm text-slate-400">
                  Page {page} of {Math.ceil(total / pageSize)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(total / pageSize)}
                  className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 disabled:opacity-50 hover:bg-slate-700"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
  );
}
