import type { Metadata } from "next";
import { Cinzel, Manrope } from "next/font/google";
import "../globals.css";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-cinzel" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-manrope" });

export const metadata: Metadata = { title: "Admin · Raiden", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cinzel.variable} ${manrope.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
