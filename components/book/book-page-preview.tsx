"use client";

import { cn } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

/**
 * 문집 위저드에서 사용되는 "책 한 페이지" 미리보기.
 * 선택한 레이아웃 템플릿에 따라 폰트·여백·정렬이 달라집니다.
 * 인쇄 미리보기(A4·A5 인쇄물)처럼 페이지 한 장을 축소해 보여줍니다.
 */

export interface PagePreviewData {
  title: string;
  body: string;
  imageUrl?: string;
}

interface Props {
  /** 표시할 페이지 데이터 (하나면 단일 페이지, 여러 개면 목록 미리보기) */
  pages: PagePreviewData[];
  /** 레이아웃 슬러그 (basic_collection, spacious_poetry, essay, letter, photo_text) */
  layout: string;
  /** 이미지 모드 (none, cover_only, per_writing, decorative) */
  imageMode?: string;
  /** 표지 이미지 URL — cover_only 모드에서 표지 첫 페이지 대신 사용 */
  coverImageUrl?: string;
  className?: string;
  lang?: Locale;
}

interface LayoutStyle {
  page: string;
  title: string;
  body: string;
  showImage: (imageMode?: string, hasImage?: boolean) => boolean;
  imageLayout: "top" | "background" | "side";
}

const LAYOUT_STYLES: Record<string, LayoutStyle> = {
  basic_collection: {
    page: "px-6 py-7",
    title: "font-serif text-[13px] font-semibold mb-3 text-center leading-snug",
    body: "font-serif text-[10px] leading-[1.9] text-center whitespace-pre-wrap",
    showImage: (mode, has) => (mode === "per_writing" && !!has),
    imageLayout: "top",
  },
  spacious_poetry: {
    page: "px-10 py-14",
    title: "font-serif text-[12px] font-medium mb-8 text-center tracking-wider",
    body: "font-serif text-[9px] leading-[2.4] text-center whitespace-pre-wrap",
    showImage: (mode, has) => (mode === "per_writing" && !!has),
    imageLayout: "top",
  },
  essay: {
    page: "px-8 py-6",
    title: "font-serif text-[12px] font-semibold mb-3 text-left leading-snug",
    body: "font-serif text-[10px] leading-[1.7] text-left whitespace-pre-wrap indent-4",
    showImage: (mode, has) => (mode === "per_writing" && !!has),
    imageLayout: "top",
  },
  letter: {
    page: "px-8 py-8",
    title: "font-serif italic text-[12px] mb-4 text-center leading-snug",
    body: "font-serif italic text-[10px] leading-[1.9] text-left whitespace-pre-wrap",
    showImage: () => false,
    imageLayout: "top",
  },
  photo_text: {
    page: "px-4 py-3",
    title: "font-serif text-[11px] font-medium mb-2 text-center leading-snug",
    body: "font-serif text-[9px] leading-[1.7] text-center whitespace-pre-wrap",
    showImage: () => true,
    imageLayout: "top",
  },
};

function ImagePlaceholder({
  url,
  height = "40%",
  layout,
}: {
  url?: string;
  height?: string;
  layout: "top" | "background" | "side";
}) {
  if (url) {
    return (
      <div
        className={cn(
          "w-full overflow-hidden rounded-md bg-cover bg-center",
          layout === "top" ? "mb-3" : "",
        )}
        style={{ backgroundImage: `url(${url})`, height }}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center rounded-md border border-dashed border-border-soft bg-accent-soft/20",
        layout === "top" ? "mb-3" : "",
      )}
      style={{ height }}
    >
      <ImageIcon className="size-4 text-text-secondary opacity-50" />
    </div>
  );
}

function SinglePage({
  data,
  layout,
  imageMode,
  index,
  total,
}: {
  data: PagePreviewData;
  layout: string;
  imageMode?: string;
  index: number;
  total: number;
}) {
  const style = LAYOUT_STYLES[layout] ?? LAYOUT_STYLES.basic_collection;
  const showImg = style.showImage(imageMode, !!data.imageUrl);

  return (
    <div className="flex flex-col rounded-md bg-white shadow-sm ring-1 ring-border-soft overflow-hidden aspect-[3/4]">
      <div className={cn("flex flex-col flex-1", style.page)}>
        {showImg && style.imageLayout === "top" && (
          <ImagePlaceholder
            url={data.imageUrl}
            height={layout === "photo_text" ? "45%" : "30%"}
            layout="top"
          />
        )}
        <h3 className={style.title} style={{ color: "#2F332D" }}>
          {data.title || "(제목 없음)"}
        </h3>
        <div className={style.body} style={{ color: "#2F332D" }}>
          {data.body || "…"}
        </div>
      </div>
      <div className="border-t border-border-soft/60 px-3 py-1 text-center">
        <span className="text-[8px] text-text-secondary tabular-nums">
          {index + 1} / {total}
        </span>
      </div>
    </div>
  );
}

export function BookPagePreview({
  pages,
  layout,
  imageMode,
  coverImageUrl,
  className,
  lang = "ko",
}: Props) {
  const isEn = lang === "en";
  const displayPages = pages.slice(0, 4);

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-center text-xs text-text-secondary">
        {isEn ? "Page preview" : "페이지 미리보기"}
      </p>

      {displayPages.length === 0 ? (
        <div className="rounded-md bg-white shadow-sm ring-1 ring-border-soft aspect-[3/4] flex items-center justify-center p-8 text-center">
          <p className="text-xs text-text-secondary italic">
            {isEn
              ? "Add writings to see how they'll look on the page."
              : "글을 담으면 페이지 배치를 미리 볼 수 있어요."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {displayPages.map((page, i) => (
            <SinglePage
              key={i}
              data={{
                ...page,
                imageUrl: imageMode === "cover_only" && i === 0 ? coverImageUrl : page.imageUrl,
              }}
              layout={layout}
              imageMode={imageMode}
              index={i}
              total={pages.length}
            />
          ))}
        </div>
      )}

      {pages.length > 4 && (
        <p className="text-center text-[10px] text-text-secondary">
          {isEn
            ? `+ ${pages.length - 4} more pages`
            : `외 ${pages.length - 4}편 더`}
        </p>
      )}
    </div>
  );
}
