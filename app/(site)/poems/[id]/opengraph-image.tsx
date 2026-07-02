import { ImageResponse } from "next/og";
import { getPublicPoemById } from "@/lib/db/poems";

export const runtime = "edge";
export const alt = "시담 — 시를 담는 곳";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const THEME_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
  paper: { bg: "#F6F1E7", text: "#2F332D", accent: "#6F7F62" },
  white: { bg: "#FFFFFF", text: "#222222", accent: "#777777" },
  night: { bg: "#16201C", text: "#F5F0E8", accent: "#B5D692" },
  green: { bg: "#E8F1DC", text: "#2E4638", accent: "#7DA266" },
  letter: { bg: "#FBF4E8", text: "#3A3028", accent: "#B8956A" },
  cream: { bg: "#F8F3EA", text: "#2B2B2B", accent: "#B5D692" },
};

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const poem = await getPublicPoemById(id);

  if (!poem) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "#F6F1E7", color: "#2F332D", fontSize: 48 }}>
          시담
        </div>
      ),
      { ...size },
    );
  }

  const themeKey = poem.theme ?? "paper";
  const tc = THEME_COLORS[themeKey] ?? THEME_COLORS.paper;
  const bodyPreview = poem.content.split("\n").slice(0, 4).join("\n").slice(0, 200);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: tc.bg,
          color: tc.text,
          padding: "80px 100px",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.3, marginBottom: 32 }}>
          {poem.title}
        </div>
        <div
          style={{
            fontSize: 24,
            lineHeight: 1.8,
            opacity: 0.8,
            whiteSpace: "pre-wrap",
            maxWidth: 800,
          }}
        >
          {bodyPreview}
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 18,
            letterSpacing: "0.15em",
            opacity: 0.5,
          }}
        >
          {poem.author.display_name} · sidam.space
        </div>
      </div>
    ),
    { ...size },
  );
}
