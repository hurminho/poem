import { ImageResponse } from "next/og";
import { getPublicBookById } from "@/lib/db/books";
import { getContrastTextColor } from "@/lib/books/cover-colors";

export const runtime = "edge";
export const alt = "시담 — 시를 담는 곳";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COVER_COLORS: Record<string, { from: string; to: string; text: string }> = {
  warm_paper: { from: "#F4E9D6", to: "#E5D4B5", text: "#3a342c" },
  ink_black: { from: "#1a1816", to: "#0c0b0a", text: "#f5efe6" },
  spring: { from: "#F4E6E0", to: "#E7C9BD", text: "#52332f" },
  rain: { from: "#D7DEE5", to: "#9FAEBE", text: "#1f2a36" },
  night: { from: "#2a2a3a", to: "#10131c", text: "#dcd6c4" },
  letter: { from: "#FBF8F1", to: "#EFE3CC", text: "#3a342c" },
  minimal: { from: "#ffffff", to: "#f6f6f6", text: "#222222" },
  classic: { from: "#F0E6D2", to: "#C9B790", text: "#33291a" },
  modern: { from: "#222222", to: "#3a3a3a", text: "#f5f5f5" },
  garden: { from: "#E5EFE6", to: "#B9C8B9", text: "#243027" },
};

export default async function OGImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getPublicBookById(id);

  if (!book) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "#F6F1E7", color: "#2F332D", fontSize: 48 }}>
          시담
        </div>
      ),
      { ...size },
    );
  }

  const tc = book.cover_background_color
    ? { from: book.cover_background_color, text: getContrastTextColor(book.cover_background_color) }
    : COVER_COLORS[book.cover_theme] ?? COVER_COLORS.warm_paper;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: tc.from,
          color: tc.text,
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontFamily: "serif",
          flexDirection: "column",
          padding: "60px 80px",
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.3 }}>
          {book.title}
        </div>
        {book.subtitle && (
          <div style={{ fontSize: 24, marginTop: 16, opacity: 0.7 }}>
            {book.subtitle}
          </div>
        )}
        <div
          style={{
            marginTop: 40,
            fontSize: 20,
            letterSpacing: "0.15em",
            opacity: 0.5,
          }}
        >
          {book.author.display_name} · sidam.space
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 16,
            opacity: 0.4,
          }}
        >
          {book.poem_count}편의 시
        </div>
      </div>
    ),
    { ...size },
  );
}
