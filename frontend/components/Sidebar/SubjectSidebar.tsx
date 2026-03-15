"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { SubjectTree, TreeSection, TreeVideo } from "@/store/sidebarStore";
import { useSidebarStore } from "@/store/sidebarStore";
import { apiFetch } from "@/lib/apiClient";
import { Spinner } from "@/components/common/Spinner";

export function SubjectSidebar() {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const { tree, loading, error } = useSidebarStore();
  const [progress, setProgress] = useState<{ percent_complete: number; completed_videos: number; total_videos: number } | null>(null);

  useEffect(() => {
    if (!subjectId || !tree) return;
    apiFetch(`/api/progress/subjects/${subjectId}`)
      .then((res) => res.ok ? res.json() : null)
      .then(setProgress)
      .catch(() => {});
  }, [subjectId, tree]);

  if (loading) {
    return (
      <aside className="w-72 shrink-0 border-r border-slate-200 bg-white p-4">
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="w-72 shrink-0 border-r border-slate-200 bg-white p-4">
        <p className="text-sm text-red-600">{error}</p>
      </aside>
    );
  }

  if (!tree) return null;

  return (
    <aside className="w-72 shrink-0 border-r border-slate-200 bg-white">
      <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto p-4">
        <h2 className="mb-4 font-semibold text-slate-800">{tree.title}</h2>
        {progress && progress.total_videos > 0 && (
          <div className="mb-4 rounded-lg bg-slate-100 p-3">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-slate-700">Progress</span>
              <span className="text-slate-600">{progress.percent_complete}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-primary-600 transition-all duration-300"
                style={{ width: `${progress.percent_complete}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {progress.completed_videos} of {progress.total_videos} lessons
            </p>
          </div>
        )}
        <nav className="space-y-4">
          {tree.sections.map((section) => (
            <SectionItem
              key={section.id}
              section={section}
              subjectId={subjectId}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}

function SectionItem({
  section,
  subjectId,
}: {
  section: TreeSection;
  subjectId: string;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {section.title}
      </h3>
      <ul className="space-y-1">
        {section.videos.map((video) => (
          <VideoItem key={video.id} video={video} subjectId={subjectId} />
        ))}
      </ul>
    </div>
  );
}

function VideoItem({
  video,
  subjectId,
}: {
  video: TreeVideo;
  subjectId: string;
}) {
  const isLocked = video.locked;
  const isCompleted = video.is_completed;

  const content = (
    <span className="flex items-center gap-2">
      {isCompleted ? (
        <span className="text-primary-600" title="Completed">
          ✓
        </span>
      ) : isLocked ? (
        <span className="text-slate-400" title="Locked">
          🔒
        </span>
      ) : (
        <span className="text-slate-400">○</span>
      )}
      <span
        className={
          isLocked
            ? "text-slate-400 line-through"
            : "text-slate-700 hover:text-primary-600"
        }
      >
        {video.title}
      </span>
    </span>
  );

  if (isLocked) {
    return (
      <li className="rounded-lg px-3 py-2 text-sm cursor-not-allowed bg-slate-50">
        {content}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={`/subjects/${subjectId}/video/${video.id}`}
        className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-primary-50"
      >
        {content}
      </Link>
    </li>
  );
}
