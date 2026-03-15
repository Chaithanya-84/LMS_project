import type { Section, Video } from "@prisma/client";
import {
  buildFlatVideoSequence,
  getPreviousVideoId,
  getNextVideoId,
} from "../../utils/ordering.js";
import * as subjectRepo from "./subject.repository.js";
import * as progressRepo from "../progress/progress.repository.js";

export async function getSubjects(page: number, pageSize: number, search?: string) {
  return subjectRepo.getPublishedSubjects(page, pageSize, search);
}

export async function getSubject(id: number) {
  return subjectRepo.getSubjectById(id);
}

export async function getSubjectWithStats(subjectId: number) {
  const subject = await subjectRepo.getSubjectById(subjectId);
  if (!subject) return null;
  const stats = await subjectRepo.getSubjectStats(subjectId);
  let learningOutcomes: string[] = [];
  if (subject.learningOutcomes) {
    try {
      learningOutcomes = JSON.parse(subject.learningOutcomes) as string[];
    } catch {
      learningOutcomes = subject.learningOutcomes.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return {
    id: subject.id.toString(),
    title: subject.title,
    slug: subject.slug,
    description: subject.description,
    shortDescription: subject.shortDescription,
    thumbnail: subject.thumbnail,
    instructor: subject.instructor,
    learningOutcomes,
    totalLessons: stats.totalLessons,
    totalDuration: stats.totalDuration,
  };
}

export async function enrollUser(userId: number, subjectId: number) {
  return subjectRepo.enrollUser(userId, subjectId);
}

export async function isEnrolled(userId: number, subjectId: number) {
  return subjectRepo.isEnrolled(userId, subjectId);
}

export async function getSubjectTreeWithProgress(subjectId: number, userId: number) {
  const subject = await subjectRepo.getSubjectTree(subjectId);
  if (!subject) return null;

  const flatSequence = buildFlatVideoSequence(subject.sections);
  const completedVideoIds = await progressRepo.getCompletedVideoIds(userId, subjectId);

  const sectionsWithStatus = subject.sections.map((section) => ({
    id: section.id.toString(),
    title: section.title,
    order_index: section.orderIndex,
    videos: section.videos.map((v) => {
      const prevId = getPreviousVideoId(flatSequence, v.id);
      const locked =
        prevId !== null && !completedVideoIds.has(prevId.toString());
      return {
        id: v.id.toString(),
        title: v.title,
        order_index: v.orderIndex,
        is_completed: completedVideoIds.has(v.id.toString()),
        locked,
      };
    }),
  }));

  return {
    id: subject.id.toString(),
    title: subject.title,
    sections: sectionsWithStatus,
  };
}

export async function getFirstUnlockedVideo(subjectId: number, userId: number) {
  const subject = await subjectRepo.getSubjectTree(subjectId);
  if (!subject) return null;

  const flatSequence = buildFlatVideoSequence(subject.sections);
  const completedVideoIds = await progressRepo.getCompletedVideoIds(userId, subjectId);

  for (const v of flatSequence) {
    const prevId = getPreviousVideoId(flatSequence, v.id);
    const locked = prevId !== null && !completedVideoIds.has(prevId.toString());
    if (!locked) {
      return v.id.toString();
    }
  }
  return null;
}
