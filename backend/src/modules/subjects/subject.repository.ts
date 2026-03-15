import { prisma } from "../../config/db.js";

export async function getPublishedSubjects(page: number, pageSize: number, search?: string) {
  const skip = (page - 1) * pageSize;
  const where = search
    ? {
        isPublished: true,
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      }
    : { isPublished: true };

  const [subjects, total] = await Promise.all([
    prisma.subject.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.subject.count({ where }),
  ]);

  return { subjects, total };
}

export async function getSubjectById(id: number) {
  return prisma.subject.findUnique({
    where: { id },
  });
}

export async function getSubjectTree(subjectId: number) {
  return prisma.subject.findUnique({
    where: { id: subjectId },
    include: {
      sections: {
        orderBy: { orderIndex: "asc" },
        include: {
          videos: {
            orderBy: { orderIndex: "asc" },
          },
        },
      },
    },
  });
}

export async function getSubjectStats(subjectId: number) {
  const videos = await prisma.video.findMany({
    where: { section: { subjectId } },
    select: { durationSeconds: true },
  });
  const totalLessons = videos.length;
  const totalDuration = videos.reduce((sum, v) => sum + (v.durationSeconds ?? 0), 0);
  return { totalLessons, totalDuration };
}

export async function enrollUser(userId: number, subjectId: number) {
  return prisma.enrollment.upsert({
    where: { userId_subjectId: { userId, subjectId } },
    create: { userId, subjectId },
    update: {},
  });
}

export async function isEnrolled(userId: number, subjectId: number) {
  const e = await prisma.enrollment.findUnique({
    where: { userId_subjectId: { userId, subjectId } },
  });
  return !!e;
}
