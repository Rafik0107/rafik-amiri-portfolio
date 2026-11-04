import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Rafik Amiri (Raiden) — Control, robotics & mechatronics · Photographer & graphic designer";

export default async function OG({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const sub = lang === "en" ? "CONTROL · ROBOTICS · MECHATRONICS" : "AUTOMATIQUE · ROBOTIQUE · MÉCATRONIQUE";
  const sub2 = lang === "en" ? "Master 1 student · Photographer & graphic designer" : "Étudiant en Master 1 · Photographe & designer graphique";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at 30% 20%, #2a0d66 0%, #050508 60%)", color: "#f5f5f7", fontFamily: "serif" }}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 60, bottom: 60, border: "1px solid #d4af37" }} />
        <div style={{ fontSize: 104, letterSpacing: 10, color: "#ffd700", fontWeight: 700 }}>RAFIK AMIRI</div>
        <div style={{ fontSize: 36, letterSpacing: 18, color: "#a978ff", marginTop: 14 }}>(RAIDEN)</div>
        <div style={{ fontSize: 24, letterSpacing: 12, marginTop: 40, color: "#f5f5f7" }}>{sub}</div>
        <div style={{ fontSize: 22, marginTop: 22, color: "#b3b1c0" }}>{sub2}</div>
        <div style={{ fontSize: 20, marginTop: 14, color: "#d4af37" }}>Sorbonne Université · Paris</div>
      </div>
    ),
    size,
  );
}
