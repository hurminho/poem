import { redirect } from "next/navigation";
import { BookForm } from "@/components/book/book-form";
import {
  BookTemplatePicker,
  BookTemplateGuide,
} from "@/components/book/book-template-picker";
import { PageTitle } from "@/components/ui/page-title";
import { getCurrentProfile } from "@/lib/auth/current";
import { isSupabaseConfigured } from "@/lib/supabase/check";
import { getMyPoems } from "@/lib/db/poems";
import { findBookTemplate } from "@/lib/books/templates";

export const metadata = { title: "새 시집" };

interface PageProps {
  searchParams: Promise<{
    notice?: string;
    error?: string;
    template?: string;
  }>;
}

export default async function NewBookPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const profile = await getCurrentProfile();
  if (isSupabaseConfigured() && !profile) redirect("/login?next=/studio/books/new");

  const myPoems = await getMyPoems(profile?.id ?? "");

  // 템플릿이 선택된 경우 BookForm 의 initial 을 채워 사용자가 바로 다듬을 수 있게.
  const template = sp.template ? findBookTemplate(sp.template) : undefined;
  const initial = template
    ? {
        title: template.suggestedTitle,
        description: template.description,
        cover_theme: template.coverTheme,
      }
    : undefined;

  return (
    <div className="space-y-8">
      <PageTitle title="시집 만들기" description="한 권의 작은 책을 천천히 묶어요." />

      <BookTemplatePicker activeSlug={template?.slug ?? null} />

      {template ? <BookTemplateGuide template={template} /> : null}

      <BookForm
        key={template?.slug ?? "blank"}
        myPoems={myPoems}
        authorName={profile?.display_name}
        notice={sp.notice}
        errorMessage={sp.error}
        initial={initial}
      />
    </div>
  );
}
