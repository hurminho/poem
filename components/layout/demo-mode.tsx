"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * 스크린샷 친화 모드.
 *
 * `?demo=1` 쿼리가 있으면 <html>에 `data-demo="1"` 속성을 부여합니다.
 * `globals.css` 의 `html[data-demo="1"]` 선택자가 헤더·푸터·쿠키바·CTA 등을
 * 깔끔하게 숨겨, 사업계획서·앱스토어 캡쳐에 바로 쓸 수 있도록 합니다.
 *
 * 추가로 `?demo=1&theme=night` 같이 테마도 함께 강제할 수 있습니다.
 */
export function DemoModeBoundary() {
  const sp = useSearchParams();

  useEffect(() => {
    const demo = sp.get("demo");
    const theme = sp.get("theme");
    const html = document.documentElement;

    if (demo === "1") {
      html.setAttribute("data-demo", "1");
    } else {
      html.removeAttribute("data-demo");
    }

    if (theme === "night" || theme === "day" || theme === "light") {
      html.setAttribute("data-theme", theme);
    } else if (demo === "1") {
      // 데모 진입 시에는 light 로 안정화.
      html.setAttribute("data-theme", "light");
    }
  }, [sp]);

  return null;
}
