"use client";

import * as React from "react";
import Link from "next/link";
import {
  Pause,
  Play,
  RotateCcw,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PoemWithAuthor } from "@/types";

interface MeditationRoomProps {
  poem: PoemWithAuthor;
  minutes: number;
}

const PRESETS = [3, 5, 10, 15];

/**
 * 시 명상 — 호흡 타이머 + (선택) 한국어 음성 낭독.
 *
 * 타이머의 의미:
 *  - 3·5·10·15 분 동안 한 페이지에 한 편의 시만 남기고 머무는 시간을 정합니다.
 *  - 단순 카운트다운이지만, 화면이 깨끗하게 비워지므로 ‘한 번 더 천천히 읽기’를
 *    돕는 의도된 디자인입니다.
 *
 * 음성 낭독 (옵션):
 *  - 브라우저 내장 Web Speech API (`speechSynthesis`) 의 ko-KR 음성을 사용합니다.
 *  - 외부 서버나 비용이 들지 않으며, 미지원 브라우저에서는 자동으로 숨겨집니다.
 *  - 한 번에 한 문단씩(빈 줄 기준) 끊어 읽도록 했으며, 호흡과 자연스럽게 어울리는
 *    `rate: 0.85` 로 천천히 읽습니다.
 */
export function MeditationRoom({ poem, minutes }: MeditationRoomProps) {
  const total = minutes * 60;
  const [remaining, setRemaining] = React.useState(total);
  const [running, setRunning] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);

  // ── 음성 낭독 상태 ─────────────────────────────────
  const [speechSupported, setSpeechSupported] = React.useState(false);
  const [speechOn, setSpeechOn] = React.useState(false);
  const [speaking, setSpeaking] = React.useState(false);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const koVoiceRef = React.useRef<SpeechSynthesisVoice | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    setSpeechSupported(true);

    function pickKoVoice() {
      const voices = window.speechSynthesis.getVoices();
      const ko = voices.find((v) => v.lang?.toLowerCase().startsWith("ko"));
      if (ko) koVoiceRef.current = ko;
    }
    pickKoVoice();
    window.speechSynthesis.onvoiceschanged = pickKoVoice;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // ── 카운트다운 타이머 ─────────────────────────────────
  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false);
          setCompleted(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  function speakPoem() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    // 문단 단위로 자연스럽게 — 빈 줄(\n\n)로 끊고, 그 안에서는 줄바꿈을 쉼표처럼 살짝 쉼표 처리.
    const text = poem.content
      .replace(/\r/g, "")
      .split(/\n{2,}/)
      .map((p) => p.replace(/\n/g, ", "))
      .filter((p) => p.trim().length > 0)
      .join("\n\n");

    const u = new SpeechSynthesisUtterance(`${poem.title}.\n\n${text}`);
    u.lang = "ko-KR";
    u.rate = 0.85;
    u.pitch = 1.0;
    u.volume = 1;
    if (koVoiceRef.current) u.voice = koVoiceRef.current;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
  }

  function stopSpeaking() {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  function onToggleSpeech() {
    if (speechOn) {
      setSpeechOn(false);
      stopSpeaking();
    } else {
      setSpeechOn(true);
      if (running) speakPoem();
    }
  }

  function onTogglePlay() {
    if (running) {
      setRunning(false);
      stopSpeaking();
    } else {
      setRunning(true);
      if (speechOn) speakPoem();
    }
  }

  function onReset() {
    setRunning(false);
    setRemaining(total);
    setCompleted(false);
    stopSpeaking();
  }

  const pct = Math.max(0, Math.min(1, (total - remaining) / total));
  const m = String(Math.floor(remaining / 60)).padStart(2, "0");
  const s = String(remaining % 60).padStart(2, "0");

  return (
    <section className="poem-surface px-6 py-10 md:px-12 md:py-14 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1 bg-accent/40 transition-[width] duration-700"
        style={{ width: `${pct * 100}%` }}
      />

      <div className="text-center mb-6">
        <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
          {poem.author.display_name}
        </p>
        <h2 className="mt-1 poem-title text-2xl md:text-3xl">{poem.title}</h2>
      </div>

      <article className="mx-auto max-w-prose">
        <p className="poem-body text-balance">{poem.content}</p>
      </article>

      <div className="mt-10 flex flex-col items-center gap-4">
        <p className="font-mono tabular-nums text-3xl text-text-primary">
          {m}:{s}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {PRESETS.map((p) => (
            <Link
              key={p}
              href={`/meditation?poem=${poem.id}&minutes=${p}`}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                p === minutes
                  ? "border-accent bg-accent-soft text-text-primary"
                  : "border-border-soft text-text-secondary hover:border-accent",
              )}
            >
              {p}분
            </Link>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-2">
          {!completed ? (
            <button
              type="button"
              onClick={onTogglePlay}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-text-primary px-6 text-sm font-medium text-background hover:opacity-90"
              aria-label={running ? "일시정지" : "시작"}
            >
              {running ? <Pause className="size-4" /> : <Play className="size-4" />}
              {running ? "잠시 멈추기" : "시작하기"}
            </button>
          ) : (
            <Link
              href="/today"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-text-primary px-6 text-sm font-medium text-background hover:opacity-90"
            >
              마음 적으러 가기 <ChevronRight className="size-4" />
            </Link>
          )}
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border-soft bg-surface px-5 text-sm text-text-primary hover:border-accent"
          >
            <RotateCcw className="size-4" /> 다시
          </button>

          {speechSupported ? (
            <button
              type="button"
              onClick={onToggleSpeech}
              aria-pressed={speechOn}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm transition-colors",
                speechOn
                  ? "border-accent bg-accent-soft text-text-primary"
                  : "border-border-soft bg-surface text-text-secondary hover:border-accent hover:text-text-primary",
              )}
              title={
                speechOn
                  ? "음성 낭독 끄기"
                  : "한국어 음성으로 시를 천천히 읽어줍니다"
              }
            >
              {speechOn ? (
                <Volume2 className="size-4" />
              ) : (
                <VolumeX className="size-4" />
              )}
              {speechOn ? (speaking ? "낭독 중…" : "음성 낭독 켜짐") : "음성 낭독"}
            </button>
          ) : null}
        </div>

        {completed ? (
          <p className="text-sm text-text-secondary mt-2">
            잘 머무셨어요. 한 줄로 마음을 이어가 보세요.
          </p>
        ) : (
          <p className="text-xs text-text-secondary">
            타이머는 한 편에 머무는 시간을 정해줍니다.
            {speechSupported
              ? " 음성 낭독을 켜면 시작과 동시에 한국어로 천천히 읽어드려요."
              : ""}
          </p>
        )}
      </div>
    </section>
  );
}
