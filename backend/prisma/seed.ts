import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Real educational YouTube videos - freeCodeCamp & popular tutorials
// Each course uses one full course video with start times for each lesson
const COURSE_VIDEOS: Record<string, { videoId: string; startTimes: number[] }> = {
  "java-programming": {
    // Learn Java Programming (version 17) - freeCodeCamp, ~4 hours
    videoId: "A74TOX803D0",
    startTimes: [0, 960, 1920, 2880, 3840, 4800, 5760, 6720, 7680],
  },
  "python-dsa": {
    // Data Structures and Algorithms in Python - freeCodeCamp, ~12 hours
    videoId: "pkYVOmU3MgA",
    startTimes: [0, 2880, 5760, 8640, 11520, 14400, 17280, 20160, 23040],
  },
  "data-science-python": {
    // Learn Python for Data Science - freeCodeCamp, ~17 hours
    videoId: "CMEWVn1uZpQ",
    startTimes: [0, 4080, 8160, 12240, 16320, 20400, 24480, 28560, 32640],
  },
  "python-fullstack-web": {
    // Django + React Full-Stack Crash Course, ~2 hours
    videoId: "5FFqW7D5W20",
    startTimes: [0, 480, 960, 1440, 1920, 2400, 2880, 3360, 3840],
  },
};

const COURSES = [
  {
    title: "Java Programming",
    slug: "java-programming",
    shortDescription: "Master Java from basics to advanced. Build robust applications with OOP, collections, and multithreading.",
    description: "A comprehensive Java programming course covering fundamentals, object-oriented programming, data structures, exception handling, multithreading, and building real-world applications. Perfect for beginners and those looking to strengthen their Java skills.",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    instructor: "Farhan Hasin Chowdhury",
    learningOutcomes: JSON.stringify([
      "Core Java syntax and data types",
      "Object-Oriented Programming (OOP) concepts",
      "Collections Framework and Stream API",
      "Exception handling and debugging",
      "Multithreading and concurrency",
      "Building desktop and web applications",
    ]),
    sections: [
      { title: "Java Basics", videos: ["Java Introduction", "Variables and Data Types", "Control Flow"] },
      { title: "OOP in Java", videos: ["Classes and Objects", "Inheritance and Polymorphism", "Interfaces"] },
      { title: "Advanced Topics", videos: ["Collections", "Exception Handling", "Multithreading"] },
    ],
  },
  {
    title: "Python DSA",
    slug: "python-dsa",
    shortDescription: "Data Structures and Algorithms in Python. Ace coding interviews with arrays, trees, graphs, and dynamic programming.",
    description: "Learn essential data structures and algorithms using Python. Covers arrays, linked lists, stacks, queues, trees, graphs, sorting, searching, and dynamic programming. Includes practice problems to prepare for technical interviews.",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop",
    instructor: "Aakash N S",
    learningOutcomes: JSON.stringify([
      "Arrays, Linked Lists, Stacks, and Queues",
      "Trees and Binary Search Trees",
      "Graph algorithms (BFS, DFS, shortest path)",
      "Sorting and searching algorithms",
      "Dynamic programming patterns",
      "Time and space complexity analysis",
    ]),
    sections: [
      { title: "Linear Structures", videos: ["Arrays and Lists", "Linked Lists", "Stacks and Queues"] },
      { title: "Trees and Graphs", videos: ["Binary Trees", "BST and Heaps", "Graph Traversal"] },
      { title: "Algorithms", videos: ["Sorting Algorithms", "Dynamic Programming", "Interview Problems"] },
    ],
  },
  {
    title: "Data Science with Python",
    slug: "data-science-python",
    shortDescription: "End-to-end data science: pandas, numpy, visualization, machine learning, and real-world projects.",
    description: "Complete data science course using Python. Learn data manipulation with pandas, numerical computing with numpy, visualization with matplotlib and seaborn, and machine learning with scikit-learn. Includes hands-on projects.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    instructor: "Frank Andrade",
    learningOutcomes: JSON.stringify([
      "Data manipulation with Pandas",
      "Statistical analysis and visualization",
      "Machine learning fundamentals",
      "Model evaluation and tuning",
      "Working with real datasets",
      "Building predictive models",
    ]),
    sections: [
      { title: "Data Foundations", videos: ["Python for Data Science", "Pandas Basics", "Data Cleaning"] },
      { title: "Visualization & Stats", videos: ["Matplotlib & Seaborn", "Statistical Analysis", "EDA"] },
      { title: "Machine Learning", videos: ["Supervised Learning", "Model Evaluation", "Capstone Project"] },
    ],
  },
  {
    title: "Python Full Stack Web Development",
    slug: "python-fullstack-web",
    shortDescription: "Build full-stack web apps with Python, Django, React, and PostgreSQL. From backend APIs to modern frontends.",
    description: "Master full-stack web development with Python. Backend with Django REST Framework, frontend with React, database design with PostgreSQL. Learn authentication, API design, deployment, and best practices for production applications.",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
    instructor: "freeCodeCamp",
    learningOutcomes: JSON.stringify([
      "Django and Django REST Framework",
      "RESTful API design",
      "React and modern JavaScript",
      "Database design with PostgreSQL",
      "Authentication and authorization",
      "Deployment and DevOps basics",
    ]),
    sections: [
      { title: "Backend with Django", videos: ["Django Basics", "Models and Migrations", "REST API"] },
      { title: "Frontend with React", videos: ["React Fundamentals", "State Management", "API Integration"] },
      { title: "Full Stack Integration", videos: ["Auth Flow", "Deployment", "Final Project"] },
    ],
  },
];

