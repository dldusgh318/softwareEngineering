import Link from "next/link";

import type { Performance } from "@/types/performance/performance.types";
import type { TicketReservation } from "@/types/ticket/ticket.types";

import TicketReservationResult from "./TicketReservationResult";

type PerformanceReservationPanelProps = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isSubmitting: boolean;
  performance: Performance;
  reservation: TicketReservation | null;
  errorMessage: string;
  cancelErrorMessage?: string;
  isCancelling?: boolean;
  onReserve: () => void;
  onCancel?: () => void;
  redirectPath?: string;
};

export default function PerformanceReservationPanel({
  isAuthenticated,
  isInitialized,
  isSubmitting,
  performance,
  reservation,
  errorMessage,
  cancelErrorMessage,
  isCancelling,
  onReserve,
  onCancel,
  redirectPath = "/performances",
}: PerformanceReservationPanelProps) {
  const isSoldOut = performance.remainingSeats <= 0;

  if (reservation) {
    return (
      <TicketReservationResult
        cancelErrorMessage={cancelErrorMessage}
        isCancelling={isCancelling}
        reservation={reservation}
        onCancel={onCancel}
      />
    );
  }

  return (
    <section className="rounded-3xl border border-white/14 bg-white/10 p-5 shadow-2xl shadow-black/10 backdrop-blur">
      <h2 className="text-xl font-black">티켓 예매</h2>
      <p className="typo-caption text-text-muted mt-2">
        좌석 확인, 좌석 선점, 예매 생성, QR 티켓 발급, 예매 완료 순서로 진행됩니다.
      </p>

      <div className="mt-5 rounded-2xl border border-white/12 bg-black/12 p-4">
        <p className="text-text-muted text-xs font-bold">잔여 좌석</p>
        <p className="mt-1 text-3xl font-black">
          {performance.remainingSeats.toLocaleString("ko-KR")}석
        </p>
      </div>

      {errorMessage ? (
        <p className="mt-4 border border-rose-300/40 bg-rose-500/15 p-3 text-sm text-rose-100">
          {errorMessage}
        </p>
      ) : null}

      {!isInitialized ? (
        <button
          type="button"
          disabled
          className="mt-5 h-11 w-full rounded-full bg-white/12 text-sm font-black text-white/60"
        >
          로그인 상태 확인 중
        </button>
      ) : !isAuthenticated ? (
        <Link
          href={`/login?redirect=${redirectPath}`}
          className="bg-brand-coral hover:bg-brand-coral-soft hover:text-brand-navy mt-5 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-black text-white transition"
        >
          로그인하고 예매하기
        </Link>
      ) : (
        <button
          type="button"
          disabled={isSubmitting || isSoldOut}
          onClick={onReserve}
          className="bg-brand-coral hover:bg-brand-coral-soft hover:text-brand-navy mt-5 h-11 w-full rounded-full text-sm font-black text-white transition disabled:cursor-not-allowed disabled:bg-white/12 disabled:text-white/50"
        >
          {isSubmitting ? "예매 중" : isSoldOut ? "매진" : "좌석 선점하고 예매하기"}
        </button>
      )}
    </section>
  );
}
