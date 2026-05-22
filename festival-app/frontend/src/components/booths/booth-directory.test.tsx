import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getBooths } from "@/apis/booths/booth.api";
import { BoothDirectory } from "@/components/booths/booth-directory";
import type { Booth } from "@/types/booth";

vi.mock("@/apis/booths/booth.api", () => ({
  getBooths: vi.fn(),
}));

const booths: Booth[] = [
  {
    id: "booth-1",
    name: "타코야끼 라운지",
    teamName: "일식조리 동아리 오코노미",
    description: "즉석 타코야끼 부스",
    category: "FOOD",
    operatingHours: "12:00 - 21:00",
    availableTables: 4,
    location: {
      zone: "A",
      area: "학생회관 앞",
      detail: "A-03",
      mapX: 26,
      mapY: 34,
    },
  },
  {
    id: "booth-2",
    name: "미니 게임 스테이션",
    teamName: "게임제작팀",
    description: "축제 리듬 게임 체험",
    category: "EXPERIENCE",
    operatingHours: "13:00 - 22:00",
    availableTables: 5,
    location: {
      zone: "D",
      area: "운동장 입구",
      detail: "D-02",
      mapX: 40,
      mapY: 70,
    },
  },
];

const mockedGetBooths = vi.mocked(getBooths);

describe("BoothDirectory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders booth cards and selects the first booth after loading", async () => {
    mockedGetBooths.mockResolvedValue(booths);

    render(<BoothDirectory />);

    const tacoBoothCard = await screen.findByRole("button", { name: /타코야끼 라운지/ });
    expect(tacoBoothCard).toBeInTheDocument();
    expect(within(tacoBoothCard).getByText("12:00 - 21:00")).toBeInTheDocument();
    expect(within(tacoBoothCard).getByText("잔여 테이블 4개")).toBeInTheDocument();

    const detailPanel = screen.getByRole("complementary");
    expect(
      within(detailPanel).getByRole("heading", { name: "타코야끼 라운지" }),
    ).toBeInTheDocument();
    expect(within(detailPanel).getByText("A구역")).toBeInTheDocument();
    expect(within(detailPanel).getByText("학생회관 앞 A-03")).toBeInTheDocument();
    expect(screen.getByLabelText("타코야끼 라운지 위치")).toHaveStyle({
      left: "26%",
      top: "34%",
    });
  });

  it("updates detail and location when another booth is selected", async () => {
    const user = userEvent.setup();
    mockedGetBooths.mockResolvedValue(booths);

    render(<BoothDirectory />);

    await user.click(await screen.findByRole("button", { name: /미니 게임 스테이션/ }));

    const detailPanel = screen.getByRole("complementary");
    expect(
      within(detailPanel).getByRole("heading", { name: "미니 게임 스테이션" }),
    ).toBeInTheDocument();
    expect(within(detailPanel).getByText("D구역")).toBeInTheDocument();
    expect(within(detailPanel).getByText("운동장 입구 D-02")).toBeInTheDocument();
    expect(screen.getByLabelText("미니 게임 스테이션 위치")).toHaveStyle({
      left: "40%",
      top: "70%",
    });
  });

  it("shows an error message when booth loading fails", async () => {
    mockedGetBooths.mockRejectedValue(new Error("Network unavailable"));

    render(<BoothDirectory />);

    expect(await screen.findByText("부스 목록을 불러오지 못했습니다.")).toBeInTheDocument();
  });
});
