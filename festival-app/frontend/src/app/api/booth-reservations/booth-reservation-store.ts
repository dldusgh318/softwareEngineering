import { initialBoothReservations } from "@/app/api/booth-reservations/booth-reservation.mocks";
import type {
  BoothReservation,
  BoothReservationStatus,
  CompensationLog,
} from "@/types/booths.types";

const globalForBoothReservations = globalThis as typeof globalThis & {
  boothReservations?: BoothReservation[];
};

const reservations = globalForBoothReservations.boothReservations ?? initialBoothReservations;

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
