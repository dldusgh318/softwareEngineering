"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getPerformance } from "@/apis/performances/performance.api";
import PerformanceDetailPanel from "@/components/performances/PerformanceDetailPanel";
import PerformanceReservationPanel from "@/components/performances/PerformanceReservationPanel";
import SiteHeader from "@/components/SiteHeader";
import { useAuth } from "@/providers/AuthProvider";
import type { Performance } from "@/types/performance/performance.types";

export default function PerformanceDetailPage() {
  const params = useParams<{ performanceId: string }>();
  const { isAuthenticated, isInitialized } = useAuth();
  const performanceId = useMemo(() => Number(params.performanceId), [params.performanceId]);
  const performanceDetailPath = `/performances/${performanceId}`;
  const {
    data: performance,
    error,
    isError,
    isLoading,
  } = useQuery<Performance>({
    queryKey: ["performance", performanceId],
    queryFn: ({ signal }) => getPerformance({ id: performanceId, signal }),
    enabled: Number.isFinite(performanceId),
  });

  return (
    <main className="bg-brand-navy text-text-primary min-h-screen">
      <SiteHeader
        actionHref={`/login?redirect=${performanceDetailPath}`}
        actionLabel="로그인"
        actionVariant="filled"
        fixed
        showNav
      />

      <section className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <Link
          href="/performances"
          className="text-text-muted text-sm font-black transition hover:text-white"
        >
          공연 목록으로 돌아가기
        </Link>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {isLoading && (
            <>
              <div className="h-96 animate-pulse rounded-2xl border border-white/10 bg-white/10" />
              <div className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/10" />
            </>
          )}

          {!isLoading && isError && (
            <div className="border-brand-coral/30 bg-brand-coral/10 text-brand-coral-soft rounded-2xl border p-5 text-sm font-bold lg:col-span-2">
              {error instanceof Error ? error.message : "공연 상세 정보를 불러오지 못했습니다."}
            </div>
          )}

          {!isLoading && !isError && performance && (
            <>
              <PerformanceDetailPanel performance={performance} />
              <PerformanceReservationPanel
                isAuthenticated={isAuthenticated}
                isInitialized={isInitialized}
                remainingSeats={performance.remainingSeats}
                redirectPath={performanceDetailPath}
              />
            </>
          )}
        </div>
      </section>
    </main>
  );
}
