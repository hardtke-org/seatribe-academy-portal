"use client";

import type { Course } from "@/lib/courses";

interface CoursePlayerProps {
  course: Course;
  activeLessonIndex: number;
  embedUrl: string;
}

export default function CoursePlayer({
  course,
  activeLessonIndex,
  embedUrl,
}: CoursePlayerProps) {
  const activeLesson = course.lessons[activeLessonIndex];

  return (
    <div>
      {/* Video embed */}
      <div className="bg-black rounded-xl overflow-hidden shadow-md">
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe
            src={embedUrl}
            title={activeLesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>

      {/* Lesson info */}
      <div className="mt-6 bg-white border border-[#dedad4] rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#86a6a2] tracking-widest uppercase">
              Session {activeLessonIndex + 1} von {course.lessons.length}
            </span>
            <h2
              className="text-xl text-[#3c3d38] mt-1"
              style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
            >
              {activeLesson.title}
            </h2>
          </div>
          {/* PDF download placeholder */}
          <button
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-[#dedad4] rounded-lg text-sm text-[#86a6a2] hover:border-[#417970] hover:text-[#417970] transition-colors"
            title="PDF herunterladen (demnächst verfügbar)"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3M3 17a1 1 0 00-1 1v3m1-4V7a1 1 0 011-1h8l5 5v8"
              />
            </svg>
            PDF Download
          </button>
        </div>

        <p className="mt-4 text-[#3c3d38] leading-relaxed text-sm">
          {activeLesson.description}
        </p>

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-6">
          {activeLessonIndex > 0 && (
            <a
              href={`/portal/kurs/${course.id}?lesson=${activeLessonIndex}`}
              className="flex items-center gap-2 px-4 py-2 border border-[#dedad4] rounded-lg text-sm text-[#3c3d38] hover:border-[#417970] hover:text-[#417970] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Vorherige Session
            </a>
          )}
          {activeLessonIndex < course.lessons.length - 1 && (
            <a
              href={`/portal/kurs/${course.id}?lesson=${activeLessonIndex + 2}`}
              className="flex items-center gap-2 px-4 py-2 bg-[#417970] text-white rounded-lg text-sm font-semibold hover:bg-[#355f57] transition-colors ml-auto"
            >
              Nächste Session
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
