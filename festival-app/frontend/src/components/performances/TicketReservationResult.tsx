import type { TicketReservation } from "@/types/ticket/ticket.types";

import TicketQr from "./TicketQr";

type TicketReservationResultProps = {
  reservation: TicketReservation;
};

export default function TicketReservationResult({ reservation }: TicketReservationResultProps) {
  return (
    <section className="rounded-3xl border border-emerald-300/30 bg-emerald-500/12 p-5 shadow-2xl shadow-black/10">
      <p className="text-brand-mint-soft text-sm font-black">TICKET RESERVED</p>
      <h2 className="mt-2 text-2xl font-black">예매가 완료되었습니다</h2>
      <p className="text-text-secondary mt-2 text-sm">현장 입장 시 아래 QR 티켓을 제시해주세요.</p>
      <p className="text-text-muted mt-3 text-xs font-bold break-all">예매 번호 {reservation.id}</p>

      {reservation.qrCode ? (
        <div className="mt-5">
          <TicketQr qrCode={reservation.qrCode} />
        </div>
      ) : null}
    </section>
  );
}
