"use client";

import { useEffect, useRef, useCallback } from "react";
import YouTube, { type YouTubePlayer } from "react-youtube";
import { sendProgressDebounced, sendProgressImmediate } from "@/lib/progress";
import { useSidebarStore } from "@/store/sidebarStore";

interface VideoPlayerProps {
  videoId: string;
  youtubeUrl: string;
  startPositionSeconds: number;
  durationSeconds?: number;
  onCompleted?: () => void;
}

function extractYoutubeId(url: string): string {
  const m = url.match(/(?:embed\/|v=|youtu\.be\/)([^&\s?]+)/);
  return m ? m[1] : url;
}

export function VideoPlayer({
  videoId,
  youtubeUrl,
  startPositionSeconds,
  durationSeconds,
  onCompleted,
}: VideoPlayerProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const markCompleted = useSidebarStore((s) => s.markVideoCompleted);

  const onPlayerReady = useCallback(
    (event: { target: YouTubePlayer }) => {
      playerRef.current = event.target;
      if (startPositionSeconds > 0) {
        event.target.seekTo(startPositionSeconds, true);
      }
    },
    [startPositionSeconds]
  );

  const onPlayerStateChange = useCallback(
    async (event: { data: number }) => {
      const state = event.data;
      if (state === 1) {
        intervalRef.current = setInterval(() => {
          const player = playerRef.current;
          if (player?.getCurrentTime) {
            const ct = player.getCurrentTime();
            const dur = durationSeconds ?? player.getDuration?.() ?? 0;
            const currentTime = typeof ct?.then === "function" ? 0 : Number(ct) || 0;
            const duration = typeof dur?.then === "function" ? 0 : Number(dur) || 0;
            sendProgressDebounced(
              videoId,
              Math.floor(currentTime),
              false,
              duration > 0 ? Math.floor(duration) : undefined
            );
          }
        }, 5000);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (state === 0) {
          const player = playerRef.current;
          let currentTime = 0;
          let duration = durationSeconds ?? 0;
          try {
            if (player) {
              const ct = player.getCurrentTime?.();
              const dur = player.getDuration?.();
              currentTime = typeof ct?.then === "function" ? Math.floor((await ct) ?? 0) : Math.floor(Number(ct) ?? 0);
              if (typeof dur?.then === "function") {
                duration = Math.floor((await dur) ?? 0);
              } else if (dur != null) {
                duration = Math.floor(Number(dur) ?? 0);
              }
            }
          } catch {
            /* use defaults */
          }
          await sendProgressImmediate(
            videoId,
            currentTime,
            true,
            duration > 0 ? duration : undefined
          );
          markCompleted(videoId);
          onCompleted?.();
        }
      }
    },
    [videoId, durationSeconds, markCompleted, onCompleted]
  );

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      start: startPositionSeconds,
      autoplay: 0,
    },
  };

  const ytId = extractYoutubeId(youtubeUrl);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-xl">
      <YouTube
        videoId={ytId}
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
        className="absolute inset-0 h-full w-full"
        iframeClassName="absolute left-0 top-0 h-full w-full"
      />
    </div>
  );
}
