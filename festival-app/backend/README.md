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

## Run

IDE에서 `FestivalBackendApplication`을 실행하거나, 터미널에서 Maven으로 실행합니다.

```bash
cd festival-app/backend
mvn spring-boot:run
```

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
