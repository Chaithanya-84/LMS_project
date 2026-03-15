"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/apiClient";
import { sendProgressImmediate } from "@/lib/progress";
import { useSidebarStore } from "@/store/sidebarStore";
import { VideoPlayer } from "@/components/Video/VideoPlayer";
import { VideoMeta } from "@/components/Video/VideoMeta";
import { Spinner } from "@/components/common/Spinner";

interface VideoData {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  duration_seconds: number | null;
  section_title: string;
  previous_video_id: string | null;
  next_video_id: string | null;
  locked: boolean;
  unlock_reason: string | null;
}

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId as string;
  const videoId = params.videoId as string;
  const [video, setVideo] = useState<VideoData | null>(null);
  const [progress, setProgress] = useState<{ last_position_seconds: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [navigating, setNavigating] = useState(false);
  const markCompleted = useSidebarStore((s) => s.markVideoCompleted);

  useEffect(() => {
    if (!videoId) return;
    let cancelled = false;

    async function fetchData() {
      try {
        const [videoRes, progressRes] = await Promise.all([
          apiFetch(`/api/videos/${videoId}`),
          apiFetch(`/api/progress/videos/${videoId}`),
        ]);

        if (cancelled) return;

        if (!videoRes.ok) {
          setError("Video not found");
          return;
        }

        const videoData = await videoRes.json();
        const progressData = progressRes.ok ? await progressRes.json() : null;

        setVideo(videoData);
        setProgress(progressData);
      } catch (e) {
        if (!cancelled) setError("Failed to load video");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [videoId]);

  const handleCompleted = () => {
    if (video?.next_video_id) {
      router.push(`/subjects/${subjectId}/video/${video.next_video_id}`);
    }
  };

  const handleNextClick = async () => {
    if (!video?.next_video_id || navigating) return;
    setNavigating(true);
    await sendProgressImmediate(
      video.id,
      progress?.last_position_seconds ?? 0,
      true,
      video.duration_seconds ?? undefined
    );
    markCompleted(video.id);
    router.push(`/subjects/${subjectId}/video/${video.next_video_id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-900/50 bg-red-900/20 p-6 text-red-400">
          {error || "Video not found"}
        </div>
      </div>
    );
  }

  if (video.locked) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-2xl rounded-xl border border-amber-900/50 bg-amber-900/20 p-8 text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-amber-400">Video locked</h2>
          <p className="mt-2 text-amber-300/80">{video.unlock_reason || "Complete the previous video to unlock this one."}</p>
          <Link
            href={`/subjects/${subjectId}/learn`}
            className="mt-6 inline-block rounded-lg bg-amber-500 px-6 py-2 font-medium text-white hover:bg-amber-600"
          >
            Back to course
          </Link>
        </div>
      </div>
    );
  }

  const startPosition = progress?.last_position_seconds ?? 0;
  const startAdjusted = startPosition > 3 ? startPosition - 3 : 0;

  return (
    <div className="p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <VideoPlayer
          videoId={video.id}
          youtubeUrl={video.youtube_url}
          startPositionSeconds={startAdjusted}
          durationSeconds={video.duration_seconds ?? undefined}
          onCompleted={handleCompleted}
        />
        <VideoMeta
          title={video.title}
          description={video.description}
          sectionTitle={video.section_title}
        />

        <div className="mt-8 flex justify-between border-t border-slate-700 pt-6">
          {video.previous_video_id ? (
            <Link
              href={`/subjects/${subjectId}/video/${video.previous_video_id}`}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          {video.next_video_id ? (
            <button
              onClick={handleNextClick}
              disabled={navigating}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
            >
              {navigating ? "..." : "Next →"}
            </button>
          ) : (
            <div className="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-400">
              Course complete! 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
