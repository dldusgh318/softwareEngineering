import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createBoothReservation,
  getBoothReservationsByApplicant,
  getBooths,
} from "@/apis/booths/booth.api";
import { BoothDirectory } from "@/components/booths/booth-directory";
import type { Booth, BoothReservationApplication } from "@/types/booth/booths.types";

vi.mock("@/apis/booths/booth.api", () => ({
  createBoothReservation: vi.fn(),
  getBoothReservationsByApplicant: vi.fn(),
  getBooths: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/booths",
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
const mockedCreateBoothReservation = vi.mocked(createBoothReservation);
const mockedGetBoothReservationsByApplicant = vi.mocked(getBoothReservationsByApplicant);

describe("BoothDirectory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    mockedGetBoothReservationsByApplicant.mockResolvedValue([]);
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
    expect(screen.getByRole("button", { name: "로그인 후 예약 신청" })).toBeDisabled();
    expect(screen.getByText("로그인 후 예약 신청이 가능합니다.")).toBeInTheDocument();
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

  it("submits a booth reservation and shows pending approval status", async () => {
    const user = userEvent.setup();
    setLoggedInApplicant();
    mockedGetBooths.mockResolvedValue(booths);
    mockedCreateBoothReservation.mockResolvedValue(reservationApplication());

    render(<BoothDirectory />);

    await user.selectOptions(await screen.findByLabelText("신청 테이블 수"), "2");
    await user.click(screen.getByRole("button", { name: "예약 신청" }));

    expect(mockedCreateBoothReservation).toHaveBeenCalledWith({
      boothId: "booth-1",
      applicantId: "demo-user-1",
      applicantName: "홍길동",
      requestedTables: 2,
    });
    expect(
      await screen.findByText(
        "예약 신청이 완료되었습니다. 관리자 승인 대기 상태로 저장되었습니다.",
      ),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole("region", { name: "내 예약 현황" })).getByText("신청 테이블 2개"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("관리자 승인 대기")).not.toHaveLength(0);
  });

  it("does not show success message for another booth without reservation", async () => {
    const user = userEvent.setup();
    setLoggedInApplicant();
    mockedGetBooths.mockResolvedValue(booths);
    mockedCreateBoothReservation.mockResolvedValue(reservationApplication());

    render(<BoothDirectory />);

    await user.click(await screen.findByRole("button", { name: "예약 신청" }));
    expect(
      await screen.findByText(
        "예약 신청이 완료되었습니다. 관리자 승인 대기 상태로 저장되었습니다.",
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /미니 게임 스테이션/ }));

    expect(
      screen.queryByText("예약 신청이 완료되었습니다. 관리자 승인 대기 상태로 저장되었습니다."),
    ).not.toBeInTheDocument();
    expect(screen.getByText("아직 이 부스에 신청한 예약이 없습니다.")).toBeInTheDocument();
  });

  it("shows existing reservation status and blocks duplicate application", async () => {
    setLoggedInApplicant();
    mockedGetBooths.mockResolvedValue(booths);
    mockedGetBoothReservationsByApplicant.mockResolvedValue([reservationApplication()]);

    render(<BoothDirectory />);

    expect(await screen.findByText("이미 신청한 부스")).toBeDisabled();
    expect(screen.getAllByText("관리자 승인 대기")).not.toHaveLength(0);
  });

  it("shows a reservation list and selects reserved booth from it", async () => {
    const user = userEvent.setup();
    setLoggedInApplicant();
    mockedGetBooths.mockResolvedValue(booths);
    mockedGetBoothReservationsByApplicant.mockResolvedValue([
      reservationApplication({ boothId: "booth-2", requestedTables: 3 }),
    ]);

    render(<BoothDirectory />);

    const reservationList = await screen.findByRole("region", { name: "내 예약 현황" });
    expect(within(reservationList).getByText("미니 게임 스테이션")).toBeInTheDocument();
    expect(within(reservationList).getByText("신청 테이블 3개")).toBeInTheDocument();

    await user.click(within(reservationList).getByRole("button", { name: /미니 게임 스테이션/ }));

    expect(screen.getByRole("heading", { name: "미니 게임 스테이션" })).toBeInTheDocument();
  });

  it("clears reservations when applicant is removed", async () => {
    setLoggedInApplicant();
    mockedGetBooths.mockResolvedValue(booths);
    mockedGetBoothReservationsByApplicant.mockResolvedValue([reservationApplication()]);

    render(<BoothDirectory />);

    expect(await screen.findByText("신청 테이블 2개")).toBeInTheDocument();

    await act(async () => {
      window.localStorage.clear();
    });

    expect(
      await screen.findByText("로그인 후 내 부스 예약 현황을 확인할 수 있습니다."),
    ).toBeInTheDocument();
    expect(screen.queryByText("신청 테이블 2개")).not.toBeInTheDocument();
  });
});

function reservationApplication(
  overrides: Partial<BoothReservationApplication> = {},
): BoothReservationApplication {
  return {
    id: "reservation-1",
    boothId: "booth-1",
    applicantId: "demo-user-1",
    applicantName: "홍길동",
    requestedTables: 2,
    status: "PENDING_APPROVAL",
    statusDescription: "관리자 승인 대기",
    createdAt: "2026-05-24T10:00:00",
    updatedAt: "2026-05-24T10:00:00",
    ...overrides,
  };
}

function setLoggedInApplicant() {
  window.localStorage.setItem(
    "festival-app-current-user",
    JSON.stringify({
      id: "demo-user-1",
      name: "홍길동",
    }),
  );
}
