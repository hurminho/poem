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
import { getDictionary } from "@/lib/i18n/dictionaries";

const t = getDictionary("en").studio.bookNew;

export const metadata = { title: t.metaTitle };

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
  if (isSupabaseConfigured() && !profile) redirect("/en/login?next=/en/studio/books/new");

  const myPoems = await getMyPoems(profile?.id ?? "");

  const template = sp.template ? findBookTemplate(sp.template, "en") : undefined;
  const initial = template
    ? {
        title: template.suggestedTitle,
        description: template.description,
        cover_theme: template.coverTheme,
      }
    : undefined;

  return (
    <div className="space-y-8">
      <PageTitle title={t.title} description={t.desc} />

      <BookTemplatePicker activeSlug={template?.slug ?? null} lang="en" />

      {template ? <BookTemplateGuide template={template} lang="en" /> : null}

      <BookForm
        key={template?.slug ?? "blank"}
        lang="en"
        myPoems={myPoems}
        authorName={profile?.display_name}
        notice={sp.notice}
        errorMessage={sp.error}
        initial={initial}
      />
    </div>
  );
}
