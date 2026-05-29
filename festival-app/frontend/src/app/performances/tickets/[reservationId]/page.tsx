"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { cancelTicketReservation, getTicketReservation } from "@/apis/tickets/ticket.api";
import TicketQr from "@/components/performances/TicketQr";
import SiteHeader from "@/components/SiteHeader";
import type { TicketReservation } from "@/types/ticket/ticket.types";
import { getAuthErrorMessage } from "@/utils/auth-error";

export default function PerformanceTicketPage() {
  const params = useParams<{ reservationId: string }>();
  const [cancelErrorMessage, setCancelErrorMessage] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const {
    data: reservation,
    error,
    isError,
    isLoading,
    refetch,
  } = useQuery<TicketReservation>({
    queryKey: ["ticket-reservation", params.reservationId],
    queryFn: ({ signal }) => getTicketReservation(params.reservationId, signal),
  });
  const canCancel = reservation?.status === "COMPLETED";

  async function handleCancel() {
    setCancelErrorMessage("");
    setIsCancelling(true);

    try {
      await cancelTicketReservation(params.reservationId);
      await refetch();
    } catch (error) {
      setCancelErrorMessage(await getAuthErrorMessage(error));
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <main className="bg-brand-navy min-h-screen text-white">
      <SiteHeader actionHref="/performances" actionLabel="공연 화면" fixed showNav />
      <section className="mx-auto w-full max-w-3xl px-5 pt-24 pb-8 lg:pt-28">
        <div className="border-line-subtle bg-surface-glass border p-5 shadow-sm">
          <p className="text-brand-coral-soft text-sm font-semibold">Performance Ticket</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal">공연 티켓 확인</h1>

          {isLoading ? (
            <p className="text-text-secondary mt-6 text-sm">티켓 정보를 불러오는 중입니다.</p>
          ) : null}

          {isError ? (
            <p className="mt-6 border border-rose-300/40 bg-rose-500/15 p-3 text-sm text-rose-100">
              {error instanceof Error ? error.message : "티켓 정보를 확인하지 못했습니다."}
            </p>
          ) : null}

          {reservation ? (
            <div className="mt-6 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-text-muted text-sm font-semibold">예매 번호</p>
                  <p className="mt-1 font-mono text-sm break-all">{reservation.id}</p>
                </div>
                <span className="inline-flex h-8 shrink-0 items-center border border-emerald-300 bg-emerald-50 px-3 text-xs font-bold text-emerald-800">
                  {reservation.statusDescription}
                </span>
              </div>

              <dl className="grid gap-3 text-sm">
                <div className="border-line-subtle grid grid-cols-[96px_1fr] gap-3 border-b pb-3">
                  <dt className="text-text-muted font-semibold">공연</dt>
                  <dd className="font-medium">{reservation.performanceId}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-3">
                  <dt className="text-text-muted font-semibold">상태</dt>
                  <dd className="font-medium">{reservation.statusDescription}</dd>
                </div>
              </dl>

              {reservation.status === "FAILED" || reservation.status === "CANCELLED" ? (
                <p className="border border-rose-300/40 bg-rose-500/15 p-3 text-sm text-rose-100">
                  {reservation.status === "FAILED"
                    ? "예매 처리에 실패해 선점된 좌석이 복구되었습니다."
                    : "예매가 취소되어 좌석이 다시 예매 가능 상태로 복구되었습니다."}
                </p>
              ) : null}

              {reservation.status === "COMPLETED" && reservation.qrCode ? (
                <div className="border-line-subtle border-t pt-5">
                  <TicketQr qrCode={reservation.qrCode} />
                </div>
              ) : null}

              {cancelErrorMessage ? (
                <p className="border border-rose-300/40 bg-rose-500/15 p-3 text-sm text-rose-100">
                  {cancelErrorMessage}
                </p>
              ) : null}

              {canCancel ? (
                <button
                  type="button"
                  disabled={isCancelling}
                  onClick={handleCancel}
                  className="h-11 w-full rounded-full border border-white/30 text-sm font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCancelling ? "예매 취소 중" : "예매 취소하기"}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
