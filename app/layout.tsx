import type { Metadata } from "next";
import { Marcellus, Open_Sans } from "next/font/google";
import "./globals.css";

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SeaTribe Skipper Academy",
  description:
    "Professional Delivery Skipper Foundations – Der Online-Kurs für ambitionierte Segler.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${marcellus.variable} ${openSans.variable}`}>
      <body className="bg-[#f7f1ea] text-[#3c3d38] font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
