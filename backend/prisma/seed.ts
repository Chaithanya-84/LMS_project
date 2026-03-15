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
  "javascript-programming": {
    // Learn JavaScript - Full Course (freeCodeCamp)
    videoId: "jS4aFq5-91M",
    startTimes: [0, 1800, 3600, 5400, 7200, 9000, 10800, 12600, 14400],
  },
  "html-css-web": {
    // HTML Full Course - Build a Website Tutorial (freeCodeCamp)
    videoId: "pQN-pnXPaVg",
    startTimes: [0, 1200, 2400, 3600, 4800, 6000, 7200, 8400, 9600],
  },
  "react-js": {
    // React Tutorial for Beginners (freeCodeCamp)
    videoId: "w7ejDZ8SWv8",
    startTimes: [0, 900, 1800, 2700, 3600, 4500, 5400, 6300, 7200],
  },
  "node-js": {
    // Node.js and Express - Full Course (freeCodeCamp)
    videoId: "f2EqECiTBL8",
    startTimes: [0, 2400, 4800, 7200, 9600, 12000, 14400, 16800, 19200],
  },
  "sql-database": {
    // SQL Tutorial - Full Database Course (freeCodeCamp)
    videoId: "p3qvj9hO_Bo",
    startTimes: [0, 600, 1200, 1800, 2400, 3000, 3600, 4200, 4800],
  },
  "git-github": {
    // Git Tutorial for Beginners (freeCodeCamp)
    videoId: "8JJ101D3knE",
    startTimes: [0, 600, 1200, 1800, 2400, 3000, 3600, 4200, 4800],
  },
  "c-programming": {
    // C Programming Tutorial for Beginners (freeCodeCamp)
    videoId: "KJgsSFOSQv0",
    startTimes: [0, 2400, 4800, 7200, 9600, 12000, 14400, 16800, 19200],
  },
  "machine-learning": {
    // Python for Data Science (includes ML) - freeCodeCamp
    videoId: "CMEWVn1uZpQ",
    startTimes: [0, 3600, 7200, 10800, 14400, 18000, 21600, 25200, 28800],
  },
  "cybersecurity": {
    // Cyber Security Full Course for Beginner (My CS) ~5 hours
    videoId: "U_P23SqJaDc",
    startTimes: [0, 1200, 2400, 3600, 4800, 6000, 7200, 8400, 9600],
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
  {
    title: "JavaScript Programming",
    slug: "javascript-programming",
    shortDescription: "Master JavaScript from fundamentals to ES6+. DOM manipulation, async programming, and modern web development.",
    description: "Complete JavaScript course covering variables, functions, arrays, objects, DOM manipulation, async/await, promises, and ES6+ features. Build interactive web applications and understand the language that powers the web.",
    thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=300&fit=crop",
    instructor: "freeCodeCamp",
    learningOutcomes: JSON.stringify([
      "Variables, functions, and control flow",
      "Arrays, objects, and destructuring",
      "DOM manipulation and events",
      "Async JavaScript and Promises",
      "ES6+ features and modules",
      "Building interactive web apps",
    ]),
    sections: [
      { title: "JavaScript Basics", videos: ["Introduction", "Variables and Types", "Functions"] },
      { title: "Data Structures", videos: ["Arrays", "Objects", "Destructuring"] },
      { title: "Advanced JS", videos: ["DOM & Events", "Async & Promises", "ES6+ Features"] },
    ],
  },
  {
    title: "HTML & CSS Web Development",
    slug: "html-css-web",
    shortDescription: "Build beautiful, responsive websites with HTML5 and CSS3. Flexbox, Grid, and modern layout techniques.",
    description: "Learn HTML5 semantics, CSS3 styling, Flexbox, CSS Grid, responsive design, and accessibility. Create professional-looking websites from scratch with best practices.",
    thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=300&fit=crop",
    instructor: "freeCodeCamp",
    learningOutcomes: JSON.stringify([
      "HTML5 structure and semantics",
      "CSS selectors and specificity",
      "Flexbox and CSS Grid layouts",
      "Responsive design with media queries",
      "CSS variables and animations",
      "Accessibility best practices",
    ]),
    sections: [
      { title: "HTML Fundamentals", videos: ["HTML Structure", "Forms and Inputs", "Semantic HTML"] },
      { title: "CSS Styling", videos: ["Selectors and Box Model", "Flexbox", "CSS Grid"] },
      { title: "Responsive Design", videos: ["Media Queries", "Mobile-First", "Final Project"] },
    ],
  },
  {
    title: "React.js",
    slug: "react-js",
    shortDescription: "Build modern UIs with React. Hooks, state management, and component-based architecture.",
    description: "Master React from basics to advanced. Learn components, JSX, hooks (useState, useEffect), props, context, and building single-page applications. Includes routing and API integration.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
    instructor: "freeCodeCamp",
    learningOutcomes: JSON.stringify([
      "Components and JSX",
      "State and props",
      "Hooks (useState, useEffect)",
      "Context and custom hooks",
      "React Router",
      "API integration and deployment",
    ]),
    sections: [
      { title: "React Basics", videos: ["Setup and JSX", "Components", "Props and State"] },
      { title: "Hooks & Patterns", videos: ["useState", "useEffect", "Custom Hooks"] },
      { title: "Advanced React", videos: ["Context API", "React Router", "Project Build"] },
    ],
  },
  {
    title: "Node.js",
    slug: "node-js",
    shortDescription: "Server-side JavaScript with Node.js. Build REST APIs, work with databases, and deploy applications.",
    description: "Complete Node.js course covering modules, npm, Express.js, REST APIs, MongoDB, authentication, and deployment. Learn to build scalable backend applications.",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop",
    instructor: "freeCodeCamp",
    learningOutcomes: JSON.stringify([
      "Node.js modules and npm",
      "Express.js framework",
      "REST API design",
      "MongoDB and Mongoose",
      "Authentication (JWT)",
      "Deployment and best practices",
    ]),
    sections: [
      { title: "Node Fundamentals", videos: ["Modules and npm", "File System", "HTTP Server"] },
      { title: "Express & APIs", videos: ["Express Basics", "REST API", "Middleware"] },
      { title: "Database & Auth", videos: ["MongoDB", "JWT Auth", "Deployment"] },
    ],
  },
  {
    title: "SQL & Databases",
    slug: "sql-database",
    shortDescription: "Master SQL for data querying and database design. SELECT, JOINs, indexes, and optimization.",
    description: "Learn SQL from scratch. Write queries, design schemas, use JOINs, subqueries, indexes, and understand database normalization. Works with PostgreSQL, MySQL, and SQLite.",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop",
    instructor: "freeCodeCamp",
    learningOutcomes: JSON.stringify([
      "SELECT, INSERT, UPDATE, DELETE",
      "JOINs and subqueries",
      "Aggregation and grouping",
      "Database design and normalization",
      "Indexes and optimization",
      "Transactions and ACID",
    ]),
    sections: [
      { title: "SQL Basics", videos: ["Introduction", "SELECT Queries", "Filtering and Sorting"] },
      { title: "Advanced Queries", videos: ["JOINs", "Subqueries", "Aggregation"] },
      { title: "Database Design", videos: ["Normalization", "Indexes", "Best Practices"] },
    ],
  },
  {
    title: "Git & GitHub",
    slug: "git-github",
    shortDescription: "Version control with Git. Branches, merges, pull requests, and collaborative workflows.",
    description: "Master Git and GitHub for version control. Learn commits, branches, merges, rebasing, pull requests, and collaborative workflows. Essential for every developer.",
    thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=300&fit=crop",
    instructor: "freeCodeCamp",
    learningOutcomes: JSON.stringify([
      "Git basics: add, commit, push",
      "Branches and merging",
      "Remote repositories",
      "Pull requests and code review",
      "Rebasing and conflict resolution",
      "GitHub workflows",
    ]),
    sections: [
      { title: "Git Basics", videos: ["Installation", "Commits", "Branches"] },
      { title: "Remote & Collaboration", videos: ["GitHub Setup", "Pull Requests", "Merging"] },
      { title: "Advanced Git", videos: ["Rebase", "Conflict Resolution", "Best Practices"] },
    ],
  },
  {
    title: "C Programming",
    slug: "c-programming",
    shortDescription: "Learn C from the ground up. Pointers, memory management, and systems programming fundamentals.",
    description: "Comprehensive C programming course covering variables, control flow, functions, pointers, memory allocation, structs, and file I/O. Foundation for systems programming and embedded development.",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop",
    instructor: "freeCodeCamp",
    learningOutcomes: JSON.stringify([
      "Variables, operators, control flow",
      "Functions and scope",
      "Pointers and memory",
      "Arrays and strings",
      "Structs and dynamic allocation",
      "File I/O and preprocessor",
    ]),
    sections: [
      { title: "C Basics", videos: ["Introduction", "Variables and Types", "Control Flow"] },
      { title: "Functions & Pointers", videos: ["Functions", "Pointers", "Arrays"] },
      { title: "Advanced C", videos: ["Structs", "Dynamic Memory", "File I/O"] },
    ],
  },
  {
    title: "Machine Learning",
    slug: "machine-learning",
    shortDescription: "Introduction to ML with Python. Regression, classification, neural networks, and real projects.",
    description: "Learn machine learning fundamentals using Python. Covers supervised and unsupervised learning, regression, classification, neural networks, and scikit-learn. Includes hands-on projects.",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
    instructor: "freeCodeCamp",
    learningOutcomes: JSON.stringify([
      "ML fundamentals and workflow",
      "Regression and classification",
      "Neural networks basics",
      "Scikit-learn and TensorFlow",
      "Model evaluation and tuning",
      "Real-world ML projects",
    ]),
    sections: [
      { title: "ML Foundations", videos: ["Introduction", "Data Preprocessing", "Regression"] },
      { title: "Classification & Clustering", videos: ["Classification", "Clustering", "Evaluation"] },
      { title: "Deep Learning", videos: ["Neural Networks", "TensorFlow", "Capstone"] },
    ],
  },
  {
    title: "Cybersecurity Fundamentals",
    slug: "cybersecurity",
    shortDescription: "Introduction to cybersecurity. Threats, encryption, network security, and ethical hacking basics.",
    description: "Learn cybersecurity fundamentals including threat types, encryption, network security, authentication, and secure coding. Introduction to ethical hacking and penetration testing concepts.",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop",
    instructor: "freeCodeCamp",
    learningOutcomes: JSON.stringify([
      "Threat landscape and attack vectors",
      "Encryption and cryptography",
      "Network security basics",
      "Authentication and access control",
      "Secure coding practices",
      "Ethical hacking introduction",
    ]),
    sections: [
      { title: "Security Basics", videos: ["Threats", "Encryption", "Network Security"] },
      { title: "Defense & Auth", videos: ["Firewalls", "Authentication", "Access Control"] },
      { title: "Secure Development", videos: ["Secure Coding", "Ethical Hacking", "Best Practices"] },
    ],
  },
];

