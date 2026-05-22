/** 배포·OG·sitemap 에 쓰는 공개 사이트 URL */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw).origin;
    } catch {
      /* fall through */
    }
  }
  return "https://sidam.space";
}
