"use client";

import { useEffect, useMemo, useState } from "react";

import { getBooths } from "@/apis/booths/booth.api";
import SiteHeader from "@/components/SiteHeader";
import type { Booth } from "@/types/booth";

const categoryLabels: Record<Booth["category"], string> = {
  FOOD: "푸드",
  GOODS: "굿즈",
  EXPERIENCE: "체험",
  EVENT: "이벤트",
};

const categoryStyles: Record<Booth["category"], string> = {
  FOOD: "border-red-200 bg-red-50 text-red-700",
  GOODS: "border-indigo-200 bg-indigo-50 text-indigo-700",
  EXPERIENCE: "border-emerald-200 bg-emerald-50 text-emerald-700",
  EVENT: "border-amber-200 bg-amber-50 text-amber-800",
};

export function BoothDirectory() {
  const [booths, setBooths] = useState<Booth[]>([]);
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
                  <button
                    className={`bg-surface-glass hover:border-brand-mint hover:bg-surface-glass-hover min-h-52 border p-5 text-left shadow-sm backdrop-blur transition ${
                      selectedBoothId === booth.id ? "border-brand-mint" : "border-line-subtle"
                    }`}
                    key={booth.id}
                    onClick={() => setSelectedBoothId(booth.id)}
                    type="button"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span>
                        <span className="block text-lg font-bold">{booth.name}</span>
                        <span className="text-text-muted mt-1 block text-sm">{booth.teamName}</span>
                      </span>
                      <span
                        className={`inline-flex h-8 shrink-0 items-center border px-3 text-xs font-bold ${categoryStyles[booth.category]}`}
                      >
                        {categoryLabels[booth.category]}
                      </span>
                    </span>
                    <span className="text-text-secondary mt-4 block min-h-12 text-sm leading-6">
                      {booth.description}
                    </span>
                    <span className="text-text-secondary mt-5 grid gap-2 text-sm sm:grid-cols-2">
                      <span className="border-line-subtle border bg-white/5 px-3 py-2">
                        {booth.operatingHours}
                      </span>
                      <span className="border-line-subtle border bg-white/5 px-3 py-2">
                        잔여 테이블 {booth.availableTables}개
                      </span>
                    </span>
                    <span className="text-brand-cream mt-3 block text-sm font-semibold">
                      {booth.location.area} {booth.location.detail}
                    </span>
                  </button>
                ))}
          </div>
        </div>

        <aside className="border-line-subtle bg-surface-glass h-fit border p-5 shadow-sm backdrop-blur">
          {selectedBooth ? (
            <div className="space-y-5">
              <div>
                <p className="text-text-muted text-sm font-semibold">선택한 부스</p>
                <h2 className="mt-1 text-2xl font-bold">{selectedBooth.name}</h2>
                <p className="text-text-muted mt-2 text-sm">{selectedBooth.teamName}</p>
              </div>

              <div className="border-line-subtle relative h-72 overflow-hidden border bg-white/10">
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/15" />
                <div className="absolute inset-y-0 left-1/2 w-px bg-white/15" />
                <div className="text-text-muted absolute top-4 left-4 text-xs font-bold">
                  캠퍼스 지도
                </div>
                <div className="text-text-secondary absolute right-4 bottom-4 left-4 grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                  <span className="border-line-subtle border bg-white/10 py-2">학생회관</span>
                  <span className="border-line-subtle border bg-white/10 py-2">중앙광장</span>
                  <span className="border-line-subtle border bg-white/10 py-2">운동장</span>
                </div>
                <div
                  aria-label={`${selectedBooth.name} 위치`}
                  className="bg-brand-mint absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-md"
                  style={{
                    left: `${selectedBooth.location.mapX}%`,
                    top: `${selectedBooth.location.mapY}%`,
                  }}
                />
              </div>

              <dl className="grid gap-3 text-sm">
                <div className="border-line-subtle grid grid-cols-[96px_1fr] gap-3 border-b pb-3">
                  <dt className="text-text-muted font-semibold">구역</dt>
                  <dd className="font-medium">{selectedBooth.location.zone}구역</dd>
                </div>
                <div className="border-line-subtle grid grid-cols-[96px_1fr] gap-3 border-b pb-3">
                  <dt className="text-text-muted font-semibold">위치</dt>
                  <dd className="font-medium">
                    {selectedBooth.location.area} {selectedBooth.location.detail}
                  </dd>
                </div>
                <div className="border-line-subtle grid grid-cols-[96px_1fr] gap-3 border-b pb-3">
                  <dt className="text-text-muted font-semibold">운영 시간</dt>
                  <dd className="font-medium">{selectedBooth.operatingHours}</dd>
                </div>
                <div className="grid grid-cols-[96px_1fr] gap-3">
                  <dt className="text-text-muted font-semibold">테이블</dt>
                  <dd className="font-medium">예약 가능 {selectedBooth.availableTables}개</dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="text-text-secondary text-sm">부스를 선택해주세요.</p>
          )}
        </aside>
      </section>
    </main>
  );
}
