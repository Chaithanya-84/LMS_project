import type { Request, Response } from "express";
import * as progressService from "./progress.service.js";

export async function getVideoProgress(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const videoId = parseInt(req.params.videoId, 10);
  const progress = await progressService.getVideoProgress(userId, videoId);
  res.json(progress);
}

export async function updateVideoProgress(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const videoId = parseInt(req.params.videoId, 10);
  const { last_position_seconds, is_completed, duration_seconds } = req.body;
  const lastPositionSeconds = parseInt(String(last_position_seconds ?? 0), 10) || 0;
  const durationSeconds = duration_seconds != null ? parseInt(String(duration_seconds), 10) : undefined;

  await progressService.upsertVideoProgress(
    userId,
    videoId,
    lastPositionSeconds,
    is_completed,
    durationSeconds
  );
  res.json({ success: true });
}

export async function getSubjectProgress(req: Request, res: Response): Promise<void> {
  const userId = req.user!.id;
  const subjectId = parseInt(req.params.subjectId, 10);
  const progress = await progressService.getSubjectProgress(userId, subjectId);
  res.json(progress);
}
