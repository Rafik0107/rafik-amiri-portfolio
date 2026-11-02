import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Rafik Amiri (Raiden) — Engineer • Creator • Innovator";

export default async function OG({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const sub = lang === "en" ? "ENGINEER • CREATOR • INNOVATOR" : "INGÉNIEUR • CRÉATEUR • INNOVATEUR";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 50% 50%, #2a0d66 0%, #050508 62%)", color: "#f5f5f7", fontFamily: "serif" }}>
        <div style={{ position: "absolute", width: 520, height: 520, borderRadius: 9999, border: "3px solid #d4af37", boxShadow: "0 0 80px #7b2fff" }} />
        <div style={{ fontSize: 104, letterSpacing: 10, color: "#ffd700", fontWeight: 700 }}>RAFIK AMIRI</div>
        <div style={{ fontSize: 40, letterSpacing: 22, color: "#a978ff", marginTop: 14 }}>( RAIDEN )</div>
        <div style={{ fontSize: 24, letterSpacing: 12, marginTop: 40, color: "#f5f5f7" }}>{sub}</div>
        <div style={{ fontSize: 20, marginTop: 26, color: "#a7a5b4" }}>Sorbonne Université · Paris</div>
      </div>
    ),
    size,
  );
}
