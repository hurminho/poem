import { PrimaryCTA } from "@/components/ui/primary-cta";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <p className="text-xs tracking-[0.3em] text-text-secondary uppercase">404</p>
      <h1 className="mt-3 font-serif text-2xl font-semibold text-text-primary">
        이 자리에 글이 없어요
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        주소를 다시 확인하거나, 다른 방을 둘러보세요.
      </p>
      <div className="mt-6">
        <PrimaryCTA href="/">처음으로</PrimaryCTA>
      </div>
    </div>
  );
}
