import type { Request, Response } from "express";
import * as videoService from "./video.service.js";

export async function getVideo(req: Request, res: Response): Promise<void> {
  const videoId = parseInt(req.params.videoId, 10);
  const userId = req.user!.id;
  const video = await videoService.getVideoDetails(videoId, userId);
  if (!video) {
    res.status(404).json({ error: "Video not found" });
    return;
  }
  res.json(video);
}
