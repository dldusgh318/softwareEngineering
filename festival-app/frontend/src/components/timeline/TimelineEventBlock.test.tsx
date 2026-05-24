import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import TimelineEventBlock from "@/components/timeline/TimelineEventBlock";
import type { TimelineBlock } from "@/types/timeline/timeline.types";

const event: TimelineBlock = {
  id: 1,
  title: "체험형 부스",
  category: "EXPERIENCE",
  startsAt: "2026-05-13T11:00:00",
  endsAt: "2026-05-13T17:00:00",
  location: "와우관 오른쪽, Q동 앞",
  description: "참여형 콘텐츠와 미니 게임을 자유롭게 체험할 수 있는 부스입니다.",
  status: "SCHEDULED",
  lane: 0,
  top: 0,
  height: 120,
  startMinute: 660,
  endMinute: 1020,
};

describe("TimelineEventBlock", () => {
  it("행사 요약 정보를 보여주고 클릭 시 행사 ID를 전달한다", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(<TimelineEventBlock event={event} laneCount={2} onSelect={handleSelect} />);

    expect(screen.getByText("체험")).toBeInTheDocument();
    expect(screen.getByText("예정")).toBeInTheDocument();
    expect(screen.getByText("체험형 부스")).toBeInTheDocument();
    expect(screen.getByText("와우관 오른쪽, Q동 앞")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /체험형 부스/i }));

    expect(handleSelect).toHaveBeenCalledWith(1);
  });
});
