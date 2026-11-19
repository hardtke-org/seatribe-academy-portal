export const instant = false;

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCourseById } from "@/lib/courses";
import PortalHeader from "@/components/PortalHeader";
import Footer from "@/components/Footer";

export default async function PortalPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's purchases
  const { data: purchases } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "paid");

  const purchasedCourses = (purchases || [])
    .map((p) => getCourseById(p.course_id))
    .filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen">
      <PortalHeader userEmail={user.email} />

      {/* Welcome banner */}
      <div className="bg-[#417970] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1
            className="text-2xl sm:text-3xl text-white"
            style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
          >
            Willkommen zurück!
          </h1>
          <p className="text-[#c5d9d7] mt-1">
            Hier findest du alle deine gekauften Kurse.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto px-4 py-10 w-full">
        <h2
          className="text-xl text-[#3c3d38] mb-6"
          style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
        >
          Meine Kurse
        </h2>

        {purchasedCourses.length === 0 ? (
          <div className="bg-white border border-[#dedad4] rounded-2xl p-10 text-center">
            <div className="text-5xl mb-4">⚓</div>
            <h3
              className="text-xl text-[#3c3d38] mb-2"
              style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
            >
              Noch keine Kurse
            </h3>
            <p className="text-[#86a6a2] mb-6">
              Du hast noch keinen Kurs gekauft.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#417970] text-white font-semibold rounded-lg hover:bg-[#355f57] transition-colors"
            >
              Kurse entdecken
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedCourses.map((course) => (
              <div
                key={course!.id}
                className="bg-white border border-[#dedad4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-[#417970] p-5">
                  <span className="text-[#c5d9d7] text-xs font-semibold tracking-widest uppercase">
                    Online-Kurs
                  </span>
                  <h3
                    className="text-white text-lg mt-1 leading-snug"
                    style={{
                      fontFamily: "var(--font-marcellus), Marcellus, serif",
                    }}
                  >
                    {course!.title}
                  </h3>
                </div>
                <div className="p-5">
                  <p className="text-sm text-[#86a6a2] mb-4">
                    {course!.lessons.length} Sessions · Videoformat
                  </p>
                  <Link
                    href={`/portal/kurs/${course!.id}`}
                    className="block w-full text-center py-3 bg-[#417970] text-white font-semibold rounded-lg hover:bg-[#355f57] transition-colors"
                  >
                    Kurs starten
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
