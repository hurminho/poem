"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { BookCover } from "@/components/book/book-cover";
import { BookPoemPicker } from "@/components/book/book-poem-picker";
import type { Book, Poem, Visibility, Status } from "@/types";

const COVER_THEMES = [
  { value: "linen", label: "리넨" },
  { value: "ink", label: "먹" },
  { value: "dawn", label: "여명" },
  { value: "forest", label: "숲" },
  { value: "paper", label: "한지" },
];

interface BookFormProps {
  initial?: Partial<Book> & { poem_ids?: string[] };
  myPoems: Poem[];
}

export function BookForm({ initial, myPoems }: BookFormProps) {
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = React.useState(initial?.subtitle ?? "");
  const [description, setDescription] = React.useState(initial?.description ?? "");
  const [coverTheme, setCoverTheme] = React.useState(initial?.cover_theme ?? "linen");
  const [visibility, setVisibility] = React.useState<Visibility>(initial?.visibility ?? "private");
  const [status, setStatus] = React.useState<Status>(initial?.status ?? "draft");
  const [selectedPoemIds, setSelectedPoemIds] = React.useState<string[]>(initial?.poem_ids ?? []);

  const onPublish = () => {
    setStatus("published");
    if (visibility === "private") setVisibility("link");
    // TODO: Supabase upsert
  };
  const onSaveDraft = () => {
    setStatus("draft");
    // TODO: Supabase upsert
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      {/* 표지 + 메타 */}
      <div className="space-y-5">
        <BookCover title={title} subtitle={subtitle} theme={coverTheme} size="lg" />

        <Card className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">제목</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="시집의 제목" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subtitle">부제 (선택)</Label>
            <Input id="subtitle" value={subtitle ?? ""} onChange={(e) => setSubtitle(e.target.value)} placeholder="짧은 한 줄" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">설명 (선택)</Label>
            <Textarea
              id="description"
              rows={3}
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="이 시집을 한 문단으로 소개해주세요."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cover">표지</Label>
              <Select id="cover" value={coverTheme} onChange={(e) => setCoverTheme(e.target.value)}>
                {COVER_THEMES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="visibility">공개 범위</Label>
              <Select id="visibility" value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)}>
                <option value="private">비공개</option>
                <option value="link">링크가 있는 사람</option>
                <option value="public">전체 공개</option>
              </Select>
            </div>
          </div>

          <hr className="divider" />
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={onPublish}>발행하기</Button>
            <Button variant="secondary" onClick={onSaveDraft}>임시저장</Button>
            <span className="ml-auto text-xs text-ink-mute">
              {status === "draft" ? "임시저장" : status === "published" ? "발행됨" : "보관함"}
            </span>
          </div>
        </Card>
      </div>

      {/* 시 선택·재정렬 */}
      <div>
        <BookPoemPicker
          allPoems={myPoems}
          selectedIds={selectedPoemIds}
          onChange={setSelectedPoemIds}
        />
      </div>
    </div>
  );
}
