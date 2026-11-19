"use client";

import Link from "next/link";
import Logo from "./Logo";

interface HeaderProps {
  variant?: "public" | "portal";
  userEmail?: string;
  onLogout?: () => void;
}

export default function Header({
  variant = "public",
  userEmail,
  onLogout,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-[#dedad4]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Logo size={44} color="#417970" />
            <span
              className="text-[#417970] font-heading text-lg hidden sm:block"
              style={{ fontFamily: "var(--font-marcellus), Marcellus, serif" }}
            >
              SeaTribe Skipper Academy
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            {variant === "public" && (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-[#417970] border border-[#417970] rounded hover:bg-[#417970] hover:text-white transition-colors"
              >
                Login
              </Link>
            )}
            {variant === "portal" && (
              <>
                <span className="text-sm text-[#86a6a2] hidden sm:block">
                  {userEmail}
                </span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-semibold text-[#417970] border border-[#417970] rounded hover:bg-[#417970] hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
