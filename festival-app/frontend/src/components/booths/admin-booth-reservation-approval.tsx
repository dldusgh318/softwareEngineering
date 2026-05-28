"use client";

import { useEffect, useMemo, useState } from "react";
import type { HTTPError } from "ky";

import {
  approveBoothReservation,
  checkInBoothReservation,
  getPendingBoothReservations,
} from "@/apis/booths/booth.api";
import { BoothReservationQr } from "@/components/booths/booth-reservation-qr";
import SiteHeader from "@/components/SiteHeader";
import {
  boothReservationStatusLabels,
  boothReservationStatusStyles,
} from "@/constants/booths/booth.constants";
import { useAuth } from "@/providers/AuthProvider";
import type { BoothReservationApplication } from "@/types/booth/booths.types";

const ADMIN_APPROVER = {
  id: "admin-1",
  name: "관리자",
};
const QR_FAILURE_SIMULATION_INPUT_ID = "qr-failure-simulation";

export function AdminBoothReservationApproval() {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const [pendingReservations, setPendingReservations] = useState<BoothReservationApplication[]>([]);
  const [approvedReservations, setApprovedReservations] = useState<BoothReservationApplication[]>(
    [],
  );
  const [selectedReservationId, setSelectedReservationId] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [checkInQrCode, setCheckInQrCode] = useState("");
  const [checkInReservation, setCheckInReservation] = useState<BoothReservationApplication | null>(
    null,
  );
  const [checkInMessage, setCheckInMessage] = useState("");
  const [checkInErrorMessage, setCheckInErrorMessage] = useState("");
  const [simulateQrFailure, setSimulateQrFailure] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const selectedReservation = useMemo(
    () => pendingReservations.find((reservation) => reservation.id === selectedReservationId),
    [pendingReservations, selectedReservationId],
  );

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    if (!isInitialized || !isAuthenticated || !isAdmin) {
      return;
    }

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
  }, [isAdmin, isAuthenticated, isInitialized]);

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
        simulateQrFailure,
      });

      if (approvedReservation.status === "QR_FAILED") {
        setPendingReservations((currentReservations) =>
          currentReservations.map((reservation) =>
            reservation.id === approvedReservation.id ? approvedReservation : reservation,
          ),
        );
      } else {
        setPendingReservations((currentReservations) =>
          currentReservations.filter((reservation) => reservation.id !== approvedReservation.id),
        );
      }
      setApprovedReservations((currentReservations) => [
        approvedReservation,
        ...currentReservations,
      ]);
      setSelectedReservationId((currentId) => {
        if (approvedReservation.status === "QR_FAILED") {
          return approvedReservation.id;
        }

        if (currentId !== approvedReservation.id) {
          return currentId;
        }

        return (
          pendingReservations.find((reservation) => reservation.id !== approvedReservation.id)
            ?.id ?? ""
        );
      });
      setMessage(resolveApprovalSuccessMessage(approvedReservation));
    } catch (error) {
      setErrorMessage(await resolveApprovalErrorMessage(error));
    } finally {
      setIsApproving(false);
    }
  }

  async function handleCheckIn() {
    if (!checkInQrCode.trim()) {
      setCheckInErrorMessage("체크인할 QR 정보를 입력해주세요.");
      setCheckInMessage("");
      return;
    }

    setIsCheckingIn(true);
    setCheckInMessage("");
    setCheckInErrorMessage("");

    try {
      const checkedInReservation = await checkInBoothReservation({
        qrCode: checkInQrCode.trim(),
      });

      setApprovedReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation.id === checkedInReservation.id ? checkedInReservation : reservation,
        ),
      );
      setCheckInReservation(checkedInReservation);
      setCheckInMessage(`${checkedInReservation.applicantName}님의 현장 체크인이 완료되었습니다.`);
    } catch (error) {
      setCheckInErrorMessage(await resolveCheckInErrorMessage(error));
    } finally {
      setIsCheckingIn(false);
    }
  }

  return (
    <main className="bg-brand-navy min-h-screen text-white">
      <SiteHeader actionHref="/booths" actionLabel="부스 화면" fixed showNav />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 pt-24 pb-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:pt-28">
        {!isInitialized ? (
          <AdminAccessMessage
            title="권한 확인 중"
            description="관리자 계정 정보를 확인하고 있습니다."
          />
        ) : !isAuthenticated ? (
          <AdminAccessMessage
            title="로그인이 필요합니다"
            description="관리자 계정으로 로그인한 뒤 예약 승인 화면을 이용할 수 있습니다."
          />
        ) : !isAdmin ? (
          <AdminAccessMessage
            title="관리자 권한이 필요합니다"
            description="부스 예약 승인과 QR 발급은 관리자 계정에서만 처리할 수 있습니다."
          />
        ) : (
          <>
            <div className="space-y-5">
              <div className="border-line-subtle border-b pb-5">
                <p className="text-brand-mint-soft text-sm font-semibold">Admin Reservation</p>
                <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">
                  부스 예약 승인
                </h1>
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
                      <div
                        className="border-line-subtle border bg-white/5 p-4"
                        key={reservation.id}
                      >
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
                        {reservation.status === "QR_FAILED" ? (
                          <QrFailureResult reservation={reservation} />
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-text-secondary text-sm">아직 승인한 예약이 없습니다.</p>
                  )}
                </div>
              </section>
            </div>

            <aside className="grid h-fit gap-5">
              <section className="border-line-subtle bg-surface-glass border p-5 shadow-sm">
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
                    {selectedReservation.status === "QR_FAILED" ? (
                      <div className="border border-rose-300/35 bg-rose-500/12 p-3 text-sm text-rose-100">
                        이전 QR 발급이 실패했습니다. 재승인하면 QR 발급을 다시 시도합니다.
                      </div>
                    ) : null}

                    <label className="flex items-start gap-3 border border-white/12 bg-white/5 p-3 text-sm">
                      <input
                        aria-label="QR 발급 실패 시뮬레이션"
                        checked={simulateQrFailure}
                        className="mt-1"
                        id={QR_FAILURE_SIMULATION_INPUT_ID}
                        onChange={(event) => setSimulateQrFailure(event.target.checked)}
                        type="checkbox"
                      />
                      <span>
                        <span className="block font-bold">QR 발급 실패 시뮬레이션</span>
                        <span className="text-text-secondary mt-1 block">
                          테스트용으로 승인 후 QR 발급 실패와 보상 처리를 확인합니다.
                        </span>
                      </span>
                    </label>

                    <button
                      className="bg-brand-mint h-11 w-full px-4 text-sm font-bold text-zinc-950 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/45"
                      disabled={isApproving}
                      onClick={handleApprove}
                      type="button"
                    >
                      {isApproving
                        ? "승인 중"
                        : selectedReservation.status === "QR_FAILED"
                          ? "재승인하고 QR 재발급"
                          : "승인하고 QR 발급"}
                    </button>
                  </div>
                ) : (
                  <p className="text-text-secondary mt-5 text-sm">승인할 예약을 선택해주세요.</p>
                )}
              </section>

              <section
                aria-label="QR 체크인"
                className="border-line-subtle bg-surface-glass border p-5 shadow-sm"
              >
                <div>
                  <p className="text-text-muted text-sm font-semibold">현장 체크인</p>
                  <h2 className="mt-1 text-2xl font-bold">QR 검증</h2>
                </div>

                <div className="mt-5 space-y-4">
                  <label className="block text-sm font-semibold" htmlFor="booth-check-in-qr">
                    QR 값
                  </label>
                  <textarea
                    className="border-line-subtle focus:border-brand-mint min-h-24 w-full resize-none border bg-white/8 px-3 py-3 text-sm text-white transition outline-none placeholder:text-white/35"
                    id="booth-check-in-qr"
                    onChange={(event) => setCheckInQrCode(event.target.value)}
                    placeholder="스캔된 QR URL을 붙여넣으세요."
                    value={checkInQrCode}
                  />

                  {checkInErrorMessage ? (
                    <div className="border border-rose-300/40 bg-rose-500/15 px-4 py-3 text-sm text-rose-100">
                      {checkInErrorMessage}
                    </div>
                  ) : null}

                  {checkInMessage ? (
                    <div className="border border-emerald-300/40 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100">
                      {checkInMessage}
                    </div>
                  ) : null}

                  <button
                    className="h-11 w-full border border-white/25 bg-white/12 px-4 text-sm font-bold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
                    disabled={isCheckingIn}
                    onClick={handleCheckIn}
                    type="button"
                  >
                    {isCheckingIn ? "체크인 중" : "QR 체크인"}
                  </button>

                  {checkInReservation ? (
                    <div className="border-line-subtle border-t pt-4 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold">{checkInReservation.applicantName}</p>
                          <p className="text-text-secondary mt-1">
                            부스 {checkInReservation.boothId} · 테이블{" "}
                            {checkInReservation.requestedTables}개
                          </p>
                        </div>
                        <span
                          className={`inline-flex h-8 shrink-0 items-center border px-3 text-xs font-bold ${boothReservationStatusStyles[checkInReservation.status]}`}
                        >
                          {checkInReservation.statusDescription ||
                            boothReservationStatusLabels[checkInReservation.status]}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>
            </aside>
          </>
        )}
      </section>
    </main>
  );
}

