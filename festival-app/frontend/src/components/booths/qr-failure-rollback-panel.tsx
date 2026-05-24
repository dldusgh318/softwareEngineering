"use client";

import { useEffect, useMemo, useState } from "react";

import {
  boothReservationStatusLabels,
  boothReservationStatusStyles,
} from "@/constants/booths/booth.constants";
import type {
  BoothReservation,
  BoothReservationStatus,
  QrFailureRollbackResponse,
} from "@/types/booths.types";

export function QrFailureRollbackPanel() {
  const [reservations, setReservations] = useState<BoothReservation[]>([]);
  const [selectedReservationId, setSelectedReservationId] = useState("");
  const [reason, setReason] = useState("QR provider timeout");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedReservation = useMemo(
    () => reservations.find((reservation) => reservation.id === selectedReservationId),
    [reservations, selectedReservationId],
  );

  async function handleRollback() {
    if (!selectedReservation) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`/api/booth-reservations/${selectedReservation.id}/qr-failure`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });
      const data = (await response.json()) as QrFailureRollbackResponse | { message: string };

      if (!response.ok) {
        setErrorMessage(data.message);
        return;
      }

      const rollbackData = data as QrFailureRollbackResponse;
      setReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation.id === rollbackData.reservation.id ? rollbackData.reservation : reservation,
        ),
      );
      setMessage(rollbackData.message);
    } catch {
      setErrorMessage("보상 처리 요청에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    let isActive = true;

    fetch("/api/booth-reservations", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { reservations: BoothReservation[] }) => {
        if (!isActive) {
          return;
        }

        setReservations(data.reservations);
        setSelectedReservationId((currentId) => {
          if (data.reservations.some((reservation) => reservation.id === currentId)) {
            return currentId;
          }

          return data.reservations[0]?.id ?? "";
        });
      })
      .catch(() => {
        if (isActive) {
          setErrorMessage("예약 상태를 불러오지 못했습니다.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f3eb] text-zinc-950">
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-teal-700">Booth Reservation Saga</p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-zinc-950">
              QR 발급 실패 보상 처리
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-700">
              관리자 승인 이후 QR 발급이 실패했을 때 승인 상태를 롤백하고, 예약을 다시 승인 대기
              상태로 되돌리는 Saga 보상 트랜잭션 데모입니다.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {["PENDING_APPROVAL", "APPROVED", "RESERVED"].map((status) => (
              <div key={status} className="border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-zinc-500">
                  {boothReservationStatusLabels[status as BoothReservationStatus]}
                </p>
                <p className="mt-3 text-3xl font-bold">
                  {reservations.filter((reservation) => reservation.status === status).length}
                </p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 px-5 py-4">
              <h2 className="text-lg font-bold">예약 상태 목록</h2>
            </div>
            <div className="divide-y divide-zinc-200">
              {isLoading ? (
                <p className="px-5 py-6 text-sm text-zinc-600">예약 정보를 불러오는 중입니다.</p>
              ) : (
                reservations.map((reservation) => (
                  <button
                    key={reservation.id}
                    className="grid w-full gap-3 px-5 py-4 text-left transition hover:bg-stone-50 md:grid-cols-[1fr_auto]"
                    onClick={() => setSelectedReservationId(reservation.id)}
                    type="button"
                  >
                    <span>
                      <span className="block font-semibold">{reservation.boothName}</span>
                      <span className="mt-1 block text-sm text-zinc-600">
                        {reservation.applicantName} · {reservation.location}
                      </span>
                    </span>
                    <span
                      className={`inline-flex h-8 items-center justify-center border px-3 text-sm font-semibold ${boothReservationStatusStyles[reservation.status]}`}
                    >
                      {boothReservationStatusLabels[reservation.status]}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <aside className="h-fit border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-zinc-500">보상 처리</p>
            <h2 className="text-xl font-bold">승인 상태 롤백</h2>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-zinc-700">대상 예약</span>
              <select
                className="mt-2 h-11 w-full border border-zinc-300 bg-white px-3 text-sm"
                onChange={(event) => setSelectedReservationId(event.target.value)}
                value={selectedReservationId}
              >
                {reservations.map((reservation) => (
                  <option key={reservation.id} value={reservation.id}>
                    {reservation.boothName} / {boothReservationStatusLabels[reservation.status]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-zinc-700">실패 사유</span>
              <input
                className="mt-2 h-11 w-full border border-zinc-300 px-3 text-sm"
                onChange={(event) => setReason(event.target.value)}
                value={reason}
              />
            </label>

            <div className="border border-zinc-200 bg-stone-50 p-4">
              <p className="text-sm font-semibold text-zinc-600">예상 흐름</p>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                APPROVED → QR 발급 실패 → PENDING_APPROVAL
              </p>
            </div>

            <button
              className="h-11 w-full bg-teal-700 px-4 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
              disabled={
                isSubmitting || !selectedReservation || selectedReservation.status !== "APPROVED"
              }
              onClick={handleRollback}
              type="button"
            >
              {isSubmitting ? "보상 처리 중" : "QR 실패 보상 처리"}
            </button>

            {message ? (
              <p className="border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                {message}
              </p>
            ) : null}

            {errorMessage ? (
              <p className="border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                {errorMessage}
              </p>
            ) : null}

            {selectedReservation?.qrFailureReason ? (
              <div className="border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                최근 실패 사유: {selectedReservation.qrFailureReason}
              </div>
            ) : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
