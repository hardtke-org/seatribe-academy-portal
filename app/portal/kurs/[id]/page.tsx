export const instant = false;

import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCourseById } from "@/lib/courses";
import PortalHeader from "@/components/PortalHeader";
import CoursePlayer from "@/components/CoursePlayer";
import Footer from "@/components/Footer";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lesson?: string }>;
}

export default async function CoursePlayerPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { lesson: lessonParam } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const course = getCourseById(id);
  if (!course) {
    notFound();
  }

  // Check if user has purchased this course
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .eq("status", "paid")
    .single();

  if (!purchase) {
    // User hasn't purchased this course
    redirect("/portal");
  }

  const activeLessonIndex = lessonParam
    ? Math.max(
        0,
        Math.min(parseInt(lessonParam, 10) - 1, course.lessons.length - 1)
      )
    : 0;

  const activeLesson = course.lessons[activeLessonIndex];

  // Build embed URL server-side so the raw YouTube ID is never a plain link in HTML
  // The video ID is embedded inside the iframe src attribute only
  const embedUrl = `https://www.youtube.com/embed/${activeLesson.youtubeId}?rel=0&modestbranding=1`;

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader
        userEmail={user.email}
        backHref="/portal"
        backLabel="Meine Kurse"
      />

      <div className="flex-1 bg-[#f7f1ea]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Course title */}
          <h1
            className="text-2xl text-[#3c3d38] mb-6"
            style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
          >
            {course.title}
          </h1>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Video + info */}
            <div className="flex-1 min-w-0">
              <CoursePlayer
                course={course}
                activeLessonIndex={activeLessonIndex}
                embedUrl={embedUrl}
              />
            </div>

            {/* Lesson sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white border border-[#dedad4] rounded-xl overflow-hidden">
                <div className="bg-[#417970] px-4 py-3">
                  <h2
                    className="text-white text-sm font-semibold tracking-wide"
                    style={{
                      fontFamily: "var(--font-marcellus), Marcellus, serif",
                    }}
                  >
                    Kursinhalt
                  </h2>
                </div>
                <ul className="divide-y divide-[#dedad4]">
                  {course.lessons.map((lesson, idx) => (
                    <li key={lesson.id}>
                      <a
                        href={`/portal/kurs/${course.id}?lesson=${idx + 1}`}
                        className={`flex items-start gap-3 px-4 py-4 hover:bg-[#f7f1ea] transition-colors ${
                          idx === activeLessonIndex
                            ? "bg-[#f0f7f6] border-l-4 border-[#417970]"
                            : "border-l-4 border-transparent"
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${
                            idx === activeLessonIndex
                              ? "bg-[#417970] text-white"
                              : "bg-[#dedad4] text-[#86a6a2]"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div>
                          <p
                            className={`text-sm leading-snug ${
                              idx === activeLessonIndex
                                ? "text-[#417970] font-semibold"
                                : "text-[#3c3d38]"
                            }`}
                          >
                            {lesson.title}
                          </p>
                          {lesson.duration && (
                            <p className="text-xs text-[#86a6a2] mt-0.5">
                              {lesson.duration}
                            </p>
                          )}
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
