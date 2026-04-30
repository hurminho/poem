import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <p className="text-xs tracking-[0.3em] text-ink-mute uppercase">404</p>
      <h1 className="mt-3 font-serif text-2xl font-semibold text-ink">
        이 자리에 글이 없어요
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        주소를 다시 확인하거나, 다른 방을 둘러보세요.
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-md bg-ink px-5 text-sm font-medium text-paper hover:bg-ink-soft transition-colors"
        >
          처음으로
        </Link>
      </div>
    </div>
  );
}
