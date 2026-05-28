import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PerformanceReservationPanel from "@/components/performances/PerformanceReservationPanel";

describe("PerformanceReservationPanel", () => {
  it("비로그인 사용자는 로그인 예매 링크를 볼 수 있다", () => {
    render(
      <PerformanceReservationPanel isAuthenticated={false} isInitialized remainingSeats={128} />,
    );

    expect(screen.getByText("128석")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "로그인하고 예매하기" })).toHaveAttribute(
      "href",
      "/login?redirect=/performances",
    );
  });

  it("redirectPath가 있으면 로그인 후 해당 경로로 돌아가도록 링크를 만든다", () => {
    render(
      <PerformanceReservationPanel
        isAuthenticated={false}
        isInitialized
        remainingSeats={128}
        redirectPath="/performances/1"
      />,
    );

    expect(screen.getByRole("link", { name: "로그인하고 예매하기" })).toHaveAttribute(
      "href",
      "/login?redirect=/performances/1",
    );
  });

  it("로그인 사용자는 향후 예매 기능 버튼 영역을 볼 수 있다", () => {
    render(<PerformanceReservationPanel isAuthenticated isInitialized remainingSeats={128} />);

    expect(screen.getByRole("button", { name: "예매 기능 준비 중" })).toBeDisabled();
  });

  it("잔여 좌석이 없으면 매진 상태를 표시한다", () => {
    render(<PerformanceReservationPanel isAuthenticated isInitialized remainingSeats={0} />);

    expect(screen.getByRole("button", { name: "매진" })).toBeDisabled();
  });
});
