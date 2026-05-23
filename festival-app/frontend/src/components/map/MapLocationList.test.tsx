import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import MapLocationList from "@/components/map/MapLocationList";
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
    name: "화장실",
    category: "AMENITY",
    x: 88,
    y: 34,
    width: 9,
    height: 7,
    description: "Z2동 방향에 위치한 행사장 인근 화장실입니다.",
  },
];

describe("MapLocationList", () => {
  it("위치 목록을 표시하고 카드 클릭 시 위치를 선택한다", async () => {
    const user = userEvent.setup();
    const handleSelectLocation = vi.fn();

    render(
      <MapLocationList
        error={null}
        isError={false}
        isLoading={false}
        locations={locations}
        selectedLocationId={null}
        onSelectLocation={handleSelectLocation}
      />,
    );

    expect(screen.getByText("공연장")).toBeInTheDocument();
    expect(screen.getByText("편의시설")).toBeInTheDocument();
    expect(screen.getByText("메인무대")).toBeInTheDocument();
    expect(screen.getByText("화장실")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /화장실/i }));

    expect(handleSelectLocation).toHaveBeenCalledWith(2);
  });

  it("에러 상태를 표시한다", () => {
    render(
      <MapLocationList
        error={new Error("위치 API 오류")}
        isError
        isLoading={false}
        locations={[]}
        selectedLocationId={null}
        onSelectLocation={vi.fn()}
      />,
    );

    expect(screen.getByText("위치 API 오류")).toBeInTheDocument();
  });
});
