import type { Metadata } from "next";
import "../globals.css";

import { cinzel, manrope } from "@/lib/fonts";

export const metadata: Metadata = { title: "Admin · Raiden", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cinzel.variable} ${manrope.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
