import { notFound } from "next/navigation";
import Link from "next/link";
import { PrimaryCTA } from "@/components/ui/primary-cta";
import { QuietButton } from "@/components/ui/quiet-button";
import { getChallengeById } from "@/lib/db/placeholder";
import { formatDateKo } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const c = getChallengeById(id);
  return { title: c ? c.title : "챌린지" };
}

export default async function ChallengeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const c = getChallengeById(id);
  if (!c) notFound();

  const statusLabel =
    c.status === "active" ? "진행 중" : c.status === "open" ? "곧 시작" : "종료";

  return (
    <div className="poem-page">
      <div className="mx-auto max-w-3xl px-5 py-12 space-y-10">
        <header className="text-center">
          <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">
            Quiet challenge
          </p>
          <h1 className="mt-2 font-serif text-3xl md:text-4xl font-semibold text-text-primary leading-snug">
            {c.title}
          </h1>
          <p className="mt-3 text-sm text-text-secondary">
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-text-primary">{statusLabel}</span>{" "}
            · {c.participant_count.toLocaleString("ko-KR")}명 참여 · {formatDateKo(c.starts_at)} ~ {formatDateKo(c.ends_at)}
          </p>
        </header>

        <section className="poem-surface px-6 py-8 md:px-10 md:py-10 text-center">
          <p className="text-[11px] tracking-[0.3em] uppercase text-text-secondary">Today&apos;s prompt</p>
          <p className="mt-4 font-serif text-2xl text-text-primary leading-snug">{c.prompt}</p>
          <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-prose mx-auto">
            {c.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {c.status === "active" ? (
              <PrimaryCTA href={`/studio/new?challenge=${c.id}`}>
                참여해 한 편 쓰기
              </PrimaryCTA>
            ) : (
              <PrimaryCTA href="/challenges">다른 챌린지 보기</PrimaryCTA>
            )}
            <QuietButton href="/explore">먼저 다른 시집 둘러보기</QuietButton>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          {[
            { t: "강요하지 않습니다", d: "쓰지 못한 날도 ‘쉼표’로 기록됩니다." },
            { t: "조용히 함께", d: "댓글 대신 짧은 감상평으로만 응합니다." },
            { t: "끝나면 한 권", d: "참여한 글들을 모아 작은 시집으로 묶어드려요." },
          ].map((row) => (
            <div key={row.t} className="reflection-card">
              <p className="font-serif text-base font-semibold text-text-primary">{row.t}</p>
              <p className="mt-1 text-sm text-text-secondary leading-relaxed">{row.d}</p>
            </div>
          ))}
        </section>

        <div className="text-center">
          <Link href="/challenges" className="text-sm text-text-secondary hover:text-text-primary">
            ← 챌린지 전체로
          </Link>
        </div>
      </div>
    </div>
  );
}