function getVideoUrl(courseSlug: string, lessonIndex: number): string {
  const config = COURSE_VIDEOS[courseSlug];
  if (!config) {
    return "https://www.youtube.com/embed/dQw4w9WgXcQ";
  }
  const start = config.startTimes[lessonIndex % config.startTimes.length] ?? 0;
  return `https://www.youtube.com/embed/${config.videoId}?start=${start}`;
}

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const slugsToKeep = COURSES.map((c) => c.slug);
  await prisma.subject.deleteMany({
    where: { slug: { notIn: slugsToKeep } },
  });

  let user = await prisma.user.findUnique({ where: { email: "demo@lms.com" } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "demo@lms.com",
        passwordHash,
        name: "Demo User",
      },
    });
  }

  for (const course of COURSES) {
    let subject = await prisma.subject.findUnique({ where: { slug: course.slug } });
    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          title: course.title,
          slug: course.slug,
          description: course.description,
          shortDescription: course.shortDescription,
          thumbnail: course.thumbnail,
          instructor: course.instructor,
          learningOutcomes: course.learningOutcomes,
          isPublished: true,
        },
      });
    }

    let globalLessonIndex = 0;
    for (let si = 0; si < course.sections.length; si++) {
      const sectionData = course.sections[si];
      let section = await prisma.section.findFirst({
        where: { subjectId: subject.id, orderIndex: si },
      });
      if (!section) {
        section = await prisma.section.create({
          data: {
            subjectId: subject.id,
            title: sectionData.title,
            orderIndex: si,
          },
        });
      }

      let videos = await prisma.video.findMany({
        where: { sectionId: section.id },
        orderBy: { orderIndex: "asc" },
      });
      if (videos.length === 0) {
        for (let vi = 0; vi < sectionData.videos.length; vi++) {
          const youtubeUrl = getVideoUrl(course.slug, globalLessonIndex);
          await prisma.video.create({
            data: {
              sectionId: section.id,
              title: sectionData.videos[vi],
              description: `Lesson ${vi + 1} of ${sectionData.title}`,
              youtubeUrl,
              durationSeconds: 600,
              orderIndex: vi,
            },
          });
          globalLessonIndex++;
        }
      } else {
        for (let vi = 0; vi < videos.length; vi++) {
          const youtubeUrl = getVideoUrl(course.slug, globalLessonIndex);
          await prisma.video.update({
            where: { id: videos[vi].id },
            data: { youtubeUrl },
          });
          globalLessonIndex++;
        }
      }
    }
  }

  console.log("Seed completed. Demo user: demo@lms.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
