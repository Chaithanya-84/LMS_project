import { prisma } from "../../config/db.js";

export async function getVideoById(videoId: number) {
  return prisma.video.findUnique({
    where: { id: videoId },
    include: {
      section: {
        include: { subject: true },
      },
    },
  });
}
