"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { cancelTicketReservation, getMyTicketReservations } from "@/apis/tickets/ticket.api";
import SiteHeader from "@/components/SiteHeader";
import type { TicketReservation } from "@/types/ticket/ticket.types";
import { getAuthErrorMessage } from "@/utils/auth-error";

export default function MyPerformanceTicketsPage() {
  const [cancelErrorMessage, setCancelErrorMessage] = useState("");
  const [cancellingReservationId, setCancellingReservationId] = useState<string | null>(null);
  const {
    data: reservations = [],
    error,
    isError,
    isLoading,
    refetch,
  } = useQuery<TicketReservation[]>({
    queryKey: ["ticket-reservations", "me"],
    queryFn: ({ signal }) => getMyTicketReservations(signal),
  });

  async function handleCancel(reservationId: string) {
    setCancelErrorMessage("");
    setCancellingReservationId(reservationId);

    try {
      await cancelTicketReservation(reservationId);
      await refetch();
    } catch (error) {
      setCancelErrorMessage(await getAuthErrorMessage(error));
    } finally {
      setCancellingReservationId(null);
    }
  }

  return (
    <main className="bg-brand-navy text-text-primary min-h-screen">
      <SiteHeader actionHref="/login" actionLabel="로그인" actionVariant="filled" fixed showNav />

      <section className="mx-auto w-full max-w-5xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div>
          <p className="typo-caption text-brand-coral-soft mb-4 font-black">MY TICKETS</p>
          <h1 className="typo-title text-4xl sm:text-5xl">내 공연 예매</h1>
          <p className="typo-body text-text-secondary mt-4 max-w-2xl">
            예매한 공연 티켓을 확인하고 취소할 수 있습니다.
          </p>
        </div>

        {cancelErrorMessage ? (
          <p className="mt-6 border border-rose-300/40 bg-rose-500/15 p-3 text-sm text-rose-100">
            {cancelErrorMessage}
          </p>
        ) : null}

        {isLoading ? (
          <div className="mt-8 grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-3xl border border-white/10 bg-white/10"
              />
            ))}
          </div>
        ) : null}

        {!isLoading && isError ? (
          <p className="border-brand-coral/30 bg-brand-coral/10 text-brand-coral-soft mt-8 rounded-2xl border p-5 text-sm font-bold">
            {error instanceof Error ? error.message : "예매 내역을 불러오지 못했습니다."}
          </p>
        ) : null}

        {!isLoading && !isError && reservations.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-white/12 bg-white/[0.07] p-8 text-center">
            <p className="text-text-muted text-sm font-bold">예매한 공연 티켓이 없습니다.</p>
            <Link
              href="/performances"
              className="bg-brand-coral hover:bg-brand-coral-soft hover:text-brand-navy mt-5 inline-flex h-10 items-center rounded-full px-4 text-sm font-black text-white transition"
            >
              공연 보러가기
            </Link>
          </div>
        ) : null}

        {!isLoading && !isError && reservations.length > 0 ? (
          <div className="mt-8 grid gap-4">
            {reservations.map((reservation) => (
              <TicketReservationListItem
                key={reservation.id}
                isCancelling={cancellingReservationId === reservation.id}
                reservation={reservation}
                onCancel={() => handleCancel(reservation.id)}
              />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

type TicketReservationListItemProps = {
  reservation: TicketReservation;
  isCancelling: boolean;
  onCancel: () => void;
};

function TicketReservationListItem({
  reservation,
  isCancelling,
  onCancel,
}: TicketReservationListItemProps) {
  const canCancel = reservation.status === "COMPLETED";

  return (
    <article className="rounded-3xl border border-white/14 bg-white/10 p-5 shadow-2xl shadow-black/10 backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-text-muted text-xs font-bold">예매 번호</p>
          <p className="mt-1 font-mono text-sm break-all">{reservation.id}</p>
          <p className="text-text-secondary mt-3 text-sm">공연 ID {reservation.performanceId}</p>
        </div>
        <span className="border-brand-cream/30 bg-brand-cream/12 text-brand-cream inline-flex h-8 shrink-0 items-center rounded-full border px-3 text-xs font-black">
          {reservation.statusDescription}
        </span>
      </div>

      {reservation.status === "FAILED" || reservation.status === "CANCELLED" ? (
        <p className="mt-4 border border-rose-300/40 bg-rose-500/15 p-3 text-sm text-rose-100">
          {reservation.status === "FAILED"
            ? "예매 처리에 실패해 선점된 좌석이 복구되었습니다."
            : "예매가 취소되어 좌석이 다시 예매 가능 상태로 복구되었습니다."}
        </p>
      ) : null}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link
          href={`/performances/tickets/${reservation.id}`}
          className="bg-brand-coral hover:bg-brand-coral-soft hover:text-brand-navy inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-black text-white transition"
        >
          티켓 확인
        </Link>
        {canCancel ? (
          <button
            type="button"
            disabled={isCancelling}
            onClick={onCancel}
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/30 px-4 text-sm font-black text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCancelling ? "예매 취소 중" : "예매 취소하기"}
          </button>
        ) : null}
      </div>
    </article>
  );
}
