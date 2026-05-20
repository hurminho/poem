/**
 * 시담 — 운영자(슈퍼 관리자) 계정 생성/갱신
 *
 *   npm run seed:admin
 *
 *  생성/갱신되는 계정:
 *    이메일:   sidamadmin@sidam.space
 *    비밀번호: sidam1914
 *    역할:     super_admin (시·시집·사용자 등 모든 record를 수정/삭제 가능)
 *
 * 필요 env (.env.local 또는 셸 환경):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * 운영자 콘솔: /admin
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ADMIN_EMAIL = "sidamadmin@sidam.space";
const ADMIN_PASSWORD = "sidam1914";
const ADMIN_DISPLAY_NAME = "시담 운영자";
const ADMIN_USERNAME = "sidamadmin";
const ADMIN_BIO = "시담 서비스 운영자 계정. 모든 콘텐츠/사용자 관리 권한을 가집니다.";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "\n[seed:admin] NEXT_PUBLIC_SUPABASE_URL 과 SUPABASE_SERVICE_ROLE_KEY 가 필요합니다.\n" +
      "  → .env.local 또는 환경 변수에 값을 채워주세요.\n",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function findUserByEmail(email) {
  // listUsers 는 최대 perPage 만큼만 돌려주므로 페이지를 끝까지 훑습니다.
  let page = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase(),
    );
    if (found) return found;
    if (data.users.length < 200) return null;
    page += 1;
    if (page > 50) return null;
  }
}

async function ensureProfile(userId) {
  const { error } = await admin.from("profiles").upsert(
    {
      id: userId,
      display_name: ADMIN_DISPLAY_NAME,
      username: ADMIN_USERNAME,
      bio: ADMIN_BIO,
      is_author: true,
    },
    { onConflict: "id" },
  );
  if (error) throw error;
}

async function ensureSuperAdmin(userId) {
  const { error } = await admin.from("admin_users").upsert(
    {
      user_id: userId,
      role: "super_admin",
      is_active: true,
    },
    { onConflict: "user_id" },
  );
  if (error) throw error;
}

async function main() {
  let user = await findUserByEmail(ADMIN_EMAIL);

  if (user) {
    const { data, error } = await admin.auth.admin.updateUserById(user.id, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        display_name: ADMIN_DISPLAY_NAME,
        username: ADMIN_USERNAME,
      },
    });
    if (error) throw error;
    user = data.user;
    console.log("\n[seed:admin] 기존 운영자 계정 비밀번호를 갱신했습니다.");
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        display_name: ADMIN_DISPLAY_NAME,
        username: ADMIN_USERNAME,
      },
    });
    if (error) throw error;
    user = data.user;
    console.log("\n[seed:admin] 새 운영자 계정을 만들었습니다.");
  }

  await ensureProfile(user.id);
  await ensureSuperAdmin(user.id);

  console.log("\n── 시담 운영자 계정 ──");
  console.log(`  로그인 ID:  ${ADMIN_EMAIL}`);
  console.log(`  비밀번호:    ${ADMIN_PASSWORD}`);
  console.log(`  역할:        super_admin (모든 권한)`);
  console.log(`  콘솔 URL:    https://sidam.space/admin  ·  https://www.sidam.space/admin`);
  console.log(`  로컬 URL:    http://localhost:3000/admin`);
  console.log("\n  ※ 보안을 위해 베타 종료 후 비밀번호를 즉시 변경해 주세요.\n");
}

main().catch((err) => {
  console.error("\n[seed:admin] 실패:", err.message || err);
  process.exit(1);
});
