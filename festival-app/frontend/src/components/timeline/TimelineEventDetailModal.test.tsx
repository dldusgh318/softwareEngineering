import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import TimelineEventDetailModal from "@/components/timeline/TimelineEventDetailModal";
import type { TimelineEvent } from "@/types/timeline/timeline.types";

const event: TimelineEvent = {
  id: 1,
  title: "체험형 부스",
  category: "EXPERIENCE",
  startsAt: "2026-05-13T11:00:00",
  endsAt: "2026-05-13T17:00:00",
  location: "와우관 오른쪽, Q동 앞",
  description: "참여형 콘텐츠와 미니 게임을 자유롭게 체험할 수 있는 부스입니다.",
  status: "ONGOING",
};

describe("TimelineEventDetailModal", () => {
  it("행사 상세 정보를 표시하고 닫기 버튼을 처리한다", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <TimelineEventDetailModal
        event={event}
        error={null}
        isError={false}
        isFetching={false}
        onClose={handleClose}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "체험형 부스" })).toBeInTheDocument();
    expect(screen.getByText("진행 중")).toBeInTheDocument();
    expect(screen.getByText("와우관 오른쪽, Q동 앞")).toBeInTheDocument();
    expect(
      screen.getByText("참여형 콘텐츠와 미니 게임을 자유롭게 체험할 수 있는 부스입니다."),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "상세 닫기" }));

    expect(handleClose).toHaveBeenCalled();
  });

  it("상세 데이터가 없고 로딩 중이면 스켈레톤을 표시한다", () => {
    render(<TimelineEventDetailModal error={null} isError={false} isFetching onClose={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "행사 상세" })).toBeInTheDocument();
    expect(screen.queryByText("행사 상세 정보를 불러오지 못했습니다.")).not.toBeInTheDocument();
  });
});
