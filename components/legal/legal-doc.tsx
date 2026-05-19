import * as React from "react";
import Link from "next/link";
import { PageTitle } from "@/components/ui/page-title";

interface LegalDocProps {
  eyebrow: string;
  title: string;
  effectiveOn: string;
  intro?: string;
  sections: { heading: string; body: React.ReactNode }[];
}

const RELATED = [
  { href: "/legal/terms", label: "이용약관" },
  { href: "/legal/privacy", label: "개인정보처리방침" },
  { href: "/legal/copyright", label: "저작권 정책" },
  { href: "/legal/community", label: "커뮤니티 가이드라인" },
];

export function LegalDoc({ eyebrow, title, effectiveOn, intro, sections }: LegalDocProps) {
  return (
    <div className="poem-page">
      <div className="mx-auto max-w-3xl px-5 py-12 space-y-10">
        <PageTitle eyebrow={eyebrow} title={title} description={`시행일 · ${effectiveOn}`} />
        {intro ? (
          <p className="text-sm text-text-secondary leading-relaxed">{intro}</p>
        ) : null}

        <div className="rounded-2xl border border-dashed border-border-soft bg-surface px-5 py-4 text-xs text-text-secondary">
          본 문서는 베타 단계의 <strong className="text-text-primary">잠정안(placeholder)</strong>입니다.
          정식 약관은 정식 출시 시 법무 검토 후 갱신됩니다.
        </div>

        <article className="space-y-8">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="font-serif text-lg font-semibold text-text-primary">
                제{i + 1}조 · {s.heading}
              </h2>
              <div className="mt-2 text-sm text-text-primary leading-relaxed space-y-2">
                {s.body}
              </div>
            </section>
          ))}
        </article>

        <hr className="divider" />

        <nav aria-label="관련 문서" className="text-sm flex flex-wrap gap-x-4 gap-y-1.5 text-text-secondary">
          {RELATED.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-text-primary">
              {l.label}
            </Link>
          ))}
          <a
            href="mailto:hello@sidam.app"
            className="ml-auto hover:text-text-primary"
          >
            문의 · hello@sidam.app
          </a>
        </nav>
      </div>
    </div>
  );
}
