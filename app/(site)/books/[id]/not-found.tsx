import { PrimaryCTA } from "@/components/ui/primary-cta";
import { QuietButton } from "@/components/ui/quiet-button";

export default function BookNotFound() {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <p className="text-xs tracking-[0.3em] text-text-secondary uppercase">Book</p>
      <h1 className="mt-3 font-serif text-2xl font-semibold text-text-primary">
        이 시집은 아직 공개되지 않았습니다.
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        작가가 아직 펼치지 않았거나, 비공개로 두고 있는 시집일 수 있어요.
      </p>
      <div className="mt-6 flex items-center justify-center gap-2">
        <PrimaryCTA href="/explore">둘러보기</PrimaryCTA>
        <QuietButton href="/">처음으로</QuietButton>
      </div>
    </div>
  );
}
