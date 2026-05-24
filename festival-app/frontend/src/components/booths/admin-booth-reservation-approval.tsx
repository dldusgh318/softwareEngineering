"use client";

import { useEffect, useMemo, useState } from "react";
import type { HTTPError } from "ky";

import { approveBoothReservation, getPendingBoothReservations } from "@/apis/booths/booth.api";
import { BoothReservationQr } from "@/components/booths/booth-reservation-qr";
import SiteHeader from "@/components/SiteHeader";
import {
  boothReservationStatusLabels,
  boothReservationStatusStyles,
} from "@/constants/booths/booth.constants";
import type { BoothReservationApplication } from "@/types/booth/booths.types";

const ADMIN_APPROVER = {
  id: "admin-1",
  name: "관리자",
};

export function AdminBoothReservationApproval() {
  const [pendingReservations, setPendingReservations] = useState<BoothReservationApplication[]>([]);
  const [approvedReservations, setApprovedReservations] = useState<BoothReservationApplication[]>(
    [],
  );
  const [selectedReservationId, setSelectedReservationId] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);

  const selectedReservation = useMemo(
    () => pendingReservations.find((reservation) => reservation.id === selectedReservationId),
    [pendingReservations, selectedReservationId],
  );

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    getPendingBoothReservations(controller.signal)
      .then((reservations) => {
        if (!isActive) {
          return;
        }

        setPendingReservations(reservations);
        setSelectedReservationId((currentId) => {
          if (reservations.some((reservation) => reservation.id === currentId)) {
            return currentId;
          }

          return reservations[0]?.id ?? "";
        });
      })
      .catch(() => {
        if (isActive) {
          setErrorMessage("승인 대기 예약을 불러오지 못했습니다.");
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
  }, []);

  async function handleApprove() {
    if (!selectedReservation) {
      return;
    }

    setIsApproving(true);
    setMessage("");
    setErrorMessage("");

    try {
      const approvedReservation = await approveBoothReservation(selectedReservation.id, {
        approverId: ADMIN_APPROVER.id,
        approverName: ADMIN_APPROVER.name,
      });

      setPendingReservations((currentReservations) =>
        currentReservations.filter((reservation) => reservation.id !== approvedReservation.id),
      );
      setApprovedReservations((currentReservations) => [
        approvedReservation,
        ...currentReservations,
      ]);
      setSelectedReservationId((currentId) => {
        if (currentId !== approvedReservation.id) {
          return currentId;
        }

        return (
          pendingReservations.find((reservation) => reservation.id !== approvedReservation.id)
            ?.id ?? ""
        );
      });
      setMessage(`${approvedReservation.applicantName}님의 예약을 승인하고 QR을 발급했습니다.`);
    } catch (error) {
      setErrorMessage(await resolveApprovalErrorMessage(error));
    } finally {
      setIsApproving(false);
    }
  }

  return (
    <main className="bg-brand-navy min-h-screen text-white">
      <SiteHeader actionHref="/booths" actionLabel="부스 화면" fixed showNav />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 pt-24 pb-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:pt-28">
        <div className="space-y-5">
          <div className="border-line-subtle border-b pb-5">
            <p className="text-brand-mint-soft text-sm font-semibold">Admin Reservation</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">부스 예약 승인</h1>
          </div>

          {errorMessage ? (
            <div className="border border-rose-300/40 bg-rose-500/15 px-4 py-3 text-sm text-rose-100">
              {errorMessage}
            </div>
          ) : null}

          {message ? (
            <div className="border border-emerald-300/40 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100">
              {message}
            </div>
          ) : null}

          <section
            aria-label="승인 대기 예약"
            className="border-line-subtle bg-surface-glass border p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">승인 대기</h2>
              <span className="border-line-subtle bg-white/10 px-3 py-2 text-sm font-bold">
                {pendingReservations.length}건
              </span>
            </div>

            <div className="mt-4 grid gap-3">
              {isLoading ? (
                <p className="text-text-secondary text-sm">예약 신청을 불러오는 중입니다.</p>
              ) : pendingReservations.length > 0 ? (
                pendingReservations.map((reservation) => (
                  <button
                    className={`border p-4 text-left transition ${
                      selectedReservationId === reservation.id
                        ? "border-brand-mint bg-white/12"
                        : "border-line-subtle bg-white/5 hover:bg-white/10"
                    }`}
                    key={reservation.id}
                    onClick={() => setSelectedReservationId(reservation.id)}
                    type="button"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span>
                        <span className="block font-bold">{reservation.applicantName}</span>
                        <span className="text-text-secondary mt-1 block text-sm">
                          부스 {reservation.boothId} · 테이블 {reservation.requestedTables}개
                        </span>
                      </span>
                      <span
                        className={`inline-flex h-8 shrink-0 items-center border px-3 text-xs font-bold ${boothReservationStatusStyles[reservation.status]}`}
                      >
                        {reservation.statusDescription ||
                          boothReservationStatusLabels[reservation.status]}
                      </span>
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-text-secondary text-sm">승인 대기 예약이 없습니다.</p>
              )}
            </div>
          </section>

          <section
            aria-label="방금 승인한 예약"
            className="border-line-subtle bg-surface-glass border p-5 shadow-sm"
          >
            <h2 className="text-xl font-bold">승인 완료</h2>
            <div className="mt-4 grid gap-3">
              {approvedReservations.length > 0 ? (
                approvedReservations.map((reservation) => (
                  <div className="border-line-subtle border bg-white/5 p-4" key={reservation.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold">{reservation.applicantName}</p>
                        <p className="text-text-secondary mt-1 text-sm">
                          부스 {reservation.boothId} · 테이블 {reservation.requestedTables}개
                        </p>
                      </div>
                      <span
                        className={`inline-flex h-8 shrink-0 items-center border px-3 text-xs font-bold ${boothReservationStatusStyles[reservation.status]}`}
                      >
                        {reservation.statusDescription ||
                          boothReservationStatusLabels[reservation.status]}
                      </span>
                    </div>
                    {reservation.qrCode ? (
                      <div className="border-line-subtle mt-4 border-t pt-4">
                        <BoothReservationQr qrCode={reservation.qrCode} />
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="text-text-secondary text-sm">아직 승인한 예약이 없습니다.</p>
              )}
            </div>
          </section>
        </div>

        <aside className="border-line-subtle bg-surface-glass h-fit border p-5 shadow-sm">
          <div>
            <p className="text-text-muted text-sm font-semibold">승인 처리</p>
            <h2 className="mt-1 text-2xl font-bold">선택 예약</h2>
          </div>

          {selectedReservation ? (
            <div className="mt-5 space-y-4">
              <dl className="grid gap-3 text-sm">
                <div className="border-line-subtle grid grid-cols-[96px_1fr] gap-3 border-b pb-3">
                  <dt className="text-text-muted font-semibold">신청자</dt>
                  <dd className="font-medium">{selectedReservation.applicantName}</dd>
                </div>
                <div className="border-line-subtle grid grid-cols-[96px_1fr] gap-3 border-b pb-3">
                  <dt className="text-text-muted font-semibold">부스</dt>
                  <dd className="font-medium">{selectedReservation.boothId}</dd>
                </div>
                <div className="border-line-subtle grid grid-cols-[96px_1fr] gap-3 border-b pb-3">
                  <dt className="text-text-muted font-semibold">테이블</dt>
                  <dd className="font-medium">{selectedReservation.requestedTables}개</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-3">
                  <dt className="text-text-muted font-semibold">상태</dt>
                  <dd className="font-medium">{selectedReservation.statusDescription}</dd>
                </div>
              </dl>

              <button
                className="bg-brand-mint h-11 w-full px-4 text-sm font-bold text-zinc-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/45"
                disabled={isApproving}
                onClick={handleApprove}
                type="button"
              >
                {isApproving ? "승인 중" : "승인하고 QR 발급"}
              </button>
            </div>
          ) : (
            <p className="text-text-secondary mt-5 text-sm">승인할 예약을 선택해주세요.</p>
          )}
        </aside>
      </section>
    </main>
  );
}

async function resolveApprovalErrorMessage(error: unknown) {
  const httpError = error as HTTPError;

  if (httpError.response) {
    const data = await httpError.response.json().catch(() => null);
    if (isMessageResponse(data)) {
      return data.message;
    }
  }

  return "예약 승인에 실패했습니다.";
}

function isMessageResponse(data: unknown): data is { message: string } {
  return typeof data === "object" && data !== null && "message" in data;
}
