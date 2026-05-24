# Festival Backend

대학 축제 통합 운영 플랫폼의 백엔드 API 서버입니다.  

## Tech Stack

- Java 17
- Spring Boot 3
- Spring Web
- Maven

## Project Structure

```bash
src/main/java/com/festivalapp/
├── api/                 # REST Controller
├── config/              # CORS 등 서버 설정
├── domain/timeline/     # 타임라인 도메인 모델
├── dto/                 # API 응답 DTO
├── repository/timeline/ # 임시 인메모리 일정 데이터
└── service/             # 조회 로직 및 DTO 변환
```

## API

### Health Check

```http
GET /api/health
```

### 날짜별 행사 일정 조회

```http
GET /api/timeline?date=2026-05-13
```

Query Parameter:

| name   | type         | required | description                                            |
| ------ | ------------ | -------- | ------------------------------------------------------ |
| `date` | `YYYY-MM-DD` | false    | 조회할 축제 날짜입니다. 없으면 전체 일정을 반환합니다. |

Response Example:

```json
[
  {
    "id": 1,
    "title": "체험형 부스",
    "category": "EXPERIENCE",
    "startsAt": "2026-05-13T11:00:00",
    "endsAt": "2026-05-13T17:00:00",
    "location": "와우관 오른쪽, Q동 앞"
  }
]
```

### 부스 예약 신청

```http
POST /api/booth-reservations
```

Request Example:

```json
{
  "boothId": "booth-1",
  "applicantId": "user-1",
  "applicantName": "홍길동",
  "requestedTables": 2
}
```

예약 신청 직후 상태는 `PENDING_APPROVAL`로 저장됩니다. 동일 사용자가 같은 부스에 이미 활성 예약을 신청한 경우, 또는 남은 테이블 수를 초과한 경우 `409 Conflict`를 반환합니다.

### 사용자별 부스 예약 상태 조회

```http
GET /api/booth-reservations/applicants/{applicantId}
```

Response Example:

```json
[
  {
    "id": "reservation-1",
    "boothId": "booth-1",
    "applicantId": "user-1",
    "applicantName": "홍길동",
    "requestedTables": 2,
    "status": "PENDING_APPROVAL",
    "statusDescription": "관리자 승인 대기",
    "createdAt": "2026-05-24T10:00:00",
    "updatedAt": "2026-05-24T10:00:00"
  }
]
```

### 관리자 예약 신청 목록 조회

```http
GET /api/admin/booth-reservations/pending
```

관리자가 승인해야 하는 `PENDING_APPROVAL` 상태의 예약 신청 목록을 반환합니다.

### 관리자 예약 승인 및 QR 발급

```http
POST /api/admin/booth-reservations/{reservationId}/approve
```

Request Example:

```json
{
  "approverId": "admin-1",
  "approverName": "관리자"
}
```

승인 가능한 예약은 `PENDING_APPROVAL` 상태의 예약뿐입니다. 승인 요청이 들어오면 Saga는 다음 순서로 진행됩니다.

```text
PENDING_APPROVAL → APPROVED → QR 발급 → RESERVED
```

Response Example:

```json
{
  "id": "reservation-1",
  "boothId": "booth-1",
  "applicantId": "user-1",
  "applicantName": "홍길동",
  "requestedTables": 2,
  "status": "RESERVED",
  "statusDescription": "QR 발급 완료",
  "qrCode": "http://localhost:3000/booths/reservations/reservation-1",
  "sagaLogs": [
    {
      "step": "APPROVED",
      "message": "관리자가 예약 신청을 승인했습니다.",
      "createdAt": "2026-05-24T10:00:00"
    },
    {
      "step": "QR_ISSUED",
      "message": "QR 발급에 성공해 예약 완료 상태로 전환했습니다.",
      "createdAt": "2026-05-24T10:00:00"
    }
  ],
  "createdAt": "2026-05-24T09:50:00",
  "updatedAt": "2026-05-24T10:00:00"
}
```

## 부스 예약 Saga 기록

이슈 #6은 부스 예약 Saga의 시작점입니다.

```text
부스 예약 신청 → PENDING_APPROVAL 저장 → 관리자 승인 → APPROVED → QR 발급 → RESERVED → 체크인
```

현재 단계에서 보장하는 규칙:

- 예약 신청 직후 상태는 항상 `PENDING_APPROVAL`입니다.
- 동일 사용자는 같은 부스에 활성 예약을 중복 신청할 수 없습니다.
- 신청 테이블 수는 1개 이상이어야 합니다.
- 이미 활성 예약으로 점유된 테이블 수를 제외하고, 남은 테이블 수를 초과해 신청할 수 없습니다.
- 사용자별 예약 상태 조회 API로 Saga 시작 상태를 확인할 수 있습니다.
- 관리자는 승인 대기 예약 목록을 조회하고, 승인 API를 통해 QR 발급까지 이어지는 Saga를 시작할 수 있습니다.
- QR 발급이 성공하면 예약 상태는 `RESERVED`로 전환되고, 승인 응답의 `sagaLogs`로 진행 단계를 확인할 수 있습니다.

