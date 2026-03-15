"use client";

import Link from "next/link";

const DEMO_COURSES = [
  {
    slug: "docker-in-2-hours",
    title: "Docker in 2 Hours",
    duration: "2 hours",
    thumbnail: "https://images.unsplash.com/photo-1612831455749-a47041f85f2e?w=400&h=240&fit=crop",
    instructor: "Tech Academy",
  },
  {
    slug: "sql-in-4-hours",
    title: "SQL in 4 Hours",
    duration: "4 hours",
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=240&fit=crop",
    instructor: "Data Pro",
  },
  {
    slug: "python-full-course",
    title: "Python Full Course",
    duration: "12 hours",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=240&fit=crop",
    instructor: "freeCodeCamp",
  },
  {
    slug: "machine-learning-beginners",
    title: "Machine Learning for Beginners",
    duration: "8 hours",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=240&fit=crop",
    instructor: "AI Institute",
  },
];

export default function DemoHomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Skills for your present and your future
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Learn in-demand skills with expert-led courses. Start your journey today.
        </p>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">500K+</p>
            <p className="mt-1 text-sm text-slate-500">Students</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">4.7</p>
            <p className="mt-1 text-sm text-slate-500">Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">1,200+</p>
            <p className="mt-1 text-sm text-slate-500">Courses</p>
          </div>
        </div>
      </section>

      {/* Course Cards */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-white mb-8">Popular Courses</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_COURSES.map((course) => (
            <Link
              key={course.slug}
              href={`/demo/course/${course.slug}`}
              className="group overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute bottom-2 right-2 rounded-md bg-slate-900/90 px-2 py-1 text-xs font-medium text-slate-300">
                  {course.duration}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  {course.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">By {course.instructor}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <p className="text-slate-400 mb-6">Ready to start learning?</p>
        <Link
          href="/demo/course/machine-learning-beginners"
          className="inline-flex items-center rounded-xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-emerald-600 transition-colors"
        >
          Explore Courses
        </Link>
      </section>
    </div>
  );
}
