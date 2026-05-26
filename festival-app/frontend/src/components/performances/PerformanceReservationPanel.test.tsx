import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import PerformanceReservationPanel from "@/components/performances/PerformanceReservationPanel";
import type { Performance } from "@/types/performance/performance.types";
import type { TicketReservation } from "@/types/ticket/ticket.types";

const performance: Performance = {
  id: 1,
  title: "와우 스테이지 헤드라이너",
  artist: "헤드라이너 아티스트",
  startsAt: "2026-05-13T19:00:00",
  endsAt: "2026-05-13T21:00:00",
  location: "대운동장 메인 스테이지",
  description: "축제 첫날 밤을 여는 메인 스테이지 공연입니다.",
  totalSeats: 500,
  remainingSeats: 128,
};

const reservation: TicketReservation = {
  id: "ticket-1",
  performanceId: 1,
  userId: "user-1",
  status: "COMPLETED",
  statusDescription: "예매 완료",
  qrCode: "http://localhost:3000/performances/tickets/ticket-1",
  sagaLogs: [
    {
      step: "SEAT_CHECKED",
      message: "잔여 좌석을 확인했습니다.",
      createdAt: "2026-05-13T19:00:00",
    },
    {
      step: "SEAT_HELD",
      message: "좌석을 선점했습니다.",
      createdAt: "2026-05-13T19:00:00",
    },
    {
      step: "RESERVATION_CREATED",
      message: "예매 정보를 생성했습니다.",
      createdAt: "2026-05-13T19:00:00",
    },
    {
      step: "QR_ISSUED",
      message: "QR 티켓을 발급했습니다.",
      createdAt: "2026-05-13T19:00:00",
    },
    {
      step: "COMPLETED",
      message: "예매를 완료했습니다.",
      createdAt: "2026-05-13T19:00:00",
    },
  ],
  createdAt: "2026-05-13T19:00:00",
  updatedAt: "2026-05-13T19:00:00",
};

describe("PerformanceReservationPanel", () => {
  it("로그인 사용자에게 예매 버튼을 표시하고 클릭 시 핸들러를 호출한다", async () => {
    const user = userEvent.setup();
    const handleReserve = vi.fn();

    render(
      <PerformanceReservationPanel
        errorMessage=""
        isAuthenticated
        isInitialized
        isSubmitting={false}
        performance={performance}
        reservation={null}
        onReserve={handleReserve}
      />,
    );

    await user.click(screen.getByRole("button", { name: "좌석 선점하고 예매하기" }));

    expect(handleReserve).toHaveBeenCalledOnce();
  });

  it("예매 완료 후 QR 티켓과 Saga 로그를 표시한다", () => {
    render(
      <PerformanceReservationPanel
        errorMessage=""
        isAuthenticated
        isInitialized
        isSubmitting={false}
        performance={performance}
        reservation={reservation}
        onReserve={vi.fn()}
      />,
    );

    expect(screen.getByText("예매가 완료되었습니다")).toBeInTheDocument();
    expect(
      screen.getByLabelText("공연 티켓 QR http://localhost:3000/performances/tickets/ticket-1"),
    ).toBeInTheDocument();
    expect(screen.getByText("SEAT_CHECKED")).toBeInTheDocument();
    expect(screen.getByText("COMPLETED")).toBeInTheDocument();
  });
});
