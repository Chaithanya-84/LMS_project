import { prisma } from "../../config/db.js";

export async function getCompletedVideoIds(userId: number, subjectId: number): Promise<Set<string>> {
  const progress = await prisma.videoProgress.findMany({
    where: { userId, isCompleted: true, video: { section: { subjectId } } },
    select: { videoId: true },
  });
  return new Set(progress.map((p) => p.videoId.toString()));
}

export async function getVideoProgress(userId: number, videoId: number) {
  return prisma.videoProgress.findUnique({
    where: { userId_videoId: { userId, videoId } },
  });
}

export async function upsertVideoProgress(
  userId: number,
  videoId: number,
  data: { lastPositionSeconds: number; isCompleted?: boolean }
) {
  const update: { lastPositionSeconds: number; isCompleted?: boolean; completedAt?: Date } = {
    lastPositionSeconds: Math.max(0, data.lastPositionSeconds),
  };
  if (data.isCompleted) {
    update.isCompleted = true;
    update.completedAt = new Date();
  }

  return prisma.videoProgress.upsert({
    where: { userId_videoId: { userId, videoId } },
    create: {
      userId,
      videoId,
      lastPositionSeconds: update.lastPositionSeconds,
      isCompleted: update.isCompleted ?? false,
      completedAt: update.completedAt,
    },
    update,
  });
}

export async function getSubjectProgress(userId: number, subjectId: number) {
  const videos = await prisma.video.findMany({
    where: { section: { subjectId } },
    select: { id: true },
  });
  const totalVideos = videos.length;
  const videoIds = videos.map((v) => v.id);

  const completed = await prisma.videoProgress.count({
    where: { userId, videoId: { in: videoIds }, isCompleted: true },
  });

  const lastProgress = await prisma.videoProgress.findFirst({
    where: { userId, videoId: { in: videoIds } },
    orderBy: { updatedAt: "desc" },
    include: { video: true },
  });

  const percentComplete = totalVideos > 0 ? Math.round((completed / totalVideos) * 100) : 0;

  return {
    total_videos: totalVideos,
    completed_videos: completed,
    percent_complete: percentComplete,
    last_video_id: lastProgress?.videoId.toString() ?? null,
    last_position_seconds: lastProgress?.lastPositionSeconds ?? null,
  };
}
