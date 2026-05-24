# Festival Frontend

대학 축제 플랫폼의 프론트엔드 프로젝트입니다.  
공연 티켓 예매, 부스 예약, 축제 타임라인, 안내도 등의 기능을 사용자에게 제공합니다.

프론트엔드와 백엔드는 pnpm workspace 기반의 모노레포 환경에서 함께 관리하며,  
VSCode Codex Extension을 활용한 바이브 코딩 기반으로 개발을 진행합니다.

<br/>

## 🛠 Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- pnpm workspace
- ESLint
- Prettier
- Husky
- lint-staged

<br/>

## 📦 Project Structure

프론트엔드는 역할별 디렉토리를 기준으로 파일을 분리하고,  
각 디렉토리 내부에서는 기능 도메인별로 세분화하여 관리합니다.

```bash
src/
├── app/                         # Next.js App Router
├── components/                  # 공통 UI 컴포넌트
│   ├── tickets/
│   ├── booths/
│   ├── timeline/
│   └── common/
├── constants/                   # 상수 값 관리
├── hooks/                       # 커스텀 훅
├── styles/              # 전역 스타일 및 스타일 관련 파일
├── types/                       # 공통 TypeScript 타입
└── utils/                       # 공통 유틸 함수
```

<br/>

## Booth Reservation QR

이슈 #7에서는 관리자 승인 후 발급된 QR을 사용자가 실제로 스캔할 수 있도록 처리합니다.

- 관리자 화면: `/booths/admin/reservations`
- QR 확인 화면: `/booths/reservations/[reservationId]`
- QR payload: `http://localhost:3000/booths/reservations/{reservationId}`

관리자 화면은 승인 대기 예약을 조회하고, 승인 성공 후 `RESERVED` 상태와 QR URL을 보여줍니다. QR 확인 화면은 URL의 `reservationId`로 예약 단건 조회 API를 호출해 예약 상태를 표시합니다.

### Test Scope

- `AdminBoothReservationApproval` 테스트
  - 승인 대기 예약 목록 표시
  - 승인 요청 후 QR URL과 실제 QR SVG 표시
- `BoothReservationVerification` 테스트
  - QR URL로 진입한 예약 확인 화면 표시
- `BoothDirectory` 테스트
  - 내 예약 현황에서 `RESERVED` 예약의 QR URL과 QR SVG 표시