## 이슈 #7 외부 행위자 개입 기록

관리자 승인은 시스템 내부 자동 흐름이 아니라 외부 행위자의 명시적인 판단이 필요한 단계입니다.

이번 구현에서는 외부 행위자 개입을 다음처럼 처리했습니다.

- 관리자가 처리할 대상은 `GET /api/admin/booth-reservations/pending`으로 분리했습니다.
- 승인 행위는 `POST /api/admin/booth-reservations/{reservationId}/approve`로 명시했습니다.
- 승인과 QR 발급은 하나의 트랜잭션으로 처리합니다.
- 서비스는 승인 요청을 받은 뒤 예약 상태를 `APPROVED`로 변경하고, QR 발급 성공 후 `RESERVED`로 변경합니다.
- QR 발급은 `QrCodeIssuer` 인터페이스로 분리해 승인 Saga와 QR 생성 방식을 느슨하게 연결했습니다.
- QR 발급 성공 후 최종 사용자 예약 상태는 `RESERVED`가 됩니다.
- 승인 응답의 `sagaLogs`에 `APPROVED`, `QR_ISSUED` 단계를 담아 Saga 진행 상태를 확인할 수 있게 했습니다.

## 이슈 #6 테스트 범위

### Backend

- `BoothReservationControllerTest`
  - 예약 신청 API가 `201 Created`와 `PENDING_APPROVAL` 응답을 반환하는지 검증합니다.
  - 사용자별 예약 상태 조회 API가 신청자 예약 목록을 반환하는지 검증합니다.
- `BoothReservationServiceTest`
  - 정상 예약 신청 시 저장 상태가 `PENDING_APPROVAL`인지 검증합니다.
  - 동일 사용자/동일 부스 중복 신청이 `409 Conflict`로 차단되는지 검증합니다.
  - 잔여 테이블 초과 신청이 `409 Conflict`로 차단되는지 검증합니다.
  - 존재하지 않는 부스 신청이 `404 Not Found`로 차단되는지 검증합니다.
  - 사용자별 예약 조회가 해당 사용자의 예약만 반환하는지 검증합니다.
- `BoothReservationRepositoryTest`
  - 예약 저장, 사용자별 조회, 활성 예약 수량 집계, 취소 예약 제외 규칙을 검증합니다.
- `BoothReservationStatusTest`
  - 예약 상태 설명 필드가 함께 제공되는지 검증합니다.

### Backend - 이슈 #7

- `AdminBoothReservationControllerTest`
  - 관리자 예약 신청 목록 조회 API가 승인 대기 예약을 반환하는지 검증합니다.
  - 관리자 승인 API가 QR 코드가 포함된 `RESERVED` 예약을 반환하는지 검증합니다.
- `BoothReservationApprovalServiceTest`
  - 승인 대기 예약 목록만 조회되는지 검증합니다.
  - `PENDING_APPROVAL → APPROVED → QR 발급 → RESERVED` 정상 흐름을 검증합니다.
  - 승인 대상이 아닌 예약 승인 시 `409 Conflict`가 발생하는지 검증합니다.
  - 존재하지 않는 예약 승인 시 `404 Not Found`가 발생하는지 검증합니다.
- `BoothReservationRepositoryTest`
  - 상태별 예약 조회와 예약 업데이트가 정상 동작하는지 검증합니다.

### Frontend

- `BoothDirectory` 테스트
  - 부스 상세에서 예약 신청 버튼과 신청 테이블 선택 UI가 노출되는지 검증합니다.
  - 예약 신청 성공 후 승인 대기 상태와 완료 메시지가 표시되는지 검증합니다.
  - 다른 부스로 이동했을 때 이전 부스의 신청 완료 메시지가 남지 않는지 검증합니다.
  - 기존 예약이 있으면 중복 신청 버튼이 비활성화되는지 검증합니다.
  - 내 예약 현황 목록에서 예약 카드가 표시되고, 카드 클릭 시 해당 부스로 이동하는지 검증합니다.
  - 로그인 정보가 없으면 예약 신청과 예약 현황이 로그인 안내로 제한되는지 검증합니다.

## Run

IDE에서 `FestivalBackendApplication`을 실행하거나, 터미널에서 Maven으로 실행합니다.

```bash
cd festival-app/backend
export JWT_SECRET="replace-with-at-least-32-byte-secret-key"
mvn spring-boot:run
```

JWT 만료 시간은 필요하면 `JWT_EXPIRATION_MILLIS` 환경변수로 조정할 수 있습니다.

기본 서버 주소:

```text
http://localhost:8080
```

## Test

```bash
cd festival-app/backend
mvn test
```

## Frontend 연동

프론트엔드는 기본적으로 아래 주소의 백엔드 API를 호출합니다.

```text
http://localhost:8080
```

다른 주소를 사용해야 한다면 프론트엔드 실행 환경에 `NEXT_PUBLIC_API_BASE_URL`을 설정합니다.

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080 pnpm dev
```
