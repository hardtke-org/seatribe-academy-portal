"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/portal";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("E-Mail oder Passwort ungültig. Bitte versuche es erneut.");
      setLoading(false);
    } else {
      router.push(redirect);
    }
  }

  async function handleMagicLink() {
    if (!email) {
      setError("Bitte gib deine E-Mail-Adresse ein.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
      },
    });

    if (error) {
      setError("Fehler beim Senden des Login-Links.");
    } else {
      setMagicSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#f7f1ea] flex flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8 hover:opacity-80 transition-opacity">
        <Logo size={60} color="#417970" />
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-[#dedad4] p-8">
        <h1
          className="text-2xl text-[#3c3d38] mb-2 text-center"
          style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
        >
          Willkommen zurück
        </h1>
        <p className="text-sm text-[#86a6a2] text-center mb-8">
          Melde dich an, um auf deine Kurse zuzugreifen.
        </p>

        {magicSent ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="font-heading text-[#417970] text-lg mb-2">
              Check deine E-Mails!
            </h2>
            <p className="text-sm text-[#86a6a2]">
              Wir haben dir einen Login-Link geschickt. Klicke darauf, um dich
              einzuloggen.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#3c3d38] mb-1">
                  E-Mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-[#dedad4] rounded-lg px-4 py-3 text-[#3c3d38] focus:outline-none focus:border-[#417970] bg-[#f7f1ea]"
                  placeholder="deine@email.de"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3c3d38] mb-1">
                  Passwort
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-[#dedad4] rounded-lg px-4 py-3 text-[#3c3d38] focus:outline-none focus:border-[#417970] bg-[#f7f1ea]"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#417970] text-white font-semibold rounded-lg hover:bg-[#355f57] transition-colors disabled:opacity-60"
              >
                {loading ? "Anmelden..." : "Anmelden"}
              </button>
            </form>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-px bg-[#dedad4]" />
              <span className="text-xs text-[#86a6a2]">oder</span>
              <div className="flex-1 h-px bg-[#dedad4]" />
            </div>

            <button
              onClick={handleMagicLink}
              disabled={loading}
              className="mt-4 w-full py-3 border border-[#417970] text-[#417970] font-semibold rounded-lg hover:bg-[#417970] hover:text-white transition-colors disabled:opacity-60"
            >
              Login-Link per E-Mail senden
            </button>

            <p className="mt-6 text-center text-sm text-[#86a6a2]">
              Noch kein Konto?{" "}
              <Link
                href="/"
                className="text-[#417970] font-semibold hover:underline"
              >
                Kurs kaufen
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f1ea]" />}>
      <LoginForm />
    </Suspense>
  );
}
