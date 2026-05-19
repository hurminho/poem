import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // 상위에 있는 다른 lockfile과 충돌하지 않도록 작업 영역을 명시.
  turbopack: {
    root: projectRoot,
  },
  // 로컬 네트워크(휴대폰 등)에서 dev 서버 접속 시 HMR 차단 방지
  allowedDevOrigins: ["172.30.1.59"],
};

export default nextConfig;
