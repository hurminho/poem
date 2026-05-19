import Link from "next/link";
import { PageTitle } from "@/components/ui/page-title";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { getCommunityPosts } from "@/lib/db/placeholder";
import { relativeTimeKo } from "@/lib/utils";
import { MessageSquareQuote } from "lucide-react";

export const metadata = { title: "커뮤니티" };

const TYPE_LABEL: Record<string, string> = {
  thread: "이야기",
  question: "물음",
  share: "나눔",
};

export default function CommunityPage() {
  const posts = getCommunityPosts();

  return (
    <div className="poem-page">
      <div className="mx-auto max-w-4xl px-5 py-12 space-y-12">
        <PageTitle
          eyebrow="Community"
          title="커뮤니티"
          description="피드처럼 흐르지 않는, 천천히 모이는 자리. ‘좋아요’ 대신 짧은 한 줄을 건넵니다."
        />

        <section className="rounded-3xl border border-border-soft bg-surface px-5 py-6 md:px-8 md:py-8 grid gap-3 sm:grid-cols-3 text-sm text-text-secondary">
          {[
            { t: "타임라인이 없습니다", d: "정렬은 ‘최근’과 ‘조용히’ 두 가지뿐입니다." },
            { t: "댓글 대신 감상평", d: "한 줄의 응답을 신중히 적습니다." },
            { t: "혐오·자해 표현 자동 검토", d: "운영자 검토 후 게시됩니다." },
          ].map((row) => (
            <div key={row.t}>
              <p className="font-medium text-text-primary">{row.t}</p>
              <p className="mt-1 leading-relaxed">{row.d}</p>
            </div>
          ))}
        </section>

        <Section
          title="최근 이야기"
          description="작가들의 짧은 글, 물음, 나눔."
          action={
            <Link
              href="mailto:hello@sidam.app?subject=시담%20커뮤니티%20글쓰기%20베타%20문의"
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              글쓰기 베타 신청 →
            </Link>
          }
        >
          {posts.length === 0 ? (
            <Card className="p-6">
              <p className="text-sm text-text-secondary">
                아직 글이 없어요. 첫 이야기를 남겨주세요.
              </p>
            </Card>
          ) : (
            <ul className="grid gap-3">
              {posts.map((p) => (
                <li key={p.id}>
                  <Card className="p-5">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <span className="rounded-full bg-accent-soft px-2 py-0.5 text-text-primary">
                        {TYPE_LABEL[p.type] ?? p.type}
                      </span>
                      <span>· {p.author.display_name}</span>
                      <span>· {relativeTimeKo(p.created_at)}</span>
                    </div>
                    <p className="mt-2 font-serif text-lg font-semibold text-text-primary">
                      {p.title}
                    </p>
                    <p className="mt-1 text-sm text-text-secondary line-clamp-3 leading-relaxed">
                      {p.body}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs text-text-secondary">
                      <MessageSquareQuote className="size-3.5" />
                      감상평 {p.reply_count}
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <p className="text-xs text-text-secondary text-center">
          커뮤니티 글쓰기는 베타 단계에서는 운영자 승인 후 노출됩니다.<br />
          신고된 글은 운영자가 24시간 이내에 검토합니다.
        </p>
      </div>
    </div>
  );
}
