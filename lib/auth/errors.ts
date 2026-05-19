/** Supabase Auth 오류 메시지를 화면용 한국어로 바꿉니다. */
export function mapAuthErrorMessage(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }
  if (m.includes("invalid api key")) {
    return "인증 설정(anon key)을 확인해 주세요. .env.local 을 점검한 뒤 서버를 다시 시작하세요.";
  }
  if (m.includes("email not confirmed")) {
    return "이메일 인증이 필요합니다. 받은 메일의 링크를 눌러 주세요.";
  }
  if (m.includes("too many requests")) {
    return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
  }
  return message;
}
