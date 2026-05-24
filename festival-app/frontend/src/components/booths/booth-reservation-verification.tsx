"use client";

import { useEffect, useState } from "react";

import { getBoothReservation } from "@/apis/booths/booth.api";
import { BoothReservationQr } from "@/components/booths/booth-reservation-qr";
import SiteHeader from "@/components/SiteHeader";
import {
  boothReservationStatusLabels,
  boothReservationStatusStyles,
} from "@/constants/booths/booth.constants";
import type { BoothReservationApplication } from "@/types/booths.types";

type BoothReservationVerificationProps = {
  reservationId: string;
};

export function BoothReservationVerification({ reservationId }: BoothReservationVerificationProps) {
  const [reservation, setReservation] = useState<BoothReservationApplication | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    getBoothReservation(reservationId, controller.signal)
      .then((data) => {
        if (isActive) {
          setReservation(data);
        }
      })
      .catch(() => {
        if (isActive) {
          setErrorMessage("예약 정보를 확인하지 못했습니다.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [reservationId]);

  return (
    <main className="bg-brand-navy min-h-screen text-white">
      <SiteHeader actionHref="/booths" actionLabel="부스 화면" fixed showNav />
      <section className="mx-auto w-full max-w-3xl px-5 pt-24 pb-8 lg:pt-28">
        <div className="border-line-subtle bg-surface-glass border p-5 shadow-sm">
          <p className="text-brand-mint-soft text-sm font-semibold">Reservation Check</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal">부스 예약 확인</h1>

          {isLoading ? (
            <p className="text-text-secondary mt-6 text-sm">예약 정보를 불러오는 중입니다.</p>
          ) : null}

          {errorMessage ? (
            <p className="mt-6 border border-rose-300/40 bg-rose-500/15 p-3 text-sm text-rose-100">
              {errorMessage}
            </p>
          ) : null}

          {reservation ? (
            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-text-muted text-sm font-semibold">예약 번호</p>
                  <p className="mt-1 font-mono text-sm break-all">{reservation.id}</p>
                </div>
                <span
                  className={`inline-flex h-8 shrink-0 items-center border px-3 text-xs font-bold ${boothReservationStatusStyles[reservation.status]}`}
                >
                  {reservation.statusDescription ||
                    boothReservationStatusLabels[reservation.status]}
                </span>
              </div>

              <dl className="grid gap-3 text-sm">
                <div className="border-line-subtle grid grid-cols-[96px_1fr] gap-3 border-b pb-3">
                  <dt className="text-text-muted font-semibold">신청자</dt>
                  <dd className="font-medium">{reservation.applicantName}</dd>
                </div>
                <div className="border-line-subtle grid grid-cols-[96px_1fr] gap-3 border-b pb-3">
                  <dt className="text-text-muted font-semibold">부스</dt>
                  <dd className="font-medium">{reservation.boothId}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-3">
                  <dt className="text-text-muted font-semibold">테이블</dt>
                  <dd className="font-medium">{reservation.requestedTables}개</dd>
                </div>
              </dl>

              {reservation.qrCode ? (
                <div className="border-line-subtle border-t pt-5">
                  <BoothReservationQr qrCode={reservation.qrCode} />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