function getVideoUrl(courseSlug: string, lessonIndex: number): string {
  const config = COURSE_VIDEOS[courseSlug];
  if (!config) {
    return "https://www.youtube.com/embed/jS4aFq5-91M";
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

  const coursePrices = [
    { price: 1299, originalPrice: 9999, rating: 4.7, ratingCount: 12450 },
    { price: 1499, originalPrice: 12999, rating: 4.8, ratingCount: 8920 },
    { price: 999, originalPrice: 7999, rating: 4.6, ratingCount: 15600 },
    { price: 1799, originalPrice: 14999, rating: 4.9, ratingCount: 5200 },
    { price: 1199, originalPrice: 8999, rating: 4.7, ratingCount: 21000 },
    { price: 899, originalPrice: 5999, rating: 4.5, ratingCount: 9800 },
    { price: 1599, originalPrice: 11999, rating: 4.8, ratingCount: 11200 },
    { price: 1399, originalPrice: 9999, rating: 4.6, ratingCount: 7600 },
    { price: 999, originalPrice: 6999, rating: 4.7, ratingCount: 14300 },
    { price: 799, originalPrice: 4999, rating: 4.9, ratingCount: 18900 },
    { price: 1099, originalPrice: 7999, rating: 4.8, ratingCount: 6700 },
    { price: 1699, originalPrice: 12999, rating: 4.7, ratingCount: 4200 },
    { price: 1299, originalPrice: 9999, rating: 4.6, ratingCount: 3100 },
  ];

  for (let ci = 0; ci < COURSES.length; ci++) {
    const course = COURSES[ci];
    const pricing = coursePrices[ci % coursePrices.length];
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
          price: pricing.price,
          originalPrice: pricing.originalPrice,
          rating: pricing.rating,
          ratingCount: pricing.ratingCount,
        },
      });
    } else {
      await prisma.subject.update({
        where: { id: subject.id },
        data: {
          price: pricing.price,
          originalPrice: pricing.originalPrice,
          rating: pricing.rating,
          ratingCount: pricing.ratingCount,
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
