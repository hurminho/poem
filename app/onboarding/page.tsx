import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/ui/page-title";

export const metadata = { title: "프로필 만들기" };

const INTERESTS = ["사랑", "이별", "겨울", "밤", "일상", "기억", "여행", "가족", "위로"];

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12 space-y-8">
      <PageTitle
        eyebrow="처음이라"
        title="작은 작업실 꾸미기"
        description="작가의 이름과 한 줄 소개부터 천천히 적어볼까요?"
      />

      <Card className="p-6">
        <form className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="display_name">필명 (작가 이름)</Label>
              <Input id="display_name" name="display_name" placeholder="예) 윤지원" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username">사용자 이름</Label>
              <Input id="username" name="username" placeholder="예) jiwon" required />
              <p className="text-xs text-text-secondary">영문 소문자·숫자·언더스코어</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">한 줄 소개 (선택)</Label>
            <Textarea id="bio" name="bio" rows={3} placeholder="조용한 문장들을 좋아합니다." />
          </div>

          <div className="space-y-1.5">
            <Label>관심 (선택)</Label>
            <div className="flex flex-wrap gap-1.5">
              {INTERESTS.map((tag) => (
                <label
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border-soft bg-surface px-3 py-1 text-xs cursor-pointer has-[:checked]:bg-text-primary has-[:checked]:text-background has-[:checked]:border-text-primary"
                >
                  <input type="checkbox" name="interests" value={tag} className="hidden" />
                  #{tag}
                </label>
              ))}
            </div>
            <p className="text-xs text-text-secondary">이 정보는 둘러보기 추천에 잔잔하게 반영됩니다.</p>
          </div>

          <hr className="divider" />
          <Button type="submit" className="w-full">시작하기</Button>
        </form>
      </Card>
    </div>
  );
}
