import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  approveBoothReservation,
  checkInBoothReservation,
  getApprovedBoothReservations,
  getPendingBoothReservations,
} from "@/apis/booths/booth.api";
import { AdminBoothReservationApproval } from "@/components/booths/admin-booth-reservation-approval";
import { useAuth } from "@/providers/AuthProvider";
import type { BoothReservationApplication } from "@/types/booth/booths.types";

vi.mock("@/apis/booths/booth.api", () => ({
  approveBoothReservation: vi.fn(),
  checkInBoothReservation: vi.fn(),
  getApprovedBoothReservations: vi.fn(),
  getPendingBoothReservations: vi.fn(),
}));

vi.mock("@/providers/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/booths/admin/reservations",
}));

const mockedGetPendingBoothReservations = vi.mocked(getPendingBoothReservations);
const mockedGetApprovedBoothReservations = vi.mocked(getApprovedBoothReservations);
const mockedApproveBoothReservation = vi.mocked(approveBoothReservation);
const mockedCheckInBoothReservation = vi.mocked(checkInBoothReservation);
const mockedUseAuth = vi.mocked(useAuth);

describe("AdminBoothReservationApproval", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetApprovedBoothReservations.mockResolvedValue([]);
    mockedUseAuth.mockReturnValue({
      accessToken: "admin-token",
      isAuthenticated: true,
      isInitialized: true,
      login: vi.fn(),
      logout: vi.fn(),
      signup: vi.fn(),
      user: {
        id: "admin-1",
        name: "관리자",
        email: "admin@hongik.ac.kr",
        role: "ADMIN",
      },
    });
  });

  it("blocks non-admin user from loading pending reservations", () => {
    mockedUseAuth.mockReturnValue({
      accessToken: "user-token",
      isAuthenticated: true,
      isInitialized: true,
      login: vi.fn(),
      logout: vi.fn(),
      signup: vi.fn(),
      user: {
        id: "user-1",
        name: "홍길동",
        email: "user@hongik.ac.kr",
        role: "USER",
      },
    });

    render(<AdminBoothReservationApproval />);

    expect(screen.getByText("관리자 권한이 필요합니다")).toBeInTheDocument();
    expect(mockedGetPendingBoothReservations).not.toHaveBeenCalled();
    expect(mockedGetApprovedBoothReservations).not.toHaveBeenCalled();
  });

  it("shows pending reservation list", async () => {
    mockedGetPendingBoothReservations.mockResolvedValue([
      reservationApplication({ applicantName: "홍길동" }),
    ]);

    render(<AdminBoothReservationApproval />);

    const pendingRegion = await screen.findByRole("region", { name: "승인 대기 예약" });
    expect(within(pendingRegion).getByText("홍길동")).toBeInTheDocument();
    expect(within(pendingRegion).getByText("관리자 승인 대기")).toBeInTheDocument();
  });

  it("loads approved reservations after refresh", async () => {
    mockedGetPendingBoothReservations.mockResolvedValue([]);
    mockedGetApprovedBoothReservations.mockResolvedValue([
      reservationApplication({
        id: "reservation-1",
        applicantName: "홍길동",
        status: "RESERVED",
        statusDescription: "QR 발급 완료",
        qrCode: "http://localhost:3000/booths/reservations/reservation-1",
      }),
    ]);

    render(<AdminBoothReservationApproval />);

    const approvedRegion = await screen.findByRole("region", { name: "승인 완료 예약" });
    expect(await within(approvedRegion).findByText("홍길동")).toBeInTheDocument();
    expect(within(approvedRegion).getByText("QR 발급 완료")).toBeInTheDocument();
  });

  it("approves selected reservation and shows issued QR code", async () => {
    const user = userEvent.setup();
    mockedGetPendingBoothReservations.mockResolvedValue([
      reservationApplication({ id: "reservation-1", applicantName: "홍길동" }),
    ]);
    mockedApproveBoothReservation.mockResolvedValue(
      reservationApplication({
        id: "reservation-1",
        applicantName: "홍길동",
        status: "RESERVED",
        statusDescription: "QR 발급 완료",
        qrCode: "http://localhost:3000/booths/reservations/reservation-1",
        sagaLogs: [
          {
            step: "APPROVED",
            message: "관리자가 예약 신청을 승인했습니다.",
            createdAt: "2026-05-24T10:05:00",
          },
          {
            step: "QR_ISSUED",
            message: "QR 발급에 성공해 예약 완료 상태로 전환했습니다.",
            createdAt: "2026-05-24T10:05:00",
          },
        ],
      }),
    );

    render(<AdminBoothReservationApproval />);

    await screen.findByRole("button", { name: /홍길동/ });
    await user.click(screen.getByRole("button", { name: "승인하고 QR 발급" }));

    expect(mockedApproveBoothReservation).toHaveBeenCalledWith("reservation-1", {
      approverId: "admin-1",
      approverName: "관리자",
      simulateQrFailure: false,
    });
    expect(
      await screen.findByText("홍길동님의 예약을 승인하고 QR을 발급했습니다."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("http://localhost:3000/booths/reservations/reservation-1"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("예약 QR http://localhost:3000/booths/reservations/reservation-1"),
    ).toBeInTheDocument();
  });

  it("replaces approved reservation when retrying QR failed reservation", async () => {
    const user = userEvent.setup();
    mockedGetPendingBoothReservations.mockResolvedValue([
      reservationApplication({
        id: "reservation-1",
        applicantName: "홍길동",
        status: "QR_FAILED",
        statusDescription: "QR 발급 실패",
      }),
    ]);
    mockedGetApprovedBoothReservations.mockResolvedValue([
      reservationApplication({
        id: "reservation-1",
        applicantName: "홍길동",
        status: "QR_FAILED",
        statusDescription: "QR 발급 실패",
      }),
    ]);
    mockedApproveBoothReservation.mockResolvedValue(
      reservationApplication({
        id: "reservation-1",
        applicantName: "홍길동",
        status: "RESERVED",
        statusDescription: "QR 발급 완료",
        qrCode: "http://localhost:3000/booths/reservations/reservation-1",
      }),
    );

    render(<AdminBoothReservationApproval />);

    await screen.findByRole("button", { name: /홍길동/ });
    await user.click(screen.getByRole("button", { name: "재승인하고 QR 재발급" }));

    const approvedRegion = await screen.findByRole("region", { name: "승인 완료 예약" });
    expect(within(approvedRegion).getAllByText("홍길동")).toHaveLength(1);
  });

  it("shows QR failure result and keeps reservation retryable", async () => {
    const user = userEvent.setup();
    mockedGetPendingBoothReservations.mockResolvedValue([
      reservationApplication({ id: "reservation-1", applicantName: "홍길동" }),
    ]);
    mockedApproveBoothReservation.mockResolvedValue(
      reservationApplication({
        id: "reservation-1",
        applicantName: "홍길동",
        status: "QR_FAILED",
        statusDescription: "QR 발급 실패",
        compensationLogs: [
          {
            step: "APPROVAL_ROLLBACK",
            reason: "QR 발급 시뮬레이션 실패",
            fromStatus: "APPROVED",
            toStatus: "QR_FAILED",
            createdAt: "2026-05-24T10:05:00",
          },
        ],
        sagaLogs: [
          {
            step: "APPROVED",
            message: "관리자가 예약 신청을 승인했습니다.",
            createdAt: "2026-05-24T10:05:00",
          },
          {
            step: "QR_ISSUE_FAILED",
            message: "QR 발급 시뮬레이션 실패",
            createdAt: "2026-05-24T10:05:00",
          },
          {
            step: "APPROVAL_COMPENSATED",
            message: "QR 발급 실패로 승인 상태를 보상 처리했습니다.",
            createdAt: "2026-05-24T10:05:00",
          },
        ],
      }),
    );

    render(<AdminBoothReservationApproval />);

    await screen.findByRole("button", { name: /홍길동/ });
    await user.click(screen.getByLabelText("QR 발급 실패 시뮬레이션"));
    await user.click(screen.getByRole("button", { name: "승인하고 QR 발급" }));

    expect(mockedApproveBoothReservation).toHaveBeenCalledWith("reservation-1", {
      approverId: "admin-1",
      approverName: "관리자",
      simulateQrFailure: true,
    });
    expect(
      await screen.findByText("홍길동님의 예약 승인 중 QR 발급이 실패해 보상 처리했습니다."),
    ).toBeInTheDocument();
    expect(screen.getAllByText("QR 발급 실패")).not.toHaveLength(0);
    expect(screen.getByText("QR 발급 시뮬레이션 실패")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "재승인하고 QR 재발급" })).toBeInTheDocument();
  });

  it("checks in reservation with scanned QR code", async () => {
    const user = userEvent.setup();
    const qrCode = "http://localhost:3000/booths/reservations/reservation-1";
    mockedGetPendingBoothReservations.mockResolvedValue([]);
    mockedCheckInBoothReservation.mockResolvedValue(
      reservationApplication({
        id: "reservation-1",
        applicantName: "홍길동",
        status: "CHECKED_IN",
        statusDescription: "현장 체크인 완료",
        qrCode,
      }),
    );

    render(<AdminBoothReservationApproval />);

    await screen.findByText("승인 대기 예약이 없습니다.");
    await user.type(screen.getByLabelText("QR 값"), qrCode);
    await user.click(screen.getByRole("button", { name: "QR 체크인" }));

    expect(mockedCheckInBoothReservation).toHaveBeenCalledWith({ qrCode });
    expect(await screen.findByText("홍길동님의 현장 체크인이 완료되었습니다.")).toBeInTheDocument();
    expect(screen.getByText("현장 체크인 완료")).toBeInTheDocument();
  });

  it("does not request check-in without QR code", async () => {
    const user = userEvent.setup();
    mockedGetPendingBoothReservations.mockResolvedValue([]);

    render(<AdminBoothReservationApproval />);

    await screen.findByText("승인 대기 예약이 없습니다.");
    await user.click(screen.getByRole("button", { name: "QR 체크인" }));

    expect(mockedCheckInBoothReservation).not.toHaveBeenCalled();
    expect(screen.getByText("체크인할 QR 정보를 입력해주세요.")).toBeInTheDocument();
  });

  it("shows check-in error message from API", async () => {
    const user = userEvent.setup();
    mockedGetPendingBoothReservations.mockResolvedValue([]);
    mockedCheckInBoothReservation.mockRejectedValue({
      response: {
        json: () => Promise.resolve({ message: "이미 체크인된 예약입니다." }),
      },
    });

    render(<AdminBoothReservationApproval />);

    await screen.findByText("승인 대기 예약이 없습니다.");
    await user.type(
      screen.getByLabelText("QR 값"),
      "http://localhost:3000/booths/reservations/reservation-1",
    );
    await user.click(screen.getByRole("button", { name: "QR 체크인" }));

    expect(await screen.findByText("이미 체크인된 예약입니다.")).toBeInTheDocument();
  });

  it("clears previous checked-in reservation before failed check-in result", async () => {
    const user = userEvent.setup();
    const qrCode = "http://localhost:3000/booths/reservations/reservation-1";
    mockedGetPendingBoothReservations.mockResolvedValue([]);
    mockedCheckInBoothReservation
      .mockResolvedValueOnce(
        reservationApplication({
          id: "reservation-1",
          applicantName: "홍길동",
          status: "CHECKED_IN",
          statusDescription: "현장 체크인 완료",
          qrCode,
        }),
      )
      .mockRejectedValueOnce({
        response: {
          json: () => Promise.resolve({ message: "유효하지 않은 QR입니다." }),
        },
      });

    render(<AdminBoothReservationApproval />);

    await screen.findByText("승인 대기 예약이 없습니다.");
    await user.type(screen.getByLabelText("QR 값"), qrCode);
    await user.click(screen.getByRole("button", { name: "QR 체크인" }));

    expect(await screen.findByText("홍길동님의 현장 체크인이 완료되었습니다.")).toBeInTheDocument();

    await user.clear(screen.getByLabelText("QR 값"));
    await user.type(screen.getByLabelText("QR 값"), "invalid-qr");
    await user.click(screen.getByRole("button", { name: "QR 체크인" }));

    expect(await screen.findByText("유효하지 않은 QR입니다.")).toBeInTheDocument();
    expect(screen.queryByText("현장 체크인 완료")).not.toBeInTheDocument();
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
    qrCode: null,
    sagaLogs: [],
    compensationLogs: [],
    createdAt: "2026-05-24T10:00:00",
    updatedAt: "2026-05-24T10:00:00",
    ...overrides,
  };
}
