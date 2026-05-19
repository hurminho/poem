import { LegalDoc } from "@/components/legal/legal-doc";

export const metadata = { title: "개인정보처리방침" };

export default function PrivacyPage() {
  return (
    <LegalDoc
      eyebrow="Legal · 개인정보처리방침"
      title="시담 개인정보처리방침"
      effectiveOn="2026년 5월 9일 (베타)"
      intro="시담은 이용자의 개인정보를 소중히 여기며, 관련 법령(개인정보 보호법, 정보통신망법 등)에 따라 개인정보를 처리합니다."
      sections={[
        {
          heading: "수집하는 개인정보 항목",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>필수: 이메일, 비밀번호 해시, 표시 이름, 사용자명</li>
              <li>선택: 자기소개, 프로필 이미지</li>
              <li>자동 수집: 접속 로그, 기기 정보, 쿠키, 서비스 이용 기록</li>
            </ul>
          ),
        },
        {
          heading: "수집 및 이용 목적",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>회원 식별 및 인증, 부정 이용 방지</li>
              <li>시·시집·감상평·시 명상 등 서비스 제공</li>
              <li>운영자 모더레이션 및 신고 처리</li>
              <li>서비스 개선을 위한 통계 분석 (식별 불가 형태)</li>
            </ul>
          ),
        },
        {
          heading: "보유 및 이용 기간",
          body: (
            <p>
              회원 탈퇴 시 즉시 파기하며, 단 관계 법령(전자상거래법 등)이 정한 기간 동안 보존이
              필요한 경우 해당 기간 동안만 보관합니다.
            </p>
          ),
        },
        {
          heading: "제3자 제공",
          body: (
            <p>
              회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 단, 법령에 따라 요구되는
              경우는 예외로 합니다.
            </p>
          ),
        },
        {
          heading: "처리 위탁",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>인증·데이터베이스: Supabase (Amazon Web Services 인프라)</li>
              <li>이메일 발송: 정식 출시 단계에서 별도 고지</li>
            </ul>
          ),
        },
        {
          heading: "이용자의 권리",
          body: (
            <p>
              이용자는 언제든지 자신의 개인정보 열람·정정·삭제·처리 정지를 요청할 수 있습니다.
              계정 삭제 시 작성한 콘텐츠는 함께 비공개 처리됩니다.
            </p>
          ),
        },
        {
          heading: "안전성 확보 조치",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>HTTPS 전 구간 암호화 통신</li>
              <li>비밀번호 해시 저장, Row Level Security를 통한 접근 통제</li>
              <li>운영자 작업의 감사 로그(audit log) 기록</li>
            </ul>
          ),
        },
        {
          heading: "개인정보 보호 책임자",
          body: (
            <p>
              hello@sidam.app 으로 문의 주시면 영업일 기준 3일 이내에 답변드립니다.
            </p>
          ),
        },
      ]}
    />
  );
}
