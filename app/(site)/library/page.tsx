import { redirect } from "next/navigation";
import { PageTitle } from "@/components/ui/page-title";
import { LibraryTabs, type LibraryTabId } from "@/components/saves/library-tabs";
import { SavedBooksList } from "@/components/saves/saved-books-list";
import { SavedPoemsList } from "@/components/saves/saved-poems-list";
import { SavedHighlightsList } from "@/components/saves/saved-highlights-list";
import { LikedPoemsList } from "@/components/reactions/liked-poems-list";
import { getCurrentProfile } from "@/lib/auth/current";
import { getSavedBooks, getSavedPoems } from "@/lib/db/saves";
import { getLikedPoems } from "@/lib/db/reactions";

export const metadata = { title: "내 서재" };

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function LibraryPage({ searchParams }: PageProps) {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login?next=/library");
  }

  const sp = await searchParams;
  const tab: LibraryTabId =
    sp.tab === "poems" ||
    sp.tab === "highlights" ||
    sp.tab === "liked"
      ? sp.tab
      : "books";

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 space-y-10">
      <PageTitle
        eyebrow="Library"
        title="내 서재"
        description="마음에 담아둔 시집과 시, 좋아한 시와 구절을 모아둡니다."
      />

      <LibraryTabs active={tab} />

      {tab === "books" && <SavedBooksList items={await getSavedBooks(profile.id)} />}
      {tab === "poems" && <SavedPoemsList items={await getSavedPoems(profile.id)} />}
      {tab === "liked" && <LikedPoemsList items={await getLikedPoems(profile.id)} />}
      {tab === "highlights" && <SavedHighlightsList />}
    </div>
  );
}
