"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSetPassword(e: React.FormEvent) {
    const supabase = createClient();
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Fehler beim Setzen des Passworts: " + error.message);
      setLoading(false);
    } else {
      router.push("/portal");
    }
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
          Passwort festlegen
        </h1>
        <p className="text-sm text-[#86a6a2] text-center mb-8">
          Lege ein Passwort fest, um dich zukünftig einzuloggen.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#3c3d38] mb-1">
              Neues Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full border border-[#dedad4] rounded-lg px-4 py-3 text-[#3c3d38] focus:outline-none focus:border-[#417970] bg-[#f7f1ea]"
              placeholder="Mindestens 8 Zeichen"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#3c3d38] mb-1">
              Passwort bestätigen
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-[#dedad4] rounded-lg px-4 py-3 text-[#3c3d38] focus:outline-none focus:border-[#417970] bg-[#f7f1ea]"
              placeholder="Passwort wiederholen"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#417970] text-white font-semibold rounded-lg hover:bg-[#355f57] transition-colors disabled:opacity-60"
          >
            {loading ? "Speichern..." : "Passwort speichern & einloggen"}
          </button>
        </form>
      </div>
    </div>
  );
}
