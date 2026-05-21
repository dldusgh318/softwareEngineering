import type { BoothReservation, BoothReservationStatus, CompensationLog } from "@/types/booth";

const now = new Date("2026-05-20T10:00:00+09:00").toISOString();

const initialReservations: BoothReservation[] = [
  {
    id: "booth-reservation-1",
    applicantName: "홍길동",
    boothName: "타코야끼 부스",
    location: "학생회관 앞 A-03",
    status: "APPROVED",
    approvedAt: now,
    qrCode: null,
    qrFailureReason: null,
    compensationLogs: [],
  },
  {
    id: "booth-reservation-2",
    applicantName: "김민지",
    boothName: "포토카드 교환 부스",
    location: "중앙광장 B-11",
    status: "RESERVED",
    approvedAt: now,
    qrCode: "QR-BOOTH-RESERVATION-2",
    qrFailureReason: null,
    compensationLogs: [],
  },
  {
    id: "booth-reservation-3",
    applicantName: "이서준",
    boothName: "동아리 굿즈 부스",
    location: "홍문관 뒤 C-07",
    status: "PENDING_APPROVAL",
    approvedAt: null,
    qrCode: null,
    qrFailureReason: null,
    compensationLogs: [],
  },
];

const globalForBoothReservations = globalThis as typeof globalThis & {
  boothReservations?: BoothReservation[];
};

const reservations = globalForBoothReservations.boothReservations ?? initialReservations;

globalForBoothReservations.boothReservations = reservations;

export function getBoothReservations() {
  return reservations;
}

export function getBoothReservation(id: string) {
  return reservations.find((reservation) => reservation.id === id);
}

export function rollbackApprovalAfterQrFailure({
  reservationId,
  reason,
}: {
  reservationId: string;
  reason: string;
}) {
  const reservation = getBoothReservation(reservationId);

  if (!reservation) {
    return {
      ok: false as const,
      status: 404,
      error: "예약 정보를 찾을 수 없습니다.",
    };
  }

  if (reservation.status !== "APPROVED") {
    return {
      ok: false as const,
      status: 409,
      error: "APPROVED 상태의 예약만 QR 실패 보상 처리를 할 수 있습니다.",
    };
  }

  const fromStatus: BoothReservationStatus = reservation.status;
  const toStatus: BoothReservationStatus = "PENDING_APPROVAL";
  const compensationLog: CompensationLog = {
    id: `compensation-${Date.now()}`,
    reservationId,
    fromStatus,
    toStatus,
    reason,
    createdAt: new Date().toISOString(),
  };

  reservation.status = toStatus;
  reservation.approvedAt = null;
  reservation.qrCode = null;
  reservation.qrFailureReason = reason;
  reservation.compensationLogs = [compensationLog, ...reservation.compensationLogs];

  return {
    ok: true as const,
    reservation,
    compensationLog,
    message: "QR 발급 실패로 승인 상태를 롤백하고 예약을 승인 대기 상태로 되돌렸습니다.",
  };
}
