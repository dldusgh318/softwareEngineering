"use client";

import Link from "next/link";

import SiteHeader from "@/components/SiteHeader";
import { useAuth } from "@/providers/AuthProvider";

const performances = [
  {
    id: "performance-1",
    title: "와우 스테이지 헤드라이너",
    time: "2026.05.13 19:00",
    location: "대운동장 메인 스테이지",
    remainingSeats: 128,
  },
  {
    id: "performance-2",
    title: "동아리 밴드 쇼케이스",
    time: "2026.05.14 18:00",
    location: "학생회관 야외무대",
    remainingSeats: 64,
  },
];

export default function PerformancesPage() {
  const { isAuthenticated, isInitialized, user } = useAuth();

  return (
    <main className="bg-brand-navy text-text-primary min-h-screen">
      <SiteHeader actionHref="/login" actionLabel="로그인" actionVariant="filled" fixed showNav />

      <section className="mx-auto w-full max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="typo-caption text-brand-coral-soft mb-4 font-black">PERFORMANCE TICKETS</p>
          <h1 className="typo-title text-4xl sm:text-5xl">공연 예매</h1>
          <p className="typo-body text-text-secondary mt-4 max-w-2xl">
            로그인한 사용자만 공연 예매를 진행할 수 있습니다.
          </p>
        </div>

        {!isInitialized ? (
          <p className="text-text-secondary mt-10 text-sm font-semibold">
            로그인 상태를 확인하는 중입니다.
          </p>
        ) : !isAuthenticated ? (
          <section className="mt-8 max-w-xl rounded-3xl border border-white/14 bg-white/10 p-6 shadow-2xl shadow-black/10 backdrop-blur">
            <h2 className="text-2xl font-black">로그인이 필요합니다</h2>
            <p className="typo-caption text-text-muted mt-3">
              공연 좌석 선점과 QR 티켓 발급은 계정 확인 후 진행됩니다.
            </p>
            <Link
              href="/login?redirect=/performances"
              className="bg-brand-coral hover:bg-brand-coral-soft hover:text-brand-navy mt-6 inline-flex h-11 items-center rounded-full px-5 text-sm font-black text-white transition"
            >
              로그인하고 예매하기
            </Link>
          </section>
        ) : (
          <section className="mt-8">
            <p className="typo-caption text-text-muted mb-4">
              {user?.name}님, 예매 가능한 공연입니다.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {performances.map((performance) => (
                <article
                  key={performance.id}
                  className="rounded-3xl border border-white/14 bg-white/10 p-5 shadow-2xl shadow-black/10 backdrop-blur"
                >
                  <h2 className="text-xl font-black">{performance.title}</h2>
                  <p className="text-text-muted mt-3 text-sm font-semibold">{performance.time}</p>
                  <p className="text-text-secondary mt-1 text-sm">{performance.location}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-brand-cream text-sm font-black">
                      잔여 {performance.remainingSeats}석
                    </span>
                    <button
                      type="button"
                      className="bg-brand-coral hover:bg-brand-coral-soft hover:text-brand-navy h-10 rounded-full px-4 text-sm font-black text-white transition"
                    >
                      예매하기
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
