import Link from "next/link";
import { formatDateKo } from "@/lib/utils";
import type { QuietChallenge } from "@/types";

export function ChallengeStrip({ challenges }: { challenges: QuietChallenge[] }) {
  if (challenges.length === 0) {
    return (
      <p className="text-sm text-text-secondary">
        지금은 진행 중인 챌린지가 없습니다. 곧 새 챌린지가 시작돼요.
      </p>
    );
  }
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {challenges.map((c) => (
        <li key={c.id}>
          <Link
            href={`/challenges/${c.id}`}
            className="block rounded-2xl border border-border-soft bg-surface px-5 py-5 hover:border-accent transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.25em] uppercase text-accent">
                Active
              </span>
              <span className="text-xs text-text-secondary">
                · {c.participant_count.toLocaleString("ko-KR")}명 참여
              </span>
            </div>
            <p className="mt-2 font-serif text-lg font-semibold text-text-primary">
              {c.title}
            </p>
            <p className="mt-1 text-sm text-text-secondary line-clamp-2 leading-relaxed">
              {c.description}
            </p>
            <p className="mt-3 text-xs text-text-secondary">
              {formatDateKo(c.starts_at)} – {formatDateKo(c.ends_at)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
