import localFont from "next/font/local";

// Self-hosted variable fonts (OFL), so builds never depend on fetching Google Fonts.
export const cinzel = localFont({ src: "../fonts/cinzel.woff2", weight: "400 900", variable: "--font-cinzel", display: "swap" });
export const manrope = localFont({ src: "../fonts/manrope.woff2", weight: "200 800", variable: "--font-manrope", display: "swap" });
