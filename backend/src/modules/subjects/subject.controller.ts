import type { Request, Response } from "express";
import * as subjectService from "./subject.service.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

export async function listSubjects(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(req.query.pageSize as string) || 10));
  const search = (req.query.q as string)?.trim() || undefined;

  const { subjects, total } = await subjectService.getSubjects(page, pageSize, search);
  res.json({
    subjects: subjects.map((s) => ({
      id: s.id.toString(),
      title: s.title,
      slug: s.slug,
      description: s.description,
      shortDescription: s.shortDescription,
      thumbnail: s.thumbnail,
      instructor: s.instructor,
    })),
    total,
    page,
    pageSize,
  });
}

export async function getSubject(req: Request, res: Response): Promise<void> {
  const subjectId = parseInt(req.params.subjectId, 10);
  const subject = await subjectService.getSubjectWithStats(subjectId);
  if (!subject) {
    res.status(404).json({ error: "Subject not found" });
    return;
  }
  res.json(subject);
}

export async function enrollSubject(req: Request, res: Response): Promise<void> {
  const subjectId = parseInt(req.params.subjectId, 10);
  const userId = req.user!.id;
  await subjectService.enrollUser(userId, subjectId);
  res.json({ success: true });
}

export async function getSubjectTree(req: Request, res: Response): Promise<void> {
  const subjectId = parseInt(req.params.subjectId, 10);
  const userId = req.user!.id;
  const tree = await subjectService.getSubjectTreeWithProgress(subjectId, userId);
  if (!tree) {
    res.status(404).json({ error: "Subject not found" });
    return;
  }
  res.json(tree);
}

export async function getFirstVideo(req: Request, res: Response): Promise<void> {
  const subjectId = parseInt(req.params.subjectId, 10);
  const userId = req.user!.id;
  const videoId = await subjectService.getFirstUnlockedVideo(subjectId, userId);
  if (!videoId) {
    res.status(404).json({ error: "No videos found" });
    return;
  }
  res.json({ video_id: videoId });
}
