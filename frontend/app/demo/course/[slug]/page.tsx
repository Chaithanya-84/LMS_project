"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const COURSES: Record<string, {
  title: string;
  description: string;
  duration: string;
  rating: number;
  price: string;
  instructor: string;
  thumbnail: string;
  whatYouLearn: string[];
}> = {
  "docker-in-2-hours": {
    title: "Docker in 2 Hours",
    description: "Master Docker from scratch. Learn containers, images, Dockerfile, and Docker Compose. Deploy applications with confidence.",
    duration: "2 hours",
    rating: 4.8,
    price: "Free",
    instructor: "Tech Academy",
    thumbnail: "https://images.unsplash.com/photo-1612831455749-a47041f85f2e?w=800&h=450&fit=crop",
    whatYouLearn: ["Container basics", "Dockerfile", "Docker Compose", "Deployment"],
  },
  "sql-in-4-hours": {
    title: "SQL in 4 Hours",
    description: "Learn SQL from zero to hero. Write queries, design databases, and master JOINs. Perfect for data analysts and developers.",
    duration: "4 hours",
    rating: 4.7,
    price: "Free",
    instructor: "Data Pro",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop",
    whatYouLearn: ["SELECT, INSERT, UPDATE", "JOINs", "Subqueries", "Database design"],
  },
  "python-full-course": {
    title: "Python Full Course",
    description: "Complete Python programming course. From basics to advanced: OOP, data structures, APIs, and automation.",
    duration: "12 hours",
    rating: 4.9,
    price: "Free",
    instructor: "freeCodeCamp",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop",
    whatYouLearn: ["Variables & types", "Functions", "OOP", "APIs & automation"],
  },
  "machine-learning-beginners": {
    title: "Machine Learning for Beginners",
    description: "Introduction to machine learning with Python. Learn regression, classification, neural networks, and build real projects. No prior ML experience required.",
    duration: "8 hours",
    rating: 4.8,
    price: "Free",
    instructor: "AI Institute",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop",
    whatYouLearn: [
      "ML fundamentals",
      "Regression & classification",
      "Neural networks",
      "Scikit-learn & TensorFlow",
      "Real-world projects",
    ],
  },
};

export default function DemoCoursePage() {
  const params = useParams();
  const slug = params.slug as string;
  const course = COURSES[slug] || COURSES["machine-learning-beginners"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/demo" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
        ← Back to courses
      </Link>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="overflow-hidden rounded-2xl border border-slate-700">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-64 w-full object-cover md:h-80"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              {course.title}
            </h1>
            <p className="mt-4 text-lg text-slate-400 leading-relaxed">
              {course.description}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-4">What you&apos;ll learn</h2>
            <ul className="space-y-2">
              {course.whatYouLearn.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-300">
                  <span className="text-emerald-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar - Course card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-amber-400">
                {"★".repeat(Math.floor(course.rating))}
                <span className="text-slate-500">★</span>
              </div>
              <span className="text-slate-400">{course.rating} rating</span>
            </div>
            <p className="text-slate-500 text-sm">By {course.instructor}</p>
            <p className="text-slate-400 text-sm mt-1">{course.duration} of content</p>

            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-2xl font-bold text-emerald-400">{course.price}</p>
              <Link
                href="/auth/register"
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-emerald-500 px-6 py-4 font-semibold text-white shadow-lg hover:bg-emerald-600 transition-colors"
              >
                Buy Now / Enroll
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
