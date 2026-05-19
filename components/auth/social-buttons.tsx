import Link from "next/link";

interface SocialButtonsProps {
  /** 로그인 후 돌아갈 경로 (예: /studio) */
  next?: string;
  /** 라벨을 '시작하기' / '로그인' 중 어느 톤으로 보여줄지 */
  variant?: "login" | "signup";
}

const PROVIDERS: Array<{
  id: "kakao" | "google" | "apple";
  label: string;
  icon: React.ReactNode;
  className: string;
}> = [
  {
    id: "kakao",
    label: "카카오",
    className:
      "bg-[#FEE500] text-[#191600] hover:brightness-95 border border-[#E6CF00]/40",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        aria-hidden
        fill="currentColor"
      >
        <path d="M12 3C6.477 3 2 6.51 2 10.84c0 2.78 1.84 5.22 4.65 6.62-.2.74-.74 2.75-.85 3.18-.13.52.19.51.4.37.16-.11 2.62-1.77 3.68-2.49.7.1 1.42.16 2.12.16 5.523 0 10-3.51 10-7.84S17.523 3 12 3Z" />
      </svg>
    ),
  },
  {
    id: "google",
    label: "구글",
    className:
      "bg-white text-[#1f1f1f] hover:bg-neutral-50 border border-black/10",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
        <path
          fill="#4285F4"
          d="M21.6 12.227c0-.708-.064-1.39-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.995 3.018v2.51h3.226c1.886-1.737 2.987-4.296 2.987-7.351z"
        />
        <path
          fill="#34A853"
          d="M12 22c2.7 0 4.963-.895 6.617-2.422l-3.226-2.51c-.895.6-2.04.955-3.39.955-2.604 0-4.81-1.76-5.6-4.124H2.985v2.59A9.997 9.997 0 0 0 12 22z"
        />
        <path
          fill="#FBBC05"
          d="M6.4 13.9a6.005 6.005 0 0 1 0-3.8V7.51H2.985a9.99 9.99 0 0 0 0 8.98L6.4 13.9z"
        />
        <path
          fill="#EA4335"
          d="M12 5.977c1.468 0 2.786.504 3.824 1.495l2.866-2.866C16.96 3.118 14.696 2.2 12 2.2A9.997 9.997 0 0 0 2.985 7.51L6.4 10.1c.79-2.364 2.996-4.123 5.6-4.123z"
        />
      </svg>
    ),
  },
  {
    id: "apple",
    label: "Apple",
    className:
      "bg-[#0f0f0f] text-white hover:bg-black border border-black",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="currentColor">
        <path d="M16.365 12.62c-.018-2.06 1.685-3.05 1.762-3.097-.96-1.4-2.456-1.592-2.99-1.613-1.273-.13-2.49.75-3.137.75-.65 0-1.65-.732-2.717-.71-1.398.02-2.687.812-3.402 2.062-1.45 2.51-.37 6.226 1.04 8.267.69 1 1.51 2.118 2.585 2.078 1.043-.043 1.438-.673 2.696-.673 1.257 0 1.611.673 2.714.65 1.122-.02 1.83-1.013 2.514-2.018.79-1.155 1.115-2.272 1.135-2.328-.024-.012-2.17-.83-2.19-3.298Zm-2.1-6.06c.575-.7.962-1.668.857-2.638-.83.035-1.836.553-2.43 1.247-.53.612-1 1.59-.872 2.538.928.07 1.873-.466 2.444-1.146Z" />
      </svg>
    ),
  },
];

export function SocialButtons({ next = "/studio", variant = "login" }: SocialButtonsProps) {
  const nextQs = `?next=${encodeURIComponent(next)}`;
  const verb = variant === "signup" ? "로 시작하기" : "로 계속하기";

  return (
    <div className="space-y-2">
      {PROVIDERS.map((p) => (
        <Link
          key={p.id}
          href={`/api/auth/oauth/${p.id}${nextQs}`}
          className={
            "inline-flex w-full h-11 items-center justify-center gap-2.5 rounded-full text-sm font-medium transition-colors " +
            p.className
          }
        >
          {p.icon}
          <span>
            {p.label}
            {verb}
          </span>
        </Link>
      ))}
      <p className="text-center text-[11px] text-text-secondary leading-relaxed pt-1">
        소셜 로그인은 베타 단계에서 Supabase Auth 의 동의된 정보만 사용합니다.
      </p>
    </div>
  );
}
