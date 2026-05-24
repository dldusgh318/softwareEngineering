import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { approveBoothReservation, getPendingBoothReservations } from "@/apis/booths/booth.api";
import { AdminBoothReservationApproval } from "@/components/booths/admin-booth-reservation-approval";
import type { BoothReservationApplication } from "@/types/booth/booths.types";

vi.mock("@/apis/booths/booth.api", () => ({
  approveBoothReservation: vi.fn(),
  getPendingBoothReservations: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/booths/admin/reservations",
}));

const mockedGetPendingBoothReservations = vi.mocked(getPendingBoothReservations);
const mockedApproveBoothReservation = vi.mocked(approveBoothReservation);

describe("AdminBoothReservationApproval", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
        qrCode: "QR-reservation-1",
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
    });
    expect(
      await screen.findByText("홍길동님의 예약을 승인하고 QR을 발급했습니다."),
    ).toBeInTheDocument();
    expect(screen.getByText("QR-reservation-1")).toBeInTheDocument();
    expect(screen.getByText("예약 QR")).toBeInTheDocument();
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
    createdAt: "2026-05-24T10:00:00",
    updatedAt: "2026-05-24T10:00:00",
    ...overrides,
  };
}
