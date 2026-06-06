"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/check";

const USERNAME_RE = /^[a-z0-9_]{2,30}$/;

function sanitizeUsername(raw: string): string | null {
  const v = raw.trim().toLowerCase();
  if (!v) return null;
  if (!USERNAME_RE.test(v)) {
    throw new Error("사용자 이름은 영문 소문자·숫자·언더스코어 2~30자로 입력해주세요.");
  }
  return v;
}

export async function saveOnboardingAction(formData: FormData) {
  const isEn = String(formData.get("locale") || "") === "en";
  const base = isEn ? "/en" : "";
  const onboardingPath = `${base}/onboarding`;
  const m = isEn
    ? {
        notConfigured: "Supabase environment variables are not configured.",
        nameRequired: "Please enter a pen name.",
        usernameTaken: "That username is already taken.",
        usernameFormat:
          "Use lowercase letters, numbers and underscores, 2–30 characters.",
      }
    : {
        notConfigured: "Supabase 환경변수가 설정되지 않았습니다.",
        nameRequired: "필명을 입력해주세요.",
        usernameTaken: "이미 사용 중인 사용자 이름입니다.",
        usernameFormat:
          "사용자 이름은 영문 소문자·숫자·언더스코어 2~30자로 입력해주세요.",
      };

  if (!isSupabaseConfigured()) {
    redirect(onboardingPath + "?error=" + encodeURIComponent(m.notConfigured));
  }

  const display_name = String(formData.get("display_name") || "").trim();
  const usernameRaw = String(formData.get("username") || "");
  const bio = String(formData.get("bio") || "").trim();

  if (!display_name) {
    redirect(onboardingPath + "?error=" + encodeURIComponent(m.nameRequired));
  }

  let username: string | null;
  try {
    username = sanitizeUsername(usernameRaw);
  } catch {
    redirect(onboardingPath + "?error=" + encodeURIComponent(m.usernameFormat));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`${base}/login?next=${onboardingPath}`);

  if (username) {
    const { data: dup } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", user.id)
      .maybeSingle();
    if (dup) {
      redirect(
        onboardingPath + "?error=" + encodeURIComponent(m.usernameTaken),
      );
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name,
      username,
      bio: bio || null,
      is_author: true,
    })
    .eq("id", user.id);

  if (error) {
    redirect(onboardingPath + "?error=" + encodeURIComponent(error.message));
  }
  revalidatePath("/", "layout");
  redirect("/studio");
}

export async function updateProfileAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/settings?error=" + encodeURIComponent("Supabase 환경변수가 설정되지 않았습니다."));
  }

  const display_name = String(formData.get("display_name") || "").trim();
  const usernameRaw = String(formData.get("username") || "");
  const bio = String(formData.get("bio") || "").trim();

  if (!display_name) {
    redirect("/settings?error=" + encodeURIComponent("필명을 비워둘 수 없습니다."));
  }

  let username: string | null;
  try {
    username = sanitizeUsername(usernameRaw);
  } catch (e) {
    redirect("/settings?error=" + encodeURIComponent((e as Error).message));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings");

  if (username) {
    const { data: dup } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", user.id)
      .maybeSingle();
    if (dup) {
      redirect(
        "/settings?error=" + encodeURIComponent("이미 사용 중인 사용자 이름입니다."),
      );
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ display_name, username, bio: bio || null })
    .eq("id", user.id);

  if (error) {
    redirect("/settings?error=" + encodeURIComponent(error.message));
  }
  revalidatePath("/", "layout");
  redirect("/settings?notice=" + encodeURIComponent("저장했습니다."));
}