function QrFailureResult({ reservation }: { reservation: BoothReservationApplication }) {
  const latestCompensation = reservation.compensationLogs[0];

  return (
    <div className="mt-4 border border-rose-300/35 bg-rose-500/12 p-3 text-sm text-rose-100">
      <p className="font-bold">QR 발급 실패</p>
      <p className="mt-1 text-rose-100/85">
        승인 상태가 보상 처리되었습니다. 관리자는 같은 예약을 다시 선택해 QR 발급을 재시도할 수
        있습니다.
      </p>
      {latestCompensation ? (
        <dl className="mt-3 grid gap-1 text-xs text-rose-100/80">
          <div className="grid grid-cols-[72px_1fr] gap-2">
            <dt className="font-semibold">보상 단계</dt>
            <dd>{latestCompensation.step}</dd>
          </div>
          <div className="grid grid-cols-[72px_1fr] gap-2">
            <dt className="font-semibold">상태 변경</dt>
            <dd>
              {latestCompensation.fromStatus} → {latestCompensation.toStatus}
            </dd>
          </div>
          <div className="grid grid-cols-[72px_1fr] gap-2">
            <dt className="font-semibold">원인</dt>
            <dd>{latestCompensation.reason}</dd>
          </div>
        </dl>
      ) : null}
    </div>
  );
}

function resolveApprovalSuccessMessage(reservation: BoothReservationApplication) {
  if (reservation.status === "QR_FAILED") {
    return `${reservation.applicantName}님의 예약 승인 중 QR 발급이 실패해 보상 처리했습니다.`;
  }

  return `${reservation.applicantName}님의 예약을 승인하고 QR을 발급했습니다.`;
}

function AdminAccessMessage({ title, description }: { title: string; description: string }) {
  return (
    <section className="border-line-subtle bg-surface-glass border p-6 shadow-sm lg:col-span-2">
      <p className="text-brand-mint-soft text-sm font-semibold">Admin Reservation</p>
      <h1 className="mt-2 text-3xl font-bold tracking-normal">{title}</h1>
      <p className="text-text-secondary mt-3 text-sm leading-6">{description}</p>
    </section>
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

async function resolveCheckInErrorMessage(error: unknown) {
  const httpError = error as HTTPError;

  if (httpError.response) {
    const data = await httpError.response.json().catch(() => null);
    if (isMessageResponse(data)) {
      return data.message;
    }
  }

  return "QR 체크인에 실패했습니다.";
}

function isMessageResponse(data: unknown): data is { message: string } {
  return typeof data === "object" && data !== null && "message" in data;
}
