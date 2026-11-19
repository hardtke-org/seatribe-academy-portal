import Link from "next/link";
import Logo from "@/components/Logo";
import { Suspense } from "react";

function SuccessContent() {
  return (
    <div className="min-h-screen bg-[#f7f1ea] flex flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8 hover:opacity-80 transition-opacity">
        <Logo size={60} color="#417970" />
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-[#dedad4] p-10 text-center">
        {/* Checkmark */}
        <div className="w-20 h-20 bg-[#417970] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        <h1
          className="text-3xl text-[#417970] mb-3"
          style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
        >
          Zahlung erfolgreich!
        </h1>

        <p className="text-[#3c3d38] mb-6 leading-relaxed">
          Vielen Dank für deinen Kauf. Du hast jetzt Zugang zum Kurs{" "}
          <strong>Professional Delivery Skipper Foundations</strong>.
        </p>

        <div className="bg-[#f7f1ea] rounded-xl p-5 mb-6 text-left">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">📧</span>
            <div>
              <h2
                className="font-semibold text-[#3c3d38] mb-1"
                style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
              >
                Prüfe deine E-Mails
              </h2>
              <p className="text-sm text-[#86a6a2] leading-relaxed">
                Wir haben dir einen Login-Link geschickt. Klicke darauf, um
                deinen Account zu aktivieren und sofort mit dem Kurs zu
                beginnen.
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-[#86a6a2] mb-6">
          Bereits ein Konto?{" "}
          <Link
            href="/login"
            className="text-[#417970] font-semibold hover:underline"
          >
            Hier einloggen
          </Link>
        </p>

        <Link
          href="/"
          className="text-sm text-[#86a6a2] hover:text-[#417970] transition-colors"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f1ea]" />}>
      <SuccessContent />
    </Suspense>
  );
}
