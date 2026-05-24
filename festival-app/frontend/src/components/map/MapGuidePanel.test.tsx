import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import MapGuidePanel from "@/components/map/MapGuidePanel";
import type { MapLocation } from "@/types/map/map.types";

const locations: MapLocation[] = [
  {
    id: 1,
    name: "메인무대",
    category: "STAGE",
    x: 35,
    y: 28,
    width: 11,
    height: 18,
    description: "운동장 왼쪽 상단에 위치한 메인 공연 무대입니다.",
  },
  {
    id: 2,
    name: "낮/밤 주점 부스",
    category: "BOOTH",
    x: 54,
    y: 42,
    width: 30,
    height: 25,
    description: "운동장 중앙에 배치된 낮 부스와 야간 주점 운영 구역입니다.",
  },
];

describe("MapGuidePanel", () => {
  it("지도 위 위치 번호를 표시하고 마커 클릭 시 위치를 선택한다", async () => {
    const user = userEvent.setup();
    const handleSelectLocation = vi.fn();

    render(
      <MapGuidePanel
        isError={false}
        isLoading={false}
        locations={locations}
        selectedLocationId={null}
        onSelectLocation={handleSelectLocation}
      />,
    );

    expect(screen.getByText("2개 위치")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "메인무대 위치 보기" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "낮/밤 주점 부스 위치 보기" }));

    expect(handleSelectLocation).toHaveBeenCalledWith(2);
  });

  it("선택된 위치 마커를 강조한다", () => {
    render(
      <MapGuidePanel
        isError={false}
        isLoading={false}
        locations={locations}
        selectedLocationId={1}
        onSelectLocation={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "메인무대 위치 보기" })).toHaveClass("z-20");
  });
});
