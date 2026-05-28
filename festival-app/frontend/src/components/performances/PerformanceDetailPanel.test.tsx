import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PerformanceDetailPanel from "@/components/performances/PerformanceDetailPanel";
import type { Performance } from "@/types/performance/performance.types";

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

describe("PerformanceDetailPanel", () => {
  it("공연 상세 정보와 잔여 좌석을 표시한다", () => {
    render(<PerformanceDetailPanel performance={performance} />);

    expect(screen.getByText("헤드라이너 아티스트")).toBeInTheDocument();
    expect(screen.getByText("와우 스테이지 헤드라이너")).toBeInTheDocument();
    expect(screen.getByText("대운동장 메인 스테이지")).toBeInTheDocument();
    expect(screen.getByText("잔여 128석")).toBeInTheDocument();
    expect(screen.getByText("축제 첫날 밤을 여는 메인 스테이지 공연입니다.")).toBeInTheDocument();
  });
});
