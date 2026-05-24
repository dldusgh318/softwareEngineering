"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { HTTPError } from "ky";

import { createBoothReservation } from "@/apis/booths/booth.api";
import {
  boothReservationStatusLabels,
  boothReservationStatusStyles,
} from "@/constants/booths/booth.constants";
import type { CurrentApplicant } from "@/lib/current-applicant";
import type { Booth, BoothReservationApplication } from "@/types/booth/booths.types";

type BoothReservationApplicationPanelProps = {
  booth: Booth;
  currentApplicant: CurrentApplicant | null;
  reservations: BoothReservationApplication[];
  onReservationCreated: (reservation: BoothReservationApplication) => void;
};

export function BoothReservationApplicationPanel({
  booth,
  currentApplicant,
  reservations,
  onReservationCreated,
}: BoothReservationApplicationPanelProps) {
  const [requestedTables, setRequestedTables] = useState(1);
  const [messageByBoothId, setMessageByBoothId] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedBoothReservation = useMemo(
    () => reservations.find((reservation) => reservation.boothId === booth.id),
    [booth.id, reservations],
  );

  const hasActiveReservation =
    selectedBoothReservation !== undefined && selectedBoothReservation.status !== "CANCELLED";
  const message = messageByBoothId[booth.id] ?? "";

  async function handleApply() {
    if (!currentApplicant) {
      setErrorMessage("로그인 후 부스 예약을 신청할 수 있습니다.");
      return;
    }

    setIsSubmitting(true);
    setMessageByBoothId((currentMessages) => ({ ...currentMessages, [booth.id]: "" }));
    setErrorMessage("");

    try {
      const reservation = await createBoothReservation({
        boothId: booth.id,
        applicantId: currentApplicant.id,
        applicantName: currentApplicant.name,
        requestedTables,
      });

      onReservationCreated(reservation);
      setMessageByBoothId((currentMessages) => ({
        ...currentMessages,
        [reservation.boothId]:
          "예약 신청이 완료되었습니다. 관리자 승인 대기 상태로 저장되었습니다.",
      }));
    } catch (error) {
      setErrorMessage(await resolveReservationErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="border-line-subtle border-t pt-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-text-muted text-sm font-semibold">예약 신청</p>
          <p className="text-text-secondary mt-1 text-sm leading-6">
            신청 후 예약은 관리자 승인 대기 상태로 저장됩니다.
          </p>
        </div>
        {selectedBoothReservation ? (
          <span
            className={`inline-flex h-8 shrink-0 items-center border px-3 text-xs font-bold ${boothReservationStatusStyles[selectedBoothReservation.status]}`}
          >
            {selectedBoothReservation.statusDescription ||
              boothReservationStatusLabels[selectedBoothReservation.status]}
          </span>
        ) : null}
      </div>

      {!currentApplicant ? (
        <div className="mt-4 border border-amber-300/35 bg-amber-400/10 p-3">
          <p className="text-sm font-semibold text-amber-100">로그인 후 예약 신청이 가능합니다.</p>
          <Link
            className="text-brand-cream mt-2 inline-flex text-sm font-bold underline-offset-4 hover:underline"
            href="/login"
          >
            로그인하러 가기
          </Link>
        </div>
      ) : null}

      <div className="mt-4 grid gap-3">
        <label className="block">
          <span className="text-text-muted text-sm font-semibold">신청 테이블 수</span>
          <select
            className="border-line-subtle mt-2 h-11 w-full border bg-white/10 px-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!currentApplicant || isSubmitting || hasActiveReservation}
            onChange={(event) => setRequestedTables(Number(event.target.value))}
            value={requestedTables}
          >
            {Array.from({ length: booth.availableTables }, (_, index) => index + 1).map((count) => (
              <option className="text-zinc-950" key={count} value={count}>
                {count}개
              </option>
            ))}
          </select>
        </label>

        <button
          className="bg-brand-mint h-11 px-4 text-sm font-bold text-zinc-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/45"
          disabled={!currentApplicant || isSubmitting || hasActiveReservation}
          onClick={handleApply}
          type="button"
        >
          {isSubmitting
            ? "신청 중"
            : !currentApplicant
              ? "로그인 후 예약 신청"
              : hasActiveReservation
                ? "이미 신청한 부스"
                : "예약 신청"}
        </button>
      </div>

      {message ? (
        <p className="mt-3 border border-emerald-300/40 bg-emerald-500/15 p-3 text-sm text-emerald-100">
          {message}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="mt-3 border border-rose-300/40 bg-rose-500/15 p-3 text-sm text-rose-100">
          {errorMessage}
        </p>
      ) : null}

      <div className="border-line-subtle mt-4 border bg-white/5 p-3">
        <p className="text-text-muted text-sm font-semibold">내 예약 상태</p>
        {selectedBoothReservation ? (
          <dl className="mt-3 grid gap-2 text-sm">
            <div className="grid grid-cols-[96px_1fr] gap-3">
              <dt className="text-text-muted font-semibold">상태</dt>
              <dd>{selectedBoothReservation.statusDescription}</dd>
            </div>
            <div className="grid grid-cols-[96px_1fr] gap-3">
              <dt className="text-text-muted font-semibold">테이블</dt>
              <dd>{selectedBoothReservation.requestedTables}개</dd>
            </div>
          </dl>
        ) : (
          <p className="text-text-secondary mt-2 text-sm">아직 이 부스에 신청한 예약이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

async function resolveReservationErrorMessage(error: unknown) {
  const httpError = error as HTTPError;

  if (httpError.response) {
    const data = await httpError.response.json().catch(() => null);
    if (isMessageResponse(data)) {
      return data.message;
    }
  }

  return "예약 신청에 실패했습니다.";
}

function isMessageResponse(data: unknown): data is { message: string } {
  return typeof data === "object" && data !== null && "message" in data;
}
