"use client";

import * as React from "react";
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

      {error && <p className="text-sm text-[color:#a85a4a]">{error}</p>}

      <Button
        type="submit"
        className="w-full"
        disabled={
          passwordMismatch ||
          password.length < 8 ||
          !displayName.trim() ||
          nameState === "taken" ||
          nameState === "checking"
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
