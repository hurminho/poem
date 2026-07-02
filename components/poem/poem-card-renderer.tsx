"use client";

import * as React from "react";

interface ThemeColors {
  background: string;
  text: string;
}

const THEME_MAP: Record<string, ThemeColors> = {
  paper: { background: "#F6F1E7", text: "#2F332D" },
  white: { background: "#FFFFFF", text: "#222222" },
  night: { background: "#16201C", text: "#F5F0E8" },
  green: { background: "#E8F1DC", text: "#2E4638" },
  letter: { background: "#FBF4E8", text: "#3A3028" },
  cream: { background: "#F8F3EA", text: "#2B2B2B" },
};

export type CardFormat = "feed" | "story" | "square";

const FORMAT_DIMS: Record<CardFormat, { w: number; h: number }> = {
  feed: { w: 1080, h: 1350 },
  story: { w: 1080, h: 1920 },
  square: { w: 1080, h: 1080 },
};

const MAX_BODY_CHARS = 300;

interface Props {
  title: string;
  content: string;
  authorName?: string;
  theme?: string;
  format?: CardFormat;
  nodeRef: React.RefObject<HTMLDivElement | null>;
}

export function PoemCardRenderer({
  title,
  content,
  authorName,
  theme = "paper",
  format = "feed",
  nodeRef,
}: Props) {
  const colors = THEME_MAP[theme] ?? THEME_MAP.paper;
  const dims = FORMAT_DIMS[format];
  const scale = 0.3;

  const truncated = content.length > MAX_BODY_CHARS;
  const displayContent = truncated
    ? content.slice(0, MAX_BODY_CHARS).trimEnd() + "…"
    : content;

  return (
    <div
      style={{
        position: "absolute",
        left: "-9999px",
        top: 0,
        pointerEvents: "none",
      }}
    >
      <div
        ref={nodeRef}
        style={{
          width: dims.w,
          height: dims.h,
          backgroundColor: colors.background,
          color: colors.text,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "80px 100px",
          fontFamily: "'Noto Serif KR', 'Georgia', serif",
          textAlign: "center",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {title && (
          <h2
            style={{
              fontSize: 48,
              fontWeight: 600,
              lineHeight: 1.4,
              marginBottom: 40,
              color: colors.text,
            }}
          >
            {title}
          </h2>
        )}

        <div
          style={{
            fontSize: 32,
            lineHeight: 2,
            whiteSpace: "pre-wrap",
            color: colors.text,
            maxWidth: "100%",
          }}
        >
          {displayContent}
        </div>

        {truncated && (
          <p
            style={{
              fontSize: 22,
              marginTop: 32,
              opacity: 0.5,
              color: colors.text,
            }}
          >
            계속 읽기: sidam.space
          </p>
        )}

        {authorName && (
          <p
            style={{
              fontSize: 24,
              marginTop: 56,
              letterSpacing: "0.15em",
              opacity: 0.6,
              color: colors.text,
            }}
          >
            {authorName}
          </p>
        )}

        <p
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 18,
            letterSpacing: "0.2em",
            opacity: 0.25,
            color: colors.text,
          }}
        >
          sidam.space
        </p>
      </div>
    </div>
  );
}
