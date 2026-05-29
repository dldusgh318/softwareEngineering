import type { TicketReservation } from "@/types/ticket/ticket.types";

import TicketQr from "./TicketQr";

type TicketReservationResultProps = {
  reservation: TicketReservation;
  cancelErrorMessage?: string;
  isCancelling?: boolean;
  onCancel?: () => void;
};

export default function TicketReservationResult({
  reservation,
  cancelErrorMessage = "",
  isCancelling = false,
  onCancel,
}: TicketReservationResultProps) {
  const isCompleted = reservation.status === "COMPLETED";
  const isFailed = reservation.status === "FAILED";
  const isCancelled = reservation.status === "CANCELLED";
  const canCancel = isCompleted && onCancel !== undefined;

  return (
    <section className="rounded-3xl border border-emerald-300/30 bg-emerald-500/12 p-5 shadow-2xl shadow-black/10">
      <p className="text-brand-mint-soft text-sm font-black">
        {isFailed ? "TICKET FAILED" : isCancelled ? "TICKET CANCELLED" : "TICKET RESERVED"}
      </p>
      <h2 className="mt-2 text-2xl font-black">
        {isFailed
          ? "예매를 완료하지 못했습니다"
          : isCancelled
            ? "예매가 취소되었습니다"
            : "예매가 완료되었습니다"}
      </h2>
      <p className="text-text-secondary mt-2 text-sm">
        {isFailed
          ? "선점된 좌석은 복구되었습니다. 잠시 후 다시 시도해주세요."
          : isCancelled
            ? "취소된 예매의 좌석은 다시 예매 가능 상태로 복구되었습니다."
            : "현장 입장 시 아래 QR 티켓을 제시해주세요."}
      </p>
      <p className="text-text-muted mt-3 text-xs font-bold break-all">예매 번호 {reservation.id}</p>

      {isCompleted && reservation.qrCode ? (
        <div className="mt-5">
          <TicketQr qrCode={reservation.qrCode} />
        </div>
      ) : null}

      {cancelErrorMessage ? (
        <p className="mt-4 border border-rose-300/40 bg-rose-500/15 p-3 text-sm text-rose-100">
          {cancelErrorMessage}
        </p>
      ) : null}

      {canCancel ? (
        <button
          type="button"
          disabled={isCancelling}
          onClick={onCancel}
          className="mt-5 h-11 w-full rounded-full border border-white/30 text-sm font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCancelling ? "예매 취소 중" : "예매 취소하기"}
        </button>
      ) : null}
    </section>
  );
}
