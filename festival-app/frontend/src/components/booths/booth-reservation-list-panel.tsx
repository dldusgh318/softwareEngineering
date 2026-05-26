import Link from "next/link";

import {
  boothReservationStatusLabels,
  boothReservationStatusStyles,
} from "@/constants/booths/booth.constants";
import type {
  Booth,
  BoothReservationApplication,
  BoothReservationCompensationLog,
} from "@/types/booth/booths.types";

type BoothReservationListPanelProps = {
  booths: Booth[];
  isLoggedIn: boolean;
  reservations: BoothReservationApplication[];
  onSelectBooth: (boothId: string) => void;
};

export function BoothReservationListPanel({
  booths,
  isLoggedIn,
  reservations,
  onSelectBooth,
}: BoothReservationListPanelProps) {
  const boothNameById = new Map(booths.map((booth) => [booth.id, booth.name]));

  return (
    <section
      aria-label="내 예약 현황"
      className="border-line-subtle bg-surface-glass border p-5 shadow-sm backdrop-blur"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-brand-mint-soft text-sm font-semibold">My Reservations</p>
          <h2 className="mt-1 text-2xl font-bold">내 예약 현황</h2>
        </div>
        <span className="border-line-subtle bg-white/10 px-3 py-2 text-sm font-bold">
          {reservations.length}건
        </span>
      </div>

      {!isLoggedIn ? (
        <div className="mt-4 border border-amber-300/35 bg-amber-400/10 p-3">
          <p className="text-sm font-semibold text-amber-100">
            로그인 후 내 부스 예약 현황을 확인할 수 있습니다.
          </p>
          <Link
            className="text-brand-cream mt-2 inline-flex text-sm font-bold underline-offset-4 hover:underline"
            href="/login"
          >
            로그인하러 가기
          </Link>
        </div>
      ) : reservations.length > 0 ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {reservations.map((reservation) => (
            <button
              className="border-line-subtle hover:border-brand-mint bg-white/5 p-4 text-left transition hover:bg-white/10"
              key={reservation.id}
              onClick={() => onSelectBooth(reservation.boothId)}
              type="button"
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block font-bold">
                    {boothNameById.get(reservation.boothId) ?? reservation.boothId}
                  </span>
                  <span className="text-text-secondary mt-1 block text-sm">
                    신청 테이블 {reservation.requestedTables}개
                  </span>
                  {reservation.qrCode ? (
                    <span className="text-brand-mint-soft mt-2 block font-mono text-xs">
                      {reservation.qrCode}
                    </span>
                  ) : null}
                  {reservation.status === "QR_FAILED" ? (
                    <QrFailureSummary compensationLog={reservation.compensationLogs[0]} />
                  ) : null}
                </span>
                <span
                  className={`inline-flex h-8 shrink-0 items-center border px-3 text-xs font-bold ${boothReservationStatusStyles[reservation.status]}`}
                >
                  {reservation.statusDescription ||
                    boothReservationStatusLabels[reservation.status]}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-text-secondary mt-4 text-sm">아직 신청한 부스 예약이 없습니다.</p>
      )}
    </section>
  );
}

function QrFailureSummary({
  compensationLog,
}: {
  compensationLog?: BoothReservationCompensationLog;
}) {
  return (
    <span className="mt-3 block border border-rose-300/35 bg-rose-500/12 p-3 text-sm text-rose-100">
      <span className="block font-bold">QR 발급 실패</span>
      <span className="mt-1 block text-rose-100/85">관리자 재승인 후 QR 재발급이 필요합니다.</span>
      {compensationLog ? (
        <span className="mt-2 block text-xs text-rose-100/75">
          {compensationLog.reason} · {compensationLog.fromStatus} → {compensationLog.toStatus}
        </span>
      ) : null}
    </span>
  );
}
