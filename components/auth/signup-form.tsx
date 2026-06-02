"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  signUpAction,
  checkDisplayNameAvailableAction,
} from "@/lib/auth/actions";

interface SignupFormProps {
  error?: string;
}

type NameState = "idle" | "checking" | "available" | "taken" | "invalid";

/**
 * 회원가입 폼.
 * - 필명(작가 이름) 중복 확인 (서버 액션 호출)
 * - 비밀번호 2회 입력 검증 (실시간 + 서버)
 */
export function SignupForm({ error }: SignupFormProps) {
  const [displayName, setDisplayName] = React.useState("");
  const [nameState, setNameState] = React.useState<NameState>("idle");
  const [nameMsg, setNameMsg] = React.useState<string | null>(null);

  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");

  const [agreeAge14, setAgreeAge14] = React.useState(false);
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [agreePrivacy, setAgreePrivacy] = React.useState(false);

  const allAgreed = agreeAge14 && agreeTerms && agreePrivacy;
  function toggleAll(next: boolean) {
    setAgreeAge14(next);
    setAgreeTerms(next);
    setAgreePrivacy(next);
  }

  const passwordMismatch =
    passwordConfirm.length > 0 && password !== passwordConfirm;

  React.useEffect(() => {
    setNameState("idle");
    setNameMsg(null);
  }, [displayName]);

  async function checkName() {
    const name = displayName.trim();
    if (!name) {
      setNameState("invalid");
      setNameMsg("필명을 입력해주세요.");
      return;
    }
    setNameState("checking");
    setNameMsg(null);
    const res = await checkDisplayNameAvailableAction(name);
    if (res.available) {
      setNameState("available");
      setNameMsg("사용할 수 있는 필명이에요.");
    } else {
      setNameState("taken");
      setNameMsg(res.reason ?? "이미 사용 중인 필명입니다.");
    }
  }

  return (
    <form action={signUpAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="display_name">필명 (작가 이름)</Label>
        <div className="flex gap-2">
          <Input
            id="display_name"
            name="display_name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="예) 윤지원"
            required
            maxLength={30}
            autoComplete="nickname"
            className="flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={checkName}
            disabled={nameState === "checking" || !displayName.trim()}
            className="shrink-0"
          >
            {nameState === "checking" ? "확인 중…" : "중복 확인"}
          </Button>
        </div>
        {nameMsg ? (
          <p
            className={
              "text-xs " +
              (nameState === "available"
                ? "text-[color:var(--ink-forest)]"
                : "text-[color:#a85a4a]")
            }
          >
            {nameMsg}
          </p>
        ) : (
          <p className="text-xs text-text-secondary">
            시담에서 글을 발표할 때 보이는 이름입니다. 가입 후에도 변경할 수 있어요.
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-xs text-text-secondary">8자 이상</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password_confirm">비밀번호 확인</Label>
        <Input
          id="password_confirm"
          name="password_confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          aria-invalid={passwordMismatch || undefined}
        />
        {passwordMismatch ? (
          <p className="text-xs text-[color:#a85a4a]">
            비밀번호가 일치하지 않습니다.
          </p>
        ) : null}
      </div>

      <div className="space-y-2 rounded-lg border border-border-soft bg-[color:var(--paper-soft,#faf7f1)]/60 p-3">
        <label className="flex items-center gap-2 text-sm font-medium text-text-primary cursor-pointer select-none">
          <input
            type="checkbox"
            checked={allAgreed}
            onChange={(e) => toggleAll(e.target.checked)}
            className="h-4 w-4 rounded border-border-soft accent-[color:var(--ink-forest)]"
          />
          전체 동의
        </label>

        <hr className="border-border-soft" />

        <label className="flex items-start gap-2 text-sm text-text-secondary cursor-pointer select-none">
          <input
            type="checkbox"
            name="agree_age_14"
            checked={agreeAge14}
            onChange={(e) => setAgreeAge14(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border-soft accent-[color:var(--ink-forest)]"
            required
          />
          <span>
            <span className="text-[color:#a85a4a]">[필수]</span>{" "}
            만 14세 이상입니다.
          </span>
        </label>

        <label className="flex items-start gap-2 text-sm text-text-secondary cursor-pointer select-none">
          <input
            type="checkbox"
            name="agree_terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border-soft accent-[color:var(--ink-forest)]"
            required
          />
          <span>
            <span className="text-[color:#a85a4a]">[필수]</span>{" "}
            <Link
              href="/legal/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary underline underline-offset-4"
            >
              시담 이용약관
            </Link>
            에 동의합니다.
          </span>
        </label>

        <label className="flex items-start gap-2 text-sm text-text-secondary cursor-pointer select-none">
          <input
            type="checkbox"
            name="agree_privacy"
            checked={agreePrivacy}
            onChange={(e) => setAgreePrivacy(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-border-soft accent-[color:var(--ink-forest)]"
            required
          />
          <span>
            <span className="text-[color:#a85a4a]">[필수]</span>{" "}
            <Link
              href="/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary underline underline-offset-4"
            >
              개인정보 처리방침
            </Link>
            에 동의합니다.
          </span>
        </label>
      </div>

      {error && <p className="text-sm text-[color:#a85a4a]">{error}</p>}

      <Button
        type="submit"
        className="w-full"
        disabled={
          passwordMismatch ||
          password.length < 8 ||
          !displayName.trim() ||
          nameState === "taken" ||
          nameState === "checking" ||
          !allAgreed
        }
      >
        가입하기
      </Button>

      {nameState === "idle" && displayName.trim().length > 0 ? (
        <p className="text-xs text-text-secondary text-center">
          ※ 가입 전 ‘중복 확인’을 한 번 눌러주세요.
        </p>
      ) : null}
    </form>
  );
}
