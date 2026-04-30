export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border-soft/80 py-8">
      <div className="mx-auto max-w-5xl px-5 flex flex-col gap-1 text-xs text-text-secondary">
        <p className="font-serif text-sm text-text-primary">포엠 — 작은 문학의 방</p>
        <p>© {new Date().getFullYear()} 포엠 · 시는 천천히 도착합니다.</p>
      </div>
    </footer>
  );
}
