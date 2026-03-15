import type { Section, Video } from "@prisma/client";

export interface FlatVideo {
  id: number;
  sectionId: number;
  orderIndex: number;
}

/**
 * Build flattened video sequence for a subject (sections ordered by order_index, videos within each section ordered by order_index)
 */
export function buildFlatVideoSequence(
  sections: (Section & { videos: Video[] })[]
): FlatVideo[] {
  const sortedSections = [...sections].sort((a, b) => a.orderIndex - b.orderIndex);
  const flat: FlatVideo[] = [];
  for (const section of sortedSections) {
    const sortedVideos = [...section.videos].sort((a, b) => a.orderIndex - b.orderIndex);
    for (const v of sortedVideos) {
      flat.push({ id: v.id, sectionId: v.sectionId, orderIndex: v.orderIndex });
    }
  }
  return flat;
}

/**
 * Get previous video id in global sequence (null if first)
 */
export function getPreviousVideoId(
  flatSequence: FlatVideo[],
  currentVideoId: number
): number | null {
  const idx = flatSequence.findIndex((v) => v.id === currentVideoId);
  if (idx <= 0) return null;
  return flatSequence[idx - 1].id;
}

/**
 * Get next video id in global sequence (null if last)
 */
export function getNextVideoId(
  flatSequence: FlatVideo[],
  currentVideoId: number
): number | null {
  const idx = flatSequence.findIndex((v) => v.id === currentVideoId);
  if (idx < 0 || idx >= flatSequence.length - 1) return null;
  return flatSequence[idx + 1].id;
}
