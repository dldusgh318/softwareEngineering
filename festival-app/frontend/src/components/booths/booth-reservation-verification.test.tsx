import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getBoothReservation } from "@/apis/booths/booth.api";
import { BoothReservationVerification } from "@/components/booths/booth-reservation-verification";

vi.mock("@/apis/booths/booth.api", () => ({
  getBoothReservation: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/booths/reservations/reservation-1",
}));

const mockedGetBoothReservation = vi.mocked(getBoothReservation);

describe("BoothReservationVerification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows reservation details from scanned QR url", async () => {
    mockedGetBoothReservation.mockResolvedValue({
      id: "reservation-1",
      boothId: "booth-1",
      applicantId: "demo-user-1",
      applicantName: "홍길동",
      requestedTables: 2,
      status: "RESERVED",
      statusDescription: "QR 발급 완료",
      qrCode: "http://localhost:3000/booths/reservations/reservation-1",
      sagaLogs: [],
      createdAt: "2026-05-24T10:00:00",
      updatedAt: "2026-05-24T10:05:00",
    });

    render(<BoothReservationVerification reservationId="reservation-1" />);

    expect(mockedGetBoothReservation).toHaveBeenCalledWith(
      "reservation-1",
      expect.any(AbortSignal),
    );
    expect(await screen.findByText("홍길동")).toBeInTheDocument();
    expect(screen.getByText("QR 발급 완료")).toBeInTheDocument();
    expect(
      screen.getByLabelText("예약 QR http://localhost:3000/booths/reservations/reservation-1"),
    ).toBeInTheDocument();
  });
});
