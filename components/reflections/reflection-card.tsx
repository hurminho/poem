"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Heart, Pencil, Check, X, Trash2 } from "lucide-react";
import { cn, relativeTime } from "@/lib/utils";
import { toggleReactionAction } from "@/lib/reactions/actions";
import {
  deleteReflectionAction,
  updateReflectionAction,
} from "@/lib/reflections/actions";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { Reflection } from "@/types";

interface Props {
  reflection: Reflection;
  authorName?: string;
  /** 현재 로그인 사용자 — null 이면 게스트. 본인 감상평일 때 수정 UI 노출. */
  currentUserId?: string | null;
  initialLiked?: boolean;
  initialLikeCount?: number;
  lang?: Locale;
}

const MAX_CONTENT = 500;

export function ReflectionCard({
  reflection,
  authorName,
  currentUserId = null,
  initialLiked = false,
  initialLikeCount = 0,
  lang = "ko",
}: Props) {
  const t = getDictionary(lang).reflections;
  const reactionsT = getDictionary(lang).reactions;
  const loginHref = lang === "en" ? "/en/login" : "/login";
  // 모든 감상평은 ‘익명의 독자’ 로 노출됩니다.
  // (작성자 식별은 user_id 로만 내부 처리 — 본인만 수정·삭제 가능.)
  void authorName;
  const name = t.anon;
  const router = useRouter();

  const canEdit = !!currentUserId && reflection.user_id === currentUserId;

  // 좋아요
  const [liked, setLiked] = React.useState(initialLiked);
  const [count, setCount] = React.useState(initialLikeCount);
  const [likePending, startLike] = React.useTransition();
  const [hint, setHint] = React.useState<string | null>(null);

  const onLike = () => {
    if (!currentUserId) {
      setHint(reactionsT.likeNeedsLogin);
      setTimeout(() => router.push(loginHref), 1000);
      return;
    }
    startLike(async () => {
      const next = !liked;
      setLiked(next);
      setCount((c) => c + (next ? 1 : -1));
      const res = await toggleReactionAction(
        "reflection",
        reflection.id,
        "like",
      );
      if (!res.ok) {
        setLiked(!next);
        setCount((c) => c + (next ? -1 : 1));
        setHint(res.error ?? reactionsT.requestFailed);
        setTimeout(() => setHint(null), 1500);
        return;
      }
      if (typeof res.count === "number") setCount(res.count);
      if (typeof res.liked === "boolean") setLiked(res.liked);
    });
  };

  // 수정
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(reflection.content);
  const [savedContent, setSavedContent] = React.useState(reflection.content);
  const [editPending, startEdit] = React.useTransition();
  const [editError, setEditError] = React.useState<string | null>(null);

  // 삭제 — 본인이 남긴 감상평을 영구히 내립니다.
  const [removed, setRemoved] = React.useState(false);
  const [removePending, startRemove] = React.useTransition();
  const onRemove = () => {
    const ok = window.confirm(t.confirmDelete);
    if (!ok) return;
    startRemove(async () => {
      const res = await deleteReflectionAction(reflection.id);
      if (!res.ok) {
        setHint(res.error ?? t.deleteFailed);
        setTimeout(() => setHint(null), 1500);
        return;
      }
      setRemoved(true);
      router.refresh();
    });
  };

  const beginEdit = () => {
    setDraft(savedContent);
    setEditing(true);
    setEditError(null);
  };
  const cancelEdit = () => {
    setEditing(false);
    setEditError(null);
  };
  const saveEdit = () => {
    const v = draft.trim();
    if (!v) {
      setEditError(t.contentRequired);
      return;
    }
    if (v.length > MAX_CONTENT) {
      setEditError(t.errTooLong.replace("{max}", String(MAX_CONTENT)));
      return;
    }
    startEdit(async () => {
      const res = await updateReflectionAction(reflection.id, v);
      if (!res.ok) {
        setEditError(res.error ?? t.editFailed);
        return;
      }
      setSavedContent(v);
      setEditing(false);
      setEditError(null);
      router.refresh();
    });
  };

  if (removed) return null;

  return (
    <article className="reflection-card relative">
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-text-primary">{name}</p>
        <p className="text-xs text-text-secondary">
          {relativeTime(reflection.created_at, lang)}
          {reflection.updated_at &&
            reflection.updated_at !== reflection.created_at && (
              <span className="ml-1">· {t.edited}</span>
            )}
        </p>
      </div>

      {editing ? (
        <div className="space-y-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            maxLength={MAX_CONTENT}
            className="w-full rounded-md border border-border-soft bg-surface px-3 py-2 font-serif text-[15px] leading-relaxed text-text-primary"
          />
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] text-text-secondary tabular-nums">
              {draft.length} / {MAX_CONTENT}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={cancelEdit}
                disabled={editPending}
                className="inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs text-text-secondary hover:bg-accent-soft"
              >
                <X className="size-3.5" /> {t.cancel}
              </button>
              <button
                type="button"
                onClick={saveEdit}
                disabled={editPending}
                className="inline-flex h-8 items-center gap-1 rounded-md bg-text-primary px-3 text-xs text-background hover:opacity-90 disabled:opacity-50"
              >
                <Check className="size-3.5" />
                {editPending ? t.saving : t.save}
              </button>
            </div>
          </div>
          {editError ? (
            <p className="text-xs text-rose-700">{editError}</p>
          ) : null}
        </div>
      ) : (
        <p className="font-serif text-[15px] leading-relaxed text-text-secondary whitespace-pre-line">
          {savedContent}
        </p>
      )}

      {/* 액션 — 좋아요(누구나) + 수정(본인) */}
      {!editing && (
        <div className="mt-3 flex items-center gap-2">
          <span className="relative inline-flex">
            <button
              type="button"
              onClick={onLike}
              disabled={likePending}
              aria-pressed={liked}
              aria-label={liked ? reactionsT.unlikeAria : reactionsT.likeAria}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border bg-surface h-7 px-2.5 text-xs transition-colors",
                "border-border-soft hover:border-accent",
                liked
                  ? "text-[color:#a85a4a]"
                  : "text-text-secondary hover:text-text-primary",
                "disabled:opacity-60",
              )}
            >
              <Heart
                className="size-3.5"
                fill={liked ? "currentColor" : "none"}
              />
              <span className="tabular-nums">{count}</span>
            </button>
            {hint && (
              <span
                role="status"
                className="absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-text-primary/95 px-3 py-1 text-[11px] text-background shadow"
              >
                {hint}
              </span>
            )}
          </span>

          {canEdit ? (
            <>
              <button
                type="button"
                onClick={beginEdit}
                className="inline-flex h-7 items-center gap-1 rounded-full border border-border-soft px-2.5 text-xs text-text-secondary hover:border-accent hover:text-text-primary"
              >
                <Pencil className="size-3.5" /> {t.edit}
              </button>
              <button
                type="button"
                onClick={onRemove}
                disabled={removePending}
                className="inline-flex h-7 items-center gap-1 rounded-full border border-border-soft px-2.5 text-xs text-text-secondary hover:border-rose-300 hover:text-rose-700 disabled:opacity-60"
              >
                <Trash2 className="size-3.5" />
                {removePending ? t.deleting : t.del}
              </button>
            </>
          ) : null}
        </div>
      )}
    </article>
  );
}
