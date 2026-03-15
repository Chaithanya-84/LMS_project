import type { Video } from "@prisma/client";
import * as videoRepo from "./video.repository.js";
import * as progressRepo from "../progress/progress.repository.js";
import {
  buildFlatVideoSequence,
  getPreviousVideoId,
  getNextVideoId,
} from "../../utils/ordering.js";
import { prisma } from "../../config/db.js";

function extractYoutubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export async function getVideoDetails(videoId: number, userId: number) {
  const video = await videoRepo.getVideoById(videoId);
  if (!video) return null;

  const subject = await prisma.subject.findUnique({
    where: { id: video.section.subjectId },
    include: {
      sections: {
        orderBy: { orderIndex: "asc" },
        include: { videos: { orderBy: { orderIndex: "asc" } } },
      },
    },
  });

  if (!subject) return null;

  const flatSequence = buildFlatVideoSequence(subject.sections);
  const completedVideoIds = await progressRepo.getCompletedVideoIds(userId, subject.id);

  const prevId = getPreviousVideoId(flatSequence, videoId);
  const locked = prevId !== null && !completedVideoIds.has(prevId.toString());
  const nextId = getNextVideoId(flatSequence, videoId);

  const youtubeId = extractYoutubeVideoId(video.youtubeUrl);
  const youtubeEmbedUrl = video.youtubeUrl.includes("/embed/")
    ? video.youtubeUrl
    : youtubeId
      ? `https://www.youtube.com/embed/${youtubeId}`
      : video.youtubeUrl;

  return {
    id: video.id.toString(),
    title: video.title,
    description: video.description,
    youtube_url: youtubeEmbedUrl,
    order_index: video.orderIndex,
    duration_seconds: video.durationSeconds,
    section_id: video.sectionId.toString(),
    section_title: video.section.title,
    subject_id: subject.id.toString(),
    subject_title: subject.title,
    previous_video_id: prevId?.toString() ?? null,
    next_video_id: nextId?.toString() ?? null,
    locked,
    unlock_reason: locked ? "Complete previous video" : null,
  };
}
