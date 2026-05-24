"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { getBoothReservationsByApplicant, getBooths } from "@/apis/booths/booth.api";
import { BoothCard } from "@/components/booths/booth-card";
import { BoothDetailPanel } from "@/components/booths/booth-detail-panel";
import { BoothReservationListPanel } from "@/components/booths/booth-reservation-list-panel";
import SiteHeader from "@/components/SiteHeader";
import {
  getApplicantSnapshot,
  parseApplicantSnapshot,
  subscribeToApplicantChange,
} from "@/lib/current-applicant";
import type { Booth, BoothReservationApplication } from "@/types/booths.types";

export function BoothDirectory() {
  const applicantSnapshot = useSyncExternalStore(
    subscribeToApplicantChange,
    getApplicantSnapshot,
    () => null,
  );
  const currentApplicant = useMemo(
    () => parseApplicantSnapshot(applicantSnapshot),
    [applicantSnapshot],
  );
  const [booths, setBooths] = useState<Booth[]>([]);
  const [reservations, setReservations] = useState<BoothReservationApplication[]>([]);
  const [selectedBoothId, setSelectedBoothId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const selectedBooth = useMemo(
    () => booths.find((booth) => booth.id === selectedBoothId),
    [booths, selectedBoothId],
  );

  useEffect(() => {
    let isActive = true;

    getBooths()
      .then((data) => {
        if (!isActive) {
          return;
        }

        setBooths(data);
        setSelectedBoothId((currentId) => {
          if (data.some((booth) => booth.id === currentId)) {
            return currentId;
          }

          return data[0]?.id ?? "";
        });
      })
      .catch(() => {
        if (isActive) {
          setErrorMessage("부스 목록을 불러오지 못했습니다.");
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

  useEffect(() => {
    if (!currentApplicant) {
      return;
    }

    let isActive = true;
    const controller = new AbortController();

    getBoothReservationsByApplicant(currentApplicant.id, controller.signal)
      .then((data) => {
        if (isActive) {
          setReservations(data);
        }
      })
      .catch(() => {
        if (isActive) {
          setErrorMessage("내 예약 현황을 불러오지 못했습니다.");
        }
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [currentApplicant]);

  function handleReservationCreated(reservation: BoothReservationApplication) {
    setReservations((currentReservations) => [reservation, ...currentReservations]);
  }

  return (
    <main className="bg-brand-navy min-h-screen text-white">
      <SiteHeader actionHref="/login" actionLabel="로그인" fixed showNav />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 pt-24 pb-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:pt-28">
        <div className="space-y-5">
          <div className="border-line-subtle flex flex-col gap-3 border-b pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-brand-mint-soft text-sm font-semibold">Booth Reservation</p>
              <h1 className="mt-2 text-3xl font-bold tracking-normal md:text-4xl">
                축제 부스 목록
              </h1>
            </div>
            <p className="text-text-secondary max-w-xl text-sm leading-6">
              부스 예약 신청 전 운영 시간, 잔여 테이블, 캠퍼스 위치를 먼저 확인합니다.
            </p>
          </div>

          {errorMessage ? (
            <div className="border border-rose-300/40 bg-rose-500/15 px-4 py-3 text-sm text-rose-100">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    className="border-line-subtle bg-surface-glass h-52 animate-pulse border"
                    key={index}
                  />
                ))
              : booths.map((booth) => (
                  <BoothCard
                    booth={booth}
                    isSelected={selectedBoothId === booth.id}
                    key={booth.id}
                    onSelect={setSelectedBoothId}
                  />
                ))}
          </div>

          <BoothReservationListPanel
            booths={booths}
            isLoggedIn={currentApplicant !== null}
            onSelectBooth={setSelectedBoothId}
            reservations={reservations}
          />
        </div>

        <BoothDetailPanel
          booth={selectedBooth}
          currentApplicant={currentApplicant}
          onReservationCreated={handleReservationCreated}
          reservations={reservations}
        />
      </section>
    </main>
  );
}
