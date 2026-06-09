import { redirect } from "next/navigation";
import { PageTitle } from "@/components/ui/page-title";
import { LibraryTabs, type LibraryTabId } from "@/components/saves/library-tabs";
import { SavedBooksList } from "@/components/saves/saved-books-list";
import { SavedHighlightsList } from "@/components/saves/saved-highlights-list";
import { LikedPoemsList } from "@/components/reactions/liked-poems-list";
import { getCurrentProfile } from "@/lib/auth/current";
import { getSavedBooks } from "@/lib/db/saves";
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
  // ‘저장한 시’ 탭은 ‘좋아한 시’로 통합 — 기본 탭이 liked 가 되었습니다.
  // (saves/saved-poems-list 컴포넌트는 보존 — 추후 별도 자리에서 재사용 가능)
  const tab: LibraryTabId =
    sp.tab === "books" || sp.tab === "highlights" ? sp.tab : "liked";

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 space-y-10">
      <PageTitle
        eyebrow="Library"
        title="내 서재"
        description="좋아한 시와 담아둔 시집, 구절을 모아둡니다."
      />

      <LibraryTabs active={tab} />

      {tab === "liked" && <LikedPoemsList items={await getLikedPoems(profile.id)} />}
      {tab === "books" && <SavedBooksList items={await getSavedBooks(profile.id)} />}
      {tab === "highlights" && <SavedHighlightsList />}
    </div>
  );
}
