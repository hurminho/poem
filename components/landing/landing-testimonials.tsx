const VOICES = [
  {
    body: "‘피드를 새로고침’하지 않아도 되어서 좋아요. 한 페이지에 한 편만 있으니까 그 한 편이 진짜로 보입니다.",
    name: "베타 테스터 · 서른의 작가",
  },
  {
    body: "오늘의 마음을 고르고 시작하니 글쓰기가 훨씬 가벼워졌어요. 어떻게 시작할지 매번 망설이지 않게 되었습니다.",
    name: "베타 테스터 · 일러스트레이터",
  },
  {
    body: "시 명상 모드에서 호흡 5분 동안 한 편만 보이는 게, 명상 앱과 다르게 ‘책’을 읽는 느낌이라 좋았어요.",
    name: "베타 테스터 · 도서관 사서",
  },
];

export function LandingTestimonials() {
  return (
    <div className="rounded-3xl border border-border-soft bg-surface px-5 py-10 md:px-10 md:py-14">
      <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary text-center">
        Voices
      </p>
      <h2 className="mt-2 font-serif text-2xl font-semibold text-text-primary text-center">
        먼저 머문 분들의 한 줄
      </h2>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {VOICES.map((v) => (
          <li
            key={v.name}
            className="rounded-2xl border border-border-soft bg-background/60 px-5 py-6"
          >
            <p className="font-serif text-base text-text-primary leading-relaxed">
              “{v.body}”
            </p>
            <p className="mt-4 text-xs text-text-secondary">— {v.name}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-center text-xs text-text-secondary">
        실제 사용자 인용은 베타 종료 후 본 의견으로 교체됩니다.
      </p>
    </div>
  );
}
