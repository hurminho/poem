import { Heart, PenLine, BookOpen, Wind, MessageSquareQuote } from "lucide-react";

const STEPS = [
  {
    icon: Heart,
    title: "오늘의 마음",
    text: "8가지 결 중에서 오늘의 마음을 고릅니다.",
  },
  {
    icon: PenLine,
    title: "오늘의 한 편",
    text: "그 마음에 어울리는 한 편을 천천히 적습니다.",
  },
  {
    icon: BookOpen,
    title: "시집에 묶기",
    text: "한 권의 작은 시집으로 묶거나, 기존 시집에 더합니다.",
  },
  {
    icon: Wind,
    title: "시 명상",
    text: "한 편을 천천히, 호흡과 함께 다시 읽습니다.",
  },
  {
    icon: MessageSquareQuote,
    title: "감상평",
    text: "도착한 마음을 짧은 글로 남깁니다.",
  },
];

export function LandingFlow() {
  return (
    <div className="rounded-3xl border border-border-soft bg-surface px-5 py-8 md:px-10 md:py-12">
      <div className="mb-8 flex flex-col gap-1 text-center md:text-left">
        <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">User flow</p>
        <h2 className="font-serif text-2xl font-semibold text-text-primary">
          시담의 하루 흐름
        </h2>
        <p className="text-sm text-text-secondary max-w-xl">
          마음을 고르고, 한 편을 적고, 책으로 묶고, 천천히 머물고, 감상평을 남깁니다.
        </p>
      </div>

      <ol className="grid gap-3 md:grid-cols-5">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              className="relative flex flex-col items-start gap-2 rounded-2xl border border-border-soft bg-background/60 px-4 py-5"
            >
              <div className="flex items-center gap-2">
                <span className="font-serif text-xs text-text-secondary">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="size-8 rounded-full bg-accent-soft flex items-center justify-center">
                  <Icon className="size-4 text-text-primary" aria-hidden />
                </span>
              </div>
              <p className="font-serif text-base font-semibold text-text-primary">
                {step.title}
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">{step.text}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
