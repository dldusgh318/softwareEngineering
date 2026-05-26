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
      <p className="text-text-secondary mt-2 text-sm">
        좌석 확인부터 QR 티켓 발급까지 정상 Saga 흐름이 완료되었습니다.
      </p>

      {reservation.qrCode ? (
        <div className="mt-5">
          <TicketQr qrCode={reservation.qrCode} />
        </div>
      ) : null}

      <ol className="mt-5 grid gap-2">
        {reservation.sagaLogs.map((log) => (
          <li
            key={`${log.step}-${log.createdAt}`}
            className="border border-white/12 bg-black/12 p-3 text-sm"
          >
            <span className="font-black text-white">{log.step}</span>
            <span className="text-text-secondary ml-2">{log.message}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
