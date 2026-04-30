# 포엠 (Foem)

시집을 만들고 모으는 모바일 앱 프로젝트입니다.

## 저장소 위치

`allsuriapp`(올수리)과 **코드가 섞이지 않도록** 동일 상위 폴더 `Documents/dev/` 아래에 별도 디렉터리로 두었습니다.

```
dev/
├── allsuriapp/   # 올수리 — 견적 플랫폼
└── foem/         # 포엠 — 시집 앱 (이 프로젝트)
```

## 실행

```bash
cd foem
flutter pub get
flutter run
```

## 패키지명

- Android/iOS 번들 ID: `com.foem` (생성 시 지정)
- Dart 패키지명: `foem`

## 다음 단계 (제안)

- 시/집(책) 데이터 모델 정의
- 로컬 DB(예: `isar`, `drift`) 또는 백엔드 연동
- 표지·타이포그래피 UX

---

© 포엠 — 올수리와 독립된 앱으로 유지하세요.
