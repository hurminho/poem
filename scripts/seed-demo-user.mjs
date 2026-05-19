/**
 * 시담 — 로컬/베타용 데모 계정 생성
 *
 * 사용법:
 *   npm run seed:demo          # 일반 작가 계정
 *   npm run seed:demo -- --admin   # 운영자 권한까지 부여
 *
 * 필요 env (.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const DEMO_EMAIL = "demo@sidam.app";
const DEMO_PASSWORD = "SidamDemo2026!";
const DEMO_DISPLAY_NAME = "시담 데모";
const DEMO_USERNAME = "sidam_demo";
const DEMO_BIO =
  "베타·로컬 테스트용 작가 계정입니다. 시를 적고, 시집에 묶고, 시 명상으로 머무릅니다.";

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
const grantAdmin = process.argv.includes("--admin");

function assertAsciiEnv(name, value) {
  if (!value) return;
  if (/[^\x00-\x7f]/.test(value)) {
    console.error(
      `\n[seed:demo] ${name} 값에 한글/특수문자가 섞여 있습니다.\n` +
        `  → .env.local 에서 키 뒤 주석을 # 으로 옮기거나, 값만 남겨 주세요.\n`,
    );
    process.exit(1);
  }
}

if (!url || !serviceKey) {
  console.error(
    "\n[seed:demo] NEXT_PUBLIC_SUPABASE_URL 과 SUPABASE_SERVICE_ROLE_KEY 가 .env.local 에 필요합니다.\n",
  );
  process.exit(1);
}

assertAsciiEnv("SUPABASE_SERVICE_ROLE_KEY", serviceKey);
assertAsciiEnv("NEXT_PUBLIC_SUPABASE_URL", url);

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function findUserByEmail(email) {
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  return data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

async function ensureProfile(userId) {
  const { error } = await admin.from("profiles").upsert(
    {
      id: userId,
      display_name: DEMO_DISPLAY_NAME,
      username: DEMO_USERNAME,
      bio: DEMO_BIO,
      is_author: true,
    },
    { onConflict: "id" },
  );
  if (error) throw error;
}

async function ensureAdmin(userId) {
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
  let user = await findUserByEmail(DEMO_EMAIL);

  if (user) {
    const { data, error } = await admin.auth.admin.updateUserById(user.id, {
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { display_name: DEMO_DISPLAY_NAME, username: DEMO_USERNAME },
    });
    if (error) throw error;
    user = data.user;
    console.log("\n[seed:demo] 기존 계정 비밀번호·메타데이터를 갱신했습니다.");
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: {
        display_name: DEMO_DISPLAY_NAME,
        username: DEMO_USERNAME,
      },
    });
    if (error) throw error;
    user = data.user;
    console.log("\n[seed:demo] 새 데모 계정을 만들었습니다.");
  }

  await ensureProfile(user.id);
  if (grantAdmin) await ensureAdmin(user.id);

  console.log("\n── 로그인 정보 (로컬/베타 전용) ──");
  console.log(`  이메일:   ${DEMO_EMAIL}`);
  console.log(`  비밀번호: ${DEMO_PASSWORD}`);
  console.log(`  필명:     ${DEMO_DISPLAY_NAME}`);
  console.log(`  @${DEMO_USERNAME}  →  /authors/${DEMO_USERNAME}`);
  console.log(`  로그인:   http://localhost:3000/login`);
  if (grantAdmin) {
    console.log(`  운영자:   http://localhost:3000/admin`);
  } else {
    console.log("\n  운영자 권한이 필요하면: npm run seed:demo -- --admin");
  }
  console.log("\n");
}

main().catch((err) => {
  console.error("\n[seed:demo] 실패:", err.message || err);
  process.exit(1);
});
