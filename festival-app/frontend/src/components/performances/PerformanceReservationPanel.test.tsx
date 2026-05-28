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
  reservedSeats: 372,
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

function renderPanel(
  overrideProps: Partial<Parameters<typeof PerformanceReservationPanel>[0]> = {},
) {
  return render(
    <PerformanceReservationPanel
      errorMessage=""
      isAuthenticated
      isInitialized
      isSubmitting={false}
      performance={performance}
      reservation={null}
      onReserve={vi.fn()}
      {...overrideProps}
    />,
  );
}

describe("PerformanceReservationPanel", () => {
  it("비로그인 사용자는 기본 로그인 예매 링크를 볼 수 있다", () => {
    renderPanel({ isAuthenticated: false });

    expect(screen.getByText("128석")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "로그인하고 예매하기" })).toHaveAttribute(
      "href",
      "/login?redirect=/performances",
    );
  });

  it("redirectPath가 있으면 로그인 후 해당 경로로 돌아가도록 링크를 만든다", () => {
    renderPanel({ isAuthenticated: false, redirectPath: "/performances/1" });

    expect(screen.getByRole("link", { name: "로그인하고 예매하기" })).toHaveAttribute(
      "href",
      "/login?redirect=/performances/1",
    );
  });

  it("로그인 사용자에게 예매 버튼을 표시하고 클릭 시 핸들러를 호출한다", async () => {
    const user = userEvent.setup();
    const handleReserve = vi.fn();

    renderPanel({ onReserve: handleReserve });

    await user.click(screen.getByRole("button", { name: "좌석 선점하고 예매하기" }));

    expect(handleReserve).toHaveBeenCalledOnce();
  });

  it("잔여 좌석이 없으면 매진 상태를 표시한다", () => {
    renderPanel({ performance: { ...performance, remainingSeats: 0 } });

    expect(screen.getByRole("button", { name: "매진" })).toBeDisabled();
  });

  it("예매 완료 후 QR 티켓을 표시하고 내부 Saga 단계는 숨긴다", () => {
    renderPanel({ reservation });

    expect(screen.getByText("예매가 완료되었습니다")).toBeInTheDocument();
    expect(
      screen.getByLabelText("공연 티켓 QR http://localhost:3000/performances/tickets/ticket-1"),
    ).toBeInTheDocument();
    expect(screen.getByText("예매 번호 ticket-1")).toBeInTheDocument();
    expect(screen.queryByText("SEAT_CHECKED")).not.toBeInTheDocument();
    expect(screen.queryByText("COMPLETED")).not.toBeInTheDocument();
  });

  it("예매 완료 후 취소 버튼을 클릭할 수 있다", async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();

    renderPanel({ reservation, onCancel: handleCancel });

    await user.click(screen.getByRole("button", { name: "예매 취소하기" }));

    expect(handleCancel).toHaveBeenCalledOnce();
  });

  it("예매 실패 상태이면 좌석 복구 안내를 표시하고 QR을 숨긴다", () => {
    renderPanel({
      reservation: {
        ...reservation,
        status: "FAILED",
        statusDescription: "예매 실패",
        qrCode: null,
      },
    });

    expect(screen.getByText("예매를 완료하지 못했습니다")).toBeInTheDocument();
    expect(
      screen.getByText("선점된 좌석은 복구되었습니다. 잠시 후 다시 시도해주세요."),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText("공연 티켓 QR http://localhost:3000/performances/tickets/ticket-1"),
    ).not.toBeInTheDocument();
  });

  it("예매 취소 상태이면 좌석 복구 안내를 표시한다", () => {
    renderPanel({
      reservation: {
        ...reservation,
        status: "CANCELLED",
        statusDescription: "예매 취소",
        qrCode: null,
      },
    });

    expect(screen.getByText("예매가 취소되었습니다")).toBeInTheDocument();
    expect(
      screen.getByText("취소된 예매의 좌석은 다시 예매 가능 상태로 복구되었습니다."),
    ).toBeInTheDocument();
  });
});
