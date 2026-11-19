"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { createClient } from "@/lib/supabase/client";

interface PortalHeaderProps {
  userEmail?: string;
  backHref?: string;
  backLabel?: string;
}

export default function PortalHeader({
  userEmail,
  backHref,
  backLabel,
}: PortalHeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="bg-white border-b border-[#dedad4]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {backHref && (
              <Link
                href={backHref}
                className="flex items-center gap-1.5 text-sm text-[#86a6a2] hover:text-[#417970] transition-colors mr-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {backLabel || "Zurück"}
              </Link>
            )}
            <Link href="/portal" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Logo size={40} color="#417970" />
              <span
                className="text-[#417970] font-heading text-base hidden sm:block"
                style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
              >
                SeaTribe Skipper Academy
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="text-sm text-[#86a6a2] hidden sm:block">
                {userEmail}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-[#417970] border border-[#417970] rounded hover:bg-[#417970] hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
