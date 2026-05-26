import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PerformanceCard from "@/components/performances/PerformanceCard";
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
  remainingSeats: 128,
};

describe("PerformanceCard", () => {
  it("공연 요약과 상세 링크를 표시한다", () => {
    render(<PerformanceCard performance={performance} />);

    expect(screen.getByText("헤드라이너 아티스트")).toBeInTheDocument();
    expect(screen.getByText("와우 스테이지 헤드라이너")).toBeInTheDocument();
    expect(screen.getByText("대운동장 메인 스테이지")).toBeInTheDocument();
    expect(screen.getByText("잔여 128석")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "상세 보기" })).toHaveAttribute(
      "href",
      "/performances/1",
    );
  });
});
