import { LegalDoc } from "@/components/legal/legal-doc";

export const metadata = { title: "저작권 정책" };

export default function CopyrightPage() {
  return (
    <LegalDoc
      eyebrow="Legal · 저작권 정책"
      title="시담 저작권 정책"
      effectiveOn="2026년 5월 9일 (베타)"
      intro="시담은 작가의 권리를 가장 먼저 생각합니다. 모든 콘텐츠의 저작권은 작성한 작가에게 있습니다."
      sections={[
        {
          heading: "작가의 권리",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>회원이 작성한 시·시집·감상평의 저작권은 해당 회원에게 귀속됩니다.</li>
              <li>회사는 서비스 운영 목적의 저장·표시·전송에 한하여 비독점적 라이선스를 가집니다.</li>
              <li>외부 채널 홍보·서비스 소개에 인용 시 회사는 사전 동의를 구합니다.</li>
            </ul>
          ),
        },
        {
          heading: "공개 범위와 라이선스",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>비공개</strong>: 작성자만 열람할 수 있습니다. 어떤 큐레이션·검색에도 노출되지 않습니다.
              </li>
              <li>
                <strong>링크 보유자만</strong>: 링크를 가진 사람만 열람할 수 있으며, 둘러보기/검색에는 노출되지 않습니다.
              </li>
              <li>
                <strong>전체 공개</strong>: 둘러보기·작가 페이지·태그 페이지에 노출될 수 있습니다.
              </li>
              <li>전체 공개 콘텐츠는 ‘마음에 담기’와 ‘감상평’이 가능합니다.</li>
              <li>‘본문 복사 허용’ 옵션을 끈 시는 전체 공개라도 본문 텍스트의 일괄 복사가 제한됩니다.</li>
            </ul>
          ),
        },
        {
          heading: "타인의 저작물 인용",
          body: (
            <p>
              인용 시 인용 부분이 한 편의 일부에 그쳐야 하며, 출처(작가·작품·게재처)를 명시해야 합니다.
              인용 비중이 과도하거나 출처가 불명확한 경우 신고 대상이 됩니다.
            </p>
          ),
        },
        {
          heading: "AI 생성물 표기",
          body: (
            <p>
              생성형 AI를 활용해 작성한 시는 시 작성 화면의 ‘AI 보조 사용’ 표기를 통해 밝혀주세요.
              표기 없이 AI 생성물을 자작으로 게시하는 행위는 가이드라인 위반입니다.
            </p>
          ),
        },
        {
          heading: "권리 침해 신고 (Notice & Takedown)",
          body: (
            <p>
              자신의 저작권을 침해하는 콘텐츠를 발견하셨다면 hello@sidam.app 으로 신고해 주세요.
              회사는 신고 접수 후 24시간 내 검토하고, 명백한 침해의 경우 즉시 비공개 처리합니다.
            </p>
          ),
        },
      ]}
    />
  );
}
