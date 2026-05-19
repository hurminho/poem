import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitBetaSignupAction } from "@/lib/beta/actions";

const ROLES = [
  { id: "writer", label: "작가" },
  { id: "reader", label: "독자" },
  { id: "moderator", label: "운영자/모더레이터 후보" },
  { id: "etc", label: "그 외" },
];

export function BetaSignupForm() {
  return (
    <Card className="p-6">
      <form action={submitBetaSignupAction} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="email">이메일 *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">이름 또는 필명</Label>
            <Input id="name" name="name" type="text" placeholder="시담" />
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-text-primary">어떤 자리에서 함께해주시나요?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {ROLES.map((r) => (
              <label
                key={r.id}
                className="flex items-center gap-2 rounded-xl border border-border-soft bg-surface px-3 py-2 text-sm text-text-primary"
              >
                <input
                  type="checkbox"
                  name="roles"
                  value={r.id}
                  className="size-4 accent-[color:var(--accent)]"
                />
                <span>{r.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="space-y-1.5">
          <Label htmlFor="message">한 줄 자기소개 (선택)</Label>
          <Textarea
            id="message"
            name="message"
            rows={3}
            placeholder="저는 오늘 ‘잔잔’한 마음으로 도착했습니다."
          />
        </div>

        <label className="flex items-start gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            name="agree"
            value="on"
            required
            className="mt-1 size-4 accent-[color:var(--accent)]"
          />
          <span>
            개인정보처리방침에 따라 이메일 주소를 베타 운영 목적으로만 보관·사용함에 동의합니다.
          </span>
        </label>

        <div className="flex justify-end gap-2">
          <Button type="submit">베타 신청하기</Button>
        </div>
      </form>
    </Card>
  );
}
