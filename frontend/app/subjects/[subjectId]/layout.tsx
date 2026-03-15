"use client";

import { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { AuthGuard } from "@/components/Auth/AuthGuard";
import { SubjectSidebar } from "@/components/Sidebar/SubjectSidebar";
import { apiFetch } from "@/lib/apiClient";
import { useSidebarStore } from "@/store/sidebarStore";

export default function SubjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const subjectId = params.subjectId as string;
  const { setTree, setLoading, setError } = useSidebarStore();

  const isLearningPage = pathname?.includes("/video/") || pathname?.includes("/learn");

  useEffect(() => {
    if (!subjectId || !isLearningPage) return;
    let cancelled = false;
    setLoading(true);
    apiFetch(`/api/subjects/${subjectId}/tree`)
      .then((res) => {
        if (cancelled) return;
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setTree(data);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [subjectId, isLearningPage, setTree, setLoading, setError]);

  return (
    <AuthGuard>
      <div className="flex min-h-[calc(100vh-4rem)]">
        {isLearningPage && <SubjectSidebar />}
        <div className="flex-1 flex flex-col bg-slate-900">
          <div className="border-b border-slate-700 bg-slate-900 px-6 py-4">
            <Link
              href="/subjects"
              className="text-sm font-medium text-slate-400 hover:text-white"
            >
              ← Back to courses
            </Link>
          </div>
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </AuthGuard>
  );
}
