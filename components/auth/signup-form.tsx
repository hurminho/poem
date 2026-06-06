"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  signUpAction,
  checkDisplayNameAvailableAction,
} from "@/lib/auth/actions";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

interface SignupFormProps {
  error?: string;
  lang?: Locale;
}

type NameState = "idle" | "checking" | "available" | "taken" | "invalid";

/**
 * 회원가입 폼.
 * - 필명(작가 이름) 중복 확인 (서버 액션 호출)
 * - 비밀번호 2회 입력 검증 (실시간 + 서버)
 * - lang 으로 한/영 카피 전환 (서버 액션/필드명은 동일)
 */
export function SignupForm({ error, lang = "ko" }: SignupFormProps) {
  const t = getDictionary(lang).auth.signup;
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

  // 제출 시 클라이언트 검증 — 버튼을 비활성화하는 대신, 무엇이 부족한지 알려줍니다.
  const [clientError, setClientError] = React.useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!displayName.trim()) {
      e.preventDefault();
      setClientError(t.needName);
      return;
    }
    if (password.length < 8) {
      e.preventDefault();
      setClientError(t.needPassword);
      return;
    }
    if (password !== passwordConfirm) {
      e.preventDefault();
      setClientError(t.passwordMismatch);
      return;
    }
    if (!allAgreed) {
      e.preventDefault();
      setClientError(t.needAgree);
      return;
    }
    if (nameState === "taken") {
      e.preventDefault();
      setClientError(nameMsg ?? t.nameTaken);
      return;
    }
    // 통과 — 서버 액션(signUpAction)이 실행되어 /onboarding 으로 이동합니다.
    setClientError(null);
  }

  React.useEffect(() => {
    setNameState("idle");
    setNameMsg(null);
  }, [displayName]);

  async function checkName() {
    const name = displayName.trim();
    if (!name) {
      setNameState("invalid");
      setNameMsg(t.nameEmpty);
      return;
    }
    setNameState("checking");
    setNameMsg(null);
    const res = await checkDisplayNameAvailableAction(name);
    if (res.available) {
      setNameState("available");
      setNameMsg(t.nameAvailable);
    } else {
      setNameState("taken");
      setNameMsg(res.reason ?? t.nameTaken);
    }
  }

  return (
    <form action={signUpAction} onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="locale" value={lang} />
      <div className="space-y-1.5">
        <Label htmlFor="display_name">{t.displayName}</Label>
        <div className="flex gap-2">
          <Input
            id="display_name"
            name="display_name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={t.displayNamePlaceholder}
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
            {nameState === "checking" ? t.checking : t.checkDup}
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
          <p className="text-xs text-text-secondary">{t.displayNameHelp}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">{t.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">{t.password}</Label>
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
        <p className="text-xs text-text-secondary">{t.passwordHelp}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password_confirm">{t.passwordConfirm}</Label>
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
          <p className="text-xs text-[color:#a85a4a]">{t.passwordMismatch}</p>
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
          {t.agreeAll}
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
            <span className="text-[color:#a85a4a]">{t.required}</span>{" "}
            {t.age14}
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
            <span className="text-[color:#a85a4a]">{t.required}</span>{" "}
            {t.agreeTermsPrefix}
            <Link
              href="/legal/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary underline underline-offset-4"
            >
              {t.termsLink}
            </Link>
            {t.agreeTermsSuffix}
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
            <span className="text-[color:#a85a4a]">{t.required}</span>{" "}
            {t.agreePrivacyPrefix}
            <Link
              href="/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-primary underline underline-offset-4"
            >
              {t.privacyLink}
            </Link>
            {t.agreePrivacySuffix}
          </span>
        </label>
      </div>

      {(clientError || error) && (
        <p className="text-sm text-[color:#a85a4a]">{clientError ?? error}</p>
      )}

      <SubmitButton label={t.submit} pendingLabel={t.submitting} />

      {nameState === "idle" && displayName.trim().length > 0 ? (
        <p className="text-xs text-text-secondary text-center">
          {t.checkFirstHint}
        </p>
      ) : null}
    </form>
  );
}

/**
 * 제출 버튼 — 항상 누를 수 있고(검증은 onSubmit/서버에서),
 * 전송 중에만 비활성화하며 진행 상태를 보여줍니다.
 */
function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending} aria-busy={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}
