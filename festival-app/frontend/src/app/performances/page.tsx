"use client";

import { useQuery } from "@tanstack/react-query";

import { getPerformances } from "@/apis/performances/performance.api";
import PerformanceCard from "@/components/performances/PerformanceCard";
import SiteHeader from "@/components/SiteHeader";
import { useAuth } from "@/providers/AuthProvider";
import type { Performance } from "@/types/performance/performance.types";

export default function PerformancesPage() {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const {
    data: performances = [],
    error,
    isError,
    isLoading,
  } = useQuery<Performance[]>({
    queryKey: ["performances"],
    queryFn: ({ signal }) => getPerformances({ signal }),
  });

  return (
    <main className="bg-brand-navy text-text-primary min-h-screen">
      <SiteHeader actionHref="/login" actionLabel="로그인" actionVariant="filled" fixed showNav />

      <section className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="typo-caption text-brand-coral-soft mb-4 font-black">PERFORMANCE TICKETS</p>
          <h1 className="typo-title text-4xl sm:text-5xl">공연 예매</h1>
          <p className="typo-body text-text-secondary mt-4 max-w-2xl">
            축제 공연 일정과 잔여 좌석을 확인하고 상세 정보에서 예매 준비 상태를 확인하세요.
          </p>
        </div>

        <section className="mt-8">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black">공연 목록</h2>
              <p className="typo-caption text-text-muted mt-1">
                {isInitialized && isAuthenticated && user
                  ? `${user.name}님, 예매 가능한 공연입니다.`
                  : "로그인 전에도 공연 정보와 잔여 좌석을 확인할 수 있습니다."}
              </p>
            </div>
            <span className="text-text-muted text-sm font-bold">{performances.length}개 공연</span>
          </div>

          {isLoading && (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-56 animate-pulse rounded-2xl border border-white/10 bg-white/10"
                />
              ))}
            </div>
          )}

          {!isLoading && isError && (
            <div className="border-brand-coral/30 bg-brand-coral/10 text-brand-coral-soft rounded-2xl border p-5 text-sm font-bold">
              {error instanceof Error ? error.message : "공연 정보를 불러오지 못했습니다."}
            </div>
          )}

          {!isLoading && !isError && performances.length === 0 && (
            <p className="text-text-muted rounded-2xl border border-white/12 bg-white/[0.07] py-12 text-center">
              등록된 공연 정보가 없습니다.
            </p>
          )}

          {!isLoading && !isError && performances.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {performances.map((performance) => (
                <PerformanceCard key={performance.id} performance={performance} />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
