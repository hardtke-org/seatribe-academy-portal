export const instant = false;

import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BuyButton from "@/components/BuyButton";
import { getCourseById, formatPrice } from "@/lib/courses";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const course = getCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header variant="public" />

      {/* Hero banner */}
      <div className="bg-[#2d4f4a] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <span className="text-[#86a6a2] text-xs font-semibold tracking-widest uppercase">
            Online-Kurs
          </span>
          <h1
            className="text-3xl sm:text-4xl text-white mt-2 mb-4"
            style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
          >
            {course.title}
          </h1>
          <p className="text-[#86a6a2] text-lg max-w-2xl">{course.subtitle}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-10 flex-1">
        {/* Main content */}
        <div className="flex-1">
          <h2
            className="text-2xl text-[#3c3d38] mb-4"
            style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
          >
            Über diesen Kurs
          </h2>
          <p className="text-[#3c3d38] leading-relaxed mb-10">
            {course.description}
          </p>

          <h2
            className="text-2xl text-[#3c3d38] mb-6"
            style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
          >
            Kursinhalt
          </h2>

          <div className="space-y-4">
            {course.lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                className="bg-white border border-[#dedad4] rounded-xl p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#417970] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{idx + 1}</span>
                </div>
                <div>
                  <h3
                    className="text-[#3c3d38] font-semibold mb-1"
                    style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
                  >
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-[#86a6a2] leading-relaxed">
                    {lesson.description}
                  </p>
                  {lesson.duration && (
                    <span className="mt-2 inline-block text-xs text-[#86a6a2] bg-[#f7f1ea] px-2 py-0.5 rounded">
                      {lesson.duration}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky purchase card */}
        <div className="lg:w-80">
          <div className="sticky top-6 bg-white border border-[#dedad4] rounded-2xl shadow-md p-6">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-[#417970] mb-1">
                {formatPrice(course.price, course.currency)}
              </div>
              <div className="text-sm text-[#86a6a2]">einmalige Zahlung</div>
            </div>

            <BuyButton
              courseId={course.id}
              label="Jetzt kaufen"
              className="w-full py-4 bg-[#417970] text-white font-semibold text-lg rounded-xl hover:bg-[#355f57] transition-colors"
            />

            <ul className="mt-6 space-y-3">
              {[
                `${course.lessons.length} Video-Sessions`,
                "Lebenslanger Zugang",
                "Downloadmaterialien",
                "Sofortiger Zugang nach Kauf",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#3c3d38]">
                  <svg className="w-4 h-4 text-[#417970] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
