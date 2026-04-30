import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 상위에 있는 다른 lockfile과 충돌하지 않도록 작업 영역을 명시.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
