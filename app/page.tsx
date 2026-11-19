import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BuyButton from "@/components/BuyButton";
import { COURSES, formatPrice } from "@/lib/courses";
import Link from "next/link";

export default function HomePage() {
  const course = COURSES[0];

  return (
    <div className="flex flex-col min-h-screen">
      <Header variant="public" />

      {/* Hero */}
      <section
        className="relative py-24 px-4"
        style={{ backgroundColor: "#2d4f4a" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#86a6a2] text-sm font-semibold tracking-widest uppercase mb-4">
            SeaTribe Skipper Academy
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
          >
            Werde zum Delivery Skipper.
          </h1>
          <p className="text-[#86a6a2] text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Lerne alles, was du brauchst, um professionell und bezahlt Boote zu
            liefern – von der ersten Anfrage bis zur sicheren Ankunft.
          </p>
          <Link
            href={`/kurs/${course.id}`}
            className="inline-block px-8 py-4 bg-[#417970] text-white font-semibold text-lg rounded hover:bg-[#355f57] transition-colors"
          >
            Kurs entdecken
          </Link>
        </div>
      </section>

      {/* Course Card */}
      <section className="py-20 px-4 bg-[#f7f1ea]">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl text-center mb-12 text-[#3c3d38]"
            style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
          >
            Verfügbare Kurse
          </h2>

          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md overflow-hidden border border-[#dedad4]">
            {/* Card header */}
            <div className="bg-[#417970] p-6">
              <span className="text-[#c5d9d7] text-xs font-semibold tracking-widest uppercase">
                Online-Kurs
              </span>
              <h3
                className="text-white text-2xl mt-2 leading-snug"
                style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
              >
                {course.title}
              </h3>
            </div>

            {/* Card body */}
            <div className="p-6">
              <p className="text-[#3c3d38] leading-relaxed mb-6">
                {course.description}
              </p>

              <ul className="space-y-2 mb-6">
                {course.lessons.map((lesson) => (
                  <li key={lesson.id} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#417970] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span className="text-sm text-[#3c3d38]">{lesson.title}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-4 border-t border-[#dedad4]">
                <div>
                  <span className="text-3xl font-bold text-[#417970]">
                    {formatPrice(course.price, course.currency)}
                  </span>
                  <span className="text-sm text-[#86a6a2] ml-2">einmalig</span>
                </div>
                <BuyButton courseId={course.id} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
          {[
            {
              icon: "🎬",
              title: "4 Video-Sessions",
              text: "Hochwertige Lehrvideos, die du jederzeit abrufen kannst.",
            },
            {
              icon: "⚓",
              title: "Praxiswissen",
              text: "Direkt aus der Erfahrung professioneller Delivery Skipper.",
            },
            {
              icon: "📄",
              title: "Downloadmaterial",
              text: "Begleitmaterialien zum Vertiefen und Nachschlagen.",
            },
          ].map((f) => (
            <div key={f.title} className="p-6">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3
                className="text-lg text-[#417970] mb-2"
                style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
              >
                {f.title}
              </h3>
              <p className="text-sm text-[#3c3d38] leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
