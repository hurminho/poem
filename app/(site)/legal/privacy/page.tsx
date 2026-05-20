import { LegalDoc } from "@/components/legal/legal-doc";

export const metadata = { title: "개인정보처리방침" };

export default function PrivacyPage() {
  return (
    <LegalDoc
      eyebrow="Legal · 개인정보처리방침"
      title="시담 개인정보처리방침"
      effectiveOn="2026년 5월 21일 (베타 시행)"
      intro="시담(Sidam, sidam.space, 이하 ‘서비스’)은 이용자의 개인정보를 소중히 여기며, 「개인정보 보호법」·「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수합니다. 본 방침은 시담이 어떤 정보를 어떻게 수집·이용·보관·파기하는지 안내합니다."
      sections={[
        {
          heading: "수집하는 개인정보 항목",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>필수 (이메일 가입):</strong> 이메일, 비밀번호 해시, 표시 이름, 사용자명(@username)
              </li>
              <li>
                <strong>필수 (소셜 가입 — 카카오 / 구글):</strong> 해당 공급자가 제공하는 이메일·프로필
                닉네임·고유 식별자 (사용자 동의 범위 내에서만)
              </li>
              <li>
                <strong>선택:</strong> 자기소개(bio), 프로필 이미지, 작가 페이지 설정
              </li>
              <li>
                <strong>이용자 작성 콘텐츠:</strong> 시·시집·감상평·마음 기록·커뮤니티 글
                (서비스 제공 자체가 목적)
              </li>
              <li>
                <strong>자동 수집:</strong> 접속 IP, User-Agent, 접속 일시, 쿠키, 서비스 이용 기록
                (오용 방지·통계용)
              </li>
            </ul>
          ),
        },
        {
          heading: "수집 및 이용 목적",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>회원 식별 및 인증, 부정 이용 방지</li>
              <li>시·시집·감상평·시 명상·챌린지·커뮤니티 등 서비스 제공</li>
              <li>운영자 모더레이션 및 신고 처리, 감사 로그 기록</li>
              <li>서비스 개선·통계 분석 (개인 식별이 불가능한 형태로 가공)</li>
              <li>중요 공지·약관 변경 안내 (선택 동의 시 마케팅성 안내)</li>
            </ul>
          ),
        },
        {
          heading: "소셜 로그인 시 수집 정보 (카카오 / 구글)",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>카카오: 프로필 닉네임, 카카오계정(이메일) — 회원 식별·중복 가입 방지 용도</li>
              <li>구글: 이메일, 이름 (OpenID/email/profile 범위) — 회원 식별·중복 가입 방지 용도</li>
              <li>소셜 공급자의 식별자(Provider ID) 및 인증 토큰은 인증 처리 후 안전하게 폐기됩니다.</li>
            </ul>
          ),
        },
        {
          heading: "보유 및 이용 기간",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>회원 정보: 회원 탈퇴 시까지 — 탈퇴 즉시 파기. 단, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안만 보관합니다.</li>
              <li>관계 법령에 따른 보존 예시: 부정 이용 기록 1년, 접속 로그 3개월(통신비밀보호법), 전자상거래 계약·결제 기록(향후 유료화 시) 5년 등.</li>
              <li>감사 로그(audit log): 운영의 투명성을 위해 최소 1년 보관 후 파기.</li>
            </ul>
          ),
        },
        {
          heading: "개인정보의 제3자 제공",
          body: (
            <p>
              서비스는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 따라
              수사기관·법원의 적법한 절차에 의한 요청이 있는 경우에는 예외로 합니다.
            </p>
          ),
        },
        {
          heading: "처리 위탁",
          body: (
            <div className="space-y-2">
              <p>서비스는 다음의 외부 처리자에게 개인정보의 일부 처리를 위탁하고 있습니다.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>호스팅·전송:</strong> Vercel Inc. (애플리케이션 호스팅 및 콘텐츠 전송망)
                </li>
                <li>
                  <strong>인증·데이터베이스·파일 저장:</strong> Supabase Inc. (AWS 인프라 기반)
                </li>
                <li>
                  <strong>소셜 로그인:</strong> Kakao Corp., Google LLC (이용자가 선택한 경우에만)
                </li>
                <li>
                  <strong>도메인 등록:</strong> Porkbun LLC
                </li>
              </ul>
              <p className="text-xs text-text-secondary">
                위탁처는 서비스 운영을 위해 필요한 최소한의 정보만 처리하며, 위탁 계약상 비밀유지·재위탁 금지·
                안전성 확보 의무를 부담합니다.
              </p>
            </div>
          ),
        },
        {
          heading: "국외 이전",
          body: (
            <p>
              위 처리 위탁의 일부는 미국 등 국외 서버에서 이루어질 수 있습니다. 이는 글로벌 인프라(Vercel,
              Supabase, Google 등)를 통한 서비스 제공을 위한 것이며, 관계 법령에서 요구하는 보호조치를 따릅니다.
            </p>
          ),
        },
        {
          heading: "이용자의 권리",
          body: (
            <p>
              이용자는 언제든지 자신의 개인정보 열람·정정·삭제·처리 정지·동의 철회를 요청할 수 있습니다.
              마이페이지 → 설정에서 직접 처리하거나, 아래 문의처로 요청해 주시면 지체 없이 처리합니다. 계정
              삭제 시 작성한 콘텐츠는 비공개 처리 후 백업 보관 기간이 끝나면 영구 삭제됩니다.
            </p>
          ),
        },
        {
          heading: "쿠키 등의 사용",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>로그인 세션 유지, 로그아웃 상태 기억, 다크/라이트 테마 등 환경 설정을 위해 쿠키를 사용합니다.</li>
              <li>이용자는 브라우저 설정에서 쿠키 저장을 거부할 수 있으나, 그 경우 일부 기능 이용에 제한이 있을 수 있습니다.</li>
            </ul>
          ),
        },
        {
          heading: "안전성 확보 조치",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>HTTPS 전 구간 암호화 통신</li>
              <li>비밀번호는 일방향 해시(bcrypt 등)로 저장</li>
              <li>Row Level Security(RLS) 정책을 통한 접근 통제</li>
              <li>운영자 콘솔 접근 권한 분리(super_admin/content_admin/moderator/curator/support)</li>
              <li>운영자 작업의 감사 로그(audit log) 기록 및 정기 점검</li>
            </ul>
          ),
        },
        {
          heading: "만 14세 미만 아동의 개인정보",
          body: (
            <p>
              서비스는 만 14세 미만 아동의 회원가입을 허용하지 않습니다. 만 14세 미만의 정보가 수집된 사실이
              확인되면 즉시 파기합니다.
            </p>
          ),
        },
        {
          heading: "개인정보 보호 책임자 · 문의처",
          body: (
            <p>
              개인정보 관련 문의·열람·정정·삭제·처리 정지 요청은 아래로 보내주시면 영업일 기준 3일 이내에
              답변드립니다.
              <br />
              · 이메일: <a href="mailto:hello@sidam.app" className="underline">hello@sidam.app</a>
              <br />
              · 도메인: <a href="https://sidam.space" className="underline">https://sidam.space</a>
            </p>
          ),
        },
        {
          heading: "변경 고지",
          body: (
            <p>
              본 방침은 법령·서비스 변경에 따라 갱신될 수 있습니다. 변경 시 시행일 7일 전(중요 변경은 30일 전)에
              서비스 내 공지 또는 이메일로 안내합니다.
            </p>
          ),
        },
      ]}
    />
  );
}
