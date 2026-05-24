import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import TimelineDateTabs from "@/components/timeline/TimelineDateTabs";
import { festivalDates } from "@/constants/timeline/timeline.constants";

describe("TimelineDateTabs", () => {
  it("선택한 날짜 버튼을 강조하고 날짜 변경을 호출한다", async () => {
    const user = userEvent.setup();
    const handleSelectDate = vi.fn();

    render(
      <TimelineDateTabs
        dates={festivalDates}
        selectedDate="2026-05-13"
        onSelectDate={handleSelectDate}
      />,
    );

    expect(screen.getByRole("button", { name: /DAY 1/i })).toHaveClass("bg-brand-yellow");

    await user.click(screen.getByRole("button", { name: /DAY 2/i }));

    expect(handleSelectDate).toHaveBeenCalledWith("2026-05-14");
  });
});
