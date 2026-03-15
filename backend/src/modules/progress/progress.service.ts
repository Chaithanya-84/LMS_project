import * as progressRepo from "./progress.repository.js";
import { prisma } from "../../config/db.js";

export async function getVideoProgress(userId: number, videoId: number) {
  const p = await progressRepo.getVideoProgress(userId, videoId);
  return {
    last_position_seconds: p?.lastPositionSeconds ?? 0,
    is_completed: p?.isCompleted ?? false,
  };
}

export async function upsertVideoProgress(
  userId: number,
  videoId: number,
  lastPositionSeconds: number,
  isCompleted?: boolean,
  durationSeconds?: number
) {
  let capped = Math.max(0, lastPositionSeconds);
  if (durationSeconds != null && durationSeconds > 0) {
    capped = Math.min(capped, durationSeconds);
  }
  return progressRepo.upsertVideoProgress(userId, videoId, {
    lastPositionSeconds: capped,
    isCompleted,
  });
}

export async function getSubjectProgress(userId: number, subjectId: number) {
  return progressRepo.getSubjectProgress(userId, subjectId);
}
