import { LegalDoc } from "@/components/legal/legal-doc";

export const metadata = { title: "커뮤니티 가이드라인" };

export default function CommunityGuidelinesPage() {
  return (
    <LegalDoc
      eyebrow="Legal · 커뮤니티 가이드라인"
      title="시담 커뮤니티 가이드라인"
      effectiveOn="2026년 5월 9일 (베타)"
      intro="시담은 빠른 피드 대신 ‘조용히 모이는 자리’를 지향합니다. 다음의 가이드라인은 작가와 독자가 서로의 글에 머무를 수 있는 최소한의 약속입니다."
      sections={[
        {
          heading: "환영하는 분위기",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>다른 사람의 글에 처음 도착할 때, 짧은 한 줄을 신중히 적습니다.</li>
              <li>‘좋아요’보다 ‘오래 머문 한 줄’을 권합니다.</li>
              <li>창작 의도와 다른 해석은 가능하나, 작가의 인격을 평가하지 않습니다.</li>
            </ul>
          ),
        },
        {
          heading: "허용되지 않는 행위",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>혐오 표현, 모욕, 성적 비하, 인종·성별·종교·장애 차별</li>
              <li>자살·자해 조장 또는 구체적 방법 묘사</li>
              <li>스팸, 광고, 외부 사이트 무관한 링크 도배</li>
              <li>실제 인물의 사생활 노출, 동의 없는 신상 공개</li>
              <li>저작권 침해, 출처 없는 인용, AI 생성물의 자작 표기</li>
              <li>미성년자에게 부적절한 콘텐츠</li>
            </ul>
          ),
        },
        {
          heading: "모더레이션 단계",
          body: (
            <ol className="list-decimal pl-5 space-y-1">
              <li>자동 검토: 자해·혐오 표현 키워드는 등록 전 자동 검토 큐로 이동</li>
              <li>운영자 검토: 24시간 이내 운영자가 정상 / 비공개 / 검토 중으로 분류</li>
              <li>작성자 통지: 비공개 처리 시 사유와 함께 알림 전송</li>
              <li>이의 신청: hello@sidam.app 으로 회신해 재검토 요청 가능</li>
            </ol>
          ),
        },
        {
          heading: "조치 단계",
          body: (
            <ul className="list-disc pl-5 space-y-1">
              <li>1차: 게시글 비공개 처리 + 사유 안내</li>
              <li>2차: 7일간 게시 제한</li>
              <li>3차 또는 중대 위반: 영구 이용 제한 및 계정 비활성화</li>
            </ul>
          ),
        },
        {
          heading: "도움이 필요한 분께",
          body: (
            <p>
              자해·자살에 관련된 어려움을 겪고 계시다면 한국생명의전화 1588-9191 또는 자살예방상담전화 1393으로
              도움을 받으실 수 있습니다. 시담 운영팀도 hello@sidam.app 으로 연락해 주시면 조용히 들어드립니다.
            </p>
          ),
        },
      ]}
    />
  );
}
