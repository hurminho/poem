import { Feather, NotebookPen, Wind, Sparkles } from "lucide-react";

const ITEMS = [
  {
    icon: Feather,
    title: "만년필처럼 가벼운 글쓰기",
    body:
      "잉크가 잘 흐르는 종이처럼. 제목·본문·메모가 한 화면에 단정하게 정렬됩니다.",
  },
  {
    icon: NotebookPen,
    title: "한 권의 작은 시집",
    body:
      "쓴 시를 한 권의 책으로 묶고, 비공개·링크·공개 중 원하는 거리에 둡니다.",
  },
  {
    icon: Wind,
    title: "호흡 5분, 시 명상",
    body:
      "배경을 비우고 호흡 길이를 정해, 한 편을 천천히 한 번 더 읽는 시간.",
  },
  {
    icon: Sparkles,
    title: "마음에 맞는 한 편",
    body:
      "오늘의 마음에 어울리는 한 편을 시담에 등록된 공개 시 가운데서 골라드립니다.",
  },
];

export function LandingStillLife() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div className="rounded-3xl border border-border-soft bg-surface px-6 py-10 md:px-12 md:py-14">
        <div className="max-w-2xl">
          <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
            Slow tools
          </p>
          <h2 className="mt-2 font-serif text-2xl md:text-3xl font-semibold text-text-primary">
            잉크가 마르듯 천천히 도착하는 도구들
          </h2>
          <p className="mt-3 text-sm text-text-secondary leading-relaxed">
            빠른 피드가 아닌, 작가의 책상 위 한 자리.
            시담은 만년필과 노트 한 권으로 충분한 도구를 지향합니다.
          </p>
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="rounded-2xl border border-border-soft bg-background/60 px-5 py-5"
            >
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-accent-soft">
                <Icon className="size-4 text-ink-forest" aria-hidden />
              </span>
              <p className="mt-3 font-serif text-base font-semibold text-text-primary">
                {title}
              </p>
              <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
